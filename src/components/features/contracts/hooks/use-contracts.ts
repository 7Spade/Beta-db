/**
 * @fileoverview 合約數據管理 Hook
 */

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Contract } from '../types';

// Helper function to convert Firestore Timestamps to Dates
const processFirestoreContract = (doc: any): Contract => {
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    startDate: data.startDate?.toDate(),
    endDate: data.endDate?.toDate(),
    payments: data.payments?.map((p: any) => ({
      ...p,
      requestDate: p.requestDate?.toDate(),
      paidDate: p.paidDate?.toDate(),
    })) || [],
    changeOrders: data.changeOrders?.map((co: any) => ({
      ...co,
      date: co.date?.toDate(),
    })) || [],
    versions: data.versions?.map((v: any) => ({
      ...v,
      date: v.date?.toDate(),
    })) || [],
  } as Contract;
};

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const contractsCollection = collection(db, 'contracts');
    const q = query(contractsCollection);
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const contractList = querySnapshot.docs.map(processFirestoreContract);
        setContracts(contractList);
        setError(null);
      } catch (err) {
        console.error("處理合約數據時發生錯誤：", err);
        setError("處理合約數據時發生錯誤");
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error("獲取合約時發生錯誤：", error);
      setError("獲取合約時發生錯誤");
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  return {
    contracts,
    loading,
    error,
  };
}
