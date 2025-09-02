/**
 * @fileoverview Engagement 列表視圖
 */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';
import { EngagementCard } from '../components/cards';
import { CreateEngagementForm } from '../components/forms';
import { useEngagements } from '../hooks';
import { ENGAGEMENT_STATUSES, ENGAGEMENT_PHASES } from '../constants';
import type { EngagementStatus, EngagementPhase } from '../types';

interface EngagementListViewProps {
  onCreateEngagement?: (engagementId: string) => void;
  onViewEngagement?: (id: string) => void;
  onEditEngagement?: (id: string) => void;
  onDeleteEngagement?: (id: string) => void;
  showCreateForm?: boolean;
  onCancelCreate?: () => void;
}

export function EngagementListView({
  onCreateEngagement,
  onViewEngagement,
  onEditEngagement,
  onDeleteEngagement,
  showCreateForm: externalShowCreateForm = false,
  onCancelCreate,
}: EngagementListViewProps) {
  const [internalShowCreateForm, setInternalShowCreateForm] = useState(false);
  
  // 使用外部控制或內部狀態
  const showCreateForm = externalShowCreateForm || internalShowCreateForm;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EngagementStatus | 'all'>('all');
  const [phaseFilter, setPhaseFilter] = useState<EngagementPhase | 'all'>('all');

  const {
    summaries,
    isLoading,
    error,
    refresh,
    loadMore,
    hasMore,
  } = useEngagements({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    phase: phaseFilter !== 'all' ? phaseFilter : undefined,
    limit: 20,
  });

  // 篩選摘要數據
  const filteredSummaries = summaries.filter(summary => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        summary.name.toLowerCase().includes(searchLower) ||
        summary.contractor.toLowerCase().includes(searchLower) ||
        summary.client.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const handleCreateSuccess = (engagementId: string) => {
    setInternalShowCreateForm(false);
    onCreateEngagement?.(engagementId);
    refresh();
  };

  const handleCreateCancel = () => {
    setInternalShowCreateForm(false);
    onCancelCreate?.();
  };

  const handleRefresh = () => {
    refresh();
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      loadMore();
    }
  };

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">創建新的專案合約</h1>
            <p className="text-muted-foreground">填寫以下信息來創建一個新的專案合約管理項目</p>
          </div>
          <Button variant="outline" onClick={handleCreateCancel}>
            返回列表
          </Button>
        </div>
        <CreateEngagementForm
          onSuccess={handleCreateSuccess}
          onCancel={handleCreateCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">專案合約管理</h1>
          <p className="text-muted-foreground">管理所有專案合約的完整生命週期</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Button onClick={() => setInternalShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            創建專案合約
          </Button>
        </div>
      </div>

      {/* 篩選器 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            篩選器
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜尋專案名稱、承包商或客戶..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as EngagementStatus | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="選擇狀態" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有狀態</SelectItem>
                {ENGAGEMENT_STATUSES.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={phaseFilter} onValueChange={(value) => setPhaseFilter(value as EngagementPhase | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="選擇階段" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有階段</SelectItem>
                {ENGAGEMENT_PHASES.map(phase => (
                  <SelectItem key={phase} value={phase}>
                    {phase}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                共 {filteredSummaries.length} 個專案
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 錯誤提示 */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-600">{error}</div>
          </CardContent>
        </Card>
      )}

      {/* 專案列表 */}
      {isLoading && filteredSummaries.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredSummaries.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' || phaseFilter !== 'all' 
                  ? '沒有找到符合條件的專案合約'
                  : '還沒有任何專案合約'
                }
              </div>
              {!searchTerm && statusFilter === 'all' && phaseFilter === 'all' && (
                <Button onClick={() => setInternalShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  創建第一個專案合約
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSummaries.map((engagement) => (
            <EngagementCard
              key={engagement.id}
              engagement={engagement}
              onView={onViewEngagement}
              onEdit={onEditEngagement}
              onDelete={onDeleteEngagement}
            />
          ))}
        </div>
      )}

      {/* 載入更多 */}
      {hasMore && filteredSummaries.length > 0 && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? '載入中...' : '載入更多'}
          </Button>
        </div>
      )}
    </div>
  );
}