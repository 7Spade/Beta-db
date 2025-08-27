/**
 * @fileoverview 註冊頁面的主要視圖元件
 * @description 負責組合註冊頁面的所有 UI 元件，形成完整的頁面。
 */
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { registerSchema, type RegisterValues } from './auth-form-schemas';
import { SocialAuthButtons } from './social-auth-buttons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function RegisterForm() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      try {
        await sendEmailVerification(cred.user);
      } catch (verifyErr) {
        // 即使寄送驗證信失敗，也不阻塞註冊流程
      }
      toast({
        title: '註冊成功',
        description: '歡迎加入！請檢查您的信箱以驗證帳戶。正在將您導向登入頁...',
      });
      router.push('/login');
    } catch (error: any) {
      let message = '註冊失敗，請稍後再試。';
      if (error.code === 'auth/email-already-in-use') {
        message = '這個電子郵件地址已經被註冊了。';
      } else if (error.code === 'auth/weak-password') {
        message = '密碼強度不足，請使用更強的密碼。';
      } else if (error.code === 'auth/invalid-email') {
        message = '電子郵件地址格式不正確。';
      }
      toast({ title: '註冊失敗', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>電子郵件</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密碼</FormLabel>
              <FormControl>
                <Input type="password" placeholder="最少 8 個字元" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>確認密碼</FormLabel>
              <FormControl>
                <Input type="password" placeholder="再次輸入密碼" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          建立帳戶
        </Button>
      </form>
    </Form>
  );
}

export function RegisterView() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>建立帳戶</CardTitle>
        <CardDescription>輸入您的資訊以註冊新帳戶。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RegisterForm />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              或使用
            </span>
          </div>
        </div>
        <SocialAuthButtons 
          buttonText="使用 Google 帳戶註冊"
          redirectTo="/dashboard"
          isRegistration={true}
        />
      </CardContent>
       <CardContent>
          <div className="text-center text-sm">
            已經有帳戶了嗎？{' '}
            <Link href="/login" className="underline">
              登入
            </Link>
          </div>
      </CardContent>
    </Card>
  );
}
