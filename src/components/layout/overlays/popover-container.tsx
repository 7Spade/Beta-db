/**
 * @fileoverview Dashboard Layout
 * @description This is the main layout for all authenticated pages.
 * It integrates the sidebar and header, creating the primary app shell.
 */
import { AppHeader } from '@/components/layout/core/app-header';
import { AppProvider } from '@/components/layout/core/app-provider';
import { UnifiedSidebar } from '@/components/layout/navigation/unified-sidebar';
import { SidebarProvider } from '@/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <UnifiedSidebar />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <AppHeader />
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AppProvider>
  );
}