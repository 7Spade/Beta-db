'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

interface ProfileViewProps {
  user: UserData;
}

export function ProfileView({ user }: ProfileViewProps) {
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
