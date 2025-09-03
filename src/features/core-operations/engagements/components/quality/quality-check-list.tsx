/**
 * @fileoverview 品質檢查列表組件
 */
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Timestamp } from 'firebase/firestore';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    FileText,
    Plus,
    Search,
    SortAsc,
    SortDesc,
    XCircle
} from 'lucide-react';
import { useState } from 'react';
import type { QualityCheck, QualityCheckStatus } from '../../types';
import { QualityCheckCard } from './quality-check-card';
import { QualityCheckForm } from './quality-check-form';

interface QualityCheckListProps {
    qualityChecks: QualityCheck[];
    onQualityCheckCreate: (data: import('../../types/quality.types').CreateQualityCheckInput) => Promise<void>;
    onQualityCheckUpdate: (id: string, updates: Partial<QualityCheck>) => Promise<void>;
    onQualityCheckDelete: (id: string) => Promise<void>;
    isLoading?: boolean;
}

export function QualityCheckList({
    qualityChecks,
    onQualityCheckCreate,
    onQualityCheckUpdate,
    onQualityCheckDelete,
    isLoading = false,
}: QualityCheckListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<QualityCheckStatus | 'all'>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'plannedDate' | 'status' | 'title'>('plannedDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [showCreateForm, setShowCreateForm] = useState(false);

    // 過濾和排序檢查
    const filteredChecks = (qualityChecks || [])
        .filter(check => {
            const matchesSearch = check.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                check.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                check.assignedToName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || check.status === statusFilter;
            const matchesType = typeFilter === 'all' || check.type === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        })
        .sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case 'plannedDate':
                    aValue = a.plannedDate instanceof Date ? a.plannedDate.getTime() :
                        a.plannedDate instanceof Timestamp ? a.plannedDate.toMillis() :
                            new Date(a.plannedDate).getTime();
                    bValue = b.plannedDate instanceof Date ? b.plannedDate.getTime() :
                        b.plannedDate instanceof Timestamp ? b.plannedDate.toMillis() :
                            new Date(b.plannedDate).getTime();
                    break;
                case 'status':
                    const statusOrder = { '待檢查': 0, '檢查中': 1, '已通過': 2, '未通過': 3, '需修正': 4 };
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

    const getStatusColor = (status: QualityCheckStatus) => {
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

    const getStatusIcon = (status: QualityCheckStatus) => {
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
                        創建品質檢查
                    </CardTitle>
                    <CardDescription>
                        安排新的品質檢查
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <QualityCheckForm
                        onSubmit={onQualityCheckCreate}
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
                    <h3 className="text-lg font-semibold">品質檢查</h3>
                    <p className="text-sm text-muted-foreground">
                        共 {filteredChecks.length} 項檢查
                    </p>
                </div>
                <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    創建檢查
                </Button>
            </div>

            {/* 搜索和過濾 */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="搜索品質檢查..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as QualityCheckStatus | 'all')}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="狀態" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">全部狀態</SelectItem>
                        <SelectItem value="待檢查">待檢查</SelectItem>
                        <SelectItem value="檢查中">檢查中</SelectItem>
                        <SelectItem value="已通過">已通過</SelectItem>
                        <SelectItem value="未通過">未通過</SelectItem>
                        <SelectItem value="需修正">需修正</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="類型" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">全部類型</SelectItem>
                        <SelectItem value="inspection">檢查</SelectItem>
                        <SelectItem value="review">審查</SelectItem>
                        <SelectItem value="test">測試</SelectItem>
                        <SelectItem value="audit">稽核</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'plannedDate' | 'status' | 'title')}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="排序" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="plannedDate">計劃日期</SelectItem>
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

            {/* 檢查列表 */}
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
            ) : filteredChecks.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">沒有品質檢查</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                                ? '沒有找到符合條件的品質檢查'
                                : '還沒有創建任何品質檢查'}
                        </p>
                        {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                            <Button onClick={() => setShowCreateForm(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                創建第一個檢查
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredChecks.map((check) => (
                        <QualityCheckCard
                            key={check.id}
                            check={check}
                            onUpdate={onQualityCheckUpdate}
                            onDelete={onQualityCheckDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
