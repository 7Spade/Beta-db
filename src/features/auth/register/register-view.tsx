'use client';

import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { Input } from '@/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import { dispatch } from '@root/src/shared/events/event-dispatcher';
import { useToast } from '@root/src/shared/hooks/use-toast';
import { isFirebaseAuthError } from '@root/src/shared/utils/auth-utils';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { createUserProfile } from '../auth-actions';
import { registerSchema, type RegisterValues } from '../auth-form-schemas';

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
      const cred = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Create user profile in Firestore
      await createUserProfile(cred.user);

      try {
        await sendEmailVerification(cred.user);
      } catch (verifyErr) {
        // Do not block registration flow if email fails
        console.warn('Failed to send verification email:', verifyErr);
      }
      // Broadcast user.registered for admin notifications
      await dispatch('user.registered', {
        userId: cred.user.uid,
        displayName: cred.user.displayName,
        email: cred.user.email,
      });
      toast({
        title: '註冊成功',
        description: '您的帳號正在等待審核。完成後即可登入。',
      });
      router.push('/login');
    } catch (error: unknown) {
      let message = '註冊失敗，請稍後再試。';
      if (isFirebaseAuthError(error)) {
        if (error.code === 'auth/email-already-in-use') {
          message = '這個電子郵件地址已經被註冊了。';
        } else if (error.code === 'auth/weak-password') {
          message = '密碼強度不足，請使用更強的密碼。';
        } else if (error.code === 'auth/invalid-email') {
          message = '電子郵件地址格式不正確。';
        }
      }
      toast({
        title: '註冊失敗',
        description: message,
        variant: 'destructive',
      });
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
        <div className="mt-4 text-center text-sm">
          已經有帳戶了嗎？{' '}
          <Link href="/login" className="underline">
            登入
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
