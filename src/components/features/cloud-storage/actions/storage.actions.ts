
'use server';

import { adminStorage } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import type { StorageFile, StorageFolder } from '../types/storage.types';

interface ActionResult {
  success: boolean;
  error?: string;
}

interface ListItemsResult {
    files: StorageFile[];
    folders: StorageFolder[];
    error?: string;
}

/**
 * Sanitizes a filename by removing potentially unsafe characters.
 * @param filename - The original filename.
 * @returns A sanitized filename.
 */
function sanitizeFilename(filename: string): string {
    // biome-ignore lint/suspicious/noControlCharactersInRegex: Standard practice for sanitization
    return filename.replace(/[\x00-\x1F\x7F/\\?%*:|"<>]/g, '_');
}

/**
 * Server Action: 獲取指定路徑下的檔案和資料夾列表。
 * 使用 firebase-admin SDK 進行後端操作。
 */
export async function getStorageItemsAction(directoryPath: string): Promise<ListItemsResult> {
    try {
        const bucket = adminStorage.bucket();
        const [files, , apiResponse] = await bucket.getFiles({ 
            prefix: directoryPath ? `${directoryPath}/` : '', 
            delimiter: '/' 
        });

        // Correctly filter for files (items that do not end with a '/')
        const filePromises = files
            .filter(file => !file.name.endsWith('/')) 
            .map(async (file) => {
                const metadata = file.metadata;
                // Generate a signed URL for client-side display.
                const [signedUrl] = await file.getSignedUrl({
                    action: 'read',
                    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
                });
                
                return {
                    name: file.name.split('/').pop() || '',
                    url: signedUrl, 
                    fullPath: file.name,
                    size: parseInt(metadata.size as string, 10),
                    contentType: metadata.contentType || 'application/octet-stream',
                    createdAt: metadata.timeCreated,
                };
            });
        
        // Correctly parse folders from prefixes
        const folders: StorageFolder[] = (apiResponse?.prefixes || []).map((prefix: string) => ({
            name: prefix.split('/').filter(Boolean).pop() || '',
            fullPath: prefix,
        }));
        
        const resolvedFiles = await Promise.all(filePromises);
        
        return { 
            files: resolvedFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), 
            folders
        };
    } catch (error: any) {
        console.error('獲取儲存項目時發生錯誤:', error);
        return { files: [], folders: [], error: '無法載入檔案列表。' };
    }
}


export async function deleteFileAction(filePath: string): Promise<ActionResult> {
  try {
    const bucket = adminStorage.bucket();
    await bucket.file(filePath).delete();
    
    const parentPath = filePath.substring(0, filePath.lastIndexOf('/'));
    revalidatePath(`/cloud-storage?path=${parentPath}`, 'page');
    revalidatePath(`/documents`, 'page');
    return { success: true };
  } catch (error: any) {
    console.error('刪除檔案時發生錯誤:', error);
    return { success: false, error: '刪除檔案失敗，請再試一次。' };
  }
}

async function copyFolder(sourcePath: string, destinationPath: string): Promise<void> {
    const bucket = adminStorage.bucket();
    const [files] = await bucket.getFiles({ prefix: `${sourcePath}/` });

    const copyPromises = files.map(file => {
      const newPath = file.name.replace(sourcePath, destinationPath);
      return file.copy(bucket.file(newPath));
    });
    await Promise.all(copyPromises);
}

export async function renameItemAction(oldPath: string, newPath: string, type: 'file' | 'folder'): Promise<ActionResult> {
    try {
        const bucket = adminStorage.bucket();
        if (type === 'file') {
            await bucket.file(oldPath).move(newPath);
        } else if (type === 'folder') {
            await copyFolder(oldPath, newPath);
            await deleteFolderAction(oldPath);
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


export async function createFolderAction(folderPath: string): Promise<ActionResult> {
    try {
        const bucket = adminStorage.bucket();
        // Create a placeholder file to simulate a folder
        await bucket.file(`${folderPath}/`).save('', {
            contentType: 'application/x-directory',
        });
        
        const parentPath = folderPath.substring(0, folderPath.lastIndexOf('/'));
        revalidatePath(`/cloud-storage?path=${parentPath}`, 'page');
        revalidatePath(`/documents`, 'page');
        return { success: true };
    } catch (error: any) {
        console.error('建立資料夾時發生錯誤:', error);
        return { success: false, error: '建立資料夾失敗。' };
    }
}

export async function deleteFolderAction(folderPath: string): Promise<ActionResult> {
  try {
    const bucket = adminStorage.bucket();
    await bucket.deleteFiles({ prefix: `${folderPath}` });

    const parentPath = folderPath.substring(0, folderPath.lastIndexOf('/'));
    revalidatePath(`/cloud-storage?path=${parentPath || ''}`, 'page');
    revalidatePath(`/documents`, 'page');
    return { success: true };
  } catch (error: any) {
    console.error('刪除資料夾時發生錯誤:', error);
    return { success: false, error: '刪除資料夾失敗。' };
  }
}

export async function uploadFileAction(formData: FormData): Promise<ActionResult> {
    const file = formData.get('file') as File;
    const currentPath = formData.get('currentPath') as string;

    if (!file) {
        return { success: false, error: '找不到檔案。'};
    }
    
    // Sanitize the filename for security
    const sanitizedFileName = sanitizeFilename(file.name);
    const filePath = currentPath ? `${currentPath}/${sanitizedFileName}` : sanitizedFileName;

    try {
        const bucket = adminStorage.bucket();
        const buffer = Buffer.from(await file.arrayBuffer());
        await bucket.file(filePath).save(buffer, {
            contentType: file.type,
            resumable: false, // Use simple upload for smaller files
        });
        revalidatePath(`/cloud-storage?path=${currentPath}`, 'page');
        revalidatePath(`/documents`, 'page');
        return { success: true };
    } catch (error: any) {
        console.error('上傳檔案時發生錯誤:', error);
        return { success: false, error: '上傳檔案失敗。' };
    }
}
