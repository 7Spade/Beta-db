/**
 * @fileoverview 財務摘要組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@root/src/shared/utils';
import {
    AlertTriangle,
    BarChart3,
    DollarSign,
    PieChart,
    Target,
    TrendingDown,
    TrendingUp
} from 'lucide-react';
import type { FinancialSummary } from '../../types';
import { formatCurrency } from '../../utils';

interface FinancialSummaryProps {
    summary: FinancialSummary;
    className?: string;
}

export function FinancialSummary({ summary, className }: FinancialSummaryProps) {
    const getProgressColor = (progress: number) => {
        if (progress >= 90) return 'bg-green-500';
        if (progress >= 70) return 'bg-blue-500';
        if (progress >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getProgressTextColor = (progress: number) => {
        if (progress >= 90) return 'text-green-600';
        if (progress >= 70) return 'text-blue-600';
        if (progress >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getProfitMarginColor = (margin?: number) => {
        if (!margin) return 'text-gray-600';
        if (margin >= 20) return 'text-green-600';
        if (margin >= 10) return 'text-blue-600';
        if (margin >= 0) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getProfitMarginIcon = (margin?: number) => {
        if (!margin) return <PieChart className="h-4 w-4" />;
        if (margin >= 0) return <TrendingUp className="h-4 w-4" />;
        return <TrendingDown className="h-4 w-4" />;
    };

    return (
        <div className={cn('space-y-6', className)}>
            {/* 財務總覽 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        財務總覽
                    </CardTitle>
                    <CardDescription>
                        專案財務狀況和進度概覽
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {formatCurrency(summary.totalValue)}
                            </div>
                            <div className="text-sm text-muted-foreground">總價值</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(summary.paidAmount)}
                            </div>
                            <div className="text-sm text-muted-foreground">已收款</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {formatCurrency(summary.pendingAmount)}
                            </div>
                            <div className="text-sm text-muted-foreground">待收款</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {formatCurrency(summary.overdueAmount)}
                            </div>
                            <div className="text-sm text-muted-foreground">逾期款項</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 進度指標 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 付款進度 */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Target className="h-4 w-4 text-green-600" />
                            付款進度
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">完成率</span>
                            <span className={cn('font-semibold', getProgressTextColor(summary.paymentProgress))}>
                                {summary.paymentProgress}%
                            </span>
                        </div>
                        <div className="relative">
                            <Progress value={summary.paymentProgress} className="h-2" />
                            <div
                                className={cn(
                                    'absolute top-0 left-0 h-full transition-all duration-300 ease-in-out',
                                    getProgressColor(summary.paymentProgress)
                                )}
                                style={{ width: `${Math.min(summary.paymentProgress, 100)}%` }}
                            />
                        </div>
                        <div className="text-xs text-muted-foreground">
                            已付款 / 總金額
                        </div>
                    </CardContent>
                </Card>

                {/* 收款進度 */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <BarChart3 className="h-4 w-4 text-blue-600" />
                            收款進度
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">完成率</span>
                            <span className={cn('font-semibold', getProgressTextColor(summary.receiptProgress))}>
                                {summary.receiptProgress}%
                            </span>
                        </div>
                        <div className="relative">
                            <Progress value={summary.receiptProgress} className="h-2" />
                            <div
                                className={cn(
                                    'absolute top-0 left-0 h-full transition-all duration-300 ease-in-out',
                                    getProgressColor(summary.receiptProgress)
                                )}
                                style={{ width: `${Math.min(summary.receiptProgress, 100)}%` }}
                            />
                        </div>
                        <div className="text-xs text-muted-foreground">
                            已收款 / 應收款
                        </div>
                    </CardContent>
                </Card>

                {/* 發票進度 */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <PieChart className="h-4 w-4 text-purple-600" />
                            發票進度
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">完成率</span>
                            <span className={cn('font-semibold', getProgressTextColor(summary.invoiceProgress))}>
                                {summary.invoiceProgress}%
                            </span>
                        </div>
                        <div className="relative">
                            <Progress value={summary.invoiceProgress} className="h-2" />
                            <div
                                className={cn(
                                    'absolute top-0 left-0 h-full transition-all duration-300 ease-in-out',
                                    getProgressColor(summary.invoiceProgress)
                                )}
                                style={{ width: `${Math.min(summary.invoiceProgress, 100)}%` }}
                            />
                        </div>
                        <div className="text-xs text-muted-foreground">
                            已開票 / 應開票
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 利潤率 */}
            {summary.profitMargin !== undefined && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            {getProfitMarginIcon(summary.profitMargin)}
                            <span className={getProfitMarginColor(summary.profitMargin)}>
                                利潤率分析
                            </span>
                        </CardTitle>
                        <CardDescription>
                            專案盈利能力評估
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <div className={cn('text-4xl font-bold mb-2', getProfitMarginColor(summary.profitMargin))}>
                                {summary.profitMargin.toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {summary.profitMargin >= 20 ? '優秀' :
                                    summary.profitMargin >= 10 ? '良好' :
                                        summary.profitMargin >= 0 ? '一般' : '需要改進'}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 成本分解 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <BarChart3 className="h-4 w-4 text-orange-600" />
                        成本分解
                    </CardTitle>
                    <CardDescription>
                        各項成本佔比分析
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(summary.costBreakdown).map(([category, amount]) => {
                            const percentage = summary.totalValue > 0 ? (amount / summary.totalValue) * 100 : 0;
                            const categoryLabels: Record<string, string> = {
                                labor: '人工成本',
                                materials: '材料成本',
                                equipment: '設備成本',
                                overhead: '間接成本',
                                other: '其他成本'
                            };

                            return (
                                <div key={category} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{categoryLabels[category] || category}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{formatCurrency(amount)}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {percentage.toFixed(1)}%
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <Progress value={percentage} className="h-2" />
                                        <div
                                            className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-300 ease-in-out"
                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* 財務警告 */}
            {(summary.overdueAmount > 0 || summary.pendingAmount > summary.totalValue * 0.3) && (
                <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-800">
                            <AlertTriangle className="h-5 w-5" />
                            財務警告
                        </CardTitle>
                        <CardDescription className="text-orange-700">
                            需要關注的財務問題
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {summary.overdueAmount > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                                    <span>有 {formatCurrency(summary.overdueAmount)} 的逾期款項需要追收</span>
                                </div>
                            )}
                            {summary.pendingAmount > summary.totalValue * 0.3 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                                    <span>待收款項佔總金額比例較高，建議加強收款管理</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
