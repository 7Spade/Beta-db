/**
 * @fileoverview Engagement 儀表板視圖
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertTriangle,
  Clock,
  DollarSign,
  FileText,
  Plus,
  TrendingUp
} from 'lucide-react';
import { ENGAGEMENT_PHASES, ENGAGEMENT_STATUSES } from '../constants';
import { useEngagements } from '../hooks';
import { formatCurrency, getPhaseColor, getStatusColor } from '../utils';

interface EngagementDashboardProps {
  onCreateEngagement?: () => void;
  onViewEngagement?: (id: string) => void;
}

export function EngagementDashboard({
  onCreateEngagement,
  onViewEngagement,
}: EngagementDashboardProps) {
  const { summaries, isLoading, error } = useEngagements({
    limit: 50,
    autoRefresh: false, // 暫時禁用自動刷新以避免閃爍
    refreshInterval: 30000,
  });

  // 計算統計數據
  const stats = {
    total: summaries.length,
    active: summaries.filter(s => s.status === '進行中').length,
    completed: summaries.filter(s => s.status === '已完成').length,
    overdue: summaries.filter(s => {
      const endDate = s.endDate.toDate ? s.endDate.toDate() : new Date(s.endDate);
      return endDate < new Date() && s.status !== '已完成' && s.status !== '已終止' && s.status !== '已取消';
    }).length,
    totalValue: summaries.reduce((sum, s) => sum + s.totalValue, 0),
    averageProgress: summaries.length > 0
      ? Math.round(summaries.reduce((sum, s) => sum + s.progressPercentage, 0) / summaries.length)
      : 0,
  };

  // 按狀態分組
  const statusGroups = ENGAGEMENT_STATUSES.map(status => ({
    status,
    count: summaries.filter(s => s.status === status).length,
    percentage: summaries.length > 0
      ? Math.round((summaries.filter(s => s.status === status).length / summaries.length) * 100)
      : 0,
  }));

  // 按階段分組
  const phaseGroups = ENGAGEMENT_PHASES.map(phase => ({
    phase,
    count: summaries.filter(s => s.phase === phase).length,
    percentage: summaries.length > 0
      ? Math.round((summaries.filter(s => s.phase === phase).length / summaries.length) * 100)
      : 0,
  }));

  // 最近更新的專案
  const recentEngagements = summaries
    .sort((a, b) => {
      const aDate = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date();
      const bDate = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date();
      return bDate.getTime() - aDate.getTime();
    })
    .slice(0, 5);

  // 高風險專案（進度低於50%且即將到期）
  const highRiskEngagements = summaries.filter(s => {
    const endDate = s.endDate.toDate ? s.endDate.toDate() : new Date(s.endDate);
    const daysRemaining = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return s.progressPercentage < 50 && daysRemaining < 30 && s.status === '進行中';
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-red-600">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">專案合約儀表板</h1>
          <p className="text-muted-foreground">專案合約管理的總覽和統計</p>
        </div>
        <Button onClick={onCreateEngagement}>
          <Plus className="h-4 w-4 mr-2" />
          創建專案合約
        </Button>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總專案數</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              活躍: {stats.active} | 已完成: {stats.completed}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總價值</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              平均進度: {stats.averageProgress}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">逾期專案</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">
              需要關注的專案
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均進度</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageProgress}%</div>
            <p className="text-xs text-muted-foreground">
              所有專案的平均進度
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 狀態和階段分佈 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>狀態分佈</CardTitle>
            <CardDescription>專案合約的狀態分佈情況</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusGroups.map(({ status, count, percentage }) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(status)}>
                      {status}
                    </Badge>
                    <span className="text-sm">{count}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {percentage}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>階段分佈</CardTitle>
            <CardDescription>專案合約的階段分佈情況</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {phaseGroups.map(({ phase, count, percentage }) => (
                <div key={phase} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getPhaseColor(phase)}>
                      {phase}
                    </Badge>
                    <span className="text-sm">{count}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {percentage}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 高風險專案和最近更新 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              高風險專案
            </CardTitle>
            <CardDescription>進度低於50%且即將到期的專案</CardDescription>
          </CardHeader>
          <CardContent>
            {highRiskEngagements.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                沒有高風險專案
              </div>
            ) : (
              <div className="space-y-3">
                {highRiskEngagements.map((engagement) => (
                  <div
                    key={engagement.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => onViewEngagement?.(engagement.id)}
                  >
                    <div>
                      <div className="font-medium">{engagement.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {engagement.contractor} → {engagement.client}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-600">
                        {engagement.progressPercentage}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(engagement.totalValue, engagement.currency || 'TWD')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              最近更新
            </CardTitle>
            <CardDescription>最近更新的專案合約</CardDescription>
          </CardHeader>
          <CardContent>
            {recentEngagements.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                沒有專案合約
              </div>
            ) : (
              <div className="space-y-3">
                {recentEngagements.map((engagement) => (
                  <div
                    key={engagement.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => onViewEngagement?.(engagement.id)}
                  >
                    <div>
                      <div className="font-medium">{engagement.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {engagement.contractor} → {engagement.client}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(engagement.status)}>
                        {engagement.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {engagement.progressPercentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}