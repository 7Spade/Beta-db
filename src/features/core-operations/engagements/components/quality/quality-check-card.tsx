/**
 * @fileoverview 品質檢查卡片組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Timestamp } from 'firebase/firestore';
import { 
    AlertTriangle, 
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
import type { QualityCheck } from '../../types';
import { formatDate } from '../../utils';

interface QualityCheckCardProps {
    check: QualityCheck;
    onUpdate: (id: string, updates: Partial<QualityCheck>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export function QualityCheckCard({ check, onUpdate, onDelete }: QualityCheckCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case '已通過':
                return 'bg-green-100 text-green-800 border-green-200';
            case '檢查中':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case '待檢查':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case '未通過':
                return 'bg-red-100 text-red-800 border-red-200';
            case '需修正':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case '已通過':
                return <CheckCircle className="h-4 w-4" />;
            case '檢查中':
                return <Clock className="h-4 w-4" />;
            case '待檢查':
                return <Clock className="h-4 w-4" />;
            case '未通過':
                return <XCircle className="h-4 w-4" />;
            case '需修正':
                return <AlertTriangle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'inspection':
                return '檢查';
            case 'review':
                return '審查';
            case 'test':
                return '測試';
            case 'audit':
                return '稽核';
            case 'other':
                return '其他';
            default:
                return type;
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
            const updates: Partial<QualityCheck> = { 
                status: newStatus as any
            };
            
            if (newStatus === '檢查中') {
                updates.actualDate = new Date();
            } else if (newStatus === '已通過' || newStatus === '未通過' || newStatus === '需修正') {
                updates.completedDate = new Date();
            }
            
            await onUpdate(check.id, updates);
        } catch (error) {
            console.error('更新狀態失敗:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('確定要刪除此品質檢查嗎？')) {
            try {
                await onDelete(check.id);
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
                                <CardTitle className="text-lg">{check.title}</CardTitle>
                                <CardDescription className="mt-1">
                                    {getTypeLabel(check.type)} • 計劃日期: {formatDate(check.plannedDate)}
                                    {check.assignedToName && ` • 負責人: ${check.assignedToName}`}
                                </CardDescription>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Badge className={getStatusColor(check.status)}>
                                    <span className="flex items-center">
                                        {getStatusIcon(check.status)}
                                        <span className="ml-1">{check.status}</span>
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
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">類型</h4>
                                    <Badge variant="outline">{getTypeLabel(check.type)}</Badge>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">計劃日期</h4>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{formatDate(check.plannedDate)}</span>
                                    </div>
                                </div>
                                {check.actualDate && (
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground mb-1">實際開始日期</h4>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>{formatDate(check.actualDate)}</span>
                                        </div>
                                    </div>
                                )}
                                {check.completedDate && (
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground mb-1">完成日期</h4>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>{formatDate(check.completedDate)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 描述 */}
                            {check.description && (
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">描述</h4>
                                    <p className="text-sm bg-gray-50 p-3 rounded-md">{check.description}</p>
                                </div>
                            )}

                            {/* 檢查標準 */}
                            {check.criteria && check.criteria.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-2">檢查標準</h4>
                                    <div className="space-y-2">
                                        {check.criteria.map((criterion, index) => (
                                            <div key={index} className="flex items-start p-3 bg-gray-50 rounded-md">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-medium text-sm">{criterion.description}</span>
                                                        <Badge 
                                                            variant="outline"
                                                            className={
                                                                criterion.status === 'met' ? 'text-green-600 border-green-200' :
                                                                criterion.status === 'not_met' ? 'text-red-600 border-red-200' :
                                                                criterion.status === 'partial' ? 'text-yellow-600 border-yellow-200' :
                                                                'text-gray-600 border-gray-200'
                                                            }
                                                        >
                                                            {criterion.status === 'met' ? '符合' :
                                                             criterion.status === 'not_met' ? '不符合' :
                                                             criterion.status === 'partial' ? '部分符合' : '不適用'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{criterion.requirement}</p>
                                                    {criterion.notes && (
                                                        <p className="text-sm mt-1">{criterion.notes}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 發現問題 */}
                            {check.findings && check.findings.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-2">發現問題</h4>
                                    <div className="space-y-2">
                                        {check.findings.map((finding, index) => (
                                            <div key={index} className="flex items-start p-3 bg-gray-50 rounded-md">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-medium text-sm">{finding.description}</span>
                                                        <Badge 
                                                            variant="outline"
                                                            className={
                                                                finding.severity === 'critical' ? 'text-red-600 border-red-200' :
                                                                finding.severity === 'high' ? 'text-orange-600 border-orange-200' :
                                                                finding.severity === 'medium' ? 'text-yellow-600 border-yellow-200' :
                                                                'text-blue-600 border-blue-200'
                                                            }
                                                        >
                                                            {finding.severity === 'critical' ? '嚴重' :
                                                             finding.severity === 'high' ? '高' :
                                                             finding.severity === 'medium' ? '中' : '低'}
                                                        </Badge>
                                                    </div>
                                                    {finding.location && (
                                                        <p className="text-sm text-muted-foreground">位置: {finding.location}</p>
                                                    )}
                                                    {finding.recommendation && (
                                                        <p className="text-sm mt-1">建議: {finding.recommendation}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 建議 */}
                            {check.recommendations && check.recommendations.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-2">建議</h4>
                                    <ul className="space-y-1">
                                        {check.recommendations.map((recommendation, index) => (
                                            <li key={index} className="text-sm bg-gray-50 p-2 rounded-md">
                                                • {recommendation}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* 附件 */}
                            {check.attachments && check.attachments.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-2">附件</h4>
                                    <div className="space-y-2">
                                        {check.attachments.map((attachment, index) => (
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
                                    {check.status === '待檢查' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusChange('檢查中')}
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            <Clock className="h-4 w-4 mr-1" />
                                            開始檢查
                                        </Button>
                                    )}
                                    {check.status === '檢查中' && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusChange('已通過')}
                                                className="text-green-600 hover:text-green-700"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                通過
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusChange('未通過')}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                不通過
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusChange('需修正')}
                                                className="text-orange-600 hover:text-orange-700"
                                            >
                                                <AlertTriangle className="h-4 w-4 mr-1" />
                                                需修正
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
