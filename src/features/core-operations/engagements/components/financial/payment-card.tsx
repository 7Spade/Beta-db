/**
 * @fileoverview 付款卡片組件
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
    CreditCard,
    Edit,
    Trash2,
    X
} from 'lucide-react';
import { useState } from 'react';
import type { Payment, PaymentStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils';

interface PaymentCardProps {
    payment: Payment;
    onUpdate: (paymentId: string, updates: Partial<Payment>) => Promise<void>;
    onDelete: (paymentId: string) => Promise<void>;
}

export function PaymentCard({ payment, onUpdate, onDelete }: PaymentCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleStatusChange = async (newStatus: PaymentStatus) => {
        try {
            await onUpdate(payment.id, {
                status: newStatus,
                updatedAt: new Date(),
                ...(newStatus === '已付款' && { paidDate: new Date() })
            });
        } catch (error) {
            console.error('更新付款狀態失敗:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('確定要刪除這個付款記錄嗎？')) {
            setIsDeleting(true);
            try {
                await onDelete(payment.id);
            } catch (error) {
                console.error('刪除付款記錄失敗:', error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const getStatusIcon = (status: PaymentStatus) => {
        switch (status) {
            case '已付款':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case '待處理':
                return <Clock className="h-4 w-4 text-yellow-600" />;
            case '已逾期':
                return <AlertTriangle className="h-4 w-4 text-red-600" />;
            case '已取消':
                return <X className="h-4 w-4 text-gray-600" />;
            default:
                return <CreditCard className="h-4 w-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case '已付款':
                return 'bg-green-100 text-green-800 border-green-200';
            case '待處理':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case '已逾期':
                return 'bg-red-100 text-red-800 border-red-200';
            case '已取消':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const isOverdue = () => {
        if (payment.status === '已付款' || payment.status === '已取消') return false;

        const now = new Date();
        const requestDate = payment.requestDate instanceof Date ? payment.requestDate :
            payment.requestDate instanceof Timestamp ? payment.requestDate.toDate() :
                new Date(payment.requestDate);

        // 假設付款期限為請求日期後30天
        const dueDate = new Date(requestDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        return now > dueDate;
    };

    return (
        <Card className={`hover:shadow-md transition-shadow ${isOverdue() ? 'border-red-200 bg-red-50' : ''}`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            {getStatusIcon(payment.status)}
                            {formatCurrency(payment.amount)}
                            {isOverdue() && (
                                <Badge variant="destructive" className="text-xs">
                                    已逾期
                                </Badge>
                            )}
                        </CardTitle>
                        {payment.description && (
                            <CardDescription className="mt-1">
                                {payment.description}
                            </CardDescription>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(payment.status)}>
                            {payment.status}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* 付款信息 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <div className="text-muted-foreground">請求日期</div>
                            <div className="font-medium">{formatDate(payment.requestDate)}</div>
                        </div>
                    </div>

                    {payment.paidDate && (
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="text-muted-foreground">付款日期</div>
                                <div className="font-medium">{formatDate(payment.paidDate)}</div>
                            </div>
                        </div>
                    )}

                    {payment.paymentMethod && (
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="text-muted-foreground">付款方式</div>
                                <div className="font-medium">{payment.paymentMethod}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 參考號碼 */}
                {payment.referenceNumber && (
                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">參考號碼</div>
                        <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {payment.referenceNumber}
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
                    </div>

                    {/* 快速狀態切換 */}
                    <div className="flex gap-1">
                        {payment.status !== '已付款' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange('已付款')}
                                className="text-green-600 hover:text-green-700"
                            >
                                <CheckCircle className="h-4 w-4" />
                            </Button>
                        )}
                        {payment.status !== '待處理' && payment.status !== '已付款' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange('待處理')}
                                className="text-yellow-600 hover:text-yellow-700"
                            >
                                <Clock className="h-4 w-4" />
                            </Button>
                        )}
                        {payment.status !== '已逾期' && payment.status !== '已付款' && (
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
