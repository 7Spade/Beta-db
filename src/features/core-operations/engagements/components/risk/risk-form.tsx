/**
 * @fileoverview 風險表單組件
 */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@root/src/shared/utils';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import type { CreateRiskInput, Risk, RiskCategory, RiskLevel } from '../../types';

interface RiskFormProps {
    risk?: Risk;
    onSubmit: (data: CreateRiskInput) => Promise<void>;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function RiskForm({
    risk,
    onSubmit,
    onSuccess,
    onCancel
}: RiskFormProps) {
    const [formData, setFormData] = useState({
        title: risk?.title || '',
        description: risk?.description || '',
        category: risk?.category || '技術' as RiskCategory,
        level: risk?.level || '中' as RiskLevel,
        probability: risk?.probability || 50,
        impact: risk?.impact || 50,
        mitigationPlan: risk?.mitigationPlan || '',
        contingencyPlan: risk?.contingencyPlan || '',
        owner: risk?.owner || '',
        targetDate: risk?.targetDate ?
            (risk.targetDate instanceof Date ? risk.targetDate : new Date())
            : undefined,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const riskScore = formData.probability * formData.impact / 100;

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = '標題不能為空';
        }

        if (!formData.description.trim()) {
            newErrors.description = '描述不能為空';
        }

        if (formData.probability < 0 || formData.probability > 100) {
            newErrors.probability = '可能性必須在 0-100 之間';
        }

        if (formData.impact < 0 || formData.impact > 100) {
            newErrors.impact = '影響程度必須在 0-100 之間';
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
                category: formData.category,
                level: formData.level,
                probability: formData.probability,
                impact: formData.impact,
                mitigationPlan: formData.mitigationPlan.trim() || undefined,
                contingencyPlan: formData.contingencyPlan.trim() || undefined,
                owner: formData.owner.trim() || undefined,
                targetDate: formData.targetDate,
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

    const getRiskLevelFromScore = (score: number): RiskLevel => {
        if (score >= 80) return '極高';
        if (score >= 60) return '高';
        if (score >= 40) return '中';
        return '低';
    };

    const getRiskScoreColor = (score: number) => {
        if (score >= 80) return 'text-red-600';
        if (score >= 60) return 'text-orange-600';
        if (score >= 40) return 'text-yellow-600';
        return 'text-green-600';
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
                        placeholder="輸入風險標題"
                        className={cn(errors.title && 'border-red-500')}
                    />
                    {errors.title && (
                        <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                    )}
                </div>

                {/* 類別 */}
                <div>
                    <Label htmlFor="category">類別 *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="選擇風險類別" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="技術">技術</SelectItem>
                            <SelectItem value="財務">財務</SelectItem>
                            <SelectItem value="進度">進度</SelectItem>
                            <SelectItem value="品質">品質</SelectItem>
                            <SelectItem value="資源">資源</SelectItem>
                            <SelectItem value="外部">外部</SelectItem>
                            <SelectItem value="其他">其他</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 風險等級 */}
                <div>
                    <Label htmlFor="level">風險等級</Label>
                    <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="選擇風險等級" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="低">低</SelectItem>
                            <SelectItem value="中">中</SelectItem>
                            <SelectItem value="高">高</SelectItem>
                            <SelectItem value="極高">極高</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 負責人 */}
                <div>
                    <Label htmlFor="owner">負責人</Label>
                    <Input
                        id="owner"
                        value={formData.owner}
                        onChange={(e) => handleInputChange('owner', e.target.value)}
                        placeholder="可選：指定負責人"
                    />
                </div>

                {/* 目標日期 */}
                <div>
                    <Label htmlFor="targetDate">目標日期</Label>
                    <Input
                        id="targetDate"
                        type="date"
                        value={formData.targetDate ? formData.targetDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => handleInputChange('targetDate', e.target.value ? new Date(e.target.value) : undefined)}
                    />
                </div>

                {/* 描述 */}
                <div className="md:col-span-2">
                    <Label htmlFor="description">描述 *</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="詳細描述風險情況"
                        rows={4}
                        className={cn(errors.description && 'border-red-500')}
                    />
                    {errors.description && (
                        <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                    )}
                </div>
            </div>

            {/* 風險評估 */}
            <div>
                <h3 className="text-lg font-semibold mb-4">風險評估</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 可能性 */}
                    <div>
                        <Label>可能性: {formData.probability}%</Label>
                        <Slider
                            value={[formData.probability]}
                            onValueChange={(value) => handleInputChange('probability', value[0])}
                            max={100}
                            min={0}
                            step={1}
                            className="mt-2"
                        />
                        {errors.probability && (
                            <p className="text-sm text-red-500 mt-1">{errors.probability}</p>
                        )}
                    </div>

                    {/* 影響程度 */}
                    <div>
                        <Label>影響程度: {formData.impact}%</Label>
                        <Slider
                            value={[formData.impact]}
                            onValueChange={(value) => handleInputChange('impact', value[0])}
                            max={100}
                            min={0}
                            step={1}
                            className="mt-2"
                        />
                        {errors.impact && (
                            <p className="text-sm text-red-500 mt-1">{errors.impact}</p>
                        )}
                    </div>
                </div>

                {/* 風險分數顯示 */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="font-medium">風險分數</span>
                        <span className={`text-2xl font-bold ${getRiskScoreColor(riskScore)}`}>
                            {Math.round(riskScore)}
                        </span>
                    </div>
                    <div className="mt-2">
                        <span className="text-sm text-muted-foreground">
                            建議風險等級: <span className="font-medium">{getRiskLevelFromScore(riskScore)}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* 緩解計劃 */}
            <div>
                <Label htmlFor="mitigationPlan">緩解計劃</Label>
                <Textarea
                    id="mitigationPlan"
                    value={formData.mitigationPlan}
                    onChange={(e) => handleInputChange('mitigationPlan', e.target.value)}
                    placeholder="描述如何緩解此風險"
                    rows={4}
                />
            </div>

            {/* 應急計劃 */}
            <div>
                <Label htmlFor="contingencyPlan">應急計劃</Label>
                <Textarea
                    id="contingencyPlan"
                    value={formData.contingencyPlan}
                    onChange={(e) => handleInputChange('contingencyPlan', e.target.value)}
                    placeholder="描述風險發生時的應急措施"
                    rows={4}
                />
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
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {isSubmitting ? '提交中...' : (risk ? '更新風險' : '創建風險')}
                </Button>
            </div>
        </form>
    );
}
