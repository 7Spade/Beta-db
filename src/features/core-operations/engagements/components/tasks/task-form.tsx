/**
 * @fileoverview 任務表單組件
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
import { cn } from "@root/src/shared/utils";
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { CalendarIcon, X } from 'lucide-react';
import { useState } from 'react';
import type { Task, TaskPriority, TaskStatus } from '../../types';

interface TaskFormProps {
    task?: Task;
    onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => Promise<void>;
    onCancel: () => void;
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        status: (task?.status || '待處理') as TaskStatus,
        priority: (task?.priority || '中') as TaskPriority,
        value: task?.value || 0,
        quantity: task?.quantity || 1,
        unitPrice: task?.unitPrice || 0,
        discount: task?.discount || 0,
        completedQuantity: task?.completedQuantity || 0,
        assignedTo: task?.assignedTo || '',
        dueDate: task?.dueDate ? (task.dueDate instanceof Date ? task.dueDate : task.dueDate instanceof Timestamp ? task.dueDate.toDate() : new Date(task.dueDate)) : undefined,
        estimatedHours: task?.estimatedHours || 0,
        tags: task?.tags?.join(', ') || '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = '任務標題不能為空';
        }

        if (formData.quantity <= 0) {
            newErrors.quantity = '數量必須大於 0';
        }

        if (formData.unitPrice < 0) {
            newErrors.unitPrice = '單價不能為負數';
        }

        if (formData.discount < 0) {
            newErrors.discount = '折扣不能為負數';
        }

        if (formData.completedQuantity < 0) {
            newErrors.completedQuantity = '已完成數量不能為負數';
        }

        if (formData.completedQuantity > formData.quantity) {
            newErrors.completedQuantity = '已完成數量不能超過總數量';
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
            const taskData = {
                title: formData.title.trim(),
                description: formData.description.trim() || undefined,
                status: formData.status,
                priority: formData.priority,
                lastUpdated: new Date().toISOString(),
                subTasks: task?.subTasks || [],
                value: formData.quantity * formData.unitPrice - formData.discount,
                quantity: formData.quantity,
                unitPrice: formData.unitPrice,
                discount: formData.discount,
                completedQuantity: formData.completedQuantity,
                assignedTo: formData.assignedTo || undefined,
                assignedToName: formData.assignedTo || undefined,
                dueDate: formData.dueDate,
                completedDate: formData.status === '已完成' ? new Date() : undefined,
                estimatedHours: formData.estimatedHours || undefined,
                actualHours: task?.actualHours || undefined,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
                dependencies: task?.dependencies || [],
                // attachments: task?.attachments || [],
                // comments: task?.comments || [],
            };

            await onSubmit(taskData);
        } catch (error) {
            console.error('提交任務失敗:', error);
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
                        <CardTitle>{task ? '編輯任務' : '新增任務'}</CardTitle>
                        <CardDescription>
                            {task ? '修改任務信息' : '創建新的任務'}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">任務標題 *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="輸入任務標題"
                                className={cn(errors.title && 'border-red-500')}
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
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

                    <div className="space-y-2">
                        <Label htmlFor="description">任務描述</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="輸入任務描述"
                            rows={3}
                        />
                    </div>

                    {/* 狀態和優先級 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>狀態</Label>
                            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="待處理">待處理</SelectItem>
                                    <SelectItem value="進行中">進行中</SelectItem>
                                    <SelectItem value="已完成">已完成</SelectItem>
                                    <SelectItem value="已暫停">已暫停</SelectItem>
                                    <SelectItem value="已取消">已取消</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>優先級</Label>
                            <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="低">低</SelectItem>
                                    <SelectItem value="中">中</SelectItem>
                                    <SelectItem value="高">高</SelectItem>
                                    <SelectItem value="緊急">緊急</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* 財務信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">數量 *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={formData.quantity}
                                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                                className={cn(errors.quantity && 'border-red-500')}
                            />
                            {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unitPrice">單價</Label>
                            <Input
                                id="unitPrice"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.unitPrice}
                                onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
                                className={cn(errors.unitPrice && 'border-red-500')}
                            />
                            {errors.unitPrice && <p className="text-sm text-red-500">{errors.unitPrice}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="discount">折扣</Label>
                            <Input
                                id="discount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.discount}
                                onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
                                className={cn(errors.discount && 'border-red-500')}
                            />
                            {errors.discount && <p className="text-sm text-red-500">{errors.discount}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="completedQuantity">已完成數量</Label>
                            <Input
                                id="completedQuantity"
                                type="number"
                                min="0"
                                max={formData.quantity}
                                value={formData.completedQuantity}
                                onChange={(e) => handleInputChange('completedQuantity', parseInt(e.target.value) || 0)}
                                className={cn(errors.completedQuantity && 'border-red-500')}
                            />
                            {errors.completedQuantity && <p className="text-sm text-red-500">{errors.completedQuantity}</p>}
                        </div>
                    </div>

                    {/* 其他信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>到期日</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !formData.dueDate && 'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.dueDate ? format(formData.dueDate, 'PPP') : '選擇日期'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.dueDate}
                                        onSelect={(date) => handleInputChange('dueDate', date)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="estimatedHours">預估工時</Label>
                            <Input
                                id="estimatedHours"
                                type="number"
                                min="0"
                                step="0.5"
                                value={formData.estimatedHours}
                                onChange={(e) => handleInputChange('estimatedHours', parseFloat(e.target.value) || 0)}
                                placeholder="預估工作小時數"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">標籤</Label>
                        <Input
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => handleInputChange('tags', e.target.value)}
                            placeholder="用逗號分隔多個標籤"
                        />
                    </div>

                    {/* 提交按鈕 */}
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            取消
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? '提交中...' : (task ? '更新' : '創建')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
