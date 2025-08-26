/**
 * @fileoverview 登入頁面的主要視圖元件
 * @description 負責組合登入頁面的所有 UI 元件，形成完整的頁面。
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
import { signInWithEmail } from '@/lib/actions/auth.actions';
import { loginSchema, type LoginValues } from '@/components/features/auth/forms/auth-form-schemas';
import { SocialAuthButtons } from '../components/social-auth-buttons';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

function LoginForm() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginValues) => {
    setLoading(true);
    const result = await signInWithEmail(data);
    setLoading(false);

    if (result.error) {
      toast({
        title: '登入失敗',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: '登入成功',
        description: '歡迎回來！',
      });
      // 可以在這裡處理重定向，例如：router.push('/dashboard')
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
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            登入
          </Button>
        </form>
    </Form>
  );
}

export function LoginView() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>登入</CardTitle>
        <CardDescription>輸入您的帳號密碼以繼續。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm />
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
        <SocialAuthButtons />
         <div className="mt-4 text-center text-sm">
            還沒有帳戶嗎？{' '}
            <Link href="/register" className="underline">
              註冊
            </Link>
          </div>
      </CardContent>
    </Card>
  );
}
