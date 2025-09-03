'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import type { Meeting, MeetingStatus, MeetingType } from '../../types/communication.types';
import { MeetingCard } from './meeting-card';
import { MeetingForm } from './meeting-form';

interface MeetingListProps {
    meetings: Meeting[];
    onMeetingCreate: () => Promise<void>;
    onMeetingUpdate: () => Promise<void>;
    onMeetingDelete: () => Promise<void>;
    isLoading?: boolean;
}

export function MeetingList({
    meetings,
    onMeetingCreate,
    onMeetingUpdate,
    onMeetingDelete,
    isLoading = false,
}: MeetingListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<MeetingType | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<MeetingStatus | 'all'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'type' | 'title'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [showForm, setShowForm] = useState(false);

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

    const filteredMeetings = (meetings || [])
        .filter(meeting => {
            const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (meeting.description && meeting.description.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesType = typeFilter === 'all' || meeting.type === typeFilter;
            const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;

            return matchesSearch && matchesType && matchesStatus;
        })
        .sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case 'date':
                    aValue = a.scheduledDate instanceof Date ? a.scheduledDate.getTime() :
                        a.scheduledDate && a.scheduledDate.toMillis ? a.scheduledDate.toMillis() :
                            new Date(a.scheduledDate).getTime();
                    bValue = b.scheduledDate instanceof Date ? b.scheduledDate.getTime() :
                        b.scheduledDate && b.scheduledDate.toMillis ? b.scheduledDate.toMillis() :
                            new Date(b.scheduledDate).getTime();
                    break;
                case 'type':
                    aValue = a.type;
                    bValue = b.type;
                    break;
                case 'title':
                    aValue = a.title;
                    bValue = b.title;
                    break;
                default:
                    return 0;
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    const handleCreate = async () => {
        await onMeetingCreate();
        setShowForm(false);
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

    const getTypeLabel = (type: MeetingType) => {
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

    return (
        <div className="space-y-4">
            {/* 標題和操作 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">會議管理</h3>
                    <Badge variant="secondary">{filteredMeetings.length}</Badge>
                </div>
                <Button onClick={() => setShowForm(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    新增會議
                </Button>
            </div>

            {/* 搜索和篩選 */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="搜索會議..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as MeetingType | 'all')}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="類型" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">所有類型</SelectItem>
                                <SelectItem value="planning">規劃會議</SelectItem>
                                <SelectItem value="review">審查會議</SelectItem>
                                <SelectItem value="status">狀態會議</SelectItem>
                                <SelectItem value="decision">決策會議</SelectItem>
                                <SelectItem value="problem_solving">問題解決</SelectItem>
                                <SelectItem value="other">其他</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as MeetingStatus | 'all')}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="狀態" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">所有狀態</SelectItem>
                                <SelectItem value="scheduled">已安排</SelectItem>
                                <SelectItem value="in_progress">進行中</SelectItem>
                                <SelectItem value="completed">已完成</SelectItem>
                                <SelectItem value="cancelled">已取消</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                            const [field, order] = value.split('-');
                            setSortBy(field as 'date' | 'type' | 'title');
                            setSortOrder(order as 'asc' | 'desc');
                        }}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="排序" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date-asc">日期 (早到晚)</SelectItem>
                                <SelectItem value="date-desc">日期 (晚到早)</SelectItem>
                                <SelectItem value="type-asc">類型 (A-Z)</SelectItem>
                                <SelectItem value="type-desc">類型 (Z-A)</SelectItem>
                                <SelectItem value="title-asc">標題 (A-Z)</SelectItem>
                                <SelectItem value="title-desc">標題 (Z-A)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* 會議列表 */}
            <div className="space-y-3">
                {isLoading ? (
                    <div className="text-center py-8 text-gray-500">載入中...</div>
                ) : filteredMeetings.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-gray-500">
                            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>沒有找到會議</p>
                            <p className="text-sm">點擊上方按鈕新增第一場會議</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredMeetings.map((meeting) => (
                        <MeetingCard
                            key={meeting.id}
                            meeting={meeting}
                            onUpdate={onMeetingUpdate}
                            onDelete={onMeetingDelete}
                        />
                    ))
                )}
            </div>

            {/* 新增表單 */}
            {showForm && (
                <MeetingForm
                    onSave={handleCreate}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
}
