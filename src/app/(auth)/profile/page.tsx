/**
 * @fileoverview 用戶資料頁面
 * @description 這是使用者個人資料頁面的伺服器端入口點。
 * 它負責從伺服器獲取當前用戶的認證資訊和設定檔資料，
 * 然後將這些資料傳遞給客戶端元件進行渲染。
 */
import { ProfileView } from '@/components/features/profile/profile-view';
import { auth } from '@/lib/db/firebase-client/firebase-client';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/db/firebase-admin/firebase-admin';
import type { UserProfile } from '@/components/features/auth/use-auth';

// 獲取當前登入使用者的資料
async function getUserData() {
  try {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) return null;

    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userRef = adminDb.collection('users').doc(decodedToken.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) return null;

    const profile = userDoc.data() as UserProfile;

    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      profile: {
        displayName: profile.displayName || '',
        role: profile.role || 'Member',
        status: profile.status || 'unknown'
      }
    };
  } catch (error) {
    // Session cookie is invalid or expired.
    console.error("Error fetching user data:", error);
    return null;
  }
}

export default async function ProfilePage() {
  const userData = await getUserData();
  
  if (!userData) {
      // 這通常不應該發生，因為有 AuthProvider 保護路由
      // 但作為一個保險措施，可以顯示一個錯誤或重定向
      return <div>無法載入使用者資料，請重新登入。</div>;
  }

  return <ProfileView user={userData} />;
}
