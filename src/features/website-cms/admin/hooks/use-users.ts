/**
 * @fileoverview 用戶數據管理 Hook
 */
'use client';

import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  Timestamp,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface UserProfile {
  id: string;
  displayName?: string;
  email?: string;
  role?: 'Admin' | 'Member';
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
}

export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const usersCollection = collection(firestore, 'users');
    const q = query(usersCollection);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        try {
          const userList = querySnapshot.docs.map((doc) => {
            const data = doc.data() as DocumentData;
            return {
              id: doc.id,
              displayName: data.displayName,
              email: data.email,
              role: data.role,
              status: data.status,
              createdAt: (data.createdAt as Timestamp)?.toDate(),
            } as UserProfile;
          });
          setUsers(userList);
          setError(null);
        } catch (err) {
          console.error('處理用戶數據時發生錯誤：', err);
          setError('處理用戶數據時發生錯誤');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('獲取用戶時發生錯誤：', err);
        setError('獲取用戶時發生錯誤');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    users,
    loading,
    error,
  };
}
