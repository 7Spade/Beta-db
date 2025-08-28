import { AppProvider } from '@/components/layout/core/app-provider';
import { AppShell } from '@/components/layout/core/app-shell';

/**
 * 管理後台 (Admin) 佈局
 *
 * 功能說明：
 * - 為所有管理後台相關的頁面提供統一的佈局。
 * - 這裡可以根據需求使用與主應用程式 (app) 相同或不同的 AppShell。
 *   - 例如，可以有一個專門為管理員設計的側邊欄或頁首。
 * - 目前為了快速建立骨架，我們重用主應用程式的 AppShell。
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <AppShell>{children}</AppShell>
    </AppProvider>
  );
}
