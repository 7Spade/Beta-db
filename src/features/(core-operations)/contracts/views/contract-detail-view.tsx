/**
 * @fileoverview 合約詳情視圖組件
 */
'use client';

import { ContractDetailsSheet } from '@/features/(core-operations)/contracts/sheets';
import type { Contract } from '@/features/(core-operations)/contracts/types';
import { firestore } from '@/lib/db/firebase-client/firebase-client';
import { Card, CardContent, CardHeader } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  onSnapshot,
} from 'firebase/firestore';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ContractDetailViewProps {
  contractId: string;
}

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
    receipts:
      data.receipts?.map((r: DocumentData) => ({
        ...r,
        requestDate: r.requestDate?.toDate(),
        receivedDate: r.receivedDate?.toDate(),
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

const ContractDetailSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
    </div>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  </div>
);

export function ContractDetailView({
  contractId,
}: ContractDetailViewProps) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!contractId) return;

    const docRef = doc(firestore, 'contracts', contractId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setContract(processFirestoreContract(docSnap));
        } else {
          console.log('No such document!');
          setContract(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('獲取合約詳情時發生錯誤:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [contractId]);

  if (loading) {
    return <ContractDetailSkeleton />;
  }

  if (!contract) {
    return (
        <Card>
            <CardHeader>
                <CardContent>找不到合約資料。</CardContent>
            </CardHeader>
        </Card>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">合約詳情</h1>
          <p className="text-muted-foreground">合約 ID: {contractId}</p>
        </div>
      </div>
      <ContractDetailsSheet
        contract={contract}
        isOpen={isOpen}
        onOpenChange={(nextOpen) => {
          setIsOpen(nextOpen);
          if (!nextOpen) {
            router.back();
          }
        }}
      />
    </>
  );
}
