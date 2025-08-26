
'use server';

import { adminStorage } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import type { StorageItem, StorageAction, StorageListResult } from '../types/storage.types';
import { getParentPath, normalizePath, buildFullPath, isValidPath } from '../utils/path.utils';

/**
 * 精簡的檔案名稱清理函數
 */
function sanitizeName(name: string): string {
  return name.replace(/[\x00-\x1F\x7F/\\?%*:|"<>]/g, '_');
}

/**
 * 精簡的儲存項目獲取 - 統一處理檔案和資料夾
 */
export async function getStorageItemsAction(directoryPath: string): Promise<StorageListResult> {
  try {
    const bucket = adminStorage.bucket();
    const [files, , apiResponse] = await bucket.getFiles({ 
      prefix: directoryPath ? `${directoryPath}/` : '', 
      delimiter: '/' 
    });

    const items: StorageItem[] = [];

    // 處理檔案
    const filePromises = files
      .filter(file => !file.name.endsWith('/') && !file.name.endsWith('/.folder'))
      .map(async (file) => {
        const metadata = file.metadata;
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

    // 處理資料夾
    if (apiResponse && typeof apiResponse === 'object' && 'prefixes' in apiResponse) {
      const prefixes = apiResponse.prefixes as string[];
      if (Array.isArray(prefixes)) {
        prefixes.forEach((prefix: string) => {
          items.push({
            name: prefix.split('/').filter(Boolean).pop() || '',
            fullPath: prefix,
            type: 'folder' as const,
          });
        });
      }
    }

    // 添加檔案項目
    const resolvedFiles = await Promise.all(filePromises);
    items.push(...resolvedFiles);

    // 按類型排序：資料夾在前，檔案在後，按創建時間排序
    items.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return { items };
  } catch (error: any) {
    console.error('獲取儲存項目時發生錯誤:', error);
    return { items: [], error: '無法載入檔案列表。' };
  }
}

/**
 * 精簡的刪除操作 - 統一處理檔案和資料夾
 */
export async function deleteItemAction(itemPath: string, type: 'file' | 'folder'): Promise<StorageAction> {
  try {
    const bucket = adminStorage.bucket();
    
    if (type === 'file') {
      await bucket.file(itemPath).delete();
    } else {
      // 刪除資料夾：先刪除所有子檔案，再刪除資料夾標記
      await bucket.deleteFiles({ prefix: `${itemPath}/` });
      
      // 刪除資料夾標記檔案（如果存在）
      try {
        const folderMarkerPath = `${itemPath}/.folder`;
        await bucket.file(folderMarkerPath).delete();
      } catch (markerError) {
        // 如果標記檔案不存在，忽略錯誤
        console.log('資料夾標記檔案不存在或已刪除:', markerError);
      }
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
 * 精簡的重命名操作 - 統一處理檔案和資料夾
 */
export async function renameItemAction(oldPath: string, newPath: string, type: 'file' | 'folder'): Promise<StorageAction> {
  try {
    const bucket = adminStorage.bucket();
    
    if (type === 'file') {
      await bucket.file(oldPath).move(newPath);
    } else {
      // 資料夾重命名：複製後刪除
      const [files] = await bucket.getFiles({ prefix: `${oldPath}/` });
      const copyPromises = files.map(file => {
        const targetPath = file.name.replace(oldPath, newPath);
        return file.copy(bucket.file(targetPath));
      });
      await Promise.all(copyPromises);
      
      // 刪除舊資料夾的所有檔案
      await bucket.deleteFiles({ prefix: `${oldPath}/` });
      
      // 刪除舊資料夾標記檔案（如果存在）
      try {
        const oldFolderMarkerPath = `${oldPath}/.folder`;
        await bucket.file(oldFolderMarkerPath).delete();
      } catch (markerError) {
        // 如果標記檔案不存在，忽略錯誤
        console.log('舊資料夾標記檔案不存在或已刪除:', markerError);
      }
      
      // 創建新資料夾標記檔案
      try {
        const newFolderMarkerPath = `${newPath}/.folder`;
        await bucket.file(newFolderMarkerPath).save('', {
          contentType: 'application/x-directory',
          metadata: {
            customMetadata: {
              type: 'folder',
              created: new Date().toISOString(),
              name: newPath.split('/').pop() || newPath
            }
          }
        });
      } catch (markerError) {
        console.log('創建新資料夾標記檔案失敗:', markerError);
      }
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
 * 精簡的資料夾創建
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
 * 精簡的檔案上傳
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
