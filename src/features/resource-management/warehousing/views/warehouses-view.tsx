'use client';

import { saveWarehouseAction, deleteWarehouseAction } from '@/features/resource-management/warehousing/actions/warehousing-actions';
import { WarehouseFormDialog } from '@/features/resource-management/warehousing/forms/warehouse-form';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu';
import { Skeleton } from '@/ui/skeleton';
import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import { useToast } from '@root/src/shared/hooks/use-toast';
import type { Warehouse } from '@root/src/shared/types/types';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Edit, MoreVertical, PlusCircle, Trash2, Warehouse as WarehouseIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function WarehousesView() {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setFormOpen] = useState(false);
    const [warehouseToEdit, setWarehouseToEdit] = useState<Warehouse | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const q = query(collection(firestore, 'warehouses'), orderBy('name'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const warehousesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Warehouse[];
            setWarehouses(warehousesData);
            setLoading(false);
        }, (error) => {
            console.error("獲取倉庫時發生錯誤：", error);
            toast({ title: "錯誤", description: "無法載入倉庫列表。", variant: "destructive" });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);

    const handleOpenForm = (warehouse: Warehouse | null) => {
        setWarehouseToEdit(warehouse);
        setFormOpen(true);
    };

    const handleSaveWarehouse = async (data: Omit<Warehouse, 'id'>, warehouseId?: string) => {
        const result = await saveWarehouseAction(data, warehouseId);
        if (result.success) {
            toast({ title: '成功', description: `倉庫 "${data.name}" 已儲存。` });
            return true;
        } else {
            toast({ title: '錯誤', description: result.error, variant: 'destructive' });
            return false;
        }
    };

    const handleDeleteWarehouse = async (warehouse: Warehouse) => {
        const result = await deleteWarehouseAction(warehouse.id);
        if (result.success) {
            toast({ title: '成功', description: `倉庫 "${warehouse.name}" 已刪除。` });
        } else {
            toast({ title: '錯誤', description: result.error, variant: 'destructive' });
        }
    };

    const LoadingSkeleton = () => (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-9 w-20" />
                    </CardHeader>
                </Card>
            ))}
        </div>
    );

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

            {loading ? <LoadingSkeleton /> : (
                warehouses.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <WarehouseIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">尚無倉庫</h3>
                        <p className="mt-1 text-sm text-muted-foreground">點擊「新增倉庫」以建立您的第一個庫存地點。</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {warehouses.map((wh) => (
                            <Card key={wh.id}>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>{wh.name}</CardTitle>
                                        <CardDescription>{wh.location || '未提供地點'}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={wh.isActive ? 'default' : 'outline'}>{wh.isActive ? '啟用中' : '已停用'}</Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenForm(wh)}><Edit className="mr-2 h-4 w-4" />編輯</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteWarehouse(wh)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />刪除</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )
            )}

            <WarehouseFormDialog
                isOpen={isFormOpen}
                onOpenChange={setFormOpen}
                onSave={handleSaveWarehouse}
                warehouse={warehouseToEdit}
            />
        </>
    );
}
