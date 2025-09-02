/**
 * @fileoverview 任務列表組件
 */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { TaskCard } from './task-card';
import { TaskForm } from './task-form';
import { Timestamp } from 'firebase/firestore';
import type { Task, TaskStatus, TaskPriority } from '../../types';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onTaskDelete: (taskId: string) => Promise<void>;
  onTaskCreate: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => Promise<void>;
  isLoading?: boolean;
}

export function TaskList({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskCreate,
  isLoading = false,
}: TaskListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'status' | 'priority' | 'dueDate' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 篩選和排序任務
  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'priority':
          const priorityOrder = { '緊急': 4, '高': 3, '中': 2, '低': 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'dueDate':
          aValue = a.dueDate ? (a.dueDate instanceof Date ? a.dueDate.getTime() : a.dueDate instanceof Timestamp ? a.dueDate.toMillis() : new Date(a.dueDate).getTime()) : 0;
          bValue = b.dueDate ? (b.dueDate instanceof Date ? b.dueDate.getTime() : b.dueDate instanceof Timestamp ? b.dueDate.toMillis() : new Date(b.dueDate).getTime()) : 0;
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

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    try {
      await onTaskCreate(taskData);
      setShowCreateForm(false);
    } catch (error) {
      console.error('創建任務失敗:', error);
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
          <CardTitle>任務管理</CardTitle>
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
              <span>任務管理</span>
              <Badge variant="secondary" className="ml-2">
                {filteredAndSortedTasks.length} / {tasks.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              管理專案的所有任務和子任務
            </CardDescription>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新增任務
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 創建任務表單 */}
        {showCreateForm && (
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {/* 篩選和搜索 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索任務..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TaskStatus | 'all')}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="狀態" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部狀態</SelectItem>
              <SelectItem value="待處理">待處理</SelectItem>
              <SelectItem value="進行中">進行中</SelectItem>
              <SelectItem value="已完成">已完成</SelectItem>
              <SelectItem value="已暫停">已暫停</SelectItem>
              <SelectItem value="已取消">已取消</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as TaskPriority | 'all')}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="優先級" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部優先級</SelectItem>
              <SelectItem value="緊急">緊急</SelectItem>
              <SelectItem value="高">高</SelectItem>
              <SelectItem value="中">中</SelectItem>
              <SelectItem value="低">低</SelectItem>
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
            onClick={() => handleSort('priority')}
            className="h-8 px-2"
          >
            優先級 {getSortIcon('priority')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort('dueDate')}
            className="h-8 px-2"
          >
            到期日 {getSortIcon('dueDate')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort('createdAt')}
            className="h-8 px-2"
          >
            創建時間 {getSortIcon('createdAt')}
          </Button>
        </div>

        {/* 任務列表 */}
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {tasks.length === 0 ? '尚無任務' : '沒有符合條件的任務'}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={onTaskUpdate}
                onDelete={onTaskDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
