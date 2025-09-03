/**
 * @fileoverview 問題卡片組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Timestamp } from 'firebase/firestore';
import {
    AlertCircle,
    Bug,
    ChevronDown,
    ChevronUp,
    Clock,
    Edit,
    FileText,
    Trash2
} from 'lucide-react';
import { useState } from 'react';
import type { Issue } from '../../types';

interface IssueCardProps {
    issue: Issue;
    onUpdate: (id: string, updates: Partial<Issue>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export function IssueCard({ issue, onUpdate, onDelete }: IssueCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case '緊急':
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
            case '已解決':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case '處理中':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case '新增':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case '缺陷':
                return <Bug className="h-4 w-4" />;
            case '變更請求':
                return <AlertCircle className="h-4 w-4" />;
            case '問題':
                return <AlertCircle className="h-4 w-4" />;
            case '改進建議':
                return <FileText className="h-4 w-4" />;
            case '其他':
                return <FileText className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
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

    const handleStatusChange = async (newStatus: string) => {
        try {
            const updates: Partial<Issue> = {
                status: newStatus as any
            };

            if (newStatus === '已解決' || newStatus === '已關閉') {
                updates.resolvedDate = new Date();
            }

            await onUpdate(issue.id, updates);
        } catch (error) {
            console.error('更新狀態失敗:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('確定要刪除此問題嗎？')) {
            try {
                await onDelete(issue.id);
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
                                <CardTitle className="text-lg">{issue.title}</CardTitle>
                                <CardDescription className="mt-1">
                                    {issue.type} • 報告人: {issue.reportedByName}
                                    {issue.assignedToName && ` • 負責人: ${issue.assignedToName}`}
                                </CardDescription>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Badge className={getPriorityColor(issue.priority)}>
                                    {issue.priority}
                                </Badge>
                                <Badge className={getStatusColor(issue.status)}>
                                    {issue.status}
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
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">類型</h4>
                                    <div className="flex items-center">
                                        {getTypeIcon(issue.type)}
                                        <span className="ml-2">{issue.type}</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">報告日期</h4>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{formatDate(issue.reportedDate)}</span>
                                    </div>
                                </div>
                                {issue.dueDate && (
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground mb-1">截止日期</h4>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>{formatDate(issue.dueDate)}</span>
                                        </div>
                                    </div>
                                )}
                                {issue.resolvedDate && (
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground mb-1">解決日期</h4>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>{formatDate(issue.resolvedDate)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 描述 */}
                            <div>
                                <h4 className="font-medium text-sm text-muted-foreground mb-1">描述</h4>
                                <p className="text-sm bg-gray-50 p-3 rounded-md">{issue.description}</p>
                            </div>

                            {/* 解決方案 */}
                            {issue.resolution && (
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">解決方案</h4>
                                    <p className="text-sm bg-green-50 p-3 rounded-md">{issue.resolution}</p>
                                </div>
                            )}

                            {/* 附件 */}
                            {issue.attachments && issue.attachments.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-2">附件</h4>
                                    <div className="space-y-2">
                                        {issue.attachments.map((attachment, index) => (
                                            <div key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
                                                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                                <span className="text-sm">{attachment.name}</span>
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="ml-auto"
                                                    onClick={() => window.open(attachment.url, '_blank')}
                                                >
                                                    查看
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 操作按鈕 */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex space-x-2">
                                    {issue.status === '新增' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusChange('處理中')}
                                            className="text-yellow-600 hover:text-yellow-700"
                                        >
                                            <Clock className="h-4 w-4 mr-1" />
                                            開始處理
                                        </Button>
                                    )}
                                    {issue.status === '處理中' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusChange('已解決')}
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            標記解決
                                        </Button>
                                    )}
                                    {issue.status === '已解決' && (
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
