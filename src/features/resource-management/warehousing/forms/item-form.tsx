/**
 * @fileoverview Inventory Item Form
 * @description Form for creating or editing inventory items.
 */
'use client';

import { saveItemAction } from '@/features/resource-management/warehousing/actions/warehousing-actions';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { Input } from '@/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@root/src/shared/hooks/use-toast';
import type { InventoryItem } from '@root/src/shared/types/types';
import { Loader2 } from 'lucide-react';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const itemSchema = z.object({
  name: z.string().min(2, '物料名稱至少需要 2 個字元。'),
  category: z.string().min(2, '分類至少需要 2 個字元。'),
  unit: z.string().min(1, '單位為必填項。'),
  safeStockLevel: z.coerce.number().min(0).optional(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

interface ItemFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  item: InventoryItem | null;
}

export function ItemFormDialog({
  isOpen,
  onOpenChange,
  item,
}: ItemFormDialogProps) {
  const [isSaving, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      category: '',
      unit: '',
      safeStockLevel: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (item) {
        form.reset({
          name: item.name,
          category: item.category,
          unit: item.unit,
          safeStockLevel: item.safeStockLevel,
        });
      } else {
        form.reset({
          name: '',
          category: '',
          unit: '',
          safeStockLevel: 0,
        });
      }
    }
  }, [item, isOpen, form]);

  const handleDialogChange = (open: boolean) => {
    if (isSaving) return;
    onOpenChange(open);
  };

  async function onSubmit(values: ItemFormValues) {
    startTransition(async () => {
      const result = await saveItemAction(values, item?.id);
      if (result.success) {
        toast({ title: '成功', description: `物料 "${values.name}" 已儲存。` });
        onOpenChange(false);
      } else {
        toast({
          title: '錯誤',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? '編輯物料' : '新增物料'}</DialogTitle>
          <DialogDescription>
            {item
              ? '更新此物料的詳細資訊。'
              : '建立一個新的物料或工具品項。'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>物料名稱</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：S腰帶防墜器" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>分類</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：安全護具" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>單位</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：個、組、箱" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="safeStockLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>安全庫存量 (可選)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? '儲存中...' : '儲存'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
