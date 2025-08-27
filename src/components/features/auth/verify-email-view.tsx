'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/db/firebase-client/firebase-client';
import { sendEmailVerification } from 'firebase/auth';
import Link from 'next/link';

export function VerifyEmailView() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const handleResend = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast({ title: '尚未登入', description: '請先登入後再嘗試。', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await sendEmailVerification(user);
      toast({ title: '驗證信已寄出', description: '請至信箱查收並完成驗證。' });
    } catch (err) {
      toast({ title: '寄送失敗', description: '請稍後再試。', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>請驗證您的電子郵件</CardTitle>
        <CardDescription>我們已寄出驗證信到您的信箱，請點擊信中的連結完成驗證。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleResend} disabled={loading} className="w-full">
          {loading ? '重新寄送中…' : '重新寄送驗證信'}
        </Button>
        <div className="text-center text-sm">
          已完成驗證？<Link href="/login" className="underline">返回登入</Link>
        </div>
      </CardContent>
    </Card>
  );
}
