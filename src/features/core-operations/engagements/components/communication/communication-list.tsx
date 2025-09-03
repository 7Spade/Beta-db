'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import type { Communication, CommunicationDirection, CommunicationType } from '../../types/communication.types';
import { CommunicationCard } from './communication-card';
import { CommunicationForm } from './communication-form';

interface CommunicationListProps {
    communications: Communication[];
    onCommunicationCreate: () => Promise<void>;
    onCommunicationUpdate: () => Promise<void>;
    onCommunicationDelete: () => Promise<void>;
    isLoading?: boolean;
}

export function CommunicationList({
    communications,
    onCommunicationCreate,
    onCommunicationUpdate,
    onCommunicationDelete,
    isLoading = false,
}: CommunicationListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<CommunicationType | 'all'>('all');
    const [directionFilter, setDirectionFilter] = useState<CommunicationDirection | 'all'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'type' | 'subject'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
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

    const filteredCommunications = (communications || [])
        .filter(communication => {
            const matchesSearch = communication.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                communication.content.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === 'all' || communication.type === typeFilter;
            const matchesDirection = directionFilter === 'all' || communication.direction === directionFilter;

            return matchesSearch && matchesType && matchesDirection;
        })
        .sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case 'date':
                    aValue = a.date instanceof Date ? a.date.getTime() :
                        a.date && a.date.toMillis ? a.date.toMillis() :
                            new Date(a.date).getTime();
                    bValue = b.date instanceof Date ? b.date.getTime() :
                        b.date && b.date.toMillis ? b.date.toMillis() :
                            new Date(b.date).getTime();
                    break;
                case 'type':
                    aValue = a.type;
                    bValue = b.type;
                    break;
                case 'subject':
                    aValue = a.subject;
                    bValue = b.subject;
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
        await onCommunicationCreate();
        setShowForm(false);
    };

    return (
        <div className="space-y-4">
            {/* 標題和操作 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">溝通記錄</h3>
                    <Badge variant="secondary">{filteredCommunications.length}</Badge>
                </div>
                <Button onClick={() => setShowForm(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    新增溝通記錄
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
                                    placeholder="搜索溝通記錄..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as CommunicationType | 'all')}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="類型" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">所有類型</SelectItem>
                                <SelectItem value="email">郵件</SelectItem>
                                <SelectItem value="meeting">會議</SelectItem>
                                <SelectItem value="phone">電話</SelectItem>
                                <SelectItem value="message">訊息</SelectItem>
                                <SelectItem value="document">文件</SelectItem>
                                <SelectItem value="other">其他</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={directionFilter} onValueChange={(value) => setDirectionFilter(value as CommunicationDirection | 'all')}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="方向" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">所有方向</SelectItem>
                                <SelectItem value="inbound">接收</SelectItem>
                                <SelectItem value="outbound">發送</SelectItem>
                                <SelectItem value="internal">內部</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                            const [field, order] = value.split('-');
                            setSortBy(field as 'date' | 'type' | 'subject');
                            setSortOrder(order as 'asc' | 'desc');
                        }}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="排序" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date-desc">日期 (新到舊)</SelectItem>
                                <SelectItem value="date-asc">日期 (舊到新)</SelectItem>
                                <SelectItem value="type-asc">類型 (A-Z)</SelectItem>
                                <SelectItem value="type-desc">類型 (Z-A)</SelectItem>
                                <SelectItem value="subject-asc">標題 (A-Z)</SelectItem>
                                <SelectItem value="subject-desc">標題 (Z-A)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* 溝通記錄列表 */}
            <div className="space-y-3">
                {isLoading ? (
                    <div className="text-center py-8 text-gray-500">載入中...</div>
                ) : filteredCommunications.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>沒有找到溝通記錄</p>
                            <p className="text-sm">點擊上方按鈕新增第一筆溝通記錄</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredCommunications.map((communication) => (
                        <CommunicationCard
                            key={communication.id}
                            communication={communication}
                            onUpdate={onCommunicationUpdate}
                            onDelete={onCommunicationDelete}
                        />
                    ))
                )}
            </div>

            {/* 新增表單 */}
            {showForm && (
                <CommunicationForm
                    onSave={handleCreate}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
}
