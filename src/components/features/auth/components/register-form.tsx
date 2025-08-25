/**
 * @fileoverview 註冊表單 UI 元件
 * @description 包含電子郵件、密碼、確認密碼等欄位。
 */
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { registerSchema, type RegisterValues } from '../forms';
import { useToast } from '@/hooks/use-toast';
import { registerWithEmail } from '@/components/features/auth';
import { Loader2 } from 'lucide-react';

export function RegisterForm() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

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
    const result = await registerWithEmail(data);
    setLoading(false);

    if (result.error) {
      toast({
        title: '註冊失敗',
        description: result.error,
        variant: 'destructive',
      });
    } else {
       toast({
        title: '註冊成功',
        description: '歡迎加入！請檢查您的信箱以驗證帳戶。',
      });
      // 可以在這裡處理重定向
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
