/**
 * @fileoverview 社交登入按鈕元件
 * @description 提供 "使用 Google 登入" 等可選的社交認證方式。
 */
'use client';

import { Button } from '@/ui/button';
import { auth } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import { useToast } from '@root/src/shared/hooks/use-toast';
import { isFirebaseAuthError } from '@root/src/shared/utils/auth-utils';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
    {...props}
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0,9.657-3.356-11.303-8H6.306C9.656,39.663,16.318,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.999,35.536,44,30.169,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

interface SocialAuthButtonsProps {
  buttonText?: string;
  redirectTo?: string;
  isRegistration?: boolean;
}

export function SocialAuthButtons({
  buttonText = '使用 Google 帳戶登入',
  redirectTo = '/dashboard',
  isRegistration = false,
}: SocialAuthButtonsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      const successMessage = isRegistration
        ? 'Google 註冊成功！正在將您導向儀表板...'
        : 'Google 登入成功！正在將您導向儀表板...';
      toast({
        title: isRegistration ? 'Google 註冊成功' : 'Google 登入成功',
        description: successMessage,
      });
      if (redirectTo) {
        router.push(redirectTo);
      }
    } catch (error: unknown) {
      let errorMessage = 'Google 登入失敗，請稍後再試。';
      if (isFirebaseAuthError(error)) {
        if (error.code === 'auth/popup-closed-by-user') {
          errorMessage = '登入流程被使用者中斷。';
        } else if (
          error.code === 'auth/account-exists-with-different-credential'
        ) {
          errorMessage = '此電子郵件地址已使用其他方式註冊。';
        } else if (error.code === 'auth/popup-blocked') {
          errorMessage = '彈出視窗被瀏覽器阻擋，請允許彈出視窗後重試。';
        } else if (error.code === 'auth/cancelled-popup-request') {
          errorMessage = '登入請求被取消。';
        } else if (error.code === 'auth/network-request-failed') {
          errorMessage = '網路連線失敗，請檢查網路連線。';
        }
      }
      toast({
        title: 'Google 登入失敗',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="mr-2 h-5 w-5" />
        )}
        {buttonText}
      </Button>
    </div>
  );
}
