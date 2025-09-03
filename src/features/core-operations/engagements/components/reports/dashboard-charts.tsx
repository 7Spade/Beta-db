'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    AlertTriangle,
    BarChart3,
    Calendar,
    CheckCircle,
    DollarSign,
    PieChart,
    Target,
    TrendingUp
} from 'lucide-react';
import type { Engagement } from '../../types/engagement.types';
import { convertTimestamp, formatCurrency as formatCurrencyShared } from '../../utils';

interface DashboardChartsProps {
    engagement: Engagement;
    className?: string;
}

export function DashboardCharts({ engagement, className }: DashboardChartsProps) {
    // 計算任務狀態分布數據
    const getTaskStatusData = () => {
        if (!engagement.tasks) return [];

        const statusCounts = engagement.tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count,
            percentage: Math.round((count / engagement.tasks.length) * 100)
        }));
    };

    // 計算財務進度數據
    const getFinancialProgressData = () => {
        const totalValue = engagement.totalValue;
        const paidAmount = engagement.paidAmount;
        const pendingAmount = engagement.pendingAmount;

        return [
            {
                category: '已付款',
                amount: paidAmount,
                percentage: totalValue > 0 ? Math.round((paidAmount / totalValue) * 100) : 0,
                color: 'bg-green-500'
            },
            {
                category: '待付款',
                amount: pendingAmount,
                percentage: totalValue > 0 ? Math.round((pendingAmount / totalValue) * 100) : 0,
                color: 'bg-orange-500'
            }
        ];
    };

    // 計算里程碑進度數據
    const getMilestoneProgressData = () => {
        if (!engagement.milestones) return [];

        return engagement.milestones.map((milestone, index) => ({
            name: milestone.name,
            progress: milestone.progress || 0,
            status: milestone.status,
            dueDate: milestone.dueDate
        }));
    };

    // 計算風險分布數據
    const getRiskDistributionData = () => {
        if (!engagement.risks) return [];

        const riskCounts = engagement.risks.reduce((acc, risk) => {
            acc[risk.level] = (acc[risk.level] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(riskCounts).map(([level, count]) => ({
            level,
            count,
            color: level === '高' ? 'bg-red-500' : level === '中' ? 'bg-yellow-500' : 'bg-green-500'
        }));
    };

    // 計算時間進度
    const getTimeProgress = () => {
        const startDate = convertTimestamp(engagement.startDate);
        const endDate = convertTimestamp(engagement.endDate);
        const today = new Date();

        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsedTime = today.getTime() - startDate.getTime();

        if (totalDuration <= 0) return 0;
        if (elapsedTime < 0) return 0;
        if (elapsedTime > totalDuration) return 100;

        return Math.round((elapsedTime / totalDuration) * 100);
    };

    // 計算品質指標
    const getQualityMetrics = () => {
        const acceptanceRecords = engagement.acceptanceRecords || [];
        const qualityChecks = engagement.qualityChecks || [];

        const approvedRecords = acceptanceRecords.filter(record => record.status === '已批准').length;
        const passedChecks = qualityChecks.filter(check => check.status === '已通過').length;

        const acceptanceRate = acceptanceRecords.length > 0 ? Math.round((approvedRecords / acceptanceRecords.length) * 100) : 0;
        const qualityPassRate = qualityChecks.length > 0 ? Math.round((passedChecks / qualityChecks.length) * 100) : 0;

        return {
            acceptanceRate,
            qualityPassRate,
            totalAcceptanceRecords: acceptanceRecords.length,
            totalQualityChecks: qualityChecks.length
        };
    };

    const taskStatusData = getTaskStatusData();
    const financialData = getFinancialProgressData();
    const milestoneData = getMilestoneProgressData();
    const riskData = getRiskDistributionData();
    const timeProgress = getTimeProgress();
    const qualityMetrics = getQualityMetrics();

    const formatDate = (date: Date | any) => {
        if (!date) return '未設定';
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        return dateObj.toLocaleDateString('zh-TW');
    };

    const formatCurrency = (amount?: number) => {
        const safeAmount = typeof amount === 'number' && Number.isFinite(amount) ? amount : 0;
        const currency = engagement?.currency || 'TWD';
        return formatCurrencyShared(safeAmount, currency);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case '已完成': return 'bg-green-100 text-green-800';
            case '進行中': return 'bg-blue-100 text-blue-800';
            case '待開始': return 'bg-gray-100 text-gray-800';
            case '已延遲': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* 關鍵指標卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">整體進度</p>
                                <p className="text-2xl font-bold">{timeProgress}%</p>
                            </div>
                            <Target className="h-8 w-8 text-blue-600" />
                        </div>
                        <Progress value={timeProgress} className="mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">財務進度</p>
                                <p className="text-2xl font-bold">{financialData[0]?.percentage || 0}%</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                        <Progress value={financialData[0]?.percentage || 0} className="mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">品質通過率</p>
                                <p className="text-2xl font-bold">{qualityMetrics.qualityPassRate}%</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-purple-600" />
                        </div>
                        <Progress value={qualityMetrics.qualityPassRate} className="mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">風險項目</p>
                                <p className="text-2xl font-bold">{engagement.risks?.length || 0}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-orange-600" />
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                            高風險: {riskData.find(r => r.level === '高')?.count || 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 任務狀態分布圖 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        任務狀態分布
                    </CardTitle>
                    <CardDescription>
                        任務完成情況統計
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {taskStatusData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Badge className={getStatusColor(item.status)}>
                                        {item.status}
                                    </Badge>
                                    <span className="text-sm font-medium">{item.count} 個任務</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-muted-foreground w-12 text-right">
                                        {item.percentage}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* 財務進度圖 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        財務進度分布
                    </CardTitle>
                    <CardDescription>
                        付款和待付款金額分布
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {financialData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                    <span className="text-sm font-medium">{item.category}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{formatCurrency(item.amount)}</span>
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${item.color}`}
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-muted-foreground w-12 text-right">
                                        {item.percentage}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* 里程碑進度 */}
            {milestoneData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            里程碑進度
                        </CardTitle>
                        <CardDescription>
                            各里程碑完成進度
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {milestoneData.map((milestone, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">{milestone.name}</span>
                                            <Badge className={getStatusColor(milestone.status)}>
                                                {milestone.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">
                                                {formatDate(milestone.dueDate)}
                                            </span>
                                            <span className="text-sm font-medium">{milestone.progress}%</span>
                                        </div>
                                    </div>
                                    <Progress value={milestone.progress} className="h-2" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 風險分布 */}
            {riskData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            風險分布
                        </CardTitle>
                        <CardDescription>
                            風險等級分布統計
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {riskData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                        <span className="text-sm font-medium">{item.level}風險</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{item.count} 項</span>
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${item.color}`}
                                                style={{ width: `${(item.count / (engagement.risks?.length || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 品質指標 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        品質指標
                    </CardTitle>
                    <CardDescription>
                        品質檢查和驗收統計
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">驗收通過率</span>
                                <span className="text-sm font-medium">{qualityMetrics.acceptanceRate}%</span>
                            </div>
                            <Progress value={qualityMetrics.acceptanceRate} className="h-2" />
                            <div className="text-xs text-muted-foreground">
                                總驗收記錄: {qualityMetrics.totalAcceptanceRecords}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">品質檢查通過率</span>
                                <span className="text-sm font-medium">{qualityMetrics.qualityPassRate}%</span>
                            </div>
                            <Progress value={qualityMetrics.qualityPassRate} className="h-2" />
                            <div className="text-xs text-muted-foreground">
                                總檢查次數: {qualityMetrics.totalQualityChecks}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 時間線進度 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        時間線進度
                    </CardTitle>
                    <CardDescription>
                        專案時間進度追蹤
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">專案開始</span>
                            <span className="text-sm font-medium">{formatDate(engagement.startDate)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">預定結束</span>
                            <span className="text-sm font-medium">{formatDate(engagement.endDate)}</span>
                        </div>
                        <div className="pt-2 border-t">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">時間進度</span>
                                <span className="text-sm font-medium">{timeProgress}%</span>
                            </div>
                            <Progress value={timeProgress} className="h-3" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
