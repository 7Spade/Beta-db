'use server';

import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client'; // Using client SDK for server components is fine
import { dispatch } from '@root/src/shared/events/event-dispatcher';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function approveUser(userId: string): Promise<ActionResult> {
  if (!userId) {
    return { success: false, error: '缺少用戶 ID。' };
  }

  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      status: 'approved',
      approvedAt: serverTimestamp(),
      // approvedBy: 'ADMIN_UID' // TODO: Get current admin user's UID
    });
    await dispatch('user.approved', { userId });

    revalidatePath('/admin/user');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "發生未知錯誤。";
    return { success: false, error: `核准用戶失敗: ${errorMessage}` };
  }
}


export async function rejectUser(userId: string): Promise<ActionResult> {
  if (!userId) {
    return { success: false, error: '缺少用戶 ID。' };
  }

  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      status: 'rejected',
    });
    await dispatch('user.rejected', { userId });

    revalidatePath('/admin/user');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "發生未知錯誤。";
    return { success: false, error: `拒絕用戶失敗: ${errorMessage}` };
  }
}
