/**
 * @fileoverview Engagement 摘要卡片組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  TrendingUp,
  Users
} from 'lucide-react';
import type { Engagement } from '../../types';

interface EngagementSummaryCardProps {
  engagement: Engagement;
}

export function EngagementSummaryCard({ engagement }: EngagementSummaryCardProps) {
  const formatDate = (date: Date | any) => {
    if (!date) return '未設定';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('zh-TW');
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '草稿': return 'bg-gray-100 text-gray-800';
      case '已簽約': return 'bg-blue-100 text-blue-800';
      case '進行中': return 'bg-green-100 text-green-800';
      case '暫停': return 'bg-yellow-100 text-yellow-800';
      case '已完成': return 'bg-emerald-100 text-emerald-800';
      case '已終止': return 'bg-red-100 text-red-800';
      case '已取消': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case '規劃': return 'bg-purple-100 text-purple-800';
      case '執行': return 'bg-blue-100 text-blue-800';
      case '監控': return 'bg-orange-100 text-orange-800';
      case '收尾': return 'bg-green-100 text-green-800';
      case '維護': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 計算統計數據
  const totalTasks = engagement.tasks.length;
  const completedTasks = engagement.tasks.filter(task => task.status === '已完成').length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalPayments = engagement.payments.length;
  const paidPayments = engagement.payments.filter(payment => payment.status === '已付款').length;
  const paymentProgress = totalPayments > 0 ? Math.round((paidPayments / totalPayments) * 100) : 0;

  const totalReceipts = engagement.receipts.length;
  const receivedReceipts = engagement.receipts.filter(receipt => receipt.status === '已收款').length;
  const receiptProgress = totalReceipts > 0 ? Math.round((receivedReceipts / totalReceipts) * 100) : 0;

  const totalChangeOrders = engagement.changeOrders.length;
  const approvedChangeOrders = engagement.changeOrders.filter(co => co.status === '已核准').length;

  const totalRisks = engagement.risks.length;
  const highRisks = engagement.risks.filter(risk => risk.level === '高' || risk.level === '極高').length;

  const totalIssues = engagement.issues.length;
  const openIssues = engagement.issues.filter(issue => issue.status === '新增' || issue.status === '處理中').length;

  return (
    <div className="space-y-6">
      {/* 基本信息卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{engagement.name}</CardTitle>
              <CardDescription className="text-base">
                {engagement.contractor} → {engagement.client}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Badge className={getStatusColor(engagement.status)}>
                {engagement.status}
              </Badge>
              <Badge variant="outline" className={getPhaseColor(engagement.phase)}>
                {engagement.phase}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">開始日期</p>
                <p className="font-medium">{formatDate(engagement.startDate)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">結束日期</p>
                <p className="font-medium">{formatDate(engagement.endDate)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">總價值</p>
                <p className="font-medium">{formatCurrency(engagement.totalValue, engagement.currency || 'TWD')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">客戶代表</p>
                <p className="font-medium">{engagement.clientRepresentative || '未設定'}</p>
              </div>
            </div>
          </div>

          {engagement.description && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">描述</p>
              <p className="text-sm">{engagement.description}</p>
            </div>
          )}

          {engagement.scope && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">工作範疇</p>
              <p className="text-sm">{engagement.scope}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 進度統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              任務進度
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{completedTasks}/{totalTasks}</span>
                <span>{taskProgress}%</span>
              </div>
              <Progress value={taskProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
              付款進度
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{paidPayments}/{totalPayments}</span>
                <span>{paymentProgress}%</span>
              </div>
              <Progress value={paymentProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
              收款進度
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{receivedReceipts}/{totalReceipts}</span>
                <span>{receiptProgress}%</span>
              </div>
              <Progress value={receiptProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2 text-purple-600" />
              變更單
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedChangeOrders}/{totalChangeOrders}</div>
            <p className="text-xs text-muted-foreground">已核准/總數</p>
          </CardContent>
        </Card>
      </div>

      {/* 風險和問題卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-orange-600" />
              風險管理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">總風險</span>
                <span className="font-medium">{totalRisks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">高風險</span>
                <span className="font-medium text-orange-600">{highRisks}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
              問題追蹤
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">總問題</span>
                <span className="font-medium">{totalIssues}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">待處理</span>
                <span className="font-medium text-red-600">{openIssues}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}