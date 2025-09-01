import { Toaster } from '@/ui/toaster';
import { AuthProvider } from '@root/src/features/auth/auth-provider';
import { cn } from '@root/src/shared/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'Beta-db - 專案管理平台',
    template: '%s | Beta-db'
  },
  description: '專業的營造專案管理應用程式，提供完整的專案追蹤、合約管理和團隊協作功能',
  keywords: ['專案管理', '營造業', '合約管理', '團隊協作', 'Beta-db'],
  authors: [{ name: 'Beta-db Team' }],
  creator: 'Beta-db',
  publisher: 'Beta-db',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://beta-db.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://beta-db.com',
    title: 'Beta-db - 專案管理平台',
    description: '專業的營造專案管理應用程式',
    siteName: 'Beta-db',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beta-db - 專案管理平台',
    description: '專業的營造專案管理應用程式',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
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
