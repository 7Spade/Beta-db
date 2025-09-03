/**
 * @fileoverview 驗收記錄列表組件
 */
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Timestamp } from 'firebase/firestore';
import { CheckCircle, Clock, FileText, Plus, Search, SortAsc, SortDesc, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { AcceptanceRecord, AcceptanceStatus } from '../../types';
import { AcceptanceRecordCard } from './acceptance-record-card';
import { AcceptanceRecordForm } from './acceptance-record-form';

interface AcceptanceRecordListProps {
    acceptanceRecords: AcceptanceRecord[];
    onAcceptanceRecordCreate: (data: import('../../types/quality.types').CreateAcceptanceRecordInput) => Promise<void>;
    onAcceptanceRecordUpdate: (id: string, updates: Partial<AcceptanceRecord>) => Promise<void>;
    onAcceptanceRecordDelete: (id: string) => Promise<void>;
    isLoading?: boolean;
}

export function AcceptanceRecordList({
    acceptanceRecords,
    onAcceptanceRecordCreate,
    onAcceptanceRecordUpdate,
    onAcceptanceRecordDelete,
    isLoading = false,
}: AcceptanceRecordListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<AcceptanceStatus | 'all'>('all');
    const [sortBy, setSortBy] = useState<'submittedAt' | 'status' | 'title'>('submittedAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showCreateForm, setShowCreateForm] = useState(false);

    // 過濾和排序記錄
    const filteredRecords = (acceptanceRecords || [])
        .filter(record => {
            const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.engagementName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.applicantName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case 'submittedAt':
                    aValue = a.submittedAt instanceof Date ? a.submittedAt.getTime() :
                        a.submittedAt instanceof Timestamp ? a.submittedAt.toMillis() :
                            new Date(a.submittedAt).getTime();
                    bValue = b.submittedAt instanceof Date ? b.submittedAt.getTime() :
                        b.submittedAt instanceof Timestamp ? b.submittedAt.toMillis() :
                            new Date(b.submittedAt).getTime();
                    break;
                case 'status':
                    const statusOrder = { '草稿': 0, '待審批': 1, '已批准': 2, '已駁回': 3 };
                    aValue = statusOrder[a.status as keyof typeof statusOrder];
                    bValue = statusOrder[b.status as keyof typeof statusOrder];
                    break;
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
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

    const getStatusColor = (status: AcceptanceStatus) => {
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

    const getStatusIcon = (status: AcceptanceStatus) => {
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

    const handleCreateSuccess = () => {
        setShowCreateForm(false);
    };

    const handleCreateCancel = () => {
        setShowCreateForm(false);
    };

    if (showCreateForm) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Plus className="h-5 w-5 mr-2" />
                        創建驗收記錄
                    </CardTitle>
                    <CardDescription>
                        提交新的驗收記錄
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AcceptanceRecordForm
                        onSubmit={onAcceptanceRecordCreate}
                        onSuccess={handleCreateSuccess}
                        onCancel={handleCreateCancel}
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* 標題和操作 */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">驗收記錄</h3>
                    <p className="text-sm text-muted-foreground">
                        共 {filteredRecords.length} 筆記錄
                    </p>
                </div>
                <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    創建記錄
                </Button>
            </div>

            {/* 搜索和過濾 */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="搜索驗收記錄..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AcceptanceStatus | 'all')}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="狀態" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">全部狀態</SelectItem>
                        <SelectItem value="草稿">草稿</SelectItem>
                        <SelectItem value="待審批">待審批</SelectItem>
                        <SelectItem value="已批准">已批准</SelectItem>
                        <SelectItem value="已駁回">已駁回</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'submittedAt' | 'status' | 'title')}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="排序" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="submittedAt">提交時間</SelectItem>
                        <SelectItem value="status">狀態</SelectItem>
                        <SelectItem value="title">標題</SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
            </div>

            {/* 記錄列表 */}
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredRecords.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">沒有驗收記錄</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm || statusFilter !== 'all'
                                ? '沒有找到符合條件的驗收記錄'
                                : '還沒有創建任何驗收記錄'}
                        </p>
                        {!searchTerm && statusFilter === 'all' && (
                            <Button onClick={() => setShowCreateForm(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                創建第一個記錄
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredRecords.map((record) => (
                        <AcceptanceRecordCard
                            key={record.id}
                            record={record}
                            onUpdate={onAcceptanceRecordUpdate}
                            onDelete={onAcceptanceRecordDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
