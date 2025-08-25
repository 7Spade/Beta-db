
'use server';

import { storage } from '@/lib/firebase';
import { ref, deleteObject } from 'firebase/storage';
import { revalidatePath } from 'next/cache';

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function deleteFileAction(filePath: string): Promise<ActionResult> {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    
    // Invalidate the cache for the cloud-storage page
    revalidatePath('/cloud-storage');
    
    return { success: true };
  } catch (error: any) {
    console.error('刪除檔案時發生錯誤:', error);
    if (error.code === 'storage/object-not-found') {
        return { success: false, error: '檔案不存在，可能已被刪除。' };
    }
    return { success: false, error: '刪除檔案失敗，請再試一次。' };
  }
}
