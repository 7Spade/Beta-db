/**
 * @fileoverview Inventory Items View
 * @description The main view for managing inventory items.
 */
'use client';

import { deleteItemAction } from '@/features/resource-management/warehousing/actions/warehousing-actions';
import { ItemFormDialog } from '@/features/resource-management/warehousing/forms/item-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/alert-dialog';
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
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
import type { InventoryItem } from '@root/src/shared/types/types';
import { formatDate } from '@root/src/shared/utils';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import {
  Edit,
  MoreVertical,
  Package,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';

export function InventoryItemsView() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(firestore, 'inventory_items'), orderBy('name'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const itemsData = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as InventoryItem
        );
        setItems(itemsData);
        setLoading(false);
      },
      (error) => {
        console.error('獲取物料時發生錯誤：', error);
        toast({
          title: '錯誤',
          description: '無法載入物料列表。',
          variant: 'destructive',
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const handleOpenForm = (item: InventoryItem | null) => {
    setItemToEdit(item);
    setFormOpen(true);
  };

  const handleDeleteItem = (item: InventoryItem) => {
    startDeleteTransition(async () => {
      const result = await deleteItemAction(item.id);
      if (result.success) {
        toast({ title: '成功', description: `物料 "${item.name}" 已刪除。` });
      } else {
        toast({
          title: '錯誤',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">物料主檔</h1>
        <Button onClick={() => handleOpenForm(null)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          新增物料
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>物料列表</CardTitle>
          <CardDescription>全公司的統一物料目錄。</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : items.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">尚無物料</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                點擊「新增物料」以建立您的第一個品項。
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>物料名稱</TableHead>
                  <TableHead>分類</TableHead>
                  <TableHead>單位</TableHead>
                  <TableHead>安全庫存</TableHead>
                  <TableHead>建立日期</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>
                      {item.safeStockLevel ?? '未設定'}
                    </TableCell>
                    <TableCell>
                      {item.createdAt ? formatDate(item.createdAt) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleOpenForm(item)}>
                              <Edit className="mr-2 h-4 w-4" />
                              編輯
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-destructive"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                刪除
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              確定要刪除「{item.name}」嗎？
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteItem(item)}
                              disabled={isDeleting}
                            >
                              繼續刪除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ItemFormDialog
        isOpen={isFormOpen}
        onOpenChange={setFormOpen}
        item={itemToEdit}
      />
    </>
  );
}
