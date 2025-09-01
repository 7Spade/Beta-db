'use server';

import { adminAuth, adminDb } from '@root/src/features/integrations/database/firebase-admin/firebase-admin';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';

const profileSchema = z.object({
  displayName: z.string().min(2, '名稱至少需要 2 個字元。'),
});

export async function updateUserProfile(values: z.infer<typeof profileSchema>) {
  const validatedFields = profileSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: '無效的輸入資料。' };
  }

  const { displayName } = validatedFields.data;

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
      return { error: '未授權的操作。' };
    }

    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userId = decodedToken.uid;

    const userRef = adminDb.collection('users').doc(userId);

    // 更新 Firestore
    await userRef.update({ displayName });

    // (可選) 更新 Firebase Auth 使用者顯示名稱
    await adminAuth.updateUser(userId, { displayName });

    revalidatePath('/profile');
    return { success: '個人資料已成功更新。' };

  } catch (error) {
    console.error('更新個人資料時發生錯誤:', error);
    return { error: '更新個人資料時發生伺服器錯誤。' };
  }
}
