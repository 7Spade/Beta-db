'use client';

import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { auth } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import { useToast } from '@root/src/lib/hooks/use-toast';
import { signOut } from 'firebase/auth';
import { Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export function PendingApprovalView() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      toast({ title: '已登出', description: '您已成功登出。' });
      router.push('/login');
    } catch {
      toast({ title: '登出失敗', description: '請稍後再試。', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto bg-secondary p-3 rounded-full w-fit">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle className="mt-4">帳號正在審核中</CardTitle>
        <CardDescription>您的帳號已成功建立，我們正在進行審核。完成後，您將可以存取儀表板。感謝您的耐心等候。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleLogout} disabled={loading} className="w-full" variant="outline">
          {loading ? '正在登出...' : '返回登入頁面'}
        </Button>
      </CardContent>
    </Card>
  );
}
