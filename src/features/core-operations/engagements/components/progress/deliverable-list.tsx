/**
 * @fileoverview 交付物列表組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Timestamp } from 'firebase/firestore';
import { FileText, Package, Plus, Search, SortAsc, SortDesc, User } from 'lucide-react';
import { useState } from 'react';
import type { Deliverable, DeliverableStatus, DeliverableType } from '../../types';
import { DeliverableCard } from './deliverable-card';
import { DeliverableForm } from './deliverable-form';

interface DeliverableListProps {
  deliverables: Deliverable[];
  onDeliverableUpdate: (deliverableId: string, updates: Partial<Deliverable>) => Promise<void>;
  onDeliverableDelete: (deliverableId: string) => Promise<void>;
  onDeliverableCreate: (deliverable: Omit<Deliverable, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => Promise<void>;
  isLoading?: boolean;
}

export function DeliverableList({
  deliverables,
  onDeliverableUpdate,
  onDeliverableDelete,
  onDeliverableCreate,
  isLoading = false,
}: DeliverableListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeliverableStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<DeliverableType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'status' | 'type' | 'plannedDate' | 'progress' | 'createdAt'>('plannedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 篩選和排序交付物
  const filteredAndSortedDeliverables = deliverables
    .filter(deliverable => {
      const matchesSearch = deliverable.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deliverable.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || deliverable.status === statusFilter;
      const matchesType = typeFilter === 'all' || deliverable.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'status':
          const statusOrder = { '未開始': 1, '進行中': 2, '已完成': 3, '已驗收': 4, '已拒絕': 5 };
          aValue = statusOrder[a.status as keyof typeof statusOrder];
          bValue = statusOrder[b.status as keyof typeof statusOrder];
          break;
        case 'type':
          const typeOrder = { 'document': 1, 'product': 2, 'service': 3, 'report': 4, 'other': 5 };
          aValue = typeOrder[a.type as keyof typeof typeOrder];
          bValue = typeOrder[b.type as keyof typeof typeOrder];
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

  const handleCreateDeliverable = async (deliverableData: Omit<Deliverable, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    try {
      await onDeliverableCreate(deliverableData);
      setShowCreateForm(false);
    } catch (error) {
      console.error('創建交付物失敗:', error);
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

  const getTypeIcon = (type: DeliverableType) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'product':
        return <Package className="h-4 w-4" />;
      case 'service':
        return <User className="h-4 w-4" />;
      case 'report':
        return <FileText className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>交付物管理</CardTitle>
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              交付物管理
              <Badge variant="secondary" className="ml-2">
                {filteredAndSortedDeliverables.length} / {deliverables.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              管理專案的所有交付物和驗收記錄
            </CardDescription>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新增交付物
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 創建交付物表單 */}
        {showCreateForm && (
          <DeliverableForm
            onSubmit={handleCreateDeliverable}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {/* 篩選和搜索 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索交付物..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as DeliverableStatus | 'all')}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="狀態" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部狀態</SelectItem>
              <SelectItem value="未開始">未開始</SelectItem>
              <SelectItem value="進行中">進行中</SelectItem>
              <SelectItem value="已完成">已完成</SelectItem>
              <SelectItem value="已驗收">已驗收</SelectItem>
              <SelectItem value="已拒絕">已拒絕</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as DeliverableType | 'all')}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="類型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部類型</SelectItem>
              <SelectItem value="document">文件</SelectItem>
              <SelectItem value="product">產品</SelectItem>
              <SelectItem value="service">服務</SelectItem>
              <SelectItem value="report">報告</SelectItem>
              <SelectItem value="other">其他</SelectItem>
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
            onClick={() => handleSort('type')}
            className="h-8 px-2"
          >
            類型 {getSortIcon('type')}
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

        {/* 交付物列表 */}
        {filteredAndSortedDeliverables.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {deliverables.length === 0 ? '尚無交付物' : '沒有符合條件的交付物'}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedDeliverables.map((deliverable) => (
              <DeliverableCard
                key={deliverable.id}
                deliverable={deliverable}
                onUpdate={onDeliverableUpdate}
                onDelete={onDeliverableDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
