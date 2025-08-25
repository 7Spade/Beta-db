
'use server';

import { storage } from '@/lib/firebase';
import { ref, deleteObject, listAll, getBlob, uploadBytes } from 'firebase/storage';
import { revalidatePath } from 'next/cache';

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function deleteFileAction(filePath: string): Promise<ActionResult> {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    
    // Invalidate the cache for the parent directory
    const parentPath = filePath.substring(0, filePath.lastIndexOf('/'));
    revalidatePath(`/cloud-storage?path=${parentPath}`);
    
    return { success: true };
  } catch (error: any) {
    console.error('刪除檔案時發生錯誤:', error);
    if (error.code === 'storage/object-not-found') {
        return { success: false, error: '檔案不存在，可能已被刪除。' };
    }
    return { success: false, error: '刪除檔案失敗，請再試一次。' };
  }
}


async function copyFolder(sourcePath: string, destinationPath: string): Promise<void> {
    const listRef = ref(storage, sourcePath);
    const res = await listAll(listRef);

    // Copy all files
    for (const itemRef of res.items) {
        const blob = await getBlob(itemRef);
        const newName = itemRef.name;
        const destFileRef = ref(storage, `${destinationPath}/${newName}`);
        await uploadBytes(destFileRef, blob);
    }

    // Recursively copy all subfolders
    for (const prefixRef of res.prefixes) {
        const newSourcePath = prefixRef.fullPath;
        const newDestinationPath = `${destinationPath}/${prefixRef.name}`;
        await copyFolder(newSourcePath, newDestinationPath);
    }
}


export async function renameItemAction(oldPath: string, newPath: string, type: 'file' | 'folder'): Promise<ActionResult> {
    try {
        if (type === 'file') {
            const oldRef = ref(storage, oldPath);
            const newRef = ref(storage, newPath);

            const blob = await getBlob(oldRef);
            await uploadBytes(newRef, blob, { contentType: blob.type });

            await deleteObject(oldRef);
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
        const folderRef = ref(storage, placeholderPath);
        await uploadBytes(folderRef, new Blob(['']));
        
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
    const folderRef = ref(storage, folderPath);
    const res = await listAll(folderRef);

    const deletePromises: Promise<any>[] = [];
    
    // Delete all files in the folder
    res.items.forEach((itemRef) => {
      deletePromises.push(deleteObject(itemRef));
    });
    
    // Recursively delete all subfolders
    res.prefixes.forEach((prefixRef) => {
      deletePromises.push(deleteFolderAction(prefixRef.fullPath));
    });
    
    await Promise.all(deletePromises);
    
    // After deleting contents, delete the placeholder for the folder itself, if it exists
    // This is useful for folders that were created but are now empty.
    const placeholderRef = ref(storage, `${folderPath}/.placeholder`);
    try {
        await deleteObject(placeholderRef);
    } catch (error: any) {
        // Ignore if placeholder doesn't exist, which is normal for non-empty folders.
        if (error.code !== 'storage/object-not-found') {
            console.warn(`Could not delete placeholder for ${folderPath}:`, error);
        }
    }


    const parentPath = folderPath.substring(0, folderPath.lastIndexOf('/'));
    if (parentPath) {
        revalidatePath(`/cloud-storage?path=${parentPath}`);
    } else {
        revalidatePath(`/cloud-storage`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('刪除資料夾時發生錯誤:', error);
    return { success: false, error: '刪除資料夾失敗。' };
  }
}
