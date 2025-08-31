/**
 * @fileoverview 變更單表格
 */
'use client';

import type { ChangeOrder } from '@/features/(core-operations)/contracts/types';
import { Badge } from '@/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import { formatDate } from '@/utils';

interface ChangeOrdersTableProps {
  changeOrders: ChangeOrder[];
}

export function ChangeOrdersTable({ changeOrders }: ChangeOrdersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>標題</TableHead>
          <TableHead>日期</TableHead>
          <TableHead>狀態</TableHead>
          <TableHead>成本影響</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {changeOrders.length > 0 ? (
          changeOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.title}</TableCell>
              <TableCell>{formatDate(order.date)}</TableCell>
              <TableCell>
                <Badge>{order.status}</Badge>
              </TableCell>
              <TableCell>${order.impact.cost.toLocaleString()}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center h-24">
              尚無變更單紀錄
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
