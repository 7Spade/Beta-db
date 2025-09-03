/**
 * @fileoverview 付款記錄表格組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Payment } from '../../types';
import { formatCurrency, formatDate } from '../../utils';

interface PaymentsTableProps {
    data: Payment[];
}

const getStatusColor = (status: string) => {
    switch (status) {
        case '已付款': return '#00C49F';
        case '待付款': return '#FFBB28';
        case '逾期': return '#FF8042';
        default: return '#6B7280';
    }
};

export function PaymentsTable({ data }: PaymentsTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>付款日期</TableHead>
                        <TableHead>金額</TableHead>
                        <TableHead>狀態</TableHead>
                        <TableHead>付款方式</TableHead>
                        <TableHead>備註</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell>{formatDate(payment.date)}</TableCell>
                            <TableCell className="font-medium">
                                {formatCurrency(payment.amount, payment.currency)}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" style={{ color: getStatusColor(payment.status) }}>
                                    {payment.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{payment.method}</TableCell>
                            <TableCell className="max-w-xs truncate">
                                {payment.notes || '-'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
