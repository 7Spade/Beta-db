'use client';

import { deleteWarehouseAction } from '@/features/resource-management/warehousing/actions/warehousing-actions';
import { WarehouseFormDialog } from '@/features/resource-management/warehousing/forms/warehouse-form';
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
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { useToast } from '@root/src/shared/hooks/use-toast';
import type { Warehouse } from '@root/src/shared/types/types';
import { Edit, Loader2, MoreVertical, PlusCircle, Trash2, Warehouse as WarehouseIcon } from 'lucide-react';
import { useState, useTransition } from 'react';

interface WarehousesClientViewProps {
    initialWarehouses: Warehouse[];
}

export function WarehousesClientView({ initialWarehouses }: WarehousesClientViewProps) {
  const [isFormOpen, setFormOpen] = useState(false);
  const [warehouseToEdit, setWarehouseToEdit] = useState<Warehouse | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const { toast } = useToast();

  const handleOpenForm = (warehouse: Warehouse | null) => {
    setWarehouseToEdit(warehouse);
    setFormOpen(true);
  };

  const handleDeleteWarehouse = async (warehouse: Warehouse) => {
    startDeleteTransition(async () => {
      const result = await deleteWarehouseAction(warehouse.id);
      if (result.success) {
        toast({ title: '成功', description: `倉庫 "${warehouse.name}" 已刪除。` });
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">倉庫管理</h1>
          <p className="text-muted-foreground">管理您的所有倉庫據點。</p>
        </div>
        <Button onClick={() => handleOpenForm(null)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          新增倉庫
        </Button>
      </div>

      {initialWarehouses.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <WarehouseIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">尚無倉庫</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            點擊「新增倉庫」以建立您的第一個庫存地點。
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {initialWarehouses.map((wh) => (
            <Card key={wh.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{wh.name}</CardTitle>
                  <CardDescription>{wh.location || '未提供地點'}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={wh.isActive ? 'default' : 'outline'}>
                    {wh.isActive ? '啟用中' : '已停用'}
                  </Badge>
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenForm(wh)}>
                          <Edit className="mr-2 h-4 w-4" />
                          編輯
                        </DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive"
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
                          確定要刪除「{wh.name}」嗎？
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          此操作無法復原。如果此倉庫尚有庫存，您可能需要先將庫存轉移。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteWarehouse(wh)}
                          disabled={isDeleting}
                        >
                          {isDeleting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          繼續刪除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <WarehouseFormDialog
        isOpen={isFormOpen}
        onOpenChange={setFormOpen}
        warehouse={warehouseToEdit}
      />
    </>
  );
}