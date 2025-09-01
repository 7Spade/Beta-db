/**
 * @fileoverview 專案儀表板元件
 * @description 顯示專案相關統計數據，包括總數、進行中、已完成以及進度。
 */
'use client';

import {
  DashboardStats,
  type StatCardData,
} from '@/features/business-intelligence/reporting-analytics/dashboard/dashboard-stats';
import { useProjects } from '@/features/core-operations/projects/hooks/use-projects';
import { calculateProjectProgress } from '@/features/core-operations/projects/utils';
import { Skeleton } from '@/ui/skeleton';
import {
  Briefcase,
  CheckCircle,
  CircleDollarSign,
  Clock,
} from 'lucide-react';

export function ProjectDashboard() {
  const { projects, loading } = useProjects();

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

  const projectStats = projects.map((p) => calculateProjectProgress(p.tasks));

  const totalValue = projectStats.reduce((sum, s) => sum + s.totalValue, 0);
  const completedValue = projectStats.reduce(
    (sum, s) => sum + s.completedValue,
    0
  );

  const inProgressProjects = projectStats.filter(
    (s) => s.completedValue < s.totalValue && s.totalValue > 0
  ).length;
  const completedProjects = projectStats.filter(
    (s) => s.completedValue >= s.totalValue && s.totalValue > 0
  ).length;

  const stats: StatCardData[] = [
    {
      title: '總專案數',
      value: projects.length.toString(),
      description: '所有進行中與已完成的專案',
      icon: Briefcase,
    },
    {
      title: '進行中專案',
      value: inProgressProjects.toString(),
      description: '基於任務完成度計算',
      icon: Clock,
    },
    {
      title: '已完成專案',
      value: completedProjects.toString(),
      description: '所有任務均已完成的專案',
      icon: CheckCircle,
    },
    {
      title: '已完成價值',
      value: `$${new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(completedValue)}`,
      description: `總價值 \$${new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(totalValue)}`,
      icon: CircleDollarSign,
    },
  ];

  return <DashboardStats stats={stats} />;
}
