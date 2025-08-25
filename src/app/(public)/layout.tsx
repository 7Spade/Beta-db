import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FolderKanban } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto h-16 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <FolderKanban className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold">Beta-db</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
              <Button variant="ghost" asChild>
                  <Link href="/about">關於我們</Link>
              </Button>
              <Button variant="ghost" asChild>
                  <Link href="/blog">部落格</Link>
              </Button>
              <Button variant="ghost" asChild>
                  <Link href="/careers">企業徵才</Link>
              </Button>
              <Button variant="ghost" asChild>
                  <Link href="/contact">聯絡我們</Link>
              </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow bg-background">
        {children}
      </main>

      <footer className="bg-muted py-8">
        <div className="container mx-auto text-center text-muted-foreground text-sm space-y-4">
           <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2">
                <Link href="/about" className="hover:text-primary">關於我們</Link>
                <Link href="/blog" className="hover:text-primary">部落格</Link>
                <Link href="/careers" className="hover:text-primary">企業徵才</Link>
                <Link href="/contact" className="hover:text-primary">聯絡我們</Link>
                <Link href="/privacy-policy" className="hover:text-primary">隱私權政策</Link>
                <Link href="/terms-of-service" className="hover:text-primary">服務條款</Link>
           </div>
           <div>
            <Link href="/login" className="hover:text-primary text-xs">內部員工登入</Link>
           </div>
           <p>&copy; {new Date().getFullYear()} Beta-db. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
