
'use client';

import { Button } from '@/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Input } from '@/ui/input';
import { Switch } from '@/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Warehouse } from '@root/src/shared/types/types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const warehouseSchema = z.object({
    name: z.string().min(2, { message: '倉庫名稱至少需要 2 個字元。' }),
    location: z.string().optional(),
    isActive: z.boolean(),
});

type WarehouseFormValues = z.infer<typeof warehouseSchema>;

interface WarehouseFormDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSave: (data: Omit<Warehouse, 'id'>, warehouseId?: string) => Promise<boolean>;
    warehouse: Warehouse | null;
}

export function WarehouseFormDialog({ isOpen, onOpenChange, onSave, warehouse }: WarehouseFormDialogProps) {
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<WarehouseFormValues>({
        resolver: zodResolver(warehouseSchema),
        defaultValues: { name: '', location: '', isActive: true },
    });

    useEffect(() => {
        if (isOpen) {
            if (warehouse) {
                form.reset(warehouse);
            } else {
                form.reset({ name: '', location: '', isActive: true });
            }
        }
    }, [warehouse, isOpen, form]);

    const handleDialogChange = (open: boolean) => {
        if (!isSaving) onOpenChange(open);
    };

    async function onSubmit(values: WarehouseFormValues) {
        setIsSaving(true);
        const success = await onSave(values, warehouse?.id);
        setIsSaving(false);
        if (success) {
            onOpenChange(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{warehouse ? '編輯倉庫' : '新增倉庫'}</DialogTitle>
                    <DialogDescription>
                        {warehouse ? '更新此倉庫據點的詳細資訊。' : '建立一個新的倉庫或工地庫房。'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>倉庫名稱</FormLabel>
                                    <FormControl><Input placeholder="例如：台北內湖倉" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>地點 (可選)</FormLabel>
                                    <FormControl><Input placeholder="例如：台北市內湖區" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>啟用狀態</FormLabel>
                                        <FormDescription>
                                            停用的倉庫將無法進行任何庫存操作。
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                         <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving}>取消</Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? '儲存中...' : '儲存'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
