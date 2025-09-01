/**
 * Reset Password Page - 密碼重置頁面
 *
 * 功能說明：
 * - 專門用於密碼重置的路由頁面。
 * - 此檔案是 Next.js 的入口點，應保持簡潔。
 * - 主要職責是渲染對應的 View 元件。
 */
import { ResetPasswordView } from '@root/src/features/auth';

export default function ResetPasswordPage() {
  return <ResetPasswordView />;
}
