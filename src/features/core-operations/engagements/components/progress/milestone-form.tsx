/**
 * @fileoverview 里程碑表單組件
 */
'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@root/src/shared/utils';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { useState } from 'react';
import type { Milestone, MilestoneStatus } from '../../types';

interface MilestoneFormProps {
  milestone?: Milestone;
  onSubmit: (milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => Promise<void>;
  onCancel: () => void;
}

export function MilestoneForm({ milestone, onSubmit, onCancel }: MilestoneFormProps) {
  const [formData, setFormData] = useState({
    title: milestone?.title || '',
    description: milestone?.description || '',
    status: (milestone?.status || '未開始') as MilestoneStatus,
    plannedDate: milestone?.plannedDate ?
      (milestone.plannedDate instanceof Date ? milestone.plannedDate : milestone.plannedDate.toDate()) :
      new Date(),
    progress: milestone?.progress || 0,
    dependencies: milestone?.dependencies?.join(', ') || '',
    deliverables: milestone?.deliverables?.join(', ') || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '里程碑標題不能為空';
    }

    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = '進度必須在 0-100 之間';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const milestoneData = {
        title: formData.title.trim(),
        name: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        plannedDate: formData.plannedDate,
        dueDate: formData.plannedDate,
        actualDate: milestone?.actualDate,
        progress: formData.progress,
        dependencies: formData.dependencies ? formData.dependencies.split(',').map(id => id.trim()).filter(Boolean) : [],
        deliverables: formData.deliverables ? formData.deliverables.split(',').map(id => id.trim()).filter(Boolean) : [],
        createdBy: milestone?.createdBy || 'system', // TODO: 從認證上下文獲取
        updatedBy: 'system', // TODO: 從認證上下文獲取
        updatedAt: new Date(),
      };

      await onSubmit(milestoneData);
    } catch (error) {
      console.error('提交里程碑失敗:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除該字段的錯誤
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{milestone ? '編輯里程碑' : '新增里程碑'}</CardTitle>
            <CardDescription>
              {milestone ? '修改里程碑信息' : '創建新的里程碑'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息 */}
          <div className="space-y-2">
            <Label htmlFor="title">里程碑標題 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="輸入里程碑標題"
              className={cn(errors.title && 'border-red-500')}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">里程碑描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="輸入里程碑描述"
              rows={3}
            />
          </div>

          {/* 狀態和進度 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>狀態</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="未開始">未開始</SelectItem>
                  <SelectItem value="進行中">進行中</SelectItem>
                  <SelectItem value="已完成">已完成</SelectItem>
                  <SelectItem value="已延遲">已延遲</SelectItem>
                  <SelectItem value="已取消">已取消</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">進度 (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
                className={cn(errors.progress && 'border-red-500')}
              />
              {errors.progress && <p className="text-sm text-red-500">{errors.progress}</p>}
            </div>
          </div>

          {/* 計劃日期 */}
          <div className="space-y-2">
            <Label>計劃完成日期</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !formData.plannedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.plannedDate ? format(formData.plannedDate, 'PPP') : '選擇日期'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.plannedDate}
                  onSelect={(date) => handleInputChange('plannedDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* 依賴關係 */}
          <div className="space-y-2">
            <Label htmlFor="dependencies">依賴里程碑 ID</Label>
            <Input
              id="dependencies"
              value={formData.dependencies}
              onChange={(e) => handleInputChange('dependencies', e.target.value)}
              placeholder="用逗號分隔多個里程碑 ID"
            />
          </div>

          {/* 交付物 */}
          <div className="space-y-2">
            <Label htmlFor="deliverables">相關交付物 ID</Label>
            <Input
              id="deliverables"
              value={formData.deliverables}
              onChange={(e) => handleInputChange('deliverables', e.target.value)}
              placeholder="用逗號分隔多個交付物 ID"
            />
          </div>

          {/* 提交按鈕 */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '提交中...' : (milestone ? '更新' : '創建')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
