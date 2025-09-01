/**
 * @fileoverview Stock Level Table
 * @description Displays the stock levels for a specific warehouse.
 */
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';

// Placeholder content for the stock level table
export function StockLevelTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>物料名稱</TableHead>
          <TableHead>分類</TableHead>
          <TableHead className="text-right">目前庫存</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="text-center h-24">
            選擇一個倉庫以查看庫存。
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
