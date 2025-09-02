/**
 * @fileoverview Inventory Movement Form
 * @description Form for recording new inventory movements (inbound/outbound/adjust).
 */
'use client';

import { recordMovementAction } from '@/features/resource-management/warehousing/actions/warehousing-actions';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';
import { Textarea } from '@/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@root/src/features/auth';
import { useToast } from '@root/src/shared/hooks/use-toast';
import type { InventoryItem, Warehouse } from '@root/src/shared/types/types';
import { Loader2 } from 'lucide-react';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const movementSchema = z.object({
  type: z.enum(['inbound', 'outbound', 'adjust']),
  itemId: z.string().min(1, '請選擇一個物料。'),
  warehouseId: z.string().min(1, '請選擇一個倉庫。'),
  quantity: z.coerce.number().min(0.01, '數量必須大於 0。'),
  notes: z.string().optional(),
});

type MovementFormValues = z.infer<typeof movementSchema>;

interface MovementFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  items: InventoryItem[];
  warehouses: Warehouse[];
}

export function MovementFormDialog({
  isOpen,
  onOpenChange,
  items,
  warehouses,
}: MovementFormDialogProps) {
  const [isSaving, startTransition] = useTransition();
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<MovementFormValues>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      type: 'inbound',
      itemId: '',
      warehouseId: '',
      quantity: 1,
      notes: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  async function onSubmit(values: MovementFormValues) {
    if (!user) {
      toast({
        title: '錯誤',
        description: '需要登入才能執行此操作。',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      const result = await recordMovementAction({
        ...values,
        operatorId: user.uid,
      });

      if (result.success) {
        toast({ title: '成功', description: '庫存紀錄已更新。' });
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增庫存紀錄</DialogTitle>
          <DialogDescription>
            記錄一次物料的入庫、出庫或庫存調整。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>紀錄類型</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="inbound">入庫</SelectItem>
                      <SelectItem value="outbound">出庫</SelectItem>
                      <SelectItem value="adjust">調整</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="warehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>倉庫</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇倉庫" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {warehouses.map((w) => (
                          <SelectItem key={w.id} value={w.id}>
                            {w.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="itemId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>物料</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇物料" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {items.map((i) => (
                          <SelectItem key={i.id} value={i.id}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>數量</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>備註 (可選)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="例如：採購單號、領料人等" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
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
                儲存紀錄
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
