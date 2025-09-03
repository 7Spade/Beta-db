'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    Edit,
    FileText,
    MapPin,
    Play,
    Trash2,
    Users,
    Video
} from 'lucide-react';
import { useState } from 'react';
import type { Meeting, MeetingStatus } from '../../types/communication.types';

interface MeetingCardProps {
    meeting: Meeting;
    onUpdate: () => Promise<void>;
    onDelete: () => Promise<void>;
}

export function MeetingCard({ meeting, onDelete, onUpdate }: MeetingCardProps) {
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

    const getStatusColor = (status: MeetingStatus) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: MeetingStatus) => {
        switch (status) {
            case 'scheduled':
                return '已安排';
            case 'in_progress':
                return '進行中';
            case 'completed':
                return '已完成';
            case 'cancelled':
                return '已取消';
            default:
                return status;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'planning':
                return '規劃會議';
            case 'review':
                return '審查會議';
            case 'status':
                return '狀態會議';
            case 'decision':
                return '決策會議';
            case 'problem_solving':
                return '問題解決';
            default:
                return '其他';
        }
    };

    const getStatusIcon = (status: MeetingStatus) => {
        switch (status) {
            case 'scheduled':
                return <Calendar className="h-4 w-4" />;
            case 'in_progress':
                return <Play className="h-4 w-4" />;
            case 'completed':
                return <CheckCircle className="h-4 w-4" />;
            case 'cancelled':
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <Calendar className="h-4 w-4" />;
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                {getStatusIcon(meeting.status)}
                                <h4 className="font-medium text-sm truncate">{meeting.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                    {getTypeLabel(meeting.type)}
                                </Badge>
                                <Badge className={`text-xs ${getStatusColor(meeting.status)}`}>
                                    {getStatusLabel(meeting.status)}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(meeting.scheduledDate)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTime(meeting.scheduledDate)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {meeting.duration} 分鐘
                                </div>
                                {meeting.participants.length > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {meeting.participants.length} 人
                                    </div>
                                )}
                                {meeting.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {meeting.location}
                                    </div>
                                )}
                                {meeting.meetingLink && (
                                    <div className="flex items-center gap-1">
                                        <Video className="h-3 w-3" />
                                        線上會議
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
                            {/* 描述 */}
                            {meeting.description && (
                                <div>
                                    <h5 className="text-sm font-medium mb-2">描述</h5>
                                    <p className="text-sm text-gray-700">{meeting.description}</p>
                                </div>
                            )}

                            {/* 議程 */}
                            {meeting.agenda && meeting.agenda.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-medium mb-2">議程</h5>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        {meeting.agenda.map((item, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-gray-400">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* 參與者 */}
                            {meeting.participants.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-medium mb-2">參與者</h5>
                                    <div className="flex flex-wrap gap-1">
                                        {meeting.participantNames.map((name, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 會議記錄 */}
                            {meeting.minutes && (
                                <div>
                                    <h5 className="text-sm font-medium mb-2">會議記錄</h5>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {meeting.minutes}
                                    </p>
                                </div>
                            )}

                            {/* 行動項目 */}
                            {meeting.actionItems && meeting.actionItems.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-medium mb-2">行動項目</h5>
                                    <div className="space-y-2">
                                        {meeting.actionItems.map((item, index) => (
                                            <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium">{item.description}</span>
                                                    <Badge
                                                        variant={item.status === 'completed' ? 'default' : 'secondary'}
                                                        className="text-xs"
                                                    >
                                                        {item.status === 'completed' ? '已完成' :
                                                            item.status === 'in_progress' ? '進行中' : '待處理'}
                                                    </Badge>
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    負責人: {item.assignedToName} |
                                                    截止日期: {formatDate(item.dueDate)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 決策 */}
                            {meeting.decisions && meeting.decisions.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-medium mb-2">決策</h5>
                                    <div className="space-y-2">
                                        {meeting.decisions.map((decision, index) => (
                                            <div key={index} className="bg-blue-50 p-2 rounded text-sm">
                                                <div className="font-medium mb-1">{decision.description}</div>
                                                {decision.rationale && (
                                                    <div className="text-xs text-gray-600 mb-1">
                                                        理由: {decision.rationale}
                                                    </div>
                                                )}
                                                <div className="text-xs text-gray-600">
                                                    負責人: {decision.responsibleName}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 附件 */}
                            {meeting.attachments && meeting.attachments.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-medium mb-2">附件</h5>
                                    <div className="space-y-1">
                                        {meeting.attachments.map((attachment, index) => (
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

                            {/* 實際時間 */}
                            {(meeting.actualStartDate || meeting.actualEndDate) && (
                                <div>
                                    <h5 className="text-sm font-medium mb-2">實際時間</h5>
                                    <div className="text-sm text-gray-700">
                                        {meeting.actualStartDate && (
                                            <div>開始: {formatDate(meeting.actualStartDate)} {formatTime(meeting.actualStartDate)}</div>
                                        )}
                                        {meeting.actualEndDate && (
                                            <div>結束: {formatDate(meeting.actualEndDate)} {formatTime(meeting.actualEndDate)}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
