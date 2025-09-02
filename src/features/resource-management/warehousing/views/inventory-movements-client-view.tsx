'use client';

import { MovementFormDialog } from '@/features/resource-management/warehousing/forms/movement-form';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
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
import { ArrowLeftRight, PlusCircle } from 'lucide-react';
import { useState } from 'react';

interface InventoryMovementsClientViewProps {
    initialMovements: InventoryMovement[];
    initialItems: InventoryItem[];
    initialWarehouses: Warehouse[];
}

export function InventoryMovementsClientView({ initialMovements, initialItems, initialWarehouses }: InventoryMovementsClientViewProps) {
  const [isFormOpen, setFormOpen] = useState(false);

  const getItemName = (id: string) => initialItems.find((i) => i.id === id)?.name || '未知物料';
  const getWarehouseName = (id: string) => initialWarehouses.find((w) => w.id === id)?.name || '未知倉庫';

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">出入庫紀錄</h1>
        <Button onClick={() => setFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          新增紀錄
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>所有庫存移動歷史</CardTitle>
          <CardDescription>不可變的庫存移動流水帳。</CardDescription>
        </CardHeader>
        <CardContent>
          {initialMovements.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <ArrowLeftRight className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">尚無庫存紀錄</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                點擊「新增紀錄」以開始追蹤您的庫存。
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
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
                {initialMovements.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <Badge
                        variant={
                          m.type === 'inbound' || m.type === 'adjust'
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        {m.type === 'inbound' ? '入庫' : m.type === 'outbound' ? '出庫' : '調整'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {getItemName(m.item_id)}
                    </TableCell>
                    <TableCell>{getWarehouseName(m.warehouse_id)}</TableCell>
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
                    <TableCell>{formatDate(m.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <MovementFormDialog
        isOpen={isFormOpen}
        onOpenChange={setFormOpen}
        items={initialItems}
        warehouses={initialWarehouses}
      />
    </>
  );
}
