'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import { doc, DocumentData, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface PublicUserProfile {
  displayName?: string;
  role?: string;
}

export function PublicProfileView({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const ref = doc(firestore, 'users', userId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as DocumentData;
          // 僅挑選公開欄位
          setProfile({ displayName: data.displayName, role: data.role });
        } else {
          setProfile(null);
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [userId]);

  if (loading) return <div>載入中…</div>;
  if (!profile) return <div>找不到使用者。</div>;

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{profile.displayName || '使用者'}</CardTitle>
        <CardDescription>公開個人資料</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">角色</div>
          <div>{profile.role || '-'}</div>
        </div>
      </CardContent>
    </Card>
  );
}
