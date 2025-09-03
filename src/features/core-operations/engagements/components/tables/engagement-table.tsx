/**
 * @fileoverview 專案詳細表格組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Engagement } from '../../types';
import { formatCurrency, formatDate } from '../../utils';

interface EngagementTableProps {
    engagement: Engagement;
}

export function EngagementTable({ engagement }: EngagementTableProps) {
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
                            <TableCell className="font-medium">專案名稱</TableCell>
                            <TableCell>{engagement.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">描述</TableCell>
                            <TableCell>{engagement.description}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">客戶</TableCell>
                            <TableCell>{engagement.client}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">承包商</TableCell>
                            <TableCell>{engagement.contractor}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">客戶代表</TableCell>
                            <TableCell>{engagement.clientRepresentative || '-'}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* 狀態資訊表格 */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead colSpan={2} className="text-center">狀態資訊</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">狀態</TableCell>
                            <TableCell>
                                <Badge variant="outline">{engagement.status}</Badge>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">階段</TableCell>
                            <TableCell>
                                <Badge variant="outline">{engagement.phase}</Badge>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">開始日期</TableCell>
                            <TableCell>{formatDate(engagement.startDate)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">結束日期</TableCell>
                            <TableCell>{formatDate(engagement.endDate)}</TableCell>
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
                            <TableCell className="font-medium">總價值</TableCell>
                            <TableCell className="font-medium">
                                {formatCurrency(engagement.totalValue, engagement.currency)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">已付款</TableCell>
                            <TableCell>
                                {formatCurrency(engagement.paidAmount, engagement.currency)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">待付款</TableCell>
                            <TableCell>
                                {formatCurrency(engagement.pendingAmount, engagement.currency)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
