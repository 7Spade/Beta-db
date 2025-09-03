'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    FileCheck,
    Shield,
    TrendingUp,
    User,
    XCircle
} from 'lucide-react';
import type { Engagement } from '../../types/engagement.types';

interface QualityReportProps {
    engagement: Engagement;
    className?: string;
}

export function QualityReport({ engagement, className }: QualityReportProps) {
    // 計算品質摘要
    const calculateQualitySummary = () => {
        const acceptanceRecords = engagement.acceptanceRecords || [];
        const qualityChecks = engagement.qualityChecks || [];

        const totalAcceptanceRecords = acceptanceRecords.length;
        const approvedRecords = acceptanceRecords.filter(record => record.status === '已通過').length;
        const pendingRecords = acceptanceRecords.filter(record => record.status === '待審核').length;
        const rejectedRecords = acceptanceRecords.filter(record => record.status === '已拒絕').length;

        const totalQualityChecks = qualityChecks.length;
        const passedChecks = qualityChecks.filter(check => check.status === '通過').length;
        const failedChecks = qualityChecks.filter(check => check.status === '不通過').length;
        const pendingChecks = qualityChecks.filter(check => check.status === '待檢查').length;

        const acceptanceRate = totalAcceptanceRecords > 0 ? Math.round((approvedRecords / totalAcceptanceRecords) * 100) : 0;
        const qualityPassRate = totalQualityChecks > 0 ? Math.round((passedChecks / totalQualityChecks) * 100) : 0;

        return {
            totalAcceptanceRecords,
            approvedRecords,
            pendingRecords,
            rejectedRecords,
            totalQualityChecks,
            passedChecks,
            failedChecks,
            pendingChecks,
            acceptanceRate,
            qualityPassRate
        };
    };

    // 計算品質問題統計
    const calculateQualityIssues = () => {
        const qualityChecks = engagement.qualityChecks || [];
        const issues = [];

        qualityChecks.forEach(check => {
            if (check.findings && check.findings.length > 0) {
                check.findings.forEach(finding => {
                    if (finding.severity === '高' || finding.severity === '中') {
                        issues.push({
                            checkName: check.name,
                            finding: finding.description,
                            severity: finding.severity,
                            status: finding.status
                        });
                    }
                });
            }
        });

        const highSeverityIssues = issues.filter(issue => issue.severity === '高').length;
        const mediumSeverityIssues = issues.filter(issue => issue.severity === '中').length;
        const resolvedIssues = issues.filter(issue => issue.status === '已解決').length;

        return {
            totalIssues: issues.length,
            highSeverityIssues,
            mediumSeverityIssues,
            resolvedIssues,
            unresolvedIssues: issues.length - resolvedIssues
        };
    };

    // 計算品質趨勢
    const calculateQualityTrend = () => {
        const qualityChecks = engagement.qualityChecks || [];
        if (qualityChecks.length < 2) return { trend: 'stable', percentage: 0 };

        const sortedChecks = [...qualityChecks].sort((a, b) => {
            const dateA = a.checkDate.toDate ? a.checkDate.toDate() : new Date(a.checkDate);
            const dateB = b.checkDate.toDate ? b.checkDate.toDate() : new Date(b.checkDate);
            return dateA.getTime() - dateB.getTime();
        });

        const recentChecks = sortedChecks.slice(-3);
        const olderChecks = sortedChecks.slice(-6, -3);

        const recentPassRate = recentChecks.length > 0
            ? (recentChecks.filter(check => check.status === '通過').length / recentChecks.length) * 100
            : 0;

        const olderPassRate = olderChecks.length > 0
            ? (olderChecks.filter(check => check.status === '通過').length / olderChecks.length) * 100
            : 0;

        const percentage = Math.round(recentPassRate - olderPassRate);
        return {
            trend: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'stable',
            percentage: Math.abs(percentage)
        };
    };

    const qualitySummary = calculateQualitySummary();
    const qualityIssues = calculateQualityIssues();
    const qualityTrend = calculateQualityTrend();

    const formatDate = (date: Date | any) => {
        if (!date) return '未設定';
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        return dateObj.toLocaleDateString('zh-TW');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case '已通過':
            case '通過': return 'bg-green-100 text-green-800';
            case '待審核':
            case '待檢查': return 'bg-yellow-100 text-yellow-800';
            case '已拒絕':
            case '不通過': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case '高': return 'bg-red-100 text-red-800';
            case '中': return 'bg-yellow-100 text-yellow-800';
            case '低': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
            case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
            default: return <div className="h-4 w-4" />;
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* 品質概覽 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        品質概覽
                    </CardTitle>
                    <CardDescription>
                        {engagement.name} - 品質管理報告
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4" />
                                驗收通過率
                            </div>
                            <p className="text-2xl font-bold text-green-600">{qualitySummary.acceptanceRate}%</p>
                            <Progress value={qualitySummary.acceptanceRate} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileCheck className="h-4 w-4" />
                                品質檢查通過率
                            </div>
                            <p className="text-2xl font-bold text-blue-600">{qualitySummary.qualityPassRate}%</p>
                            <Progress value={qualitySummary.qualityPassRate} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <AlertTriangle className="h-4 w-4" />
                                品質問題
                            </div>
                            <p className="text-2xl font-bold text-orange-600">{qualityIssues.totalIssues}</p>
                            <div className="text-xs text-muted-foreground">
                                高: {qualityIssues.highSeverityIssues} | 中: {qualityIssues.mediumSeverityIssues}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <XCircle className="h-4 w-4" />
                                未解決問題
                            </div>
                            <p className="text-2xl font-bold text-red-600">{qualityIssues.unresolvedIssues}</p>
                            <div className="text-xs text-muted-foreground">
                                解決率: {qualityIssues.totalIssues > 0 ? Math.round((qualityIssues.resolvedIssues / qualityIssues.totalIssues) * 100) : 0}%
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 品質趨勢 */}
            <Card>
                <CardHeader>
                    <CardTitle>品質趨勢</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            {getTrendIcon(qualityTrend.trend)}
                            <span className="text-sm font-medium">
                                品質檢查通過率趨勢
                            </span>
                        </div>
                        <div className="text-2xl font-bold">
                            {qualityTrend.percentage > 0 && '+'}
                            {qualityTrend.percentage}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                            相較於前一期
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 驗收記錄摘要 */}
            <Card>
                <CardHeader>
                    <CardTitle>驗收記錄摘要</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center space-y-2">
                            <div className="text-3xl font-bold text-green-600">
                                {qualitySummary.approvedRecords}
                            </div>
                            <div className="text-sm text-muted-foreground">已通過</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-3xl font-bold text-yellow-600">
                                {qualitySummary.pendingRecords}
                            </div>
                            <div className="text-sm text-muted-foreground">待審核</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-3xl font-bold text-red-600">
                                {qualitySummary.rejectedRecords}
                            </div>
                            <div className="text-sm text-muted-foreground">已拒絕</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-3xl font-bold text-purple-600">
                                {qualitySummary.totalAcceptanceRecords}
                            </div>
                            <div className="text-sm text-muted-foreground">總記錄數</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 品質檢查摘要 */}
            <Card>
                <CardHeader>
                    <CardTitle>品質檢查摘要</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center space-y-2">
                            <div className="text-3xl font-bold text-green-600">
                                {qualitySummary.passedChecks}
                            </div>
                            <div className="text-sm text-muted-foreground">通過</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-3xl font-bold text-yellow-600">
                                {qualitySummary.pendingChecks}
                            </div>
                            <div className="text-sm text-muted-foreground">待檢查</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-3xl font-bold text-red-600">
                                {qualitySummary.failedChecks}
                            </div>
                            <div className="text-sm text-muted-foreground">不通過</div>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-3xl font-bold text-purple-600">
                                {qualitySummary.totalQualityChecks}
                            </div>
                            <div className="text-sm text-muted-foreground">總檢查數</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 最近驗收記錄 */}
            {engagement.acceptanceRecords && engagement.acceptanceRecords.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>最近驗收記錄</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {engagement.acceptanceRecords.slice(-5).map((record, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="space-y-1">
                                        <div className="font-medium">{record.deliverableName}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {record.description}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(record.acceptanceDate)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {record.acceptedBy}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <Badge className={getStatusColor(record.status)}>
                                            {record.status}
                                        </Badge>
                                        {record.notes && (
                                            <div className="text-xs text-muted-foreground max-w-xs text-right">
                                                {record.notes}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 最近品質檢查 */}
            {engagement.qualityChecks && engagement.qualityChecks.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>最近品質檢查</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {engagement.qualityChecks.slice(-5).map((check, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="space-y-1">
                                        <div className="font-medium">{check.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {check.description}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(check.checkDate)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {check.checkedBy}
                                            </span>
                                        </div>
                                        {check.findings && check.findings.length > 0 && (
                                            <div className="text-xs text-muted-foreground">
                                                發現 {check.findings.length} 個問題
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right space-y-2">
                                        <Badge className={getStatusColor(check.status)}>
                                            {check.status}
                                        </Badge>
                                        {check.findings && check.findings.length > 0 && (
                                            <div className="space-y-1">
                                                {check.findings.slice(0, 2).map((finding, findingIndex) => (
                                                    <Badge
                                                        key={findingIndex}
                                                        variant="outline"
                                                        className={getSeverityColor(finding.severity)}
                                                    >
                                                        {finding.severity}
                                                    </Badge>
                                                ))}
                                                {check.findings.length > 2 && (
                                                    <div className="text-xs text-muted-foreground">
                                                        +{check.findings.length - 2} 更多
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 品質問題摘要 */}
            {qualityIssues.totalIssues > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>品質問題摘要</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center space-y-2">
                                    <div className="text-2xl font-bold text-red-600">
                                        {qualityIssues.highSeverityIssues}
                                    </div>
                                    <div className="text-sm text-muted-foreground">高嚴重性問題</div>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {qualityIssues.mediumSeverityIssues}
                                    </div>
                                    <div className="text-sm text-muted-foreground">中嚴重性問題</div>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="text-2xl font-bold text-green-600">
                                        {qualityIssues.resolvedIssues}
                                    </div>
                                    <div className="text-sm text-muted-foreground">已解決問題</div>
                                </div>
                            </div>
                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">問題解決率</span>
                                    <span className="text-sm font-medium">
                                        {qualityIssues.totalIssues > 0 ? Math.round((qualityIssues.resolvedIssues / qualityIssues.totalIssues) * 100) : 0}%
                                    </span>
                                </div>
                                <Progress
                                    value={qualityIssues.totalIssues > 0 ? (qualityIssues.resolvedIssues / qualityIssues.totalIssues) * 100 : 0}
                                    className="h-2 mt-2"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
