/**
 * @fileoverview 進度圖表組件
 */
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { cn } from '@root/src/shared/utils';
import type { ProgressSummary } from '../../types';

interface ProgressChartProps {
  summary: ProgressSummary;
  className?: string;
}

export function ProgressChart({ summary, className }: ProgressChartProps) {
  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-200';
    if (progress < 30) return 'bg-red-500';
    if (progress < 60) return 'bg-yellow-500';
    if (progress < 90) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getProgressTextColor = (progress: number) => {
    if (progress < 30) return 'text-red-600';
    if (progress < 60) return 'text-yellow-600';
    if (progress < 90) return 'text-blue-600';
    return 'text-green-600';
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* 整體進度 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">整體進度</h3>
          </div>
          <Badge variant="outline" className={cn('text-lg font-bold', getProgressTextColor(summary.overallProgress))}>
            {summary.overallProgress}%
          </Badge>
        </div>
        <div className="relative">
          <Progress value={summary.overallProgress} className="h-4" />
          <div 
            className={cn(
              'absolute top-0 left-0 h-full transition-all duration-500 ease-in-out',
              getProgressColor(summary.overallProgress)
            )}
            style={{ width: `${Math.min(summary.overallProgress, 100)}%` }}
          />
        </div>
      </div>

      {/* 詳細進度指標 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 里程碑進度 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-4 w-4 text-green-600" />
              里程碑進度
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">完成率</span>
              <span className={cn('font-semibold', getProgressTextColor(summary.milestoneProgress))}>
                {summary.milestoneProgress}%
              </span>
            </div>
            <div className="relative">
              <Progress value={summary.milestoneProgress} className="h-2" />
              <div 
                className={cn(
                  'absolute top-0 left-0 h-full transition-all duration-300 ease-in-out',
                  getProgressColor(summary.milestoneProgress)
                )}
                style={{ width: `${Math.min(summary.milestoneProgress, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{summary.completedMilestones} / {summary.totalMilestones} 完成</span>
              <span>{summary.onTimeMilestones} 準時</span>
            </div>
          </CardContent>
        </Card>

        {/* 交付物進度 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-blue-600" />
              交付物進度
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">完成率</span>
              <span className={cn('font-semibold', getProgressTextColor(summary.deliverableProgress))}>
                {summary.deliverableProgress}%
              </span>
            </div>
            <div className="relative">
              <Progress value={summary.deliverableProgress} className="h-2" />
              <div 
                className={cn(
                  'absolute top-0 left-0 h-full transition-all duration-300 ease-in-out',
                  getProgressColor(summary.deliverableProgress)
                )}
                style={{ width: `${Math.min(summary.deliverableProgress, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{summary.completedDeliverables} / {summary.totalDeliverables} 完成</span>
              <span>{summary.onTimeDeliverables} 準時</span>
            </div>
          </CardContent>
        </Card>

        {/* 任務進度 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-purple-600" />
              任務進度
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">完成率</span>
              <span className={cn('font-semibold', getProgressTextColor(summary.taskProgress))}>
                {summary.taskProgress}%
              </span>
            </div>
            <div className="relative">
              <Progress value={summary.taskProgress} className="h-2" />
              <div 
                className={cn(
                  'absolute top-0 left-0 h-full transition-all duration-300 ease-in-out',
                  getProgressColor(summary.taskProgress)
                )}
                style={{ width: `${Math.min(summary.taskProgress, 100)}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              任務完成情況
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 風險指標 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            風險指標
          </CardTitle>
          <CardDescription>
            需要關注的延遲項目
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">延遲里程碑</span>
              </div>
              <Badge variant="destructive">
                {summary.delayedMilestones}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">延遲交付物</span>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                {summary.delayedDeliverables}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 進度趨勢 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-green-600" />
            進度趨勢
          </CardTitle>
          <CardDescription>
            各項目的完成情況對比
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">里程碑</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${summary.milestoneProgress}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{summary.milestoneProgress}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">交付物</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${summary.deliverableProgress}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{summary.deliverableProgress}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">任務</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${summary.taskProgress}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{summary.taskProgress}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
