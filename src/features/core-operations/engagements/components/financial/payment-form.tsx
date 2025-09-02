/**
 * @fileoverview 付款表單組件
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
import type { Payment, PaymentStatus } from '../../types';

interface PaymentFormProps {
    payment?: Payment;
    onSubmit: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => Promise<void>;
    onCancel: () => void;
}

export function PaymentForm({ payment, onSubmit, onCancel }: PaymentFormProps) {
    const [formData, setFormData] = useState({
        amount: payment?.amount || 0,
        status: (payment?.status || '待處理') as PaymentStatus,
        requestDate: payment?.requestDate ?
            (payment.requestDate instanceof Date ? payment.requestDate : payment.requestDate.toDate()) :
            new Date(),
        paidDate: payment?.paidDate ?
            (payment.paidDate instanceof Date ? payment.paidDate : payment.paidDate.toDate()) :
            undefined,
        description: payment?.description || '',
        paymentMethod: payment?.paymentMethod || '',
        referenceNumber: payment?.referenceNumber || '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (formData.amount <= 0) {
            newErrors.amount = '付款金額必須大於 0';
        }

        if (formData.status === '已付款' && !formData.paidDate) {
            newErrors.paidDate = '已付款狀態必須填寫付款日期';
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
            const paymentData = {
                amount: formData.amount,
                status: formData.status,
                requestDate: formData.requestDate,
                paidDate: formData.paidDate,
                description: formData.description.trim() || undefined,
                paymentMethod: formData.paymentMethod.trim() || undefined,
                referenceNumber: formData.referenceNumber.trim() || undefined,
                createdBy: payment?.createdBy || 'system', // TODO: 從認證上下文獲取
                updatedBy: 'system', // TODO: 從認證上下文獲取
                updatedAt: new Date(),
            };

            await onSubmit(paymentData);
        } catch (error) {
            console.error('提交付款失敗:', error);
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
                        <CardTitle>{payment ? '編輯付款記錄' : '新增付款記錄'}</CardTitle>
                        <CardDescription>
                            {payment ? '修改付款記錄信息' : '創建新的付款記錄'}
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 基本付款信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">付款金額 *</Label>
                            <Input
                                id="amount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                                placeholder="輸入付款金額"
                                className={cn(errors.amount && 'border-red-500')}
                            />
                            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>付款狀態</Label>
                            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="待處理">待處理</SelectItem>
                                    <SelectItem value="已付款">已付款</SelectItem>
                                    <SelectItem value="已逾期">已逾期</SelectItem>
                                    <SelectItem value="已取消">已取消</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* 日期信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>請求日期</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !formData.requestDate && 'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.requestDate ? format(formData.requestDate, 'PPP') : '選擇日期'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.requestDate}
                                        onSelect={(date) => handleInputChange('requestDate', date)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {formData.status === '已付款' && (
                            <div className="space-y-2">
                                <Label>付款日期 *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !formData.paidDate && 'text-muted-foreground'
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.paidDate ? format(formData.paidDate, 'PPP') : '選擇日期'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={formData.paidDate}
                                            onSelect={(date) => handleInputChange('paidDate', date)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.paidDate && <p className="text-sm text-red-500">{errors.paidDate}</p>}
                            </div>
                        )}
                    </div>

                    {/* 付款方式 */}
                    <div className="space-y-2">
                        <Label htmlFor="paymentMethod">付款方式</Label>
                        <Input
                            id="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                            placeholder="例如：銀行轉帳、現金、支票等"
                        />
                    </div>

                    {/* 參考號碼 */}
                    <div className="space-y-2">
                        <Label htmlFor="referenceNumber">參考號碼</Label>
                        <Input
                            id="referenceNumber"
                            value={formData.referenceNumber}
                            onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                            placeholder="交易參考號碼或支票號碼"
                        />
                    </div>

                    {/* 描述 */}
                    <div className="space-y-2">
                        <Label htmlFor="description">付款描述</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="付款用途或相關說明"
                            rows={3}
                        />
                    </div>

                    {/* 提交按鈕 */}
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            取消
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? '提交中...' : (payment ? '更新' : '創建')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
