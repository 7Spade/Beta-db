/**
 * Login View - 登入視圖組件
 *
 * 功能說明：
 * - 負責登入頁的整體 UI 佈局。
 * - 包含標題、描述、以及嵌入 LoginForm。
 * - 未來可在此處加入社交登入按鈕等其他 UI 元素。
 */
import { LoginForm } from '../components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export function LoginView() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">登入</CardTitle>
        <CardDescription>輸入您的憑證以存取您的帳號。</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <div className="mt-4 text-center text-sm">
          還沒有帳號？{" "}
          <Link href="/register" className="underline">
            註冊
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
