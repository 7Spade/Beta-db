/**
 * @project Beta-db Integrated Platform - 統一整合平台合約儀表板
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author Beta-db Development Team
 * @created 2025-01-22
 * @updated 2025-01-22
 * @version 1.0.0
 * 
 * @fileoverview 合約儀表板元件
 * @description 顯示合約相關統計數據，包括總數、進行中、已完成以及總價值。
 */
'use client';

import type { Contract } from '@/lib/types';
import { DashboardStats, type StatCardData } from '@/components/features/dashboard/dashboard-stats';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Briefcase, CheckCircle, CircleDollarSign, Clock } from 'lucide-react';

interface ContractDashboardProps {
  contracts?: Contract[];
  loading?: boolean;
}

export function ContractDashboard({ contracts: initialContracts, loading: initialLoading }: ContractDashboardProps) {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts || []);
  const [loading, setLoading] = useState(initialLoading ?? !initialContracts);

  useEffect(() => {
    // If contracts are not passed as props, fetch them internally.
    if (!initialContracts) {
      const contractsCollection = collection(db, 'contracts');
      const unsubscribe = onSnapshot(contractsCollection, (snapshot) => {
        const contractList = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            startDate: data.startDate?.toDate(),
            endDate: data.endDate?.toDate(),
          } as Contract;
        });
        setContracts(contractList);
        setLoading(false);
      }, (error) => {
        console.error("為儀表板獲取合約時發生錯誤：", error);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // If contracts are passed as props, use them directly.
      setContracts(initialContracts);
      setLoading(initialLoading ?? false);
    }
  }, [initialContracts, initialLoading]);

  if (loading) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
        </div>
    )
  }
  
  const totalValue = contracts.reduce((acc, c) => acc + c.totalValue, 0);

  const stats: StatCardData[] = [
    {
      title: '總合約數',
      value: contracts.length.toString(),
      description: '所有已註冊的合約',
      icon: Briefcase,
    },
    {
      title: '啟用中合約',
      value: contracts.filter(c => c.status === '啟用中').length.toString(),
      description: '目前進行中的專案',
      icon: Clock,
    },
    {
      title: '已完成合約',
      value: contracts.filter(c => c.status === '已完成').length.toString(),
      description: '已成功完成的專案',
      icon: CheckCircle,
    },
    {
      title: '總合約價值',
      value: `$${new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(totalValue)}`,
      description: '所有合約的總價值',
      icon: CircleDollarSign,
    },
  ];

  return <DashboardStats stats={stats} />;
}
