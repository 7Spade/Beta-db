/**
 * @fileoverview 註冊頁面的主要視圖元件
 * @description 負責組合註冊頁面的所有 UI 元件，形成完整的頁面。
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
import { RegisterForm } from '../components/register-form';
import { SocialAuthButtons } from '../components/social-auth-buttons';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

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
        <SocialAuthButtons />
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
