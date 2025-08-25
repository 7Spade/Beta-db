/**
 * Login Form - 登入表單元件
 *
 * 功能說明：
 * - 這是實際的登入表單，包含 Email 和密碼輸入框。
 * - 使用 react-hook-form 處理表單狀態。
 * - 使用 zod 進行客戶端表單驗證。
 * - 提交時，將呼叫 Server Action 進行後端驗證。
 */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

import { loginSchema } from '../forms';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  // 1. 定義表單
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 2. 定義提交處理器
  function onSubmit(values: LoginFormValues) {
    // 這是我們下一步將要實現的部分。
    // 在這裡，我們將會呼叫一個 Server Action 來處理登入邏輯。
    console.log('表單已提交，準備呼叫 Server Action：', values);
  }

  // 3. 渲染表單
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
                <Input placeholder="name@example.com" {...field} />
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
        <Button type="submit" className="w-full">
          登入
        </Button>
      </form>
    </Form>
  );
}
