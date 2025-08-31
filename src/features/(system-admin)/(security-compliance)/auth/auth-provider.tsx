'use client';

import { useAuth } from '@root/src/features/(system-admin)/(security-compliance)/auth/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const PUBLIC_ROUTES = new Set<string>([
  '/login',
  '/register',
  '/verify-email',
  '/pending-approval',
  '/',
]);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, status, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Rejected accounts are signed out and redirected to login
    if (user && status === 'rejected') {
      signOut().finally(() => router.replace('/login?error=rejected'));
      return;
    }

    // Pending users are forced to pending-approval page
    if (user && status === 'pending') {
      if (pathname !== '/pending-approval') {
        router.replace('/pending-approval');
      }
      return;
    }

    // Approved users avoid auth pages and leave pending page
    if (user && status === 'approved') {
      if (pathname === '/login' || pathname === '/register' || pathname === '/pending-approval') {
        router.replace('/dashboard');
      }
      return;
    }

    // Unauthenticated users: allow public routes, otherwise go to login
    if (!user) {
      if (!PUBLIC_ROUTES.has(pathname)) {
        router.replace('/login');
      }
    }
  }, [user, status, loading, pathname, router, signOut]);

  return <>{children}</>;
}
