/**
 * @fileoverview 風險卡片組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Timestamp } from 'firebase/firestore';
import {
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Clock,
    Edit,
    Target,
    Trash2,
    TrendingUp,
    User
} from 'lucide-react';
import { useState } from 'react';
import type { Risk } from '../../types';

interface RiskCardProps {
    risk: Risk;
    onUpdate: (id: string, updates: Partial<Risk>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export function RiskCard({ risk, onUpdate, onDelete }: RiskCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const getLevelColor = (level: string) => {
        switch (level) {
            case '極高':
                return 'bg-red-100 text-red-800 border-red-200';
            case '高':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case '中':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case '低':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case '已關閉':
                return 'bg-green-100 text-green-800 border-green-200';
            case '已緩解':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case '已接受':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case '評估中':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case '已識別':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case '極高':
            case '高':
                return <AlertTriangle className="h-4 w-4" />;
            case '中':
                return <TrendingUp className="h-4 w-4" />;
            case '低':
                return <Clock className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const formatDate = (date: Date | Timestamp) => {
        if (date instanceof Date) {
            return date.toLocaleDateString('zh-TW');
        } else if (date instanceof Timestamp) {
            return date.toDate().toLocaleDateString('zh-TW');
        } else {
            return new Date(date).toLocaleDateString('zh-TW');
        }
    };

    const getRiskScoreColor = (score: number) => {
        if (score >= 80) return 'text-red-600';
        if (score >= 60) return 'text-orange-600';
        if (score >= 40) return 'text-yellow-600';
        return 'text-green-600';
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            const updates: Partial<Risk> = {
                status: newStatus as any
            };

            if (newStatus === '已關閉') {
                updates.actualDate = new Date();
            }

            await onUpdate(risk.id, updates);
        } catch (error) {
            console.error('更新狀態失敗:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('確定要刪除此風險嗎？')) {
            try {
                await onDelete(risk.id);
            } catch (error) {
                console.error('刪除失敗:', error);
            }
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-lg">{risk.title}</CardTitle>
                                <CardDescription className="mt-1">
                                    {risk.category} • 風險分數: <span className={getRiskScoreColor(risk.riskScore)}>{risk.riskScore}</span>
                                    {risk.ownerName && ` • 負責人: ${risk.ownerName}`}
                                </CardDescription>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Badge className={getLevelColor(risk.level)}>
                                    <span className="flex items-center">
                                        {getLevelIcon(risk.level)}
                                        <span className="ml-1">{risk.level}</span>
                                    </span>
                                </Badge>
                                <Badge className={getStatusColor(risk.status)}>
                                    {risk.status}
                                </Badge>
                                {isExpanded ? (
                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                            </div>
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <CardContent className="pt-0">
                        <div className="space-y-4">
                            {/* 基本信息 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">類別</h4>
                                    <Badge variant="outline">{risk.category}</Badge>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">識別日期</h4>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{formatDate(risk.identifiedDate)}</span>
                                    </div>
                                </div>
                                {risk.targetDate && (
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground mb-1">目標日期</h4>
                                        <div className="flex items-center">
                                            <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>{formatDate(risk.targetDate)}</span>
                                        </div>
                                    </div>
                                )}
                                {risk.actualDate && (
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground mb-1">實際日期</h4>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>{formatDate(risk.actualDate)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 風險評估 */}
                            <div>
                                <h4 className="font-medium text-sm text-muted-foreground mb-2">風險評估</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm">可能性</span>
                                            <span className="text-sm font-medium">{risk.probability}%</span>
                                        </div>
                                        <Progress value={risk.probability} className="h-2" />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm">影響程度</span>
                                            <span className="text-sm font-medium">{risk.impact}%</span>
                                        </div>
                                        <Progress value={risk.impact} className="h-2" />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm">風險分數</span>
                                            <span className={`text-sm font-medium ${getRiskScoreColor(risk.riskScore)}`}>
                                                {risk.riskScore}
                                            </span>
                                        </div>
                                        <Progress value={risk.riskScore} className="h-2" />
                                    </div>
                                </div>
                            </div>

                            {/* 描述 */}
                            <div>
                                <h4 className="font-medium text-sm text-muted-foreground mb-1">描述</h4>
                                <p className="text-sm bg-gray-50 p-3 rounded-md">{risk.description}</p>
                            </div>

                            {/* 緩解計劃 */}
                            {risk.mitigationPlan && (
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">緩解計劃</h4>
                                    <p className="text-sm bg-blue-50 p-3 rounded-md">{risk.mitigationPlan}</p>
                                </div>
                            )}

                            {/* 應急計劃 */}
                            {risk.contingencyPlan && (
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">應急計劃</h4>
                                    <p className="text-sm bg-orange-50 p-3 rounded-md">{risk.contingencyPlan}</p>
                                </div>
                            )}

                            {/* 操作按鈕 */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex space-x-2">
                                    {risk.status === '已識別' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusChange('評估中')}
                                            className="text-yellow-600 hover:text-yellow-700"
                                        >
                                            <TrendingUp className="h-4 w-4 mr-1" />
                                            開始評估
                                        </Button>
                                    )}
                                    {risk.status === '評估中' && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusChange('已緩解')}
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                <Target className="h-4 w-4 mr-1" />
                                                已緩解
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusChange('已接受')}
                                                className="text-purple-600 hover:text-purple-700"
                                            >
                                                <User className="h-4 w-4 mr-1" />
                                                已接受
                                            </Button>
                                        </>
                                    )}
                                    {(risk.status === '已緩解' || risk.status === '已接受') && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusChange('已關閉')}
                                            className="text-green-600 hover:text-green-700"
                                        >
                                            <Clock className="h-4 w-4 mr-1" />
                                            關閉
                                        </Button>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        編輯
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDelete}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        刪除
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
