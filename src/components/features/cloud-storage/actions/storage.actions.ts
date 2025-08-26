
'use server';

import { adminStorage } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import type { StorageItem, StorageAction, StorageListResult } from '../types/storage.types';
import { 
  getParentPath, 
  normalizePath, 
  buildFullPath, 
  isValidPath,
  extractFolderPaths,
  isFolderPath
} from '../utils/path.utils';

/**
 * 精簡的檔案名稱清理函數
 */
function sanitizeName(name: string): string {
  return name.replace(/[\x00-\x1F\x7F/\\?%*:|"<>]/g, '_');
}

/**
 * 獲取儲存項目 - 使用路徑前綴查詢，無需 .folder 標記
 */
export async function getStorageItemsAction(directoryPath: string): Promise<StorageListResult> {
  try {
    const bucket = adminStorage.bucket();
    const normalizedPath = normalizePath(directoryPath);
    const prefix = normalizedPath ? `${normalizedPath}/` : '';
    
    // 獲取所有檔案（包括子目錄中的檔案）
    const [files] = await bucket.getFiles({ 
      prefix,
      delimiter: '/'
    });

    const items: StorageItem[] = [];
    const allFilePaths: string[] = [];

    // 處理檔案
    const filePromises = files
      .filter(file => !file.name.endsWith('/')) // 排除可能的目錄標記
      .map(async (file) => {
        allFilePaths.push(file.name);
        const metadata = file.metadata;
        
        // 只處理當前目錄層級的檔案
        const relativePath = file.name.substring(prefix.length);
        if (relativePath.includes('/')) {
          // 這是子目錄中的檔案，跳過
          return null;
        }

        const [signedUrl] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 15 * 60 * 1000,
        });
        
        return {
          name: file.name.split('/').pop() || '',
          fullPath: file.name,
          type: 'file' as const,
          size: parseInt(metadata.size as string, 10),
          contentType: metadata.contentType || 'application/octet-stream',
          createdAt: metadata.timeCreated || new Date().toISOString(),
          url: signedUrl,
        };
      });

    // 獲取資料夾（通過路徑前綴推斷）
    const folderPaths = extractFolderPaths(allFilePaths, normalizedPath);
    folderPaths.forEach(folderPath => {
      const folderName = folderPath.split('/').pop() || '';
      items.push({
        name: folderName,
        fullPath: folderPath,
        type: 'folder' as const,
        createdAt: new Date().toISOString(), // 使用當前時間作為預設值
      });
    });

    // 添加檔案項目
    const resolvedFiles = await Promise.all(filePromises);
    const validFiles = resolvedFiles.filter(Boolean) as StorageItem[];
    items.push(...validFiles);

    // 按類型排序：資料夾在前，檔案在後，按名稱排序
    items.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name, 'zh-TW');
    });

    return { items };
  } catch (error: any) {
    console.error('獲取儲存項目時發生錯誤:', error);
    return { items: [], error: '無法載入檔案列表。' };
  }
}

/**
 * 刪除項目 - 簡化版本，無需處理 .folder 標記
 */
export async function deleteItemAction(itemPath: string, type: 'file' | 'folder'): Promise<StorageAction> {
  try {
    const bucket = adminStorage.bucket();
    
    if (type === 'file') {
      await bucket.file(itemPath).delete();
    } else {
      // 刪除資料夾：刪除所有以該路徑為前綴的檔案
      await bucket.deleteFiles({ prefix: `${itemPath}/` });
    }
    
    const parentPath = getParentPath(itemPath);
    revalidatePath(`/cloud-storage?path=${parentPath}`, 'page');
    revalidatePath(`/documents`, 'page');
    return { success: true };
  } catch (error: any) {
    console.error('刪除項目時發生錯誤:', error);
    return { success: false, error: '刪除失敗，請再試一次。' };
  }
}

/**
 * 重命名項目 - 簡化版本，無需處理 .folder 標記
 */
export async function renameItemAction(oldPath: string, newPath: string, type: 'file' | 'folder'): Promise<StorageAction> {
  try {
    const bucket = adminStorage.bucket();
    
    if (type === 'file') {
      await bucket.file(oldPath).move(newPath);
    } else {
      // 資料夾重命名：移動所有子檔案
      const [files] = await bucket.getFiles({ prefix: `${oldPath}/` });
      const movePromises = files.map(file => {
        const targetPath = file.name.replace(oldPath, newPath);
        return file.move(targetPath);
      });
      await Promise.all(movePromises);
    }
    
    const parentPath = getParentPath(oldPath);
    revalidatePath(`/cloud-storage?path=${parentPath}`, 'page');
    revalidatePath(`/documents`, 'page');
    return { success: true };
  } catch (error: any) {
    console.error('重新命名項目時發生錯誤:', error);
    return { success: false, error: '重新命名失敗，請再試一次。' };
  }
}

/**
 * 創建資料夾 - 創建一個隱藏的標記檔案來表示資料夾存在
 */
export async function createFolderAction(folderPath: string): Promise<StorageAction> {
  try {
    const normalizedPath = normalizePath(folderPath);
    
    if (!normalizedPath) {
      return { success: false, error: '資料夾名稱不能為空。' };
    }
    
    if (!isValidPath(normalizedPath)) {
      return { success: false, error: '資料夾名稱包含無效字符。' };
    }
    
    const bucket = adminStorage.bucket();
    const folderMarkerPath = `${normalizedPath}/.folder`;
    
    // 創建一個隱藏的標記檔案
    await bucket.file(folderMarkerPath).save('', {
      contentType: 'application/x-directory',
      metadata: {
        customMetadata: {
          type: 'folder',
          created: new Date().toISOString(),
          name: normalizedPath.split('/').pop() || normalizedPath
        }
      }
    });
    
    const parentPath = getParentPath(normalizedPath);
    revalidatePath(`/cloud-storage?path=${parentPath}`, 'page');
    revalidatePath(`/documents`, 'page');
    return { success: true };
  } catch (error: any) {
    console.error('建立資料夾時發生錯誤:', error);
    return { success: false, error: '建立資料夾失敗。' };
  }
}

/**
 * 檔案上傳 - 保持原有邏輯
 */
export async function uploadFileAction(formData: FormData): Promise<StorageAction> {
  const file = formData.get('file') as File;
  const currentPath = formData.get('currentPath') as string;

  if (!file) {
    return { success: false, error: '找不到檔案。'};
  }
  
  const sanitizedFileName = sanitizeName(file.name);
  const filePath = currentPath ? `${currentPath}/${sanitizedFileName}` : sanitizedFileName;

  try {
    const bucket = adminStorage.bucket();
    const buffer = Buffer.from(await file.arrayBuffer());
    await bucket.file(filePath).save(buffer, {
      contentType: file.type,
      resumable: false,
    });
    revalidatePath(`/cloud-storage?path=${currentPath}`, 'page');
    revalidatePath(`/documents`, 'page');
    return { success: true };
  } catch (error: any) {
    console.error('上傳檔案時發生錯誤:', error);
    return { success: false, error: '上傳檔案失敗。' };
  }
}
