/**
 * @fileoverview 付款記錄表格
 */
'use client';

import type { Payment } from '@/features/core-operations/contracts/types';
import { Badge } from '@/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import { formatDate } from '@root/src/shared/utils';

interface PaymentsTableProps {
  payments: Payment[];
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>金額</TableHead>
          <TableHead>請求日期</TableHead>
          <TableHead>狀態</TableHead>
          <TableHead>付款日期</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.length > 0 ? (
          payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>${payment.amount.toLocaleString()}</TableCell>
              <TableCell>{formatDate(payment.requestDate)}</TableCell>
              <TableCell>
                <Badge>{payment.status}</Badge>
              </TableCell>
              <TableCell>
                {payment.paidDate
                  ? formatDate(payment.paidDate)
                  : '未付款'}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center h-24">
              尚無付款紀錄
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
