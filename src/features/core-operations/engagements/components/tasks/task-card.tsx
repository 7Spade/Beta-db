/**
 * @fileoverview 任務卡片組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Pause,
  Trash2,
  User,
  X
} from 'lucide-react';
import { useState } from 'react';
import type { Task, TaskPriority, TaskStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils';
import { TaskProgressBar } from './task-progress-bar';
import { TaskStatusBadge } from './task-status-badge';

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await onUpdate(task.id, {
        status: newStatus,
        lastUpdated: new Date(),
        ...(newStatus === '已完成' && { completedDate: new Date() })
      });
    } catch (error) {
      console.error('更新任務狀態失敗:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('確定要刪除這個任務嗎？')) {
      setIsDeleting(true);
      try {
        await onDelete(task.id);
      } catch (error) {
        console.error('刪除任務失敗:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case '已完成':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case '進行中':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case '已暫停':
        return <Pause className="h-4 w-4 text-yellow-600" />;
      case '已取消':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case '緊急':
        return 'bg-red-100 text-red-800 border-red-200';
      case '高':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case '中':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case '低':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const progressPercentage = task.quantity > 0 ? (task.completedQuantity / task.quantity) * 100 : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {getStatusIcon(task.status)}
              {task.title}
            </CardTitle>
            {task.description && (
              <CardDescription className="mt-1">
                {task.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            <TaskStatusBadge status={task.status} />
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 進度條 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">進度</span>
            <span className="font-medium">
              {task.completedQuantity} / {task.quantity}
            </span>
          </div>
          <TaskProgressBar
            completed={task.completedQuantity}
            total={task.quantity}
            percentage={progressPercentage}
          />
        </div>

        {/* 任務信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">價值</div>
              <div className="font-medium">{formatCurrency(task.value)}</div>
            </div>
          </div>

          {task.dueDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground">到期日</div>
                <div className="font-medium">{formatDate(task.dueDate)}</div>
              </div>
            </div>
          )}

          {task.assignedTo && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground">負責人</div>
                <div className="font-medium">{task.assignedToName || task.assignedTo}</div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">更新時間</div>
              <div className="font-medium">{formatDate(task.lastUpdated)}</div>
            </div>
          </div>
        </div>

        {/* 標籤 */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* 操作按鈕 */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isDeleting}
            >
              <Edit className="h-4 w-4 mr-1" />
              編輯
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {isDeleting ? '刪除中...' : '刪除'}
            </Button>
          </div>

          {/* 快速狀態切換 */}
          <div className="flex gap-1">
            {task.status !== '已完成' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('已完成')}
                className="text-green-600 hover:text-green-700"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            {task.status !== '進行中' && task.status !== '已完成' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('進行中')}
                className="text-blue-600 hover:text-blue-700"
              >
                <Clock className="h-4 w-4" />
              </Button>
            )}
            {task.status !== '已暫停' && task.status !== '已完成' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('已暫停')}
                className="text-yellow-600 hover:text-yellow-700"
              >
                <Pause className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
