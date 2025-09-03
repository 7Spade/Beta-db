/**
 * @fileoverview 風險列表組件
 */
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Timestamp } from 'firebase/firestore';
import {
    AlertTriangle,
    Clock,
    Plus,
    Search,
    SortAsc,
    SortDesc,
    TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import type { Risk, RiskCategory, RiskLevel, RiskStatus } from '../../types';
import { RiskCard } from './risk-card';
import { RiskForm } from './risk-form';

interface RiskListProps {
    risks: Risk[];
    onRiskCreate: (data: Omit<Risk, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => Promise<void>;
    onRiskUpdate: (id: string, updates: Partial<Risk>) => Promise<void>;
    onRiskDelete: (id: string) => Promise<void>;
    isLoading?: boolean;
}

export function RiskList({
    risks,
    onRiskCreate,
    onRiskUpdate,
    onRiskDelete,
    isLoading = false,
}: RiskListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<RiskStatus | 'all'>('all');
    const [levelFilter, setLevelFilter] = useState<RiskLevel | 'all'>('all');
    const [categoryFilter, setCategoryFilter] = useState<RiskCategory | 'all'>('all');
    const [sortBy, setSortBy] = useState<'riskScore' | 'status' | 'title' | 'identifiedDate'>('riskScore');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showCreateForm, setShowCreateForm] = useState(false);

    // 過濾和排序風險
    const filteredRisks = risks
        .filter(risk => {
            const matchesSearch = risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                risk.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                risk.ownerName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || risk.status === statusFilter;
            const matchesLevel = levelFilter === 'all' || risk.level === levelFilter;
            const matchesCategory = categoryFilter === 'all' || risk.category === categoryFilter;
            return matchesSearch && matchesStatus && matchesLevel && matchesCategory;
        })
        .sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case 'riskScore':
                    aValue = a.riskScore;
                    bValue = b.riskScore;
                    break;
                case 'identifiedDate':
                    aValue = a.identifiedDate instanceof Date ? a.identifiedDate.getTime() :
                        a.identifiedDate instanceof Timestamp ? a.identifiedDate.toMillis() :
                            new Date(a.identifiedDate).getTime();
                    bValue = b.identifiedDate instanceof Date ? b.identifiedDate.getTime() :
                        b.identifiedDate instanceof Timestamp ? b.identifiedDate.toMillis() :
                            new Date(b.identifiedDate).getTime();
                    break;
                case 'status':
                    const statusOrder = { '已識別': 0, '評估中': 1, '已緩解': 2, '已接受': 3, '已關閉': 4 };
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

    const getLevelColor = (level: RiskLevel) => {
        switch (level) {
            case '極高':
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

    const getStatusColor = (status: RiskStatus) => {
        switch (status) {
            case '已關閉':
                return 'bg-green-100 text-green-800 border-green-200';
            case '已緩解':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case '已接受':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case '評估中':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case '已識別':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getLevelIcon = (level: RiskLevel) => {
        switch (level) {
            case '極高':
                return <AlertTriangle className="h-4 w-4" />;
            case '高':
                return <AlertTriangle className="h-4 w-4" />;
            case '中':
                return <TrendingUp className="h-4 w-4" />;
            case '低':
                return <Clock className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
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
                        創建風險
                    </CardTitle>
                    <CardDescription>
                        識別和記錄新的風險
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RiskForm
                        onSubmit={onRiskCreate}
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
                    <h3 className="text-lg font-semibold">風險管理</h3>
                    <p className="text-sm text-muted-foreground">
                        共 {filteredRisks.length} 個風險
                    </p>
                </div>
                <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    創建風險
                </Button>
            </div>

            {/* 搜索和過濾 */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="搜索風險..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as RiskStatus | 'all')}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="狀態" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">全部狀態</SelectItem>
                        <SelectItem value="已識別">已識別</SelectItem>
                        <SelectItem value="評估中">評估中</SelectItem>
                        <SelectItem value="已緩解">已緩解</SelectItem>
                        <SelectItem value="已接受">已接受</SelectItem>
                        <SelectItem value="已關閉">已關閉</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={levelFilter} onValueChange={(value) => setLevelFilter(value as RiskLevel | 'all')}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="風險等級" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">全部等級</SelectItem>
                        <SelectItem value="低">低</SelectItem>
                        <SelectItem value="中">中</SelectItem>
                        <SelectItem value="高">高</SelectItem>
                        <SelectItem value="極高">極高</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as RiskCategory | 'all')}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="類別" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">全部類別</SelectItem>
                        <SelectItem value="技術">技術</SelectItem>
                        <SelectItem value="財務">財務</SelectItem>
                        <SelectItem value="進度">進度</SelectItem>
                        <SelectItem value="品質">品質</SelectItem>
                        <SelectItem value="資源">資源</SelectItem>
                        <SelectItem value="外部">外部</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'riskScore' | 'status' | 'title' | 'identifiedDate')}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="排序" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="riskScore">風險分數</SelectItem>
                        <SelectItem value="status">狀態</SelectItem>
                        <SelectItem value="title">標題</SelectItem>
                        <SelectItem value="identifiedDate">識別日期</SelectItem>
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

            {/* 風險列表 */}
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
            ) : filteredRisks.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">沒有風險記錄</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm || statusFilter !== 'all' || levelFilter !== 'all' || categoryFilter !== 'all'
                                ? '沒有找到符合條件的風險'
                                : '還沒有識別任何風險'}
                        </p>
                        {!searchTerm && statusFilter === 'all' && levelFilter === 'all' && categoryFilter === 'all' && (
                            <Button onClick={() => setShowCreateForm(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                識別第一個風險
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredRisks.map((risk) => (
                        <RiskCard
                            key={risk.id}
                            risk={risk}
                            onUpdate={onRiskUpdate}
                            onDelete={onRiskDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
