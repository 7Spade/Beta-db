/**
 * @fileoverview 任務列表表格組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Task } from '../../types';
import { formatCurrency, formatDate } from '../../utils';

interface TasksTableProps {
    data: Task[];
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
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

export function TasksTable({
    data,
    onView,
    onEdit,
    onDelete
}: TasksTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>任務標題</TableHead>
                        <TableHead>狀態</TableHead>
                        <TableHead>優先級</TableHead>
                        <TableHead>負責人</TableHead>
                        <TableHead>價值</TableHead>
                        <TableHead>開始日期</TableHead>
                        <TableHead>結束日期</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell className="font-medium">
                                {task.title}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" style={{ color: getStatusColor(task.status) }}>
                                    {task.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">
                                    {task.priority}
                                </Badge>
                            </TableCell>
                            <TableCell>{task.assignedTo || '未分配'}</TableCell>
                            <TableCell>
                                {formatCurrency(task.value, 'TWD')}
                            </TableCell>
                            <TableCell>{formatDate(task.startDate)}</TableCell>
                            <TableCell>{formatDate(task.endDate)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    {onView && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onView(task.id)}
                                        >
                                            查看
                                        </Button>
                                    )}
                                    {onEdit && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(task.id)}
                                        >
                                            編輯
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onDelete(task.id)}
                                        >
                                            刪除
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
