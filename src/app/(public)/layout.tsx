/**
 * 公開頁面佈局 (Public Layout)
 *
 * 功能說明：
 * - 為所有公開頁面（如關於我們、部落格）提供統一、簡潔的佈局。
 * - 包含一個簡單的頁首，顯示 Logo 和返回主頁的按鈕。
 * - 包含一個頁尾。
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background">
        {children}
    </main>
  );
}
