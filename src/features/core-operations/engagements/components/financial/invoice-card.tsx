/**
 * @fileoverview 發票卡片組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Timestamp } from 'firebase/firestore';
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Download,
    Edit,
    FileText,
    Trash2,
    X
} from 'lucide-react';
import { useState } from 'react';
import type { Invoice, InvoiceStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils';

interface InvoiceCardProps {
    invoice: Invoice;
    onUpdate: (invoiceId: string, updates: Partial<Invoice>) => Promise<void>;
    onDelete: (invoiceId: string) => Promise<void>;
}

export function InvoiceCard({ invoice, onUpdate, onDelete }: InvoiceCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleStatusChange = async (newStatus: InvoiceStatus) => {
        try {
            await onUpdate(invoice.id, {
                status: newStatus,
                updatedAt: new Date(),
                ...(newStatus === '已付款' && { paidDate: new Date() })
            });
        } catch (error) {
            console.error('更新發票狀態失敗:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('確定要刪除這個發票嗎？')) {
            setIsDeleting(true);
            try {
                await onDelete(invoice.id);
            } catch (error) {
                console.error('刪除發票失敗:', error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const getStatusIcon = (status: InvoiceStatus) => {
        switch (status) {
            case '已付款':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case '已發送':
                return <Clock className="h-4 w-4 text-blue-600" />;
            case '草稿':
                return <FileText className="h-4 w-4 text-gray-600" />;
            case '已逾期':
                return <AlertTriangle className="h-4 w-4 text-red-600" />;
            case '已取消':
                return <X className="h-4 w-4 text-gray-600" />;
            default:
                return <FileText className="h-4 w-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status: InvoiceStatus) => {
        switch (status) {
            case '已付款':
                return 'bg-green-100 text-green-800 border-green-200';
            case '已發送':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case '草稿':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case '已逾期':
                return 'bg-red-100 text-red-800 border-red-200';
            case '已取消':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const isOverdue = () => {
        if (invoice.status === '已付款' || invoice.status === '已取消' || invoice.status === '草稿') return false;

        const now = new Date();
        const dueDate = invoice.dueDate instanceof Date ? invoice.dueDate :
            invoice.dueDate instanceof Timestamp ? invoice.dueDate.toDate() :
                new Date(invoice.dueDate);

        return now > dueDate;
    };

    const calculateTotal = () => {
        const itemsTotal = invoice.items.reduce((sum, item) => sum + item.totalPrice, 0);
        const taxAmount = invoice.taxAmount || 0;
        return itemsTotal + taxAmount;
    };

    return (
        <Card className={`hover:shadow-md transition-shadow ${isOverdue() ? 'border-red-200 bg-red-50' : ''}`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            {getStatusIcon(invoice.status)}
                            {invoice.invoiceNumber}
                            {isOverdue() && (
                                <Badge variant="destructive" className="text-xs">
                                    已逾期
                                </Badge>
                            )}
                        </CardTitle>
                        {invoice.description && (
                            <CardDescription className="mt-1">
                                {invoice.description}
                            </CardDescription>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(invoice.status)}>
                            {invoice.status}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* 金額信息 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">發票金額</span>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold">{formatCurrency(calculateTotal())}</div>
                        {invoice.taxAmount && invoice.taxAmount > 0 && (
                            <div className="text-xs text-muted-foreground">
                                含稅 {formatCurrency(invoice.taxAmount)}
                            </div>
                        )}
                    </div>
                </div>

                {/* 發票信息 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <div className="text-muted-foreground">開票日期</div>
                            <div className="font-medium">{formatDate(invoice.issueDate)}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <div className="text-muted-foreground">到期日期</div>
                            <div className="font-medium">{formatDate(invoice.dueDate)}</div>
                        </div>
                    </div>

                    {invoice.paidDate && (
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="text-muted-foreground">付款日期</div>
                                <div className="font-medium">{formatDate(invoice.paidDate)}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 發票項目 */}
                {invoice.items && invoice.items.length > 0 && (
                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">發票項目</div>
                        <div className="space-y-1">
                            {invoice.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="flex items-center justify-between text-sm bg-gray-50 px-2 py-1 rounded">
                                    <span className="truncate">{item.description}</span>
                                    <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
                                </div>
                            ))}
                            {invoice.items.length > 3 && (
                                <div className="text-xs text-muted-foreground text-center">
                                    還有 {invoice.items.length - 3} 個項目...
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 操作按鈕 */}
                <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            disabled={isDeleting}
                        >
                            <Edit className="h-4 w-4 mr-1" />
                            編輯
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {isDeleting ? '刪除中...' : '刪除'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* TODO: 實現發票下載功能 */ }}
                        >
                            <Download className="h-4 w-4 mr-1" />
                            下載
                        </Button>
                    </div>

                    {/* 快速狀態切換 */}
                    <div className="flex gap-1">
                        {invoice.status !== '已付款' && invoice.status !== '草稿' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange('已付款')}
                                className="text-green-600 hover:text-green-700"
                            >
                                <CheckCircle className="h-4 w-4" />
                            </Button>
                        )}
                        {invoice.status === '草稿' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange('已發送')}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                <Clock className="h-4 w-4" />
                            </Button>
                        )}
                        {invoice.status !== '已逾期' && invoice.status !== '已付款' && invoice.status !== '已取消' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange('已逾期')}
                                className="text-red-600 hover:text-red-700"
                            >
                                <AlertTriangle className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
