/**
 * @fileoverview 個人資料主視圖 (伺服器元件)
 * @description 這是使用者個人資料頁面的主視圖元件。
 * 它作為一個伺服器元件，負責從後端獲取當前用戶的認證資訊和設定檔資料，
 * 然後將這些資料傳遞給客戶端子元件進行渲染。
 */
import { adminAuth, adminDb } from '@/firebase-admin/firebase-admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import type { UserProfile } from '@root/src/features/auth/use-auth';
import { cookies } from 'next/headers';
import { ProfileForm } from './profile-form';

type UserData = {
  uid: string;
  email: string | null | undefined;
  profile: {
    displayName: string;
    role: string;
    status: string;
  };
};

// 獲取當前登入使用者的資料
async function getUserData(): Promise<UserData | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
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

export async function ProfileView() {
  const user = await getUserData();

  if (!user) {
    // 這通常不應該發生，因為有 AuthProvider 保護路由
    // 但作為一個保險措施，可以顯示一個錯誤或重定向
    return (
      <Card>
        <CardHeader>
          <CardTitle>錯誤</CardTitle>
        </CardHeader>
        <CardContent>
          <p>無法載入使用者資料，請嘗試重新登入。</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">我的個人資料</h1>
        <p className="text-muted-foreground">管理您的帳戶資訊與設定。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProfileForm defaultValues={{ displayName: user.profile.displayName }} />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>帳戶資訊</CardTitle>
              <CardDescription>這些資訊由系統管理，無法更改。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Email</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">角色</p>
                <p className="capitalize">{user.profile.role}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">狀態</p>
                <p className="capitalize">{user.profile.status}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
