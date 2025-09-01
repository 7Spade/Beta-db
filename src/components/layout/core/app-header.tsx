/**
 * @fileoverview 應用程式頂部導覽欄
 * @description 重新設計的 AppHeader，採用更現代的風格，並作為一個純粹的 UI 元件。
 */
'use client';

import { Breadcrumb } from '@/components/layout/navigation/breadcrumb';
import { NotificationCenter } from '@/components/layout/navigation/notification-center';
import { UserMenu } from '@/components/layout/navigation/user-menu';
import { Button } from '@/ui/button';
import { useSidebar } from '@/ui/sidebar';
import { useAuth } from '@root/src/features/auth/use-auth';
import { auth } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import { signOut } from 'firebase/auth';
import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AppHeader() {
  const { toggleSidebar } = useSidebar();
  const { user, profile } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Button
        variant="outline"
        size="icon"
        className="d-block md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">開啟/關閉選單</span>
      </Button>
      <div className="hidden md:block">
        <Breadcrumb />
      </div>
      <div className="relative ml-auto flex-1 md:grow-0">
        {/* 未來可放 SearchCommand */}
      </div>
      <NotificationCenter />
      <UserMenu
        user={{
          name: profile?.displayName || user?.email || 'User',
          email: user?.email || undefined,
          avatar: profile?.avatarUrl,
        }}
        onProfileClick={() => router.push('/profile')}
        onSettingsClick={() => router.push('/settings')}
        onLogoutClick={async () => {
          await signOut(auth);
          router.push('/login');
        }}
      />
    </header>
  );
}
