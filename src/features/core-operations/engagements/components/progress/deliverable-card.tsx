/**
 * @fileoverview 交付物卡片組件
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
  User, 
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Package,
  FileText,
  Download
} from 'lucide-react';
import { formatDate } from '../../utils';
import { Timestamp } from 'firebase/firestore';
import type { Deliverable, DeliverableStatus, DeliverableType } from '../../types';

interface DeliverableCardProps {
  deliverable: Deliverable;
  onUpdate: (deliverableId: string, updates: Partial<Deliverable>) => Promise<void>;
  onDelete: (deliverableId: string) => Promise<void>;
}

export function DeliverableCard({ deliverable, onUpdate, onDelete }: DeliverableCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus: DeliverableStatus) => {
    try {
      await onUpdate(deliverable.id, { 
        status: newStatus,
        updatedAt: new Date(),
        ...(newStatus === '已完成' && { actualDate: new Date() }),
        ...(newStatus === '已驗收' && { acceptedDate: new Date() })
      });
    } catch (error) {
      console.error('更新交付物狀態失敗:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('確定要刪除這個交付物嗎？')) {
      setIsDeleting(true);
      try {
        await onDelete(deliverable.id);
      } catch (error) {
        console.error('刪除交付物失敗:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getStatusIcon = (status: DeliverableStatus) => {
    switch (status) {
      case '已驗收':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case '已完成':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case '進行中':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case '已拒絕':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: DeliverableStatus) => {
    switch (status) {
      case '已驗收':
        return 'bg-green-100 text-green-800 border-green-200';
      case '已完成':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '進行中':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case '已拒絕':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: DeliverableType) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'product':
        return <Package className="h-4 w-4 text-green-600" />;
      case 'service':
        return <User className="h-4 w-4 text-purple-600" />;
      case 'report':
        return <FileText className="h-4 w-4 text-orange-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: DeliverableType) => {
    switch (type) {
      case 'document':
        return '文件';
      case 'product':
        return '產品';
      case 'service':
        return '服務';
      case 'report':
        return '報告';
      default:
        return '其他';
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
    const plannedDate = deliverable.plannedDate instanceof Date ? deliverable.plannedDate : 
                       deliverable.plannedDate instanceof Timestamp ? deliverable.plannedDate.toDate() : 
                       new Date(deliverable.plannedDate);
    return now > plannedDate && deliverable.status !== '已驗收' && deliverable.status !== '已完成';
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${isOverdue() ? 'border-red-200 bg-red-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {getTypeIcon(deliverable.type)}
              {deliverable.title}
              {isOverdue() && (
                <Badge variant="destructive" className="text-xs">
                  已逾期
                </Badge>
              )}
            </CardTitle>
            {deliverable.description && (
              <CardDescription className="mt-1">
                {deliverable.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {getTypeLabel(deliverable.type)}
            </Badge>
            <Badge variant="outline" className={getStatusColor(deliverable.status)}>
              {deliverable.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 進度條 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">進度</span>
            <span className="font-medium">{deliverable.progress}%</span>
          </div>
          <div className="relative">
            <Progress value={deliverable.progress} className="h-3" />
            <div 
              className={`absolute top-0 left-0 h-full transition-all duration-300 ease-in-out ${getProgressColor(deliverable.progress)}`}
              style={{ width: `${Math.min(deliverable.progress, 100)}%` }}
            />
          </div>
        </div>

        {/* 交付物信息 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">計劃日期</div>
              <div className="font-medium">{formatDate(deliverable.plannedDate)}</div>
            </div>
          </div>
          
          {deliverable.actualDate && (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground">完成日期</div>
                <div className="font-medium">{formatDate(deliverable.actualDate)}</div>
              </div>
            </div>
          )}

          {deliverable.acceptedDate && (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-muted-foreground">驗收日期</div>
                <div className="font-medium">{formatDate(deliverable.acceptedDate)}</div>
              </div>
            </div>
          )}
          
          {deliverable.assignedTo && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-muted-foreground">負責人</div>
                <div className="font-medium">{deliverable.assignedToName || deliverable.assignedTo}</div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">更新時間</div>
              <div className="font-medium">{formatDate(deliverable.updatedAt)}</div>
            </div>
          </div>
        </div>

        {/* 驗收標準 */}
        {deliverable.acceptanceCriteria && deliverable.acceptanceCriteria.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">驗收標準</div>
            <div className="space-y-1">
              {deliverable.acceptanceCriteria.map((criteria, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  <span>{criteria}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 附件 */}
        {deliverable.attachments && deliverable.attachments.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">附件</div>
            <div className="flex flex-wrap gap-2">
              {deliverable.attachments.map((attachment, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => window.open(attachment, '_blank')}
                >
                  <Download className="h-3 w-3 mr-1" />
                  附件 {index + 1}
                </Button>
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
            {deliverable.status !== '已完成' && deliverable.status !== '已驗收' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('已完成')}
                className="text-blue-600 hover:text-blue-700"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            {deliverable.status === '已完成' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('已驗收')}
                className="text-green-600 hover:text-green-700"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            {deliverable.status !== '進行中' && deliverable.status !== '已完成' && deliverable.status !== '已驗收' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('進行中')}
                className="text-yellow-600 hover:text-yellow-700"
              >
                <Clock className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
