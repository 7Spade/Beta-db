/**
 * @fileoverview 里程碑卡片組件
 */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Edit, 
  Trash2, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Target
} from 'lucide-react';
import { formatDate } from '../../utils';
import { Timestamp } from 'firebase/firestore';
import type { Milestone, MilestoneStatus } from '../../types';

interface MilestoneCardProps {
  milestone: Milestone;
  onUpdate: (milestoneId: string, updates: Partial<Milestone>) => Promise<void>;
  onDelete: (milestoneId: string) => Promise<void>;
}

export function MilestoneCard({ milestone, onUpdate, onDelete }: MilestoneCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus: MilestoneStatus) => {
    try {
      await onUpdate(milestone.id, { 
        status: newStatus,
        updatedAt: new Date(),
        ...(newStatus === '已完成' && { actualDate: new Date() })
      });
    } catch (error) {
      console.error('更新里程碑狀態失敗:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('確定要刪除這個里程碑嗎？')) {
      setIsDeleting(true);
      try {
        await onDelete(milestone.id);
      } catch (error) {
        console.error('刪除里程碑失敗:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getStatusIcon = (status: MilestoneStatus) => {
    switch (status) {
      case '已完成':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case '進行中':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case '已延遲':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case '已取消':
        return <X className="h-4 w-4 text-gray-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: MilestoneStatus) => {
    switch (status) {
      case '已完成':
        return 'bg-green-100 text-green-800 border-green-200';
      case '進行中':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '已延遲':
        return 'bg-red-100 text-red-800 border-red-200';
      case '已取消':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-200';
    if (progress < 30) return 'bg-red-500';
    if (progress < 60) return 'bg-yellow-500';
    if (progress < 90) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const isOverdue = () => {
    const now = new Date();
    const plannedDate = milestone.plannedDate instanceof Date ? milestone.plannedDate : 
                       milestone.plannedDate instanceof Timestamp ? milestone.plannedDate.toDate() : 
                       new Date(milestone.plannedDate);
    return now > plannedDate && milestone.status !== '已完成';
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${isOverdue() ? 'border-red-200 bg-red-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {getStatusIcon(milestone.status)}
              {milestone.title}
              {isOverdue() && (
                <Badge variant="destructive" className="text-xs">
                  已逾期
                </Badge>
              )}
            </CardTitle>
            {milestone.description && (
              <CardDescription className="mt-1">
                {milestone.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor(milestone.status)}>
              {milestone.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 進度條 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">進度</span>
            <span className="font-medium">{milestone.progress}%</span>
          </div>
          <div className="relative">
            <Progress value={milestone.progress} className="h-3" />
            <div 
              className={`absolute top-0 left-0 h-full transition-all duration-300 ease-in-out ${getProgressColor(milestone.progress)}`}
              style={{ width: `${Math.min(milestone.progress, 100)}%` }}
            />
          </div>
        </div>

        {/* 里程碑信息 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">計劃日期</div>
              <div className="font-medium">{formatDate(milestone.plannedDate)}</div>
            </div>
          </div>
          
          {milestone.actualDate && (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground">實際日期</div>
                <div className="font-medium">{formatDate(milestone.actualDate)}</div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">更新時間</div>
              <div className="font-medium">{formatDate(milestone.updatedAt)}</div>
            </div>
          </div>
        </div>

        {/* 依賴關係 */}
        {milestone.dependencies && milestone.dependencies.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">依賴里程碑</div>
            <div className="flex flex-wrap gap-1">
              {milestone.dependencies.map((depId, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {depId}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 交付物 */}
        {milestone.deliverables && milestone.deliverables.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">相關交付物</div>
            <div className="flex flex-wrap gap-1">
              {milestone.deliverables.map((deliverableId, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {deliverableId}
                </Badge>
              ))}
            </div>
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
            {milestone.status !== '已完成' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('已完成')}
                className="text-green-600 hover:text-green-700"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            {milestone.status !== '進行中' && milestone.status !== '已完成' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('進行中')}
                className="text-blue-600 hover:text-blue-700"
              >
                <Clock className="h-4 w-4" />
              </Button>
            )}
            {milestone.status !== '已延遲' && milestone.status !== '已完成' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('已延遲')}
                className="text-red-600 hover:text-red-700"
              >
                <AlertTriangle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
