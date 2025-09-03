/**
 * @fileoverview 問題表單組件
 */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@root/src/shared/utils';
import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import type { CreateIssueInput, Issue, IssuePriority, IssueType } from '../../types';

interface IssueFormProps {
    issue?: Issue;
    onSubmit: (data: CreateIssueInput) => Promise<void>;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function IssueForm({
    issue,
    onSubmit,
    onSuccess,
    onCancel
}: IssueFormProps) {
    const [formData, setFormData] = useState({
        title: issue?.title || '',
        description: issue?.description || '',
        type: issue?.type || '問題' as IssueType,
        priority: issue?.priority || '中' as IssuePriority,
        assignedTo: issue?.assignedTo || '',
        dueDate: issue?.dueDate ?
            (issue.dueDate instanceof Date ? issue.dueDate : new Date())
            : undefined,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = '標題不能為空';
        }

        if (!formData.description.trim()) {
            newErrors.description = '描述不能為空';
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
                description: formData.description.trim(),
                type: formData.type,
                priority: formData.priority,
                assignedTo: formData.assignedTo.trim() || undefined,
                dueDate: formData.dueDate,
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
                        placeholder="輸入問題標題"
                        className={cn(errors.title && 'border-red-500')}
                    />
                    {errors.title && (
                        <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                    )}
                </div>

                {/* 類型 */}
                <div>
                    <Label htmlFor="type">類型 *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="選擇問題類型" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="缺陷">缺陷</SelectItem>
                            <SelectItem value="變更請求">變更請求</SelectItem>
                            <SelectItem value="問題">問題</SelectItem>
                            <SelectItem value="改進建議">改進建議</SelectItem>
                            <SelectItem value="其他">其他</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 優先級 */}
                <div>
                    <Label htmlFor="priority">優先級 *</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="選擇優先級" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="低">低</SelectItem>
                            <SelectItem value="中">中</SelectItem>
                            <SelectItem value="高">高</SelectItem>
                            <SelectItem value="緊急">緊急</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 負責人 */}
                <div>
                    <Label htmlFor="assignedTo">負責人</Label>
                    <Input
                        id="assignedTo"
                        value={formData.assignedTo}
                        onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                        placeholder="可選：指定負責人"
                    />
                </div>

                {/* 截止日期 */}
                <div>
                    <Label htmlFor="dueDate">截止日期</Label>
                    <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => handleInputChange('dueDate', e.target.value ? new Date(e.target.value) : undefined)}
                    />
                </div>

                {/* 描述 */}
                <div className="md:col-span-2">
                    <Label htmlFor="description">描述 *</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="詳細描述問題情況"
                        rows={4}
                        className={cn(errors.description && 'border-red-500')}
                    />
                    {errors.description && (
                        <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                    )}
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
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {isSubmitting ? '提交中...' : (issue ? '更新問題' : '創建問題')}
                </Button>
            </div>
        </form>
    );
}
