/**
 * @fileoverview 品質檢查表單組件
 */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@root/src/shared/utils';
import { Calendar, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import type { QualityCheck, CreateQualityCheckInput, QualityCriteria } from '../../types';

interface QualityCheckFormProps {
    check?: QualityCheck;
    onSubmit: (data: CreateQualityCheckInput) => Promise<void>;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function QualityCheckForm({ 
    check, 
    onSubmit, 
    onSuccess, 
    onCancel 
}: QualityCheckFormProps) {
    const [formData, setFormData] = useState({
        title: check?.title || '',
        description: check?.description || '',
        type: check?.type || 'inspection' as const,
        plannedDate: check?.plannedDate ? 
            (check.plannedDate instanceof Date ? check.plannedDate : check.plannedDate instanceof Date ? check.plannedDate : new Date()) 
            : new Date(),
        assignedTo: check?.assignedTo || '',
    });
    const [criteria, setCriteria] = useState<Omit<QualityCriteria, 'id'>[]>(
        check?.criteria?.map(c => ({
            description: c.description,
            requirement: c.requirement,
            status: c.status,
            notes: c.notes,
        })) || [
            { description: '', requirement: '', status: 'not_applicable', notes: '' }
        ]
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = '標題不能為空';
        }

        if (!formData.plannedDate) {
            newErrors.plannedDate = '計劃日期不能為空';
        }

        if (criteria.length === 0) {
            newErrors.criteria = '至少需要一個檢查標準';
        }

        // 驗證檢查標準
        criteria.forEach((criterion, index) => {
            if (!criterion.description.trim()) {
                newErrors[`criterion_${index}_description`] = '檢查標準描述不能為空';
            }
            if (!criterion.requirement.trim()) {
                newErrors[`criterion_${index}_requirement`] = '檢查要求不能為空';
            }
        });

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
                description: formData.description.trim() || undefined,
                type: formData.type,
                plannedDate: formData.plannedDate,
                assignedTo: formData.assignedTo || undefined,
                criteria: criteria.filter(c => c.description.trim() && c.requirement.trim()),
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

    const addCriterion = () => {
        setCriteria(prev => [...prev, { description: '', requirement: '', status: 'not_applicable', notes: '' }]);
    };

    const removeCriterion = (index: number) => {
        setCriteria(prev => prev.filter((_, i) => i !== index));
    };

    const updateCriterion = (index: number, field: keyof Omit<QualityCriteria, 'id'>, value: any) => {
        setCriteria(prev => prev.map((criterion, i) => 
            i === index ? { ...criterion, [field]: value } : criterion
        ));
        
        // 清除相關錯誤
        const errorKey = `criterion_${index}_${field}`;
        if (errors[errorKey]) {
            setErrors(prev => ({ ...prev, [errorKey]: '' }));
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
                        placeholder="輸入品質檢查標題"
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
                            <SelectValue placeholder="選擇檢查類型" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="inspection">檢查</SelectItem>
                            <SelectItem value="review">審查</SelectItem>
                            <SelectItem value="test">測試</SelectItem>
                            <SelectItem value="audit">稽核</SelectItem>
                            <SelectItem value="other">其他</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 計劃日期 */}
                <div>
                    <Label htmlFor="plannedDate">計劃日期 *</Label>
                    <Input
                        id="plannedDate"
                        type="date"
                        value={formData.plannedDate.toISOString().split('T')[0]}
                        onChange={(e) => handleInputChange('plannedDate', new Date(e.target.value))}
                        className={cn(errors.plannedDate && 'border-red-500')}
                    />
                    {errors.plannedDate && (
                        <p className="text-sm text-red-500 mt-1">{errors.plannedDate}</p>
                    )}
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

                {/* 描述 */}
                <div className="md:col-span-2">
                    <Label htmlFor="description">描述</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="輸入檢查描述（可選）"
                        rows={4}
                    />
                </div>
            </div>

            {/* 檢查標準 */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <Label>檢查標準 *</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addCriterion}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        添加標準
                    </Button>
                </div>
                
                {errors.criteria && (
                    <p className="text-sm text-red-500 mb-4">{errors.criteria}</p>
                )}

                <div className="space-y-4">
                    {criteria.map((criterion, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium">檢查標準 {index + 1}</h4>
                                {criteria.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeCriterion(index)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor={`criterion_${index}_description`}>描述 *</Label>
                                    <Input
                                        id={`criterion_${index}_description`}
                                        value={criterion.description}
                                        onChange={(e) => updateCriterion(index, 'description', e.target.value)}
                                        placeholder="輸入檢查標準描述"
                                        className={cn(errors[`criterion_${index}_description`] && 'border-red-500')}
                                    />
                                    {errors[`criterion_${index}_description`] && (
                                        <p className="text-sm text-red-500 mt-1">{errors[`criterion_${index}_description`]}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <Label htmlFor={`criterion_${index}_requirement`}>要求 *</Label>
                                    <Input
                                        id={`criterion_${index}_requirement`}
                                        value={criterion.requirement}
                                        onChange={(e) => updateCriterion(index, 'requirement', e.target.value)}
                                        placeholder="輸入檢查要求"
                                        className={cn(errors[`criterion_${index}_requirement`] && 'border-red-500')}
                                    />
                                    {errors[`criterion_${index}_requirement`] && (
                                        <p className="text-sm text-red-500 mt-1">{errors[`criterion_${index}_requirement`]}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <Label htmlFor={`criterion_${index}_status`}>狀態</Label>
                                    <Select 
                                        value={criterion.status} 
                                        onValueChange={(value) => updateCriterion(index, 'status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="not_applicable">不適用</SelectItem>
                                            <SelectItem value="met">符合</SelectItem>
                                            <SelectItem value="not_met">不符合</SelectItem>
                                            <SelectItem value="partial">部分符合</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div>
                                    <Label htmlFor={`criterion_${index}_notes`}>備註</Label>
                                    <Input
                                        id={`criterion_${index}_notes`}
                                        value={criterion.notes || ''}
                                        onChange={(e) => updateCriterion(index, 'notes', e.target.value)}
                                        placeholder="可選：輸入備註"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
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
                    {isSubmitting ? '提交中...' : (check ? '更新檢查' : '創建檢查')}
                </Button>
            </div>
        </form>
    );
}
