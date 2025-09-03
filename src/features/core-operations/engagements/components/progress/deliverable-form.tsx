/**
 * @fileoverview 交付物表單組件
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
import { CalendarIcon, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import type { Deliverable, DeliverableStatus, DeliverableType } from '../../types';

interface DeliverableFormProps {
  deliverable?: Deliverable;
  onSubmit: (deliverable: Omit<Deliverable, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => Promise<void>;
  onCancel: () => void;
}

export function DeliverableForm({ deliverable, onSubmit, onCancel }: DeliverableFormProps) {
  const [formData, setFormData] = useState({
    title: deliverable?.title || '',
    description: deliverable?.description || '',
    status: (deliverable?.status || '未開始') as DeliverableStatus,
    type: (deliverable?.type || 'document') as DeliverableType,
    plannedDate: deliverable?.plannedDate ?
      (deliverable.plannedDate instanceof Date ? deliverable.plannedDate : deliverable.plannedDate.toDate()) :
      new Date(),
    progress: deliverable?.progress || 0,
    assignedTo: deliverable?.assignedTo || '',
    acceptanceCriteria: deliverable?.acceptanceCriteria || [],
    attachments: deliverable?.attachments || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newCriteria, setNewCriteria] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '交付物標題不能為空';
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
      const deliverableData = {
        title: formData.title.trim(),
        name: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        type: formData.type,
        plannedDate: formData.plannedDate,
        actualDate: deliverable?.actualDate,
        acceptedDate: deliverable?.acceptedDate,
        progress: formData.progress,
        assignedTo: formData.assignedTo || undefined,
        assignedToName: formData.assignedTo || undefined,
        acceptanceCriteria: formData.acceptanceCriteria,
        attachments: formData.attachments,
        createdBy: deliverable?.createdBy || 'system', // TODO: 從認證上下文獲取
        updatedBy: 'system', // TODO: 從認證上下文獲取
        updatedAt: new Date(),
      };

      await onSubmit(deliverableData);
    } catch (error) {
      console.error('提交交付物失敗:', error);
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

  const addAcceptanceCriteria = () => {
    if (newCriteria.trim()) {
      setFormData(prev => ({
        ...prev,
        acceptanceCriteria: [...prev.acceptanceCriteria, newCriteria.trim()]
      }));
      setNewCriteria('');
    }
  };

  const removeAcceptanceCriteria = (index: number) => {
    setFormData(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.filter((_, i) => i !== index)
    }));
  };

  const addAttachment = () => {
    const url = prompt('請輸入附件 URL:');
    if (url && url.trim()) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, url.trim()]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{deliverable ? '編輯交付物' : '新增交付物'}</CardTitle>
            <CardDescription>
              {deliverable ? '修改交付物信息' : '創建新的交付物'}
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
            <Label htmlFor="title">交付物標題 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="輸入交付物標題"
              className={cn(errors.title && 'border-red-500')}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">交付物描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="輸入交付物描述"
              rows={3}
            />
          </div>

          {/* 類型和狀態 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>類型</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">文件</SelectItem>
                  <SelectItem value="product">產品</SelectItem>
                  <SelectItem value="service">服務</SelectItem>
                  <SelectItem value="report">報告</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                  <SelectItem value="已驗收">已驗收</SelectItem>
                  <SelectItem value="已拒絕">已拒絕</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 進度和負責人 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="assignedTo">負責人</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                placeholder="輸入負責人姓名"
              />
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

          {/* 驗收標準 */}
          <div className="space-y-2">
            <Label>驗收標準</Label>
            <div className="space-y-2">
              {formData.acceptanceCriteria.map((criteria, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={criteria}
                    onChange={(e) => {
                      const newCriteria = [...formData.acceptanceCriteria];
                      newCriteria[index] = e.target.value;
                      handleInputChange('acceptanceCriteria', newCriteria);
                    }}
                    placeholder="輸入驗收標準"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAcceptanceCriteria(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  value={newCriteria}
                  onChange={(e) => setNewCriteria(e.target.value)}
                  placeholder="輸入新的驗收標準"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAcceptanceCriteria())}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAcceptanceCriteria}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* 附件 */}
          <div className="space-y-2">
            <Label>附件</Label>
            <div className="space-y-2">
              {formData.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={attachment}
                    onChange={(e) => {
                      const newAttachments = [...formData.attachments];
                      newAttachments[index] = e.target.value;
                      handleInputChange('attachments', newAttachments);
                    }}
                    placeholder="輸入附件 URL"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAttachment}
              >
                <Plus className="h-4 w-4 mr-2" />
                添加附件
              </Button>
            </div>
          </div>

          {/* 提交按鈕 */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '提交中...' : (deliverable ? '更新' : '創建')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
