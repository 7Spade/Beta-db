/**
 * Login View - 登入視圖組件
 *
 * 功能說明：
 * - 負責登入頁的整體 UI 佈局。
 * - 包含標題、描述、以及嵌入 LoginForm。
 * - 未來可在此處加入社交登入按鈕等其他 UI 元素。
 */
import { LoginForm } from '../components';

export function LoginView() {
  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">登入</h1>
        <p className="text-muted-foreground">輸入您的憑證以存取您的帳號。</p>
      </div>
      <LoginForm />
    </div>
  );
}
