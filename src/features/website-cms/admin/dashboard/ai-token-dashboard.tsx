/**
 * @fileoverview AI Token 使用情況總覽儀表板元件
 * @description 顯示 AI Token 相關統計數據，包括總消耗量、呼叫次數、成功率等。
 */
'use client';

import {
  DashboardStats,
  type StatCardData,
} from '@/features/business-intelligence/reporting-analytics/dashboard/dashboard-stats';
import { Skeleton } from '@/ui/skeleton';
import { CheckCircle, Cpu, FileWarning, Zap } from 'lucide-react';
import { useAiTokenStats } from '../hooks/use-ai-token-stats';

export function AiTokenDashboard() {
  const { stats, loading } = useAiTokenStats();

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

  const successRate =
    stats.totalCalls > 0
      ? ((stats.successfulCalls / stats.totalCalls) * 100).toFixed(1)
      : '0.0';

  const statCards: StatCardData[] = [
    {
      title: '總消耗 Tokens',
      value: stats.totalTokens.toLocaleString(),
      description: '過去 30 天內所有 AI 流程的消耗',
      icon: Cpu,
    },
    {
      title: '總呼叫次數',
      value: stats.totalCalls.toLocaleString(),
      description: '所有 AI 流程的呼叫總和',
      icon: Zap,
    },
    {
      title: '成功率',
      value: `${successRate}%`,
      description: `${stats.successfulCalls} 次成功呼叫`,
      icon: CheckCircle,
    },
    {
      title: '失敗次數',
      value: stats.failedCalls.toLocaleString(),
      description: '需要注意的錯誤呼叫',
      icon: FileWarning,
    },
  ];

  return <DashboardStats stats={statCards} />;
}
