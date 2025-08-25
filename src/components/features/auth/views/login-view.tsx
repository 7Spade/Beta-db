/**
 * @fileoverview 登入頁面的主要視圖元件
 * @description 負責組合登入頁面的所有 UI 元件，形成完整的頁面。
 */
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginForm } from '../components/login-form';
import { SocialAuthButtons } from '../components/social-auth-buttons';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

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
      </CardContent>
      <CardContent>
          <div className="text-center text-sm">
            還沒有帳戶嗎？{' '}
            <Link href="/register" className="underline">
              註冊
            </Link>
          </div>
      </CardContent>
    </Card>
  );
}
