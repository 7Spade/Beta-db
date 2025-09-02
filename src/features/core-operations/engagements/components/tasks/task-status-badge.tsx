/**
 * @fileoverview 任務狀態標籤組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Pause, X, AlertCircle } from 'lucide-react';
import type { TaskStatus } from '../../types';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function TaskStatusBadge({ status, size = 'md' }: TaskStatusBadgeProps) {
  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case '已完成':
        return {
          label: '已完成',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
          icon: <CheckCircle className="h-3 w-3" />
        };
      case '進行中':
        return {
          label: '進行中',
          variant: 'default' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100',
          icon: <Clock className="h-3 w-3" />
        };
      case '已暫停':
        return {
          label: '已暫停',
          variant: 'default' as const,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
          icon: <Pause className="h-3 w-3" />
        };
      case '已取消':
        return {
          label: '已取消',
          variant: 'default' as const,
          className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
          icon: <X className="h-3 w-3" />
        };
      case '待處理':
      default:
        return {
          label: '待處理',
          variant: 'default' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100',
          icon: <AlertCircle className="h-3 w-3" />
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1.5',
    lg: 'text-base px-3 py-2'
  };

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${sizeClasses[size]} flex items-center gap-1`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}
