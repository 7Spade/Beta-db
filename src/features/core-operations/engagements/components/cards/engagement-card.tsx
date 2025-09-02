/**
 * @fileoverview Engagement 卡片組件
 */
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, DollarSign, Users, Clock } from 'lucide-react';
import type { EngagementSummary } from '../../types';

interface EngagementCardProps {
  engagement: EngagementSummary;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function EngagementCard({ engagement, onView, onEdit, onDelete }: EngagementCardProps) {
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{engagement.name}</CardTitle>
            <CardDescription className="text-sm">
              {engagement.contractor} → {engagement.client}
            </CardDescription>
          </div>
          <div className="flex space-x-1">
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
        {/* 進度條 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>進度</span>
            <span>{engagement.progressPercentage}%</span>
          </div>
          <Progress value={engagement.progressPercentage} className="h-2" />
        </div>

        {/* 基本信息 */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">開始:</span>
            <span>{formatDate(engagement.startDate)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">結束:</span>
            <span>{formatDate(engagement.endDate)}</span>
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">總價值:</span>
            <span className="font-medium">{formatCurrency(engagement.totalValue, 'TWD')}</span>
          </div>
        </div>

        {/* 自定義 ID */}
        {engagement.customId && (
          <div className="text-xs text-muted-foreground">
            ID: {engagement.customId}
          </div>
        )}

        {/* 操作按鈕 */}
        <div className="flex justify-end space-x-2 pt-2">
          {onView && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onView(engagement.id)}
            >
              查看
            </Button>
          )}
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(engagement.id)}
            >
              編輯
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete(engagement.id)}
            >
              刪除
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}