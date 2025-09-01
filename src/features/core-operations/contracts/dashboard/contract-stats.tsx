/**
 * @fileoverview 合約統計
 */
'use client';

import type { Contract } from '@/features/core-operations/contracts/types';
import {
  DashboardStats,
  type StatCardData,
} from '@root/src/features/business-intelligence/reporting-analytics/dashboard/dashboard-stats';
import { Briefcase, CheckCircle, CircleDollarSign, Clock } from 'lucide-react';

interface ContractStatsProps {
  contracts: Contract[];
}

export function ContractStats({ contracts }: ContractStatsProps) {
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
