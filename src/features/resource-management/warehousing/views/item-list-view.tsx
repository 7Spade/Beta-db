/**
 * @fileoverview Item List View
 * @description Unified view component for managing inventory items with data fetching and client interactions.
 */
'use client';

import { deleteItemAction } from '@/features/resource-management/warehousing/actions/warehousing-actions';
import { ItemFormDialog } from '@/features/resource-management/warehousing/forms/item-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip';
import { useToast } from '@root/src/shared/hooks/use-toast';
import type {
  InventoryCategory,
  InventoryItem,
} from '@root/src/shared/types/types';
import { formatDate } from '@root/src/shared/utils';
import {
  Edit,
  MoreVertical,
  Package,
  PlusCircle,
  ShieldCheck,
  Tag,
  Watch,
  Wrench,
} from 'lucide-react';
import { useState, useTransition } from 'react';

interface ItemListViewProps {
  initialItems: InventoryItem[];
  initialCategories: InventoryCategory[];
}

export function ItemListView({
  initialItems,
  initialCategories,
}: ItemListViewProps) {
  const [isFormOpen, setFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const { toast } = useToast();

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
          {initialItems.length === 0 ? (
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
                  <TableHead>核心類型</TableHead>
                  <TableHead>業務分類</TableHead>
                  <TableHead>管理屬性</TableHead>
                  <TableHead>建立日期</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialItems.map((item) => {
                  const itemType = item.itemType;
                  const hasExpiryTracking = item.hasExpiryTracking;
                  const requiresMaintenance = item.requiresMaintenance;
                  const requiresInspection = item.requiresInspection;
                  const isSerialized = item.isSerialized;
                  const createdAt = item.createdAt;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            itemType === 'asset' ? 'default' : 'secondary'
                          }
                        >
                          {itemType === 'asset' ? '資產/工具' : '消耗品'}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.category || '未分類'}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <div className="flex flex-wrap gap-2">
                            {hasExpiryTracking && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline">
                                    <Watch className="h-4 w-4" />
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>需效期管理</TooltipContent>
                              </Tooltip>
                            )}
                            {requiresMaintenance && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline">
                                    <Wrench className="h-4 w-4" />
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>需定期維護</TooltipContent>
                              </Tooltip>
                            )}
                            {requiresInspection && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline">
                                    <ShieldCheck className="h-4 w-4" />
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>需定期檢驗</TooltipContent>
                              </Tooltip>
                            )}
                            {isSerialized && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline">
                                    <Tag className="h-4 w-4" />
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>需序號管理</TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        {createdAt ? formatDate(createdAt) : '-'}
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
                              <DropdownMenuItem
                                onClick={() => handleOpenForm(item)}
                              >
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
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ItemFormDialog
        isOpen={isFormOpen}
        onOpenChange={setFormOpen}
        item={itemToEdit}
        categories={initialCategories}
      />
    </>
  );
}
