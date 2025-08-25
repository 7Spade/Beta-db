/**
 * @fileoverview 登入表單 UI 元件
 * @description 包含電子郵件、密碼輸入框和提交按鈕。
 */
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { loginSchema, type LoginValues } from '../forms';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmail } from '@/components/features/auth';
import { Loader2 } from 'lucide-react';


export function LoginForm() {
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
