'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    AlertCircle,
    CreditCard,
    DollarSign,
    FileText,
    Receipt,
    TrendingDown,
    TrendingUp
} from 'lucide-react';
import type { Engagement } from '../../types/engagement.types';
import { convertTimestamp, formatCurrency as formatCurrencyShared } from '../../utils';

interface FinancialReportProps {
    engagement: Engagement;
    className?: string;
}

export function FinancialReport({ engagement, className }: FinancialReportProps) {
    // 計算財務摘要
    const calculateFinancialSummary = () => {
        const totalValue = engagement.totalValue;
        const paidAmount = engagement.paidAmount;
        const pendingAmount = engagement.pendingAmount;
        const paidPercentage = totalValue > 0 ? Math.round((paidAmount / totalValue) * 100) : 0;

        // 計算發票總額
        const totalInvoiced = engagement.invoices?.reduce((sum, invoice) => sum + invoice.amount, 0) || 0;

        // 計算未開票金額
        const uninvoicedAmount = totalValue - totalInvoiced;

        return {
            totalValue,
            paidAmount,
            pendingAmount,
            paidPercentage,
            totalInvoiced,
            uninvoicedAmount,
            invoicedPercentage: totalValue > 0 ? Math.round((totalInvoiced / totalValue) * 100) : 0
        };
    };

    // 計算付款趨勢
    const calculatePaymentTrend = () => {
        if (!engagement.payments || engagement.payments.length === 0) {
            return { trend: 'stable', percentage: 0 };
        }

        const sortedPayments = [...engagement.payments].sort((a, b) => {
            const dateA = convertTimestamp(a.paymentDate);
            const dateB = convertTimestamp(b.paymentDate);
            return dateA.getTime() - dateB.getTime();
        });

        if (sortedPayments.length < 2) {
            return { trend: 'stable', percentage: 0 };
        }

        const recentPayments = sortedPayments.slice(-3);
        const olderPayments = sortedPayments.slice(-6, -3);

        const recentTotal = recentPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const olderTotal = olderPayments.reduce((sum, payment) => sum + payment.amount, 0);

        if (olderTotal === 0) return { trend: 'up', percentage: 100 };

        const percentage = Math.round(((recentTotal - olderTotal) / olderTotal) * 100);
        return {
            trend: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'stable',
            percentage: Math.abs(percentage)
        };
    };

    // 計算逾期付款
    const calculateOverduePayments = () => {
        if (!engagement.payments) return [];

        const today = new Date();
        return engagement.payments.filter(payment => {
            const dueDate = convertTimestamp(payment.dueDate as any);
            return !Number.isNaN(dueDate.getTime()) && dueDate < today && payment.status !== '已付款';
        });
    };

    const financialSummary = calculateFinancialSummary();
    const paymentTrend = calculatePaymentTrend();
    const overduePayments = calculateOverduePayments();

    const formatDate = (date: Date | any) => {
        if (!date) return '未設定';
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        return dateObj.toLocaleDateString('zh-TW');
    };

    const formatCurrency = (amount?: number, currency: string = engagement.currency) => {
        const safeAmount = typeof amount === 'number' && Number.isFinite(amount) ? amount : 0;
        const safeCurrency = currency || 'TWD';
        return formatCurrencyShared(safeAmount, safeCurrency);
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
            case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
            default: return <div className="h-4 w-4" />;
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'up': return 'text-green-600';
            case 'down': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* 財務概覽 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        財務概覽
                    </CardTitle>
                    <CardDescription>
                        {engagement.name} - 財務狀況報告
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                專案總價值
                            </div>
                            <p className="text-2xl font-bold">{formatCurrency(financialSummary.totalValue)}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CreditCard className="h-4 w-4" />
                                已付款金額
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(financialSummary.paidAmount)}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Receipt className="h-4 w-4" />
                                待付款金額
                            </div>
                            <p className="text-2xl font-bold text-orange-600">
                                {formatCurrency(financialSummary.pendingAmount)}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                已開票金額
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                                {formatCurrency(financialSummary.totalInvoiced)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 付款進度 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>付款進度</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">付款完成度</span>
                                <span className="text-sm font-medium">{financialSummary.paidPercentage}%</span>
                            </div>
                            <Progress value={financialSummary.paidPercentage} className="h-3" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">開票完成度</span>
                                <span className="text-sm font-medium">{financialSummary.invoicedPercentage}%</span>
                            </div>
                            <Progress value={financialSummary.invoicedPercentage} className="h-3" />
                        </div>
                        <div className="pt-2 border-t">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">未開票金額</span>
                                <span className="text-sm font-medium text-orange-600">
                                    {formatCurrency(financialSummary.uninvoicedAmount)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>付款趨勢</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            {getTrendIcon(paymentTrend.trend)}
                            <span className={`text-sm font-medium ${getTrendColor(paymentTrend.trend)}`}>
                                最近付款趨勢
                            </span>
                        </div>
                        <div className="text-2xl font-bold">
                            {paymentTrend.percentage > 0 && '+'}
                            {paymentTrend.percentage}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                            相較於前一期
                        </div>
                        {overduePayments.length > 0 && (
                            <div className="pt-2 border-t">
                                <div className="flex items-center gap-2 text-sm text-red-600">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{overduePayments.length} 筆逾期付款</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* 付款記錄摘要 */}
            <Card>
                <CardHeader>
                    <CardTitle>付款記錄摘要</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">總付款次數</div>
                            <div className="text-2xl font-bold">
                                {engagement.payments?.length || 0}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">已開票數量</div>
                            <div className="text-2xl font-bold">
                                {engagement.invoices?.length || 0}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">收款記錄</div>
                            <div className="text-2xl font-bold">
                                {engagement.receipts?.length || 0}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 最近付款記錄 */}
            {engagement.payments && engagement.payments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>最近付款記錄</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {engagement.payments.slice(-5).map((payment, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="space-y-1">
                                        <div className="font-medium">{payment.description}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatDate(payment.paymentDate)}
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <div className="font-medium">
                                            {formatCurrency(payment.amount)}
                                        </div>
                                        <Badge
                                            variant={payment.status === '已付款' ? 'default' : 'secondary'}
                                            className={payment.status === '已付款' ? 'bg-green-100 text-green-800' : ''}
                                        >
                                            {payment.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 發票摘要 */}
            {engagement.invoices && engagement.invoices.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>發票摘要</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {engagement.invoices.slice(-3).map((invoice, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="space-y-1">
                                        <div className="font-medium">發票 #{invoice.invoiceNumber}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatDate(invoice.issueDate)}
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <div className="font-medium">
                                            {formatCurrency(invoice.amount)}
                                        </div>
                                        <Badge
                                            variant={invoice.status === '已付款' ? 'default' : 'secondary'}
                                            className={invoice.status === '已付款' ? 'bg-green-100 text-green-800' : ''}
                                        >
                                            {invoice.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
