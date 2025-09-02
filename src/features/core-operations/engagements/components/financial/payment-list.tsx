/**
 * @fileoverview 付款列表組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Timestamp } from 'firebase/firestore';
import { CreditCard, DollarSign, Plus, Search, SortAsc, SortDesc } from 'lucide-react';
import { useState } from 'react';
import type { Payment, PaymentStatus, PaymentSummary } from '../../types';
import { formatCurrency } from '../../utils';
import { PaymentCard } from './payment-card';
import { PaymentForm } from './payment-form';

interface PaymentListProps {
    payments: Payment[];
    paymentSummary?: PaymentSummary;
    onPaymentUpdate: (paymentId: string, updates: Partial<Payment>) => Promise<void>;
    onPaymentDelete: (paymentId: string) => Promise<void>;
    onPaymentCreate: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => Promise<void>;
    isLoading?: boolean;
}

export function PaymentList({
    payments,
    paymentSummary,
    onPaymentUpdate,
    onPaymentDelete,
    onPaymentCreate,
    isLoading = false,
}: PaymentListProps) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
    const [sortBy, setSortBy] = useState<'amount' | 'status' | 'requestDate' | 'paidDate' | 'createdAt'>('requestDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // 篩選和排序付款
    const filteredAndSortedPayments = payments
        .filter(payment => {
            const matchesSearch = payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case 'amount':
                    aValue = a.amount;
                    bValue = b.amount;
                    break;
                case 'status':
                    const statusOrder = { '已付款': 1, '待處理': 2, '已逾期': 3, '已取消': 4 };
                    aValue = statusOrder[a.status as keyof typeof statusOrder];
                    bValue = statusOrder[b.status as keyof typeof statusOrder];
                    break;
                case 'requestDate':
                    aValue = a.requestDate instanceof Date ? a.requestDate.getTime() : a.requestDate instanceof Timestamp ? a.requestDate.toMillis() : new Date(a.requestDate).getTime();
                    bValue = b.requestDate instanceof Date ? b.requestDate.getTime() : b.requestDate instanceof Timestamp ? b.requestDate.toMillis() : new Date(b.requestDate).getTime();
                    break;
                case 'paidDate':
                    aValue = a.paidDate ? (a.paidDate instanceof Date ? a.paidDate.getTime() : a.paidDate instanceof Timestamp ? a.paidDate.toMillis() : new Date(a.paidDate).getTime()) : 0;
                    bValue = b.paidDate ? (b.paidDate instanceof Date ? b.paidDate.getTime() : b.paidDate instanceof Timestamp ? b.paidDate.toMillis() : new Date(b.paidDate).getTime()) : 0;
                    break;
                case 'createdAt':
                default:
                    aValue = a.createdAt instanceof Date ? a.createdAt.getTime() : a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : new Date(a.createdAt).getTime();
                    bValue = b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : new Date(b.createdAt).getTime();
                    break;
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    const handleCreatePayment = async (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
        try {
            await onPaymentCreate(paymentData);
            setShowCreateForm(false);
        } catch (error) {
            console.error('創建付款失敗:', error);
        }
    };

    const handleSort = (field: typeof sortBy) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (field: typeof sortBy) => {
        if (sortBy !== field) return null;
        return sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>付款管理</CardTitle>
                    <CardDescription>載入中...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* 付款摘要 */}
            {paymentSummary && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <DollarSign className="h-5 w-5 mr-2" />
                            付款摘要
                        </CardTitle>
                        <CardDescription>
                            付款進度和財務狀況
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {formatCurrency(paymentSummary.totalPaid)}
                                </div>
                                <div className="text-sm text-muted-foreground">已付款</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {formatCurrency(paymentSummary.totalPending)}
                                </div>
                                <div className="text-sm text-muted-foreground">待處理</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {formatCurrency(paymentSummary.totalOverdue)}
                                </div>
                                <div className="text-sm text-muted-foreground">已逾期</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {paymentSummary.progressPercentage}%
                                </div>
                                <div className="text-sm text-muted-foreground">完成率</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 付款列表 */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center">
                                <CreditCard className="h-5 w-5 mr-2" />
                                付款管理
                                <Badge variant="secondary" className="ml-2">
                                    {filteredAndSortedPayments.length} / {payments.length}
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                管理專案的所有付款記錄
                            </CardDescription>
                        </div>
                        <Button onClick={() => setShowCreateForm(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            新增付款
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* 創建付款表單 */}
                    {showCreateForm && (
                        <PaymentForm
                            onSubmit={handleCreatePayment}
                            onCancel={() => setShowCreateForm(false)}
                        />
                    )}

                    {/* 篩選和搜索 */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="搜索付款記錄..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PaymentStatus | 'all')}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="狀態" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">全部狀態</SelectItem>
                                <SelectItem value="已付款">已付款</SelectItem>
                                <SelectItem value="待處理">待處理</SelectItem>
                                <SelectItem value="已逾期">已逾期</SelectItem>
                                <SelectItem value="已取消">已取消</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 排序選項 */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>排序:</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort('amount')}
                            className="h-8 px-2"
                        >
                            金額 {getSortIcon('amount')}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort('status')}
                            className="h-8 px-2"
                        >
                            狀態 {getSortIcon('status')}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort('requestDate')}
                            className="h-8 px-2"
                        >
                            請求日期 {getSortIcon('requestDate')}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort('paidDate')}
                            className="h-8 px-2"
                        >
                            付款日期 {getSortIcon('paidDate')}
                        </Button>
                    </div>

                    {/* 付款列表 */}
                    {filteredAndSortedPayments.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {payments.length === 0 ? '尚無付款記錄' : '沒有符合條件的付款記錄'}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredAndSortedPayments.map((payment) => (
                                <PaymentCard
                                    key={payment.id}
                                    payment={payment}
                                    onUpdate={onPaymentUpdate}
                                    onDelete={onPaymentDelete}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
