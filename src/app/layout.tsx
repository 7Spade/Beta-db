import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { FolderKanban } from 'lucide-react';
import Link from 'next/link';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Constructo - 專案管理平台',
  description: '專業的營造專案管理應用程式',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className={cn('font-sans antialiased', inter.variable)}>
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto h-16 flex items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2">
                <FolderKanban className="h-7 w-7 text-primary" />
                <span className="text-lg font-bold">Beta-db</span>
              </Link>
            </div>
          </header>

          <main className="flex-grow">{children}</main>

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
                <Link href="/login" className="hover:text-primary text-xs">內部登入</Link>
               </div>
               <p>&copy; {new Date().getFullYear()} Beta-db. All rights reserved.</p>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
