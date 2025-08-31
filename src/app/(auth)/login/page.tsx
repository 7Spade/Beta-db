/**
 * Login Page - 登入頁面
 *
 * 功能說明：
 * - 專門用於用戶登入的路由頁面。
 * - 此檔案是 Next.js 的入口點，應保持簡潔。
 * - 主要職責是渲染對應的 View 元件。
 */
import { LoginView } from '@/features/auth';

export default function LoginPage() {
  return <LoginView />;
}
