'use client';

import { isFirebaseAuthError } from '@/lib/utils/auth-utils';
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
import { useToast } from '@root/src/lib/hooks/use-toast';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// 密碼重置表單的驗證規則
const resetPasswordSchema = z.object({
    email: z.string().email({ message: '請輸入有效的電子郵件地址。' }),
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
    const { toast } = useToast();
    const [loading, setLoading] = React.useState(false);
    const [emailSent, setEmailSent] = React.useState(false);

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ResetPasswordValues) => {
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, data.email);
            setEmailSent(true);
            toast({
                title: '密碼重置郵件已發送',
                description: '請檢查您的電子郵件信箱並點擊重置連結。',
            });
        } catch (error: unknown) {
            let message = '發送密碼重置郵件失敗，請稍後再試。';
            if (isFirebaseAuthError(error)) {
                if (error.code === 'auth/user-not-found') {
                    message = '此電子郵件地址未註冊。';
                } else if (error.code === 'auth/too-many-requests') {
                    message = '請求次數過多，請稍後再試。';
                }
            }
            toast({
                title: '發送失敗',
                description: message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="text-center space-y-4">
                <div className="text-green-600">
                    <svg
                        className="mx-auto h-12 w-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-medium">密碼重置郵件已發送</h3>
                <p className="text-sm text-muted-foreground">
                    請檢查您的電子郵件信箱並點擊重置連結來重設密碼。
                </p>
                <Button
                    variant="outline"
                    onClick={() => {
                        setEmailSent(false);
                        form.reset();
                    }}
                >
                    重新發送
                </Button>
            </div>
        );
    }

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
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    發送密碼重置郵件
                </Button>
            </form>
        </Form>
    );
}

export function ResetPasswordView() {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>重設密碼</CardTitle>
                <CardDescription>
                    輸入您的電子郵件地址，我們將發送密碼重置連結給您。
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ResetPasswordForm />
                <div className="mt-4 text-center text-sm">
                    想起密碼了嗎？{' '}
                    <Link href="/login" className="underline">
                        返回登入
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
