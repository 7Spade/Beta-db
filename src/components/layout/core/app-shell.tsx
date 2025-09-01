
'use client';

import { AppHeader } from '@/components/layout/core/app-header';
import { UnifiedSidebar } from '@/components/layout/navigation/unified-sidebar';
import { SidebarInset, SidebarProvider } from '@/ui/sidebar';
import { useEffect, useState } from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <SidebarProvider>
      <UnifiedSidebar collapsible="icon" />
      <SidebarInset>
        {isClient && <AppHeader />}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
