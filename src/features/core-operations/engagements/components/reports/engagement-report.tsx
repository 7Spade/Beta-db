'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, DollarSign, FileText, Users } from 'lucide-react';
import type { Engagement } from '../../types/engagement.types';

interface EngagementReportProps {
    engagement: Engagement;
    className?: string;
}

export function EngagementReport({ engagement, className }: EngagementReportProps) {
    // 計算進度百分比
    const calculateProgress = () => {
        if (!engagement.tasks || engagement.tasks.length === 0) return 0;
        const completedTasks = engagement.tasks.filter(task => task.status === '已完成').length;
        return Math.round((completedTasks / engagement.tasks.length) * 100);
    };

    // 計算財務狀態
    const calculateFinancialStatus = () => {
        const paidPercentage = engagement.totalValue > 0
            ? Math.round((engagement.paidAmount / engagement.totalValue) * 100)
            : 0;
        return {
            paidPercentage,
            pendingAmount: engagement.pendingAmount,
            totalValue: engagement.totalValue
        };
    };

    // 計算風險等級
    const calculateRiskLevel = () => {
        if (!engagement.risks || engagement.risks.length === 0) return '低';
        const highRisks = engagement.risks.filter(risk => risk.level === '高').length;
        const mediumRisks = engagement.risks.filter(risk => risk.level === '中').length;

        if (highRisks > 0) return '高';
        if (mediumRisks > 2) return '中';
        return '低';
    };

    const progress = calculateProgress();
    const financialStatus = calculateFinancialStatus();
    const riskLevel = calculateRiskLevel();

    const formatDate = (date: Date | any) => {
        if (!date) return '未設定';
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        return dateObj.toLocaleDateString('zh-TW');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case '進行中': return 'bg-blue-100 text-blue-800';
            case '已完成': return 'bg-green-100 text-green-800';
            case '暫停': return 'bg-yellow-100 text-yellow-800';
            case '已終止': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case '高': return 'bg-red-100 text-red-800';
            case '中': return 'bg-yellow-100 text-yellow-800';
            case '低': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* 專案概覽 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        專案概覽
                    </CardTitle>
                    <CardDescription>
                        {engagement.name} - 詳細報告
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                開始日期
                            </div>
                            <p className="font-medium">{formatDate(engagement.startDate)}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                結束日期
                            </div>
                            <p className="font-medium">{formatDate(engagement.endDate)}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                客戶
                            </div>
                            <p className="font-medium">{engagement.client}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                專案價值
                            </div>
                            <p className="font-medium">
                                {engagement.currency} {engagement.totalValue.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 狀態和進度 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>專案狀態</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">當前狀態</span>
                            <Badge className={getStatusColor(engagement.status)}>
                                {engagement.status}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">專案階段</span>
                            <Badge variant="outline">{engagement.phase}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">風險等級</span>
                            <Badge className={getRiskColor(riskLevel)}>
                                {riskLevel}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>進度追蹤</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">整體進度</span>
                                <span className="text-sm font-medium">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">總任務數</span>
                                <p className="font-medium">{engagement.tasks?.length || 0}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">已完成</span>
                                <p className="font-medium">
                                    {engagement.tasks?.filter(task => task.status === '已完成').length || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 財務摘要 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        財務摘要
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">總價值</span>
                                <span className="font-medium">
                                    {engagement.currency} {engagement.totalValue.toLocaleString()}
                                </span>
                            </div>
                            <Progress value={100} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">已付款</span>
                                <span className="font-medium">
                                    {engagement.currency} {engagement.paidAmount.toLocaleString()}
                                </span>
                            </div>
                            <Progress value={financialStatus.paidPercentage} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">待付款</span>
                                <span className="font-medium">
                                    {engagement.currency} {engagement.pendingAmount.toLocaleString()}
                                </span>
                            </div>
                            <Progress
                                value={100 - financialStatus.paidPercentage}
                                className="h-2"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 關鍵指標 */}
            <Card>
                <CardHeader>
                    <CardTitle>關鍵指標</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center space-y-2">
                            <div className="text-2xl font-bold text-blue-600">
                                {engagement.milestones?.length || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">里程碑</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-2xl font-bold text-green-600">
                                {engagement.deliverables?.length || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">交付物</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-2xl font-bold text-orange-600">
                                {engagement.risks?.length || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">風險項目</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-2xl font-bold text-purple-600">
                                {engagement.documents?.length || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">文件數量</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
