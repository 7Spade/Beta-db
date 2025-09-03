'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Package,
    Target,
    TrendingUp
} from 'lucide-react';
import type { Engagement } from '../../types/engagement.types';
import { convertTimestamp } from '../../utils';

interface ProgressReportProps {
    engagement: Engagement;
    className?: string;
}

export function ProgressReport({ engagement, className }: ProgressReportProps) {
    // 計算整體進度
    const calculateOverallProgress = () => {
        if (!engagement.tasks || engagement.tasks.length === 0) return 0;
        const completedTasks = engagement.tasks.filter(task => task.status === '已完成').length;
        return Math.round((completedTasks / engagement.tasks.length) * 100);
    };

    // 計算里程碑進度
    const calculateMilestoneProgress = () => {
        if (!engagement.milestones || engagement.milestones.length === 0) return 0;
        const completedMilestones = engagement.milestones.filter(milestone => milestone.status === '已完成').length;
        return Math.round((completedMilestones / engagement.milestones.length) * 100);
    };

    // 計算交付物進度
    const calculateDeliverableProgress = () => {
        if (!engagement.deliverables || engagement.deliverables.length === 0) return 0;
        const completedDeliverables = engagement.deliverables.filter(deliverable => deliverable.status === '已完成').length;
        return Math.round((completedDeliverables / engagement.deliverables.length) * 100);
    };

    // 計算任務狀態分布
    const calculateTaskStatusDistribution = () => {
        if (!engagement.tasks) return { completed: 0, inProgress: 0, pending: 0, total: 0 };

        const completed = engagement.tasks.filter(task => task.status === '已完成').length;
        const inProgress = engagement.tasks.filter(task => task.status === '進行中').length;
        const pending = engagement.tasks.filter(task => task.status === '待處理').length;

        return { completed, inProgress, pending, total: engagement.tasks.length };
    };

    // 計算逾期項目
    const calculateOverdueItems = () => {
        const today = new Date();
        const overdueItems: Array<{ type: 'milestone' | 'task'; name: string; dueDate: Date; status: string }> = [];

        // 檢查逾期的里程碑
        if (engagement.milestones) {
            engagement.milestones.forEach(milestone => {
                const dueDate = convertTimestamp(milestone.dueDate);
                if (dueDate < today && milestone.status !== '已完成') {
                    overdueItems.push({
                        type: 'milestone',
                        name: milestone.name,
                        dueDate: dueDate,
                        status: milestone.status
                    });
                }
            });
        }

        // 檢查逾期的任務
        if (engagement.tasks) {
            engagement.tasks.forEach(task => {
                if (task.dueDate) {
                    const dueDate = convertTimestamp(task.dueDate);
                    if (dueDate < today && task.status !== '已完成') {
                        overdueItems.push({
                            type: 'task',
                            name: task.title,
                            dueDate: dueDate,
                            status: task.status
                        });
                    }
                }
            });
        }

        return overdueItems;
    };

    // 計算時間進度
    const calculateTimeProgress = () => {
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

    const overallProgress = calculateOverallProgress();
    const milestoneProgress = calculateMilestoneProgress();
    const deliverableProgress = calculateDeliverableProgress();
    const taskDistribution = calculateTaskStatusDistribution();
    const overdueItems = calculateOverdueItems();
    const timeProgress = calculateTimeProgress();

    const formatDate = (date: Date | any) => {
        if (!date) return '未設定';
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        return dateObj.toLocaleDateString('zh-TW');
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
            {/* 進度概覽 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        進度概覽
                    </CardTitle>
                    <CardDescription>
                        {engagement.name} - 進度追蹤報告
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Target className="h-4 w-4" />
                                整體進度
                            </div>
                            <p className="text-2xl font-bold">{overallProgress}%</p>
                            <Progress value={overallProgress} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4" />
                                里程碑進度
                            </div>
                            <p className="text-2xl font-bold">{milestoneProgress}%</p>
                            <Progress value={milestoneProgress} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Package className="h-4 w-4" />
                                交付物進度
                            </div>
                            <p className="text-2xl font-bold">{deliverableProgress}%</p>
                            <Progress value={deliverableProgress} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                時間進度
                            </div>
                            <p className="text-2xl font-bold">{timeProgress}%</p>
                            <Progress value={timeProgress} className="h-2" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 任務狀態分布 */}
            <Card>
                <CardHeader>
                    <CardTitle>任務狀態分布</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center space-y-2">
                            <div className="text-3xl font-bold text-green-600">
                                {taskDistribution.completed}
                            </div>
                            <div className="text-sm text-muted-foreground">已完成</div>
                            <Progress
                                value={taskDistribution.total > 0 ? (taskDistribution.completed / taskDistribution.total) * 100 : 0}
                                className="h-2"
                            />
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-3xl font-bold text-blue-600">
                                {taskDistribution.inProgress}
                            </div>
                            <div className="text-sm text-muted-foreground">進行中</div>
                            <Progress
                                value={taskDistribution.total > 0 ? (taskDistribution.inProgress / taskDistribution.total) * 100 : 0}
                                className="h-2"
                            />
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-3xl font-bold text-gray-600">
                                {taskDistribution.pending}
                            </div>
                            <div className="text-sm text-muted-foreground">待開始</div>
                            <Progress
                                value={taskDistribution.total > 0 ? (taskDistribution.pending / taskDistribution.total) * 100 : 0}
                                className="h-2"
                            />
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-3xl font-bold text-purple-600">
                                {taskDistribution.total}
                            </div>
                            <div className="text-sm text-muted-foreground">總任務數</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 里程碑進度 */}
            {engagement.milestones && engagement.milestones.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>里程碑進度</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {engagement.milestones.map((milestone, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="space-y-1">
                                        <div className="font-medium">{milestone.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            截止日期: {formatDate(milestone.dueDate)}
                                        </div>
                                        {milestone.description && (
                                            <div className="text-sm text-muted-foreground">
                                                {milestone.description}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right space-y-2">
                                        <Badge className={getStatusColor(milestone.status)}>
                                            {milestone.status}
                                        </Badge>
                                        <div className="text-sm text-muted-foreground">
                                            進度: {milestone.progress || 0}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 交付物狀態 */}
            {engagement.deliverables && engagement.deliverables.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>交付物狀態</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {engagement.deliverables.map((deliverable, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="space-y-1">
                                        <div className="font-medium">{deliverable.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            類型: {deliverable.type}
                                        </div>
                                        {deliverable.description && (
                                            <div className="text-sm text-muted-foreground">
                                                {deliverable.description}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right space-y-2">
                                        <Badge className={getStatusColor(deliverable.status)}>
                                            {deliverable.status}
                                        </Badge>
                                        <div className="text-sm text-muted-foreground">
                                            進度: {deliverable.progress || 0}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 逾期項目警告 */}
            {overdueItems.length > 0 && (
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            逾期項目警告
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {overdueItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="space-y-1">
                                        <div className="font-medium text-red-800">
                                            {item.type === 'milestone' ? '里程碑' : '任務'}: {item.name}
                                        </div>
                                        <div className="text-sm text-red-600">
                                            逾期日期: {formatDate(item.dueDate)}
                                        </div>
                                    </div>
                                    <Badge className="bg-red-100 text-red-800">
                                        {item.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 時間線進度 */}
            <Card>
                <CardHeader>
                    <CardTitle>時間線進度</CardTitle>
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
                        {engagement.actualStartDate && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">實際開始</span>
                                <span className="text-sm font-medium">{formatDate(engagement.actualStartDate)}</span>
                            </div>
                        )}
                        {engagement.actualEndDate && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">實際結束</span>
                                <span className="text-sm font-medium">{formatDate(engagement.actualEndDate)}</span>
                            </div>
                        )}
                        <div className="pt-2 border-t">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">時間進度</span>
                                <span className="text-sm font-medium">{timeProgress}%</span>
                            </div>
                            <Progress value={timeProgress} className="h-2 mt-2" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
