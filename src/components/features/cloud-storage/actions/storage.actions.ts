
'use server';

import { adminStorage } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import type { StorageItem, StorageAction, StorageListResult } from '../types/storage.types';

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
      await bucket.deleteFiles({ prefix: `${itemPath}/` });
    }
    
    const parentPath = itemPath.substring(0, itemPath.lastIndexOf('/'));
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
       await bucket.deleteFiles({ prefix: `${oldPath}/` });
     }
    
    const parentPath = oldPath.substring(0, oldPath.lastIndexOf('/'));
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
    const normalizedPath = folderPath.replace(/^\/+|\/+$/g, '');
    
    if (!normalizedPath) {
      return { success: false, error: '資料夾名稱不能為空。' };
    }
    
    if (!/^[a-zA-Z0-9\u4e00-\u9fa5\s\-_\.]+$/.test(normalizedPath)) {
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
    
    const parentPath = normalizedPath.substring(0, normalizedPath.lastIndexOf('/'));
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
