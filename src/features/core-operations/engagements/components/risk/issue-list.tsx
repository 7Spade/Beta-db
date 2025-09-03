/**
 * @fileoverview 問題列表組件
 */
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Timestamp } from 'firebase/firestore';
import {
    AlertCircle,
    Bug,
    FileText,
    Plus,
    Search,
    SortAsc,
    SortDesc
} from 'lucide-react';
import { useState } from 'react';
import type { Issue, IssuePriority, IssueStatus, IssueType } from '../../types';
import { IssueCard } from './issue-card';
import { IssueForm } from './issue-form';

interface IssueListProps {
    issues: Issue[];
    onIssueCreate: (data: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => Promise<void>;
    onIssueUpdate: (id: string, updates: Partial<Issue>) => Promise<void>;
    onIssueDelete: (id: string) => Promise<void>;
    isLoading?: boolean;
}

export function IssueList({
    issues,
    onIssueCreate,
    onIssueUpdate,
    onIssueDelete,
    isLoading = false,
}: IssueListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
    const [priorityFilter, setPriorityFilter] = useState<IssuePriority | 'all'>('all');
    const [typeFilter, setTypeFilter] = useState<IssueType | 'all'>('all');
    const [sortBy, setSortBy] = useState<'reportedDate' | 'status' | 'priority' | 'title'>('reportedDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showCreateForm, setShowCreateForm] = useState(false);

    // 過濾和排序問題
    const filteredIssues = issues
        .filter(issue => {
            const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                issue.reportedByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                issue.assignedToName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
            const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
            const matchesType = typeFilter === 'all' || issue.type === typeFilter;
            return matchesSearch && matchesStatus && matchesPriority && matchesType;
        })
        .sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case 'reportedDate':
                    aValue = a.reportedDate instanceof Date ? a.reportedDate.getTime() :
                        a.reportedDate instanceof Timestamp ? a.reportedDate.toMillis() :
                            new Date(a.reportedDate).getTime();
                    bValue = b.reportedDate instanceof Date ? b.reportedDate.getTime() :
                        b.reportedDate instanceof Timestamp ? b.reportedDate.toMillis() :
                            new Date(b.reportedDate).getTime();
                    break;
                case 'status':
                    const statusOrder = { '新增': 0, '處理中': 1, '已解決': 2, '已關閉': 3 };
                    aValue = statusOrder[a.status as keyof typeof statusOrder];
                    bValue = statusOrder[b.status as keyof typeof statusOrder];
                    break;
                case 'priority':
                    const priorityOrder = { '低': 0, '中': 1, '高': 2, '緊急': 3 };
                    aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
                    bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
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

    const getPriorityColor = (priority: IssuePriority) => {
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

    const getStatusColor = (status: IssueStatus) => {
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

    const getTypeIcon = (type: IssueType) => {
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
                        創建問題
                    </CardTitle>
                    <CardDescription>
                        報告和記錄新的問題
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <IssueForm
                        onSubmit={onIssueCreate}
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
                    <h3 className="text-lg font-semibold">問題管理</h3>
                    <p className="text-sm text-muted-foreground">
                        共 {filteredIssues.length} 個問題
                    </p>
                </div>
                <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    創建問題
                </Button>
            </div>

            {/* 搜索和過濾 */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="搜索問題..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as IssueStatus | 'all')}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="狀態" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">全部狀態</SelectItem>
                        <SelectItem value="新增">新增</SelectItem>
                        <SelectItem value="處理中">處理中</SelectItem>
                        <SelectItem value="已解決">已解決</SelectItem>
                        <SelectItem value="已關閉">已關閉</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as IssuePriority | 'all')}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="優先級" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">全部優先級</SelectItem>
                        <SelectItem value="低">低</SelectItem>
                        <SelectItem value="中">中</SelectItem>
                        <SelectItem value="高">高</SelectItem>
                        <SelectItem value="緊急">緊急</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as IssueType | 'all')}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="類型" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">全部類型</SelectItem>
                        <SelectItem value="缺陷">缺陷</SelectItem>
                        <SelectItem value="變更請求">變更請求</SelectItem>
                        <SelectItem value="問題">問題</SelectItem>
                        <SelectItem value="改進建議">改進建議</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'reportedDate' | 'status' | 'priority' | 'title')}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="排序" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="reportedDate">報告日期</SelectItem>
                        <SelectItem value="status">狀態</SelectItem>
                        <SelectItem value="priority">優先級</SelectItem>
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

            {/* 問題列表 */}
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
            ) : filteredIssues.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">沒有問題記錄</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all'
                                ? '沒有找到符合條件的問題'
                                : '還沒有報告任何問題'}
                        </p>
                        {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && typeFilter === 'all' && (
                            <Button onClick={() => setShowCreateForm(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                報告第一個問題
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredIssues.map((issue) => (
                        <IssueCard
                            key={issue.id}
                            issue={issue}
                            onUpdate={onIssueUpdate}
                            onDelete={onIssueDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
