/**
 * @fileoverview 收款表格組件
 */
'use client';

import { ContractStatusBadge } from '@/features/(core-operations)/contracts/components';
import type { Receipt } from '@/features/(core-operations)/contracts/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import { formatDate } from '@/utils';

interface ReceiptsTableProps {
  receipts: Receipt[];
}

export function ReceiptsTable({ receipts }: ReceiptsTableProps) {
  if (!receipts || receipts.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>金額</TableHead>
            <TableHead>請求日期</TableHead>
            <TableHead>狀態</TableHead>
            <TableHead>收款日期</TableHead>
            <TableHead>發票號碼</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-center h-24">
              尚無收款紀錄
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>金額</TableHead>
          <TableHead>請求日期</TableHead>
          <TableHead>狀態</TableHead>
          <TableHead>收款日期</TableHead>
          <TableHead>發票號碼</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {receipts.map((receipt) => (
          <TableRow key={receipt.id}>
            <TableCell>${receipt.amount.toLocaleString()}</TableCell>
            <TableCell>
              {formatDate(
                receipt.requestDate instanceof Date
                  ? receipt.requestDate
                  : receipt.requestDate?.toDate()
              )}
            </TableCell>
            <TableCell>
              <ContractStatusBadge
                status={
                  receipt.status as '啟用中' | '已完成' | '暫停中' | '已終止'
                }
              />
            </TableCell>
            <TableCell>
              {receipt.receivedDate
                ? formatDate(
                  receipt.receivedDate instanceof Date
                    ? receipt.receivedDate
                    : receipt.receivedDate?.toDate()
                )
                : '未收款'}
            </TableCell>
            <TableCell>{receipt.invoiceNumber || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
