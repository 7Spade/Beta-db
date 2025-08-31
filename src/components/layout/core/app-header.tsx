
'use client'

import { Breadcrumb } from '@/components/layout/navigation/breadcrumb'
import { NotificationCenter } from '@/components/layout/navigation/notification-center'
import { UserMenu } from '@/components/layout/navigation/user-menu'
import { Logo } from '@/components/layout/shared/logo'
import { auth } from '@/lib/db/firebase-client/firebase-client'
import { Button } from '@/ui/button'
import { Separator } from '@/ui/separator'
import { SidebarTrigger, useSidebar } from '@/ui/sidebar'
import { useAuth } from '@root/src/features/(system-admin)/(security-compliance)/auth/use-auth'
import { signOut } from 'firebase/auth'
import { Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'


interface AppHeaderProps {
  className?: string
}

export function AppHeader({ className }: AppHeaderProps) {
  const { toggleSidebar } = useSidebar();
  const { user, profile } = useAuth();
  const router = useRouter();
  return (
    <header className={`flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 ${className}`}>
      <div className="flex items-center gap-2 px-4">
        <Button variant="outline" size="icon" className="d-block md:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">開啟選單</span>
        </Button>
        <SidebarTrigger className="-ml-1 hidden md:flex" />
        <Separator orientation="vertical" className="mr-2 h-4 hidden md:block" />
        <div className="flex items-center gap-2">
          <Logo className="h-5 w-5" />
          <span className="font-semibold">Beta-db</span>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4">
        <div className="hidden md:block">
          <Breadcrumb />
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
      </div>
    </header>
  )
}
