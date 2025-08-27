
import { AppProvider } from '@/components/layout/core/app-provider';
import { AppShell } from '@/components/layout/core/app-shell';
import { AuthProvider } from '@/components/features/auth/auth-provider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        <AppProvider>
            <AppShell>{children}</AppShell>
        </AppProvider>
    </AuthProvider>
  );
}
