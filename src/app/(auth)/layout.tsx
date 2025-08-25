/**
 * Auth Layout - 認證頁面佈局
 *
 * 功能說明：
 * - 為所有身份驗證相關的頁面（如登入、註冊）提供統一的、置中的簡潔佈局。
 * - 使用 Flexbox 將子內容垂直和水平置中。
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {children}
    </div>
  );
}
