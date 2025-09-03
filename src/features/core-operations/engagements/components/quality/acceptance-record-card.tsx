/**
 * @fileoverview 驗收記錄卡片組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Timestamp } from 'firebase/firestore';
import { 
    CheckCircle, 
    ChevronDown, 
    ChevronUp, 
    Clock, 
    Edit, 
    FileText, 
    Trash2, 
    User, 
    XCircle 
} from 'lucide-react';
import { useState } from 'react';
import type { AcceptanceRecord } from '../../types';
import { formatDate } from '../../utils';

interface AcceptanceRecordCardProps {
    record: AcceptanceRecord;
    onUpdate: (id: string, updates: Partial<AcceptanceRecord>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export function AcceptanceRecordCard({ record, onUpdate, onDelete }: AcceptanceRecordCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case '已批准':
                return 'bg-green-100 text-green-800 border-green-200';
            case '待審批':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case '已駁回':
                return 'bg-red-100 text-red-800 border-red-200';
            case '草稿':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case '已批准':
                return <CheckCircle className="h-4 w-4" />;
            case '待審批':
                return <Clock className="h-4 w-4" />;
            case '已駁回':
                return <XCircle className="h-4 w-4" />;
            case '草稿':
                return <FileText className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const formatSubmittedAt = (date: Date | string | Timestamp) => {
        if (date instanceof Date) {
            return formatDate(date);
        } else if (date instanceof Timestamp) {
            return formatDate(date.toDate());
        } else {
            return formatDate(new Date(date));
        }
    };

    const formatReviewedAt = (date?: Date | string | Timestamp) => {
        if (!date) return '未審核';
        if (date instanceof Date) {
            return formatDate(date);
        } else if (date instanceof Timestamp) {
            return formatDate(date.toDate());
        } else {
            return formatDate(new Date(date));
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            await onUpdate(record.id, { 
                status: newStatus as any,
                reviewedAt: new Date(),
                reviewerId: 'current-user', // 實際應用中應該從認證系統獲取
                reviewerName: '當前用戶' // 實際應用中應該從認證系統獲取
            });
        } catch (error) {
            console.error('更新狀態失敗:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('確定要刪除此驗收記錄嗎？')) {
            try {
                await onDelete(record.id);
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
                                <CardTitle className="text-lg">{record.title}</CardTitle>
                                <CardDescription className="mt-1">
                                    {record.engagementName} • 提交數量: {record.submittedQuantity}
                                </CardDescription>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Badge className={getStatusColor(record.status)}>
                                    <span className="flex items-center">
                                        {getStatusIcon(record.status)}
                                        <span className="ml-1">{record.status}</span>
                                    </span>
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
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">申請人</h4>
                                    <div className="flex items-center">
                                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{record.applicantName}</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">提交時間</h4>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{formatSubmittedAt(record.submittedAt)}</span>
                                    </div>
                                </div>
                                {record.reviewerName && (
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground mb-1">審核人</h4>
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>{record.reviewerName}</span>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">審核時間</h4>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{formatReviewedAt(record.reviewedAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 備註 */}
                            {record.notes && (
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">備註</h4>
                                    <p className="text-sm bg-gray-50 p-3 rounded-md">{record.notes}</p>
                                </div>
                            )}

                            {/* 附件 */}
                            {record.attachments && record.attachments.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-2">附件</h4>
                                    <div className="space-y-2">
                                        {record.attachments.map((attachment, index) => (
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

                            {/* 歷史記錄 */}
                            {record.history && record.history.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-2">歷史記錄</h4>
                                    <div className="space-y-2">
                                        {record.history.map((entry, index) => (
                                            <div key={index} className="flex items-start p-3 bg-gray-50 rounded-md">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-sm">{entry.action}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatSubmittedAt(entry.timestamp)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {entry.userName}
                                                    </p>
                                                    {entry.notes && (
                                                        <p className="text-sm mt-1">{entry.notes}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 操作按鈕 */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex space-x-2">
                                    {record.status === '待審批' && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusChange('已批准')}
                                                className="text-green-600 hover:text-green-700"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                批准
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusChange('已駁回')}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                駁回
                                            </Button>
                                        </>
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
