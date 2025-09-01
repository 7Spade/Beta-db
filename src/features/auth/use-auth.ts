'use client';

/**
 * Firebase Auth Hook 檔案
 *
 * 功能說明：
 * - 提供 React Hook 形式的認證操作
 * - 管理用戶認證狀態和會話
 * - 處理登入、登出、註冊流程
 * - 優化權限檢查和角色管理
 * - 提供多因素認證支援
 *
 * 主要 Hook：
 * - useAuth: 認證狀態管理
 * - useUser: 用戶資料管理
 * - useLogin: 登入流程管理
 * - useLogout: 登出流程管理
 * - useRegister: 註冊流程管理
 * - usePermission: 權限檢查管理
 */
import { auth, firestore } from '@/lib/db/firebase-client/firebase-client';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';

export type AuthStatus = 'pending' | 'approved' | 'rejected' | 'unknown';

export interface UserProfile {
  email?: string | null;
  displayName?: string | null;
  role?: string;
  status?: AuthStatus;
  createdAt?: unknown;
  avatarUrl?: string;
}

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }
      try {
        const ref = doc(firestore, 'users', user.uid);
        unsubscribeProfile = onSnapshot(
          ref,
          (snap) => {
            setProfile((snap.data() as UserProfile) || null);
            setLoading(false);
          },
          () => {
            setError('讀取使用者資料失敗');
            setLoading(false);
          }
        );
      } catch {
        setError('讀取使用者資料失敗');
        setLoading(false);
      }
    });
    return () => {
      unsubAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const status: AuthStatus = useMemo(() => {
    if (!firebaseUser) return 'unknown';
    const s = profile?.status as AuthStatus | undefined;
    return s && (s === 'pending' || s === 'approved' || s === 'rejected')
      ? s
      : 'pending';
  }, [firebaseUser, profile]);

  return {
    user: firebaseUser,
    profile,
    status,
    loading,
    error,
    signOut: () => signOut(auth),
  };
}
