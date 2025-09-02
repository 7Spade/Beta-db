/**
 * @fileoverview 里程碑列表組件
 */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, SortAsc, SortDesc, Calendar, Target } from 'lucide-react';
import { MilestoneCard } from './milestone-card';
import { MilestoneForm } from './milestone-form';
import { ProgressChart } from './progress-chart';
import { formatDate } from '../../utils';
import { Timestamp } from 'firebase/firestore';
import type { Milestone, MilestoneStatus, ProgressSummary } from '../../types';

interface MilestoneListProps {
  milestones: Milestone[];
  progressSummary?: ProgressSummary;
  onMilestoneUpdate: (milestoneId: string, updates: Partial<Milestone>) => Promise<void>;
  onMilestoneDelete: (milestoneId: string) => Promise<void>;
  onMilestoneCreate: (milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => Promise<void>;
  isLoading?: boolean;
}

export function MilestoneList({
  milestones,
  progressSummary,
  onMilestoneUpdate,
  onMilestoneDelete,
  onMilestoneCreate,
  isLoading = false,
}: MilestoneListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MilestoneStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'status' | 'plannedDate' | 'progress' | 'createdAt'>('plannedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 篩選和排序里程碑
  const filteredAndSortedMilestones = milestones
    .filter(milestone => {
      const matchesSearch = milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           milestone.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || milestone.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'status':
          const statusOrder = { '未開始': 1, '進行中': 2, '已完成': 3, '已延遲': 4, '已取消': 5 };
          aValue = statusOrder[a.status as keyof typeof statusOrder];
          bValue = statusOrder[b.status as keyof typeof statusOrder];
          break;
        case 'plannedDate':
          aValue = a.plannedDate instanceof Date ? a.plannedDate.getTime() : a.plannedDate instanceof Timestamp ? a.plannedDate.toMillis() : new Date(a.plannedDate).getTime();
          bValue = b.plannedDate instanceof Date ? b.plannedDate.getTime() : b.plannedDate instanceof Timestamp ? b.plannedDate.toMillis() : new Date(b.plannedDate).getTime();
          break;
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        case 'createdAt':
        default:
          aValue = a.createdAt instanceof Date ? a.createdAt.getTime() : a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : new Date(a.createdAt).getTime();
          bValue = b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : new Date(b.createdAt).getTime();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleCreateMilestone = async (milestoneData: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    try {
      await onMilestoneCreate(milestoneData);
      setShowCreateForm(false);
    } catch (error) {
      console.error('創建里程碑失敗:', error);
    }
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: typeof sortBy) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>里程碑管理</CardTitle>
          <CardDescription>載入中...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 進度摘要圖表 */}
      {progressSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              進度摘要
            </CardTitle>
            <CardDescription>
              整體專案進度和里程碑完成情況
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressChart summary={progressSummary} />
          </CardContent>
        </Card>
      )}

      {/* 里程碑列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                里程碑管理
                <Badge variant="secondary" className="ml-2">
                  {filteredAndSortedMilestones.length} / {milestones.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                管理專案的所有里程碑和交付物
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              新增里程碑
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 創建里程碑表單 */}
          {showCreateForm && (
            <MilestoneForm
              onSubmit={handleCreateMilestone}
              onCancel={() => setShowCreateForm(false)}
            />
          )}

          {/* 篩選和搜索 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索里程碑..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as MilestoneStatus | 'all')}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="狀態" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部狀態</SelectItem>
                <SelectItem value="未開始">未開始</SelectItem>
                <SelectItem value="進行中">進行中</SelectItem>
                <SelectItem value="已完成">已完成</SelectItem>
                <SelectItem value="已延遲">已延遲</SelectItem>
                <SelectItem value="已取消">已取消</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 排序選項 */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>排序:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSort('title')}
              className="h-8 px-2"
            >
              標題 {getSortIcon('title')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSort('status')}
              className="h-8 px-2"
            >
              狀態 {getSortIcon('status')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSort('plannedDate')}
              className="h-8 px-2"
            >
              計劃日期 {getSortIcon('plannedDate')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSort('progress')}
              className="h-8 px-2"
            >
              進度 {getSortIcon('progress')}
            </Button>
          </div>

          {/* 里程碑列表 */}
          {filteredAndSortedMilestones.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {milestones.length === 0 ? '尚無里程碑' : '沒有符合條件的里程碑'}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAndSortedMilestones.map((milestone) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  onUpdate={onMilestoneUpdate}
                  onDelete={onMilestoneDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
