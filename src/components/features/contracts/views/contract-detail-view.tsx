/**
 * @fileoverview 合約詳情視圖組件
 */
'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { Contract } from '../types';
import { ContractDetailsSheet } from '../sheets';
import { Skeleton } from '@/components/ui/skeleton';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface ContractDetailViewProps {
  contractId: string;
  router: AppRouterInstance;
}

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

export function ContractDetailView({ contractId, router }: ContractDetailViewProps) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contractId) return;

    const docRef = doc(firestore, 'contracts', contractId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setContract(processFirestoreContract(docSnap));
      } else {
        console.log("No such document!");
        setContract(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("獲取合約詳情時發生錯誤:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [contractId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!contract) {
    return <div>找不到合約資料。</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">合約詳情</h1>
          <p className="text-muted-foreground">
            合約 ID: {contractId}
          </p>
        </div>
      </div>
      <ContractDetailsSheet contract={contract} isOpen={true} onOpenChange={(isOpen) => {
        if (!isOpen) {
          router.back();
        }
      }} />
    </>
  );
}
