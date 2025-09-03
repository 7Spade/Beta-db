/**
 * @fileoverview 驗收記錄表單組件
 */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@root/src/shared/utils';
import { Calendar, X } from 'lucide-react';
import { useState } from 'react';
import type { AcceptanceRecord, CreateAcceptanceRecordInput } from '../../types';

interface AcceptanceRecordFormProps {
    record?: AcceptanceRecord;
    onSubmit: (data: CreateAcceptanceRecordInput) => Promise<void>;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function AcceptanceRecordForm({ 
    record, 
    onSubmit, 
    onSuccess, 
    onCancel 
}: AcceptanceRecordFormProps) {
    const [formData, setFormData] = useState({
        title: record?.title || '',
        taskId: record?.taskId || '',
        deliverableId: record?.deliverableId || '',
        submittedQuantity: record?.submittedQuantity || 0,
        notes: record?.notes || '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = '標題不能為空';
        }

        if (formData.submittedQuantity <= 0) {
            newErrors.submittedQuantity = '提交數量必須大於 0';
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
            await onSubmit({
                title: formData.title.trim(),
                taskId: formData.taskId || undefined,
                deliverableId: formData.deliverableId || undefined,
                submittedQuantity: formData.submittedQuantity,
                notes: formData.notes.trim() || undefined,
            });
            onSuccess?.();
        } catch (error) {
            console.error('提交失敗:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 標題 */}
                <div className="md:col-span-2">
                    <Label htmlFor="title">標題 *</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="輸入驗收記錄標題"
                        className={cn(errors.title && 'border-red-500')}
                    />
                    {errors.title && (
                        <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                    )}
                </div>

                {/* 任務 ID */}
                <div>
                    <Label htmlFor="taskId">任務 ID</Label>
                    <Input
                        id="taskId"
                        value={formData.taskId}
                        onChange={(e) => handleInputChange('taskId', e.target.value)}
                        placeholder="可選：關聯的任務 ID"
                    />
                </div>

                {/* 交付物 ID */}
                <div>
                    <Label htmlFor="deliverableId">交付物 ID</Label>
                    <Input
                        id="deliverableId"
                        value={formData.deliverableId}
                        onChange={(e) => handleInputChange('deliverableId', e.target.value)}
                        placeholder="可選：關聯的交付物 ID"
                    />
                </div>

                {/* 提交數量 */}
                <div>
                    <Label htmlFor="submittedQuantity">提交數量 *</Label>
                    <Input
                        id="submittedQuantity"
                        type="number"
                        min="1"
                        value={formData.submittedQuantity}
                        onChange={(e) => handleInputChange('submittedQuantity', parseInt(e.target.value) || 0)}
                        placeholder="輸入提交數量"
                        className={cn(errors.submittedQuantity && 'border-red-500')}
                    />
                    {errors.submittedQuantity && (
                        <p className="text-sm text-red-500 mt-1">{errors.submittedQuantity}</p>
                    )}
                </div>

                {/* 備註 */}
                <div className="md:col-span-2">
                    <Label htmlFor="notes">備註</Label>
                    <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="輸入備註信息（可選）"
                        rows={4}
                    />
                </div>
            </div>

            {/* 操作按鈕 */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        <X className="h-4 w-4 mr-2" />
                        取消
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    <Calendar className="h-4 w-4 mr-2" />
                    {isSubmitting ? '提交中...' : (record ? '更新記錄' : '創建記錄')}
                </Button>
            </div>
        </form>
    );
}
