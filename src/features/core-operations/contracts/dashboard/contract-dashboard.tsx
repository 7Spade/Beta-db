/**
 * @fileoverview 合約儀表板元件
 * @description 顯示合約相關統計數據，包括總數、進行中、已完成以及總價值。
 */
'use client';

import { useContracts } from '@/features/core-operations/contracts/hooks';
import { Skeleton } from '@/ui/skeleton';
import {
  DashboardStats,
  type StatCardData,
} from '@root/src/features/business-intelligence/reporting-analytics/dashboard/dashboard-stats';
import { Briefcase, CheckCircle, CircleDollarSign, Clock } from 'lucide-react';

export function ContractDashboard() {
  const { contracts, loading } = useContracts();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    );
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
      value: contracts.filter((c) => c.status === '啟用中').length.toString(),
      description: '目前進行中的專案',
      icon: Clock,
    },
    {
      title: '已完成合約',
      value: contracts.filter((c) => c.status === '已完成').length.toString(),
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
