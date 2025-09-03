/**
 * @fileoverview 任務詳細表格組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Task } from '../../types';
import { formatCurrency, formatDate } from '../../utils';

interface TaskTableProps {
    task: Task;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case '已完成': return '#00C49F';
        case '進行中': return '#FFBB28';
        case '待處理': return '#8884D8';
        case '已取消': return '#FF8042';
        default: return '#6B7280';
    }
};

export function TaskTable({ task }: TaskTableProps) {
    return (
        <div className="space-y-4">
            {/* 基本資訊表格 */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead colSpan={2} className="text-center">基本資訊</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">任務標題</TableCell>
                            <TableCell>{task.title}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">描述</TableCell>
                            <TableCell>{task.description || '-'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">狀態</TableCell>
                            <TableCell>
                                <Badge variant="outline" style={{ color: getStatusColor(task.status) }}>
                                    {task.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">優先級</TableCell>
                            <TableCell>
                                <Badge variant="outline">{task.priority}</Badge>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">負責人</TableCell>
                            <TableCell>{task.assignedTo || '未分配'}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* 時間資訊表格 */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead colSpan={2} className="text-center">時間資訊</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">開始日期</TableCell>
                            <TableCell>{formatDate(task.startDate)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">結束日期</TableCell>
                            <TableCell>{formatDate(task.endDate)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">創建時間</TableCell>
                            <TableCell>{formatDate(task.createdAt)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">更新時間</TableCell>
                            <TableCell>{formatDate(task.updatedAt)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* 財務資訊表格 */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead colSpan={2} className="text-center">財務資訊</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">數量</TableCell>
                            <TableCell>{task.quantity}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">已完成數量</TableCell>
                            <TableCell>{task.completedQuantity}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">單價</TableCell>
                            <TableCell>{formatCurrency(task.unitPrice, 'TWD')}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">折扣</TableCell>
                            <TableCell>{formatCurrency(task.discount, 'TWD')}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">總價值</TableCell>
                            <TableCell className="font-medium">
                                {formatCurrency(task.value, 'TWD')}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
