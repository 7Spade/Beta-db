/**
 * @fileoverview 發票表單組件
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
import type { Invoice, InvoiceItem, InvoiceStatus } from '../../types';

interface InvoiceFormProps {
    invoice?: Invoice;
    onSubmit: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => Promise<void>;
    onCancel: () => void;
}

export function InvoiceForm({ invoice, onSubmit, onCancel }: InvoiceFormProps) {
    const [formData, setFormData] = useState({
        invoiceNumber: invoice?.invoiceNumber || '',
        status: (invoice?.status || '草稿') as InvoiceStatus,
        issueDate: invoice?.issueDate ?
            (invoice.issueDate instanceof Date ? invoice.issueDate : invoice.issueDate.toDate()) :
            new Date(),
        dueDate: invoice?.dueDate ?
            (invoice.dueDate instanceof Date ? invoice.dueDate : invoice.dueDate.toDate()) :
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天後
        paidDate: invoice?.paidDate ?
            (invoice.paidDate instanceof Date ? invoice.paidDate : invoice.paidDate.toDate()) :
            undefined,
        description: invoice?.description || '',
        items: invoice?.items || [],
        taxAmount: invoice?.taxAmount || 0,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [newItem, setNewItem] = useState({
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: 0,
    });

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.invoiceNumber.trim()) {
            newErrors.invoiceNumber = '發票號碼不能為空';
        }

        if (formData.items.length === 0) {
            newErrors.items = '至少需要一個發票項目';
        }

        if (formData.status === '已付款' && !formData.paidDate) {
            newErrors.paidDate = '已付款狀態必須填寫付款日期';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateItemTotal = (item: Omit<InvoiceItem, 'id'>) => {
        const subtotal = item.quantity * item.unitPrice;
        const tax = subtotal * (item.taxRate / 100);
        return subtotal + tax;
    };

    const calculateTotal = () => {
        const itemsTotal = formData.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
        return itemsTotal + formData.taxAmount;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const invoiceData = {
                invoiceNumber: formData.invoiceNumber.trim(),
                amount: calculateTotal(),
                status: formData.status,
                issueDate: formData.issueDate,
                dueDate: formData.dueDate,
                paidDate: formData.paidDate,
                description: formData.description.trim() || undefined,
                items: formData.items.map((item, index) => ({
                    ...item,
                    id: item.id || `item-${index}`,
                    totalPrice: calculateItemTotal(item),
                })),
                taxAmount: formData.taxAmount,
                totalAmount: calculateTotal(),
                createdBy: invoice?.createdBy || 'system', // TODO: 從認證上下文獲取
                updatedBy: 'system', // TODO: 從認證上下文獲取
                updatedAt: new Date(),
            };

            await onSubmit(invoiceData);
        } catch (error) {
            console.error('提交發票失敗:', error);
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

    const addItem = () => {
        if (newItem.description.trim() && newItem.quantity > 0 && newItem.unitPrice > 0) {
            const item: Omit<InvoiceItem, 'id'> = {
                description: newItem.description.trim(),
                quantity: newItem.quantity,
                unitPrice: newItem.unitPrice,
                taxRate: newItem.taxRate,
                totalPrice: calculateItemTotal(newItem),
            };

            setFormData(prev => ({
                ...prev,
                items: [...prev.items, item]
            }));

            setNewItem({
                description: '',
                quantity: 1,
                unitPrice: 0,
                taxRate: 0,
            });
        }
    };

    const removeItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{invoice ? '編輯發票' : '新增發票'}</CardTitle>
                        <CardDescription>
                            {invoice ? '修改發票信息' : '創建新的發票'}
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 基本發票信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="invoiceNumber">發票號碼 *</Label>
                            <Input
                                id="invoiceNumber"
                                value={formData.invoiceNumber}
                                onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                                placeholder="輸入發票號碼"
                                className={cn(errors.invoiceNumber && 'border-red-500')}
                            />
                            {errors.invoiceNumber && <p className="text-sm text-red-500">{errors.invoiceNumber}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>發票狀態</Label>
                            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="草稿">草稿</SelectItem>
                                    <SelectItem value="已發送">已發送</SelectItem>
                                    <SelectItem value="已付款">已付款</SelectItem>
                                    <SelectItem value="已逾期">已逾期</SelectItem>
                                    <SelectItem value="已取消">已取消</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* 日期信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>開票日期</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !formData.issueDate && 'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.issueDate ? format(formData.issueDate, 'PPP') : '選擇日期'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.issueDate}
                                        onSelect={(date) => handleInputChange('issueDate', date)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>到期日期</Label>
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

                    {/* 發票項目 */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>發票項目 *</Label>
                            {errors.items && <p className="text-sm text-red-500">{errors.items}</p>}
                        </div>

                        {/* 現有項目 */}
                        {formData.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                                <div className="flex-1 grid grid-cols-4 gap-2">
                                    <Input
                                        value={item.description}
                                        onChange={(e) => {
                                            const newItems = [...formData.items];
                                            newItems[index] = { ...newItems[index], description: e.target.value };
                                            handleInputChange('items', newItems);
                                        }}
                                        placeholder="項目描述"
                                    />
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.unitPrice}
                                        onChange={(e) => {
                                            const newItems = [...formData.items];
                                            newItems[index] = { ...newItems[index], unitPrice: parseFloat(e.target.value) || 0 };
                                            handleInputChange('items', newItems);
                                        }}
                                        placeholder="單價"
                                    />
                                    <Input
                                        type="number"
                                        min="0"
                                        value={item.quantity}
                                        onChange={(e) => {
                                            const newItems = [...formData.items];
                                            newItems[index] = { ...newItems[index], quantity: parseInt(e.target.value) || 0 };
                                            handleInputChange('items', newItems);
                                        }}
                                        placeholder="數量"
                                    />
                                    <div className="text-sm font-medium flex items-center">
                                        {formatCurrency(calculateItemTotal(item))}
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeItem(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}

                        {/* 新增項目 */}
                        <div className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg">
                            <div className="flex-1 grid grid-cols-4 gap-2">
                                <Input
                                    value={newItem.description}
                                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="項目描述"
                                />
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={newItem.unitPrice}
                                    onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                                    placeholder="單價"
                                />
                                <Input
                                    type="number"
                                    min="0"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                                    placeholder="數量"
                                />
                                <div className="text-sm font-medium flex items-center">
                                    {formatCurrency(calculateItemTotal(newItem))}
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addItem}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* 稅額和其他費用 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="taxAmount">稅額</Label>
                            <Input
                                id="taxAmount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.taxAmount}
                                onChange={(e) => handleInputChange('taxAmount', parseFloat(e.target.value) || 0)}
                                placeholder="輸入稅額"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>總金額</Label>
                            <div className="text-2xl font-bold text-primary">
                                {formatCurrency(calculateTotal())}
                            </div>
                        </div>
                    </div>

                    {/* 描述 */}
                    <div className="space-y-2">
                        <Label htmlFor="description">發票描述</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="發票相關說明"
                            rows={3}
                        />
                    </div>

                    {/* 提交按鈕 */}
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            取消
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? '提交中...' : (invoice ? '更新' : '創建')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
