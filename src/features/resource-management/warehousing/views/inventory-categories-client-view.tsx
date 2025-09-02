
'use client';

import { deleteCategoryAction } from '@/features/resource-management/warehousing/actions/warehousing-actions';
import { CategoryFormDialog } from '@/features/resource-management/warehousing/forms/category-form';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import { useToast } from '@root/src/shared/hooks/use-toast';
import type { InventoryCategory } from '@root/src/shared/types/types';
import { formatDate } from '@root/src/shared/utils';
import {
  Edit,
  MoreVertical,
  PlusCircle,
  Shapes,
  Trash2,
} from 'lucide-react';
import { useState, useTransition } from 'react';

interface InventoryCategoriesClientViewProps {
  initialCategories: InventoryCategory[];
}

export function InventoryCategoriesClientView({
  initialCategories,
}: InventoryCategoriesClientViewProps) {
  const [isFormOpen, setFormOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] =
    useState<InventoryCategory | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const { toast } = useToast();

  const handleOpenForm = (category: InventoryCategory | null) => {
    setCategoryToEdit(category);
    setFormOpen(true);
  };

  const handleDeleteCategory = (category: InventoryCategory) => {
    startDeleteTransition(async () => {
      const result = await deleteCategoryAction(category.id);
      if (result.success) {
        toast({
          title: '成功',
          description: `分類 "${category.name}" 已刪除。`,
        });
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
        <h1 className="text-3xl font-bold tracking-tight">物料類別</h1>
        <Button onClick={() => handleOpenForm(null)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          新增類別
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>類別列表</CardTitle>
          <CardDescription>管理所有物料的分類。</CardDescription>
        </CardHeader>
        <CardContent>
          {initialCategories.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <Shapes className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">尚無類別</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                點擊「新增類別」以建立您的第一個分類。
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>類別名稱</TableHead>
                  <TableHead>建立日期</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialCategories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell>{formatDate(cat.createdAt)}</TableCell>
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
                              onClick={() => handleOpenForm(cat)}
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
                              確定要刪除「{cat.name}」嗎？
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              此操作無法復原。如果已有物料使用此分類，您可能需要先更新它們。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCategory(cat)}
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

      <CategoryFormDialog
        isOpen={isFormOpen}
        onOpenChange={setFormOpen}
        category={categoryToEdit}
      />
    </>
  );
}
