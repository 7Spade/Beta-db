import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/ui/toaster';
import { cn } from '@/utils/utils';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/auth/auth-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Constructo - 專案管理平台',
  description: '專業的營造專案管理應用程式',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className={cn('font-sans antialiased', inter.variable)}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
