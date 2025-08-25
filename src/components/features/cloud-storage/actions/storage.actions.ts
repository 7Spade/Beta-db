
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

export async function renameFileAction(oldPath: string, newPath: string): Promise<ActionResult> {
    try {
        const oldRef = ref(storage, oldPath);
        const newRef = ref(storage, newPath);

        // Copy the file to the new path by getting its blob and uploading it
        const blob = await getBlob(oldRef);
        await uploadBytes(newRef, blob);

        // Delete the old file
        await deleteObject(oldRef);
        
        const parentPath = oldPath.substring(0, oldPath.lastIndexOf('/'));
        revalidatePath(`/cloud-storage?path=${parentPath}`);

        return { success: true };
    } catch (error: any) {
        console.error('重新命名檔案時發生錯誤:', error);
        return { success: false, error: '重新命名失敗，請再試一次。' };
    }
}

export async function createFolderAction(placeholderPath: string): Promise<ActionResult> {
    try {
        // Create a zero-byte file with a special name to represent a folder
        const folderRef = ref(storage, placeholderPath);
        await uploadBytes(folderRef, new Blob([]));
        
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

    