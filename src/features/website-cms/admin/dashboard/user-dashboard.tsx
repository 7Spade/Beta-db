/**
 * @fileoverview 用戶總覽儀表板元件
 * @description 顯示用戶相關統計數據，包括總數、已核准、待審核等。
 */
'use client';

import {
  DashboardStats,
  type StatCardData,
} from '@/features/business-intelligence/reporting-analytics/dashboard/dashboard-stats';
import { Skeleton } from '@/ui/skeleton';
import { CheckCircle, Clock, ShieldX, Users } from 'lucide-react';
import { useUsers } from '../hooks/use-users';

export function UserDashboard() {
  const { users, loading } = useUsers();

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

  const approvedUsers = users.filter((u) => u.status === 'approved').length;
  const pendingUsers = users.filter((u) => u.status === 'pending').length;
  const rejectedUsers = users.filter((u) => u.status === 'rejected').length;

  const stats: StatCardData[] = [
    {
      title: '總用戶數',
      value: users.length.toString(),
      description: '系統中所有已註冊的用戶',
      icon: Users,
    },
    {
      title: '已核准用戶',
      value: approvedUsers.toString(),
      description: '可以正常存取系統的用戶',
      icon: CheckCircle,
    },
    {
      title: '待審核用戶',
      value: pendingUsers.toString(),
      description: '等待管理員審核的新用戶',
      icon: Clock,
    },
    {
      title: '已拒絕用戶',
      value: rejectedUsers.toString(),
      description: '申請被拒絕的用戶',
      icon: ShieldX,
    },
  ];

  return <DashboardStats stats={stats} />;
}
