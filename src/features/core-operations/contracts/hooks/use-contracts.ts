/**
 * @fileoverview 合約數據管理 Hook
 */

import type { Contract } from '@/features/core-operations/contracts/types';
import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import {
  collection,
  DocumentData,
  DocumentSnapshot,
  onSnapshot,
  orderBy,
  query,
  QueryOrderByConstraint,
  Timestamp,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

// Helper function to convert Firestore Timestamps to Dates
const processFirestoreContract = (
  doc: DocumentSnapshot<DocumentData>
): Contract => {
  const data = doc.data();
  if (!data) {
    throw new Error('Document data is undefined');
  }

  return {
    ...data,
    id: doc.id,
    startDate: data.startDate?.toDate(),
    endDate: data.endDate?.toDate(),
    payments:
      data.payments?.map((p: DocumentData) => ({
        ...p,
        requestDate: p.requestDate?.toDate(),
        paidDate: p.paidDate?.toDate(),
      })) || [],
    changeOrders:
      data.changeOrders?.map((co: DocumentData) => ({
        ...co,
        date: co.date?.toDate(),
      })) || [],
    versions:
      data.versions?.map((v: DocumentData) => ({
        ...v,
        date: v.date?.toDate(),
      })) || [],
  } as Contract;
};

interface UseContractsOptions {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export function useContracts(options: UseContractsOptions = {}) {
  const { sortBy = 'startDate', sortDirection = 'desc' } = options;
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const contractsCollection = collection(firestore, 'contracts');
    const orderConstraints: QueryOrderByConstraint[] = [];

    if (sortBy) {
      orderConstraints.push(orderBy(sortBy, sortDirection));
    }

    const q = query(contractsCollection, ...orderConstraints);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        try {
          const contractList = querySnapshot.docs.map(processFirestoreContract);
          setContracts(contractList);
          setError(null);
        } catch (err) {
          console.error('處理合約數據時發生錯誤：', err);
          setError('處理合約數據時發生錯誤');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('獲取合約時發生錯誤：', error);
        setError('獲取合約時發生錯誤');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [sortBy, sortDirection]);

  return {
    contracts,
    loading,
    error,
  };
}
