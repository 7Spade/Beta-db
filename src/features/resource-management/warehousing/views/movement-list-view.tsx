/**
 * @fileoverview Movement List View in a Dialog
 * @description Displays inventory movements in a dialog for better user experience.
 */
'use client';

import { Badge } from '@/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import type {
  InventoryItem,
  InventoryMovement,
  Warehouse,
} from '@root/src/shared/types/types';
import { formatDate } from '@root/src/shared/utils';
import { ArrowLeftRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Input } from '@/ui/input';

interface MovementListViewProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialMovements: InventoryMovement[];
  initialItems: InventoryItem[];
  initialWarehouses: Warehouse[];
  filterByItemId?: string; // Optional filter
}

export function MovementListView({
  isOpen,
  onOpenChange,
  initialMovements,
  initialItems,
  initialWarehouses,
  filterByItemId,
}: MovementListViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const itemMap = useMemo(
    () => new Map(initialItems.map((i) => [i.id, i.name])),
    [initialItems]
  );
  const warehouseMap = useMemo(
    () => new Map(initialWarehouses.map((w) => [w.id, w.name])),
    [initialWarehouses]
  );

  const filteredMovements = useMemo(() => {
    let movements = filterByItemId
      ? initialMovements.filter((m) => m.item_id === filterByItemId)
      : initialMovements;

    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      movements = movements.filter(
        (m) =>
          itemMap.get(m.item_id)?.toLowerCase().includes(lowercasedFilter) ||
          warehouseMap
            .get(m.warehouse_id)
            ?.toLowerCase()
            .includes(lowercasedFilter) ||
          m.notes?.toLowerCase().includes(lowercasedFilter) ||
          m.operator_id?.toLowerCase().includes(lowercasedFilter)
      );
    }
    return movements;
  }, [initialMovements, filterByItemId, searchTerm, itemMap, warehouseMap]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {filterByItemId
              ? `${itemMap.get(filterByItemId) || '物料'} `
              : '所有'}
            出入庫紀錄
          </DialogTitle>
          <DialogDescription>
            {filterByItemId
              ? '此物料的所有庫存移動歷史。'
              : '所有物料的庫存移動流水帳。'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-shrink-0">
          <Input
            placeholder="搜尋物料、倉庫、備註..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-grow overflow-y-auto">
          {filteredMovements.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center justify-center h-full">
              <ArrowLeftRight className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">尚無庫存紀錄</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                沒有符合條件的庫存移動歷史。
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>類型</TableHead>
                  <TableHead>物料</TableHead>
                  <TableHead>倉庫</TableHead>
                  <TableHead className="text-right">數量</TableHead>
                  <TableHead>操作員</TableHead>
                  <TableHead>時間</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <Badge
                        variant={
                          m.type === 'inbound' || m.type === 'adjust'
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        {m.type === 'inbound'
                          ? '入庫'
                          : m.type === 'outbound'
                            ? '出庫'
                            : '調整'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {itemMap.get(m.item_id) || '未知物料'}
                    </TableCell>
                    <TableCell>
                      {warehouseMap.get(m.warehouse_id) || '未知倉庫'}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono ${
                        m.type === 'inbound' || m.type === 'adjust'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {m.type === 'inbound' || m.type === 'adjust' ? '+' : '-'}
                      {m.quantity}
                    </TableCell>
                    <TableCell>{m.operator_id}</TableCell>
                    <TableCell>
                      {m.timestamp ? formatDate(m.timestamp) : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
