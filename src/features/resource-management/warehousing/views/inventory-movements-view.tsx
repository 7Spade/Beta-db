/**
 * @fileoverview Inventory Movements View
 * @description The main view for managing inventory movements.
 */
'use client';

import { MovementFormDialog } from '@/features/resource-management/warehousing/forms/movement-form';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/alert-dialog';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import { useToast } from '@root/src/shared/hooks/use-toast';
import type {
  InventoryItem,
  InventoryMovement,
  Warehouse,
} from '@root/src/shared/types/types';
import { formatDate } from '@root/src/shared/utils';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ArrowLeftRight, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function InventoryMovementsView() {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubMovements = onSnapshot(
      query(
        collection(firestore, 'inventory_movements'),
        orderBy('timestamp', 'desc')
      ),
      (snapshot) => {
        setMovements(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as InventoryMovement
          )
        );
      },
      (error) => {
        console.error('Error fetching movements:', error);
        toast({
          title: '錯誤',
          description: '無法載入庫存紀錄。',
          variant: 'destructive',
        });
      }
    );

    const unsubItems = onSnapshot(
      collection(firestore, 'inventory_items'),
      (snapshot) => {
        setItems(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as InventoryItem
          )
        );
      }
    );

    const unsubWarehouses = onSnapshot(
      collection(firestore, 'warehouses'),
      (snapshot) => {
        setWarehouses(
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Warehouse
          )
        );
        setLoading(false);
      }
    );

    return () => {
      unsubMovements();
      unsubItems();
      unsubWarehouses();
    };
  }, [toast]);

  const getItemName = (id: string) =>
    items.find((i) => i.id === id)?.name || '未知物料';
  const getWarehouseName = (id: string) =>
    warehouses.find((w) => w.id === id)?.name || '未知倉庫';

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
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : movements.length === 0 ? (
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
                {movements.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <Badge
                        variant={
                          m.type === 'inbound' || m.type === 'adjust'
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        {m.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {getItemName(m.itemId)}
                    </TableCell>
                    <TableCell>{getWarehouseName(m.warehouseId)}</TableCell>
                    <TableCell
                      className={`text-right font-mono ${m.type === 'inbound' || m.type === 'adjust' ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {m.type === 'inbound' || m.type === 'adjust' ? '+' : '-'}
                      {m.quantity}
                    </TableCell>
                    <TableCell>{m.operatorId}</TableCell>
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
        items={items}
        warehouses={warehouses}
      />
    </>
  );
}
