/**
 * @fileoverview 發票列表組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Timestamp } from 'firebase/firestore';
import { FileText, Plus, Search, SortAsc, SortDesc } from 'lucide-react';
import { useState } from 'react';
import type { Invoice, InvoiceStatus, InvoiceSummary } from '../../types';
import { formatCurrency } from '../../utils';
import { InvoiceCard } from './invoice-card';
import { InvoiceForm } from './invoice-form';

interface InvoiceListProps {
    invoices: Invoice[];
    invoiceSummary?: InvoiceSummary;
    onInvoiceUpdate: (invoiceId: string, updates: Partial<Invoice>) => Promise<void>;
    onInvoiceDelete: (invoiceId: string) => Promise<void>;
    onInvoiceCreate: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => Promise<void>;
    isLoading?: boolean;
}

export function InvoiceList({
    invoices,
    invoiceSummary,
    onInvoiceUpdate,
    onInvoiceDelete,
    onInvoiceCreate,
    isLoading = false,
}: InvoiceListProps) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
    const [sortBy, setSortBy] = useState<'invoiceNumber' | 'amount' | 'status' | 'issueDate' | 'dueDate' | 'paidDate' | 'createdAt'>('issueDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // 篩選和排序發票
    const filteredAndSortedInvoices = invoices
        .filter(invoice => {
            const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                invoice.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case 'invoiceNumber':
                    aValue = a.invoiceNumber;
                    bValue = b.invoiceNumber;
                    break;
                case 'amount':
                    aValue = a.amount;
                    bValue = b.amount;
                    break;
                case 'status':
                    const statusOrder = { '草稿': 1, '已發送': 2, '已付款': 3, '已逾期': 4, '已取消': 5 };
                    aValue = statusOrder[a.status as keyof typeof statusOrder];
                    bValue = statusOrder[b.status as keyof typeof statusOrder];
                    break;
                case 'issueDate':
                    aValue = a.issueDate instanceof Date ? a.issueDate.getTime() : a.issueDate instanceof Timestamp ? a.issueDate.toMillis() : new Date(a.issueDate).getTime();
                    bValue = b.issueDate instanceof Date ? b.issueDate.getTime() : b.issueDate instanceof Timestamp ? b.issueDate.toMillis() : new Date(b.issueDate).getTime();
                    break;
                case 'dueDate':
                    aValue = a.dueDate instanceof Date ? a.dueDate.getTime() : a.dueDate instanceof Timestamp ? a.dueDate.toMillis() : new Date(a.dueDate).getTime();
                    bValue = b.dueDate instanceof Date ? b.dueDate.getTime() : b.dueDate instanceof Timestamp ? b.dueDate.toMillis() : new Date(b.dueDate).getTime();
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

    const handleCreateInvoice = async (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
        try {
            await onInvoiceCreate(invoiceData);
            setShowCreateForm(false);
        } catch (error) {
            console.error('創建發票失敗:', error);
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
                    <CardTitle>發票管理</CardTitle>
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
            {/* 發票摘要 */}
            {invoiceSummary && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            發票摘要
                        </CardTitle>
                        <CardDescription>
                            發票狀態和收款進度
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {invoiceSummary.totalInvoices}
                                </div>
                                <div className="text-sm text-muted-foreground">總發票數</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {formatCurrency(invoiceSummary.paidAmount)}
                                </div>
                                <div className="text-sm text-muted-foreground">已收款</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {formatCurrency(invoiceSummary.pendingAmount)}
                                </div>
                                <div className="text-sm text-muted-foreground">待收款</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {formatCurrency(invoiceSummary.overdueAmount)}
                                </div>
                                <div className="text-sm text-muted-foreground">已逾期</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 發票列表 */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center">
                                <FileText className="h-5 w-5 mr-2" />
                                發票管理
                                <Badge variant="secondary" className="ml-2">
                                    {filteredAndSortedInvoices.length} / {invoices.length}
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                管理專案的所有發票和收款記錄
                            </CardDescription>
                        </div>
                        <Button onClick={() => setShowCreateForm(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            新增發票
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* 創建發票表單 */}
                    {showCreateForm && (
                        <InvoiceForm
                            onSubmit={handleCreateInvoice}
                            onCancel={() => setShowCreateForm(false)}
                        />
                    )}

                    {/* 篩選和搜索 */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="搜索發票..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as InvoiceStatus | 'all')}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="狀態" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">全部狀態</SelectItem>
                                <SelectItem value="草稿">草稿</SelectItem>
                                <SelectItem value="已發送">已發送</SelectItem>
                                <SelectItem value="已付款">已付款</SelectItem>
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
                            onClick={() => handleSort('invoiceNumber')}
                            className="h-8 px-2"
                        >
                            發票號碼 {getSortIcon('invoiceNumber')}
                        </Button>
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
                            onClick={() => handleSort('dueDate')}
                            className="h-8 px-2"
                        >
                            到期日 {getSortIcon('dueDate')}
                        </Button>
                    </div>

                    {/* 發票列表 */}
                    {filteredAndSortedInvoices.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {invoices.length === 0 ? '尚無發票記錄' : '沒有符合條件的發票記錄'}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredAndSortedInvoices.map((invoice) => (
                                <InvoiceCard
                                    key={invoice.id}
                                    invoice={invoice}
                                    onUpdate={onInvoiceUpdate}
                                    onDelete={onInvoiceDelete}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
