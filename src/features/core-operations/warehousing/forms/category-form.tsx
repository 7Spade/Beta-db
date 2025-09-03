
'use client';

import { saveCategoryAction } from '@/features/core-operations/warehousing/actions/warehousing-actions';
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
import type { InventoryCategory } from '@root/src/shared/types/types';
import { Loader2 } from 'lucide-react';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(2, '分類名稱至少需要 2 個字元。'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  category: InventoryCategory | null;
}

export function CategoryFormDialog({
  isOpen,
  onOpenChange,
  category,
}: CategoryFormDialogProps) {
  const [isSaving, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (isOpen) {
      if (category) {
        form.reset(category);
      } else {
        form.reset({ name: '' });
      }
    }
  }, [category, isOpen, form]);

  const handleDialogChange = (open: boolean) => {
    if (isSaving) return;
    onOpenChange(open);
  };

  async function onSubmit(values: CategoryFormValues) {
    startTransition(async () => {
      const result = await saveCategoryAction(values, category?.id);
      if (result.success) {
        toast({ title: '成功', description: `分類 "${values.name}" 已儲存。` });
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
          <DialogTitle>{category ? '編輯分類' : '新增分類'}</DialogTitle>
          <DialogDescription>
            {category
              ? '更新此物料分類的名稱。'
              : '建立一個新的物料分類。'}
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
                  <FormLabel>分類名稱</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：安全護具" {...field} />
                  </FormControl>
                  <FormMessage />
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
                {isSaving ? '儲存中...' : '儲存'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
