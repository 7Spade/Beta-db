/**
 * @fileoverview Inventory Item Form
 * @description Form for creating or editing inventory items, now with item type and management attributes.
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { Input } from '@/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@root/src/shared/hooks/use-toast';
import type {
  InventoryCategory,
  InventoryItem,
} from '@root/src/shared/types/types';
import { Loader2 } from 'lucide-react';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Combobox } from '../components/combobox';
import { Switch } from '@/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';

const itemSchema = z.object({
  name: z.string().min(2, '物料名稱至少需要 2 個字元。'),
  category: z.string().nullable(),
  unit: z.string().min(1, '單位為必填項。'),
  safeStockLevel: z.coerce.number().min(0).optional(),
  // v3.1: 新增核心身份與管理屬性
  itemType: z.enum(['asset', 'consumable']),
  hasExpiryTracking: z.boolean(),
  requiresMaintenance: z.boolean(),
  requiresInspection: z.boolean(),
  isSerialized: z.boolean(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

interface ItemFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  item: InventoryItem | null;
  categories: InventoryCategory[];
}

export function ItemFormDialog({
  isOpen,
  onOpenChange,
  item,
  categories,
}: ItemFormDialogProps) {
  const [isSaving, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      category: null,
      unit: '',
      safeStockLevel: 0,
      itemType: 'consumable',
      hasExpiryTracking: false,
      requiresMaintenance: false,
      requiresInspection: false,
      isSerialized: false,
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
          itemType: item.itemType,
          hasExpiryTracking: item.hasExpiryTracking,
          requiresMaintenance: item.requiresMaintenance,
          requiresInspection: item.requiresInspection,
          isSerialized: item.isSerialized,
        });
      } else {
        form.reset({
          name: '',
          category: null,
          unit: '',
          safeStockLevel: 0,
          itemType: 'consumable',
          hasExpiryTracking: false,
          requiresMaintenance: false,
          requiresInspection: false,
          isSerialized: false,
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

  const categoryOptions = categories.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-lg">
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
            className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-4"
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
              name="itemType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>核心類型</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇物料的核心類型" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="consumable">消耗品 (追蹤數量)</SelectItem>
                      <SelectItem value="asset">資產/工具 (追蹤實體)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    決定此物料的基本管理方式。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>業務分類</FormLabel>
                  <Combobox
                    options={categoryOptions}
                    value={field.value || ''}
                    onChange={(value) => field.onChange(value)}
                    placeholder="選擇或搜尋分類..."
                  />
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
                      <Input type="number" {...field} value={field.value ?? ''}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-2 rounded-md border p-4">
                <h4 className="text-sm font-medium">管理屬性</h4>
                <FormField control={form.control} name="hasExpiryTracking" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between"><FormLabel>需效期管理</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                )}/>
                <FormField control={form.control} name="requiresMaintenance" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between"><FormLabel>需定期維護</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                )}/>
                 <FormField control={form.control} name="requiresInspection" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between"><FormLabel>需定期檢驗</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                )}/>
                 <FormField control={form.control} name="isSerialized" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between"><FormLabel>需序號管理</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                )}/>
            </div>

            <DialogFooter className="pt-4">
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
