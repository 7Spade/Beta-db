/**
 * @fileoverview 進度摘要組件
 */
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProgressSummary } from '../../types';

interface ProgressSummaryProps {
  summary: ProgressSummary;
  className?: string;
}

export function ProgressSummary({ summary, className }: ProgressSummaryProps) {
  const getStatusColor = (progress: number) => {
    if (progress >= 90) return 'text-green-600 bg-green-100';
    if (progress >= 70) return 'text-blue-600 bg-blue-100';
    if (progress >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getOverallStatus = (progress: number) => {
    if (progress >= 90) return '優秀';
    if (progress >= 70) return '良好';
    if (progress >= 50) return '一般';
    return '需要改進';
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* 整體狀態卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            專案狀態總覽
          </CardTitle>
          <CardDescription>
            整體進度和關鍵指標
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={cn('text-3xl font-bold mb-2', getStatusColor(summary.overallProgress))}>
                {summary.overallProgress}%
              </div>
              <div className="text-sm text-muted-foreground">整體進度</div>
              <Badge variant="outline" className={cn('mt-1', getStatusColor(summary.overallProgress))}>
                {getOverallStatus(summary.overallProgress)}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {summary.completedMilestones}
              </div>
              <div className="text-sm text-muted-foreground">完成里程碑</div>
              <div className="text-xs text-muted-foreground">
                共 {summary.totalMilestones} 個
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {summary.completedDeliverables}
              </div>
              <div className="text-sm text-muted-foreground">完成交付物</div>
              <div className="text-xs text-muted-foreground">
                共 {summary.totalDeliverables} 個
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {summary.taskProgress}%
              </div>
              <div className="text-sm text-muted-foreground">任務進度</div>
              <div className="text-xs text-muted-foreground">
                任務完成率
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 詳細指標 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 里程碑狀態 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-4 w-4 text-green-600" />
              里程碑狀態
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">完成率</span>
              <span className={cn('font-semibold', getStatusColor(summary.milestoneProgress))}>
                {summary.milestoneProgress}%
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600">✓ 準時完成</span>
                <span className="font-medium">{summary.onTimeMilestones}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-600">⚠ 延遲</span>
                <span className="font-medium">{summary.delayedMilestones}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 交付物狀態 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-blue-600" />
              交付物狀態
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">完成率</span>
              <span className={cn('font-semibold', getStatusColor(summary.deliverableProgress))}>
                {summary.deliverableProgress}%
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600">✓ 準時完成</span>
                <span className="font-medium">{summary.onTimeDeliverables}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-600">⚠ 延遲</span>
                <span className="font-medium">{summary.delayedDeliverables}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 風險警告 */}
      {(summary.delayedMilestones > 0 || summary.delayedDeliverables > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              風險警告
            </CardTitle>
            <CardDescription className="text-orange-700">
              發現延遲項目，需要關注
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary.delayedMilestones > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span>有 {summary.delayedMilestones} 個里程碑延遲</span>
                </div>
              )}
              {summary.delayedDeliverables > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span>有 {summary.delayedDeliverables} 個交付物延遲</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 進度建議 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-green-600" />
            進度建議
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {summary.overallProgress >= 90 && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>專案進度良好，繼續保持</span>
              </div>
            )}
            {summary.overallProgress >= 70 && summary.overallProgress < 90 && (
              <div className="flex items-center gap-2 text-blue-600">
                <Clock className="h-4 w-4" />
                <span>專案進度正常，注意時間管理</span>
              </div>
            )}
            {summary.overallProgress >= 50 && summary.overallProgress < 70 && (
              <div className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <span>專案進度需要加速，建議增加資源</span>
              </div>
            )}
            {summary.overallProgress < 50 && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span>專案進度嚴重落後，需要緊急處理</span>
              </div>
            )}
            {summary.delayedMilestones > 0 && (
              <div className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                <span>建議重新評估里程碑時間安排</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
