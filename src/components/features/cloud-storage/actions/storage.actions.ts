
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
 * Server Action: 獲取指定路徑下的檔案和資料夾列表。
 * 使用 firebase-admin SDK 進行後端操作。
 */
export async function getStorageItemsAction(directoryPath: string): Promise<ListItemsResult> {
    try {
        const bucket = adminStorage.bucket();
        const [files] = await bucket.getFiles({ prefix: directoryPath ? `${directoryPath}/` : '', delimiter: '/' });

        const filePromises = files.filter(file => !file.name.endsWith('/') && !file.name.endsWith('/.placeholder')).map(async (file) => {
            const [metadata] = await file.getMetadata();
            // 在此我們不生成下載 URL，因為前端目前不需要直接下載
            return {
                name: file.name.split('/').pop() || '',
                url: '', // URL is not needed for display/management
                fullPath: file.name,
                size: parseInt(metadata.size as string, 10),
                contentType: metadata.contentType || 'application/octet-stream',
                createdAt: metadata.timeCreated,
            };
        });
        
        const folders: StorageFolder[] = [];
        if (files.length > 0 && (files[0] as any).constructor.name === 'File') {
             const prefixes = (files as any).reduce((acc: Set<string>, file: any) => {
                const parts = file.name.substring(directoryPath ? directoryPath.length + 1 : 0).split('/');
                if (parts.length > 1) {
                    acc.add(parts[0]);
                }
                return acc;
            }, new Set<string>());

            (files as any).forEach((f: any) => {
                if(f.metadata && f.metadata.prefixes) {
                    f.metadata.prefixes.forEach((p: string) => {
                        folders.push({
                            name: p.split('/').filter(Boolean).pop() || '',
                            fullPath: p,
                        })
                    })
                }
            })
        }
        
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
    revalidatePath(`/cloud-storage?path=${parentPath}`);
    return { success: true };
  } catch (error: any) {
    console.error('刪除檔案時發生錯誤:', error);
    return { success: false, error: '刪除檔案失敗，請再試一次。' };
  }
}

async function copyFolder(sourcePath: string, destinationPath: string): Promise<void> {
    const bucket = adminStorage.bucket();
    const [files] = await bucket.getFiles({ prefix: `${sourcePath}/` });

    for (const file of files) {
        const newPath = file.name.replace(sourcePath, destinationPath);
        await file.copy(bucket.file(newPath));
    }
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
        revalidatePath(`/cloud-storage?path=${parentPath}`);
        return { success: true };
    } catch (error: any) {
        console.error('重新命名項目時發生錯誤:', error);
        return { success: false, error: '重新命名失敗，請再試一次。' };
    }
}


export async function createFolderAction(placeholderPath: string): Promise<ActionResult> {
    try {
        const bucket = adminStorage.bucket();
        await bucket.file(placeholderPath).save('', {
            contentType: 'application/x-directory',
        });
        
        const parentPath = placeholderPath.substring(0, placeholderPath.lastIndexOf('/'));
        revalidatePath(`/cloud-storage?path=${parentPath}`);
        return { success: true };
    } catch (error: any) {
        console.error('建立資料夾時發生錯誤:', error);
        return { success: false, error: '建立資料夾失敗。' };
    }
}

export async function deleteFolderAction(folderPath: string): Promise<ActionResult> {
  try {
    const bucket = adminStorage.bucket();
    await bucket.deleteFiles({ prefix: `${folderPath}/` });

    const parentPath = folderPath.substring(0, folderPath.lastIndexOf('/'));
    revalidatePath(`/cloud-storage?path=${parentPath || ''}`);
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

    const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;

    try {
        const bucket = adminStorage.bucket();
        const buffer = Buffer.from(await file.arrayBuffer());
        await bucket.file(filePath).save(buffer, {
            contentType: file.type
        });
        revalidatePath(`/cloud-storage?path=${currentPath}`);
        return { success: true };
    } catch (error: any) {
        console.error('上傳檔案時發生錯誤:', error);
        return { success: false, error: '上傳檔案失敗。' };
    }
}
