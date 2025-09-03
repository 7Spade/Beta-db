'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    AlertCircle,
    Calendar,
    ChevronDown,
    ChevronUp,
    Clock,
    Edit,
    FileText,
    Mail,
    MessageSquare,
    MoreHorizontal,
    Phone,
    Trash2,
    Users
} from 'lucide-react';
import { useState } from 'react';
import type { Communication } from '../../types/communication.types';

interface CommunicationCardProps {
    communication: Communication;
    onUpdate: () => Promise<void>;
    onDelete: () => Promise<void>;
}

export function CommunicationCard({ communication, onUpdate, onDelete }: CommunicationCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatDate = (date: Date | any) => {
        if (date instanceof Date) {
            return date.toLocaleDateString('zh-TW');
        } else if (date && date.toDate) {
            return date.toDate().toLocaleDateString('zh-TW');
        } else if (date) {
            return new Date(date).toLocaleDateString('zh-TW');
        }
        return '';
    };

    const formatTime = (date: Date | any) => {
        if (date instanceof Date) {
            return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
        } else if (date && date.toDate) {
            return date.toDate().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
        } else if (date) {
            return new Date(date).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
        }
        return '';
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'email':
                return <Mail className="h-4 w-4" />;
            case 'phone':
                return <Phone className="h-4 w-4" />;
            case 'meeting':
                return <Users className="h-4 w-4" />;
            case 'message':
                return <MessageSquare className="h-4 w-4" />;
            case 'document':
                return <FileText className="h-4 w-4" />;
            default:
                return <MoreHorizontal className="h-4 w-4" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'email':
                return '郵件';
            case 'phone':
                return '電話';
            case 'meeting':
                return '會議';
            case 'message':
                return '訊息';
            case 'document':
                return '文件';
            default:
                return '其他';
        }
    };

    const getDirectionLabel = (direction: string) => {
        switch (direction) {
            case 'inbound':
                return '接收';
            case 'outbound':
                return '發送';
            case 'internal':
                return '內部';
            default:
                return direction;
        }
    };

    const getDirectionColor = (direction: string) => {
        switch (direction) {
            case 'inbound':
                return 'bg-blue-100 text-blue-800';
            case 'outbound':
                return 'bg-green-100 text-green-800';
            case 'internal':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                {getTypeIcon(communication.type)}
                                <h4 className="font-medium text-sm truncate">{communication.subject}</h4>
                                <Badge variant="outline" className="text-xs">
                                    {getTypeLabel(communication.type)}
                                </Badge>
                                <Badge className={`text-xs ${getDirectionColor(communication.direction)}`}>
                                    {getDirectionLabel(communication.direction)}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(communication.date)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTime(communication.date)}
                                </div>
                                {communication.duration && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {communication.duration} 分鐘
                                    </div>
                                )}
                                {communication.participants.length > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {communication.participants.length} 人
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onUpdate}
                                className="h-8 w-8 p-0"
                            >
                                <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onDelete}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                    </div>
                </CardHeader>

                <CollapsibleContent>
                    <CardContent className="pt-0">
                        <div className="space-y-3">
                            {/* 內容 */}
                            <div>
                                <h5 className="text-sm font-medium mb-2">內容</h5>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {communication.content}
                                </p>
                            </div>

                            {/* 參與者 */}
                            {communication.participants.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-medium mb-2">參與者</h5>
                                    <div className="flex flex-wrap gap-1">
                                        {communication.participantNames.map((name, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 附件 */}
                            {communication.attachments && communication.attachments.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-medium mb-2">附件</h5>
                                    <div className="space-y-1">
                                        {communication.attachments.map((attachment, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm">
                                                <FileText className="h-3 w-3 text-gray-400" />
                                                <a
                                                    href={attachment.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {attachment.name}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 後續行動 */}
                            {communication.followUpRequired && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                                        <h5 className="text-sm font-medium text-yellow-800">需要後續行動</h5>
                                    </div>
                                    {communication.followUpDate && (
                                        <p className="text-xs text-yellow-700 mb-1">
                                            後續日期: {formatDate(communication.followUpDate)}
                                        </p>
                                    )}
                                    {communication.followUpNotes && (
                                        <p className="text-xs text-yellow-700">
                                            {communication.followUpNotes}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
