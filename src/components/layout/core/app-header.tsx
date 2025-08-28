
'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Logo } from '@/components/layout/shared/logo'
import { Breadcrumb } from '@/components/layout/navigation/breadcrumb'
import { useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { UserMenu } from '@/components/layout/navigation/user-menu'
import { useAuth } from '@/components/features/auth/use-auth'
import { auth } from '@/lib/db/firebase-client/firebase-client'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { NotificationCenter } from '@/components/layout/navigation/notification-center'


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
