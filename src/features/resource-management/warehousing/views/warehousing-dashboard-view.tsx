/**
 * @fileoverview Warehousing Dashboard View
 * @description The main view for the warehousing dashboard, acting as a hub for the module.
 */
'use client';

import { DashboardStats, type StatCardData } from '@/features/business-intelligence/reporting-analytics/dashboard/dashboard-stats';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';
import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import { useToast } from '@root/src/shared/hooks/use-toast';
import type { Warehouse } from '@root/src/shared/types/types';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ArrowRight, Package, Truck, Warehouse as WarehouseIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const warehousingModules = [
  {
    title: '仓库管理',
    description: '管理您的所有仓库、厂房或工地库房据点。',
    icon: WarehouseIcon,
    href: '/resource-management/warehousing/warehouses',
  },
  {
    title: '物料主档',
    description: '建立和维护公司统一的物料与工具目录。',
    icon: Package,
    href: '/resource-management/warehousing/items',
  },
  {
    title: '出入库与调拨',
    description: '记录所有物料的移动、领用与跨仓调拨。',
    icon: Truck,
    href: '/resource-management/warehousing/movements',
  },
];

export function WarehousingDashboardView() {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const q = query(collection(firestore, 'warehouses'), orderBy('name'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const warehousesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Warehouse[];
            setWarehouses(warehousesData);
            setLoading(false);
        }, (error) => {
            console.error("获取仓库时发生错误：", error);
            toast({ title: "错误", description: "无法载入仓库列表。", variant: "destructive" });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);
    
    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                </div>
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-40" />
                    <Skeleton className="h-40" />
                    <Skeleton className="h-40" />
                </div>
            </div>
        );
    }
    
    const stats: StatCardData[] = [
        {
            title: '仓库总数',
            value: warehouses.length.toString(),
            description: '所有已建立的仓库据点',
            icon: WarehouseIcon,
        },
        {
            title: '启用中据点',
            value: warehouses.filter(w => w.isActive).length.toString(),
            description: '目前正在运作的仓库',
            icon: WarehouseIcon,
        }
    ];

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">仓储管理总览</h1>
            <p className="text-muted-foreground">管理您的库存、仓库和物料移动。</p>
        </div>
        
        <DashboardStats stats={stats} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {warehousingModules.map((module) => (
                <Card key={module.title} className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <module.icon className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>{module.title}</CardTitle>
                        </div>
                        <CardDescription className="pt-2">{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow" />
                    <CardContent>
                         <Button asChild variant="outline" className="w-full">
                            <Link href={module.href}>
                                前往管理 <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
