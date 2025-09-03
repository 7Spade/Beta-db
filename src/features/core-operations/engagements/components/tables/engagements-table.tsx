/**
 * @fileoverview 專案列表表格組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { EngagementSummary } from '../../types';
import { formatCurrency, formatDate, getPhaseColor, getStatusColor } from '../../utils';

interface EngagementsTableProps {
    data: EngagementSummary[];
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function EngagementsTable({
    data,
    onView,
    onEdit,
    onDelete
}: EngagementsTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>專案名稱</TableHead>
                        <TableHead>客戶</TableHead>
                        <TableHead>狀態</TableHead>
                        <TableHead>階段</TableHead>
                        <TableHead>總價值</TableHead>
                        <TableHead>開始日期</TableHead>
                        <TableHead>結束日期</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((engagement) => (
                        <TableRow key={engagement.id}>
                            <TableCell className="font-medium">
                                {engagement.name}
                            </TableCell>
                            <TableCell>{engagement.client}</TableCell>
                            <TableCell>
                                <Badge variant="outline" style={{ color: getStatusColor(engagement.status) }}>
                                    {engagement.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" style={{ color: getPhaseColor(engagement.phase) }}>
                                    {engagement.phase}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {formatCurrency(engagement.totalValue, engagement.currency)}
                            </TableCell>
                            <TableCell>{formatDate(engagement.startDate)}</TableCell>
                            <TableCell>{formatDate(engagement.endDate)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    {onView && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onView(engagement.id)}
                                        >
                                            查看
                                        </Button>
                                    )}
                                    {onEdit && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(engagement.id)}
                                        >
                                            編輯
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onDelete(engagement.id)}
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
