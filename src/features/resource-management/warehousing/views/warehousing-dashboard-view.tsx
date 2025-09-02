/**
 * @fileoverview Warehousing Dashboard View
 * @description The main view for the warehousing dashboard, acting as a hub for the module.
 */
'use server';

import { DashboardStats, type StatCardData } from '@/features/business-intelligence/reporting-analytics/dashboard/dashboard-stats';
import { createClient } from '@/features/integrations/database/supabase/server';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { ArrowRight, Package, Truck, Warehouse as WarehouseIcon } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

const warehousingModules = [
  {
    title: '倉庫管理',
    description: '管理您的所有倉庫、廠房或工地庫房據點。',
    icon: WarehouseIcon,
    href: '/resource-management/warehousing/warehouses',
  },
  {
    title: '物料主檔',
    description: '建立和維護公司統一的物料與工具目錄。',
    icon: Package,
    href: '/resource-management/warehousing/items',
  },
  {
    title: '出入庫與調撥',
    description: '記錄所有物料的移動、領用與跨倉調撥。',
    icon: Truck,
    href: '/resource-management/warehousing/movements',
  },
];

async function getWarehouseStats() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { count, error } = await supabase
        .from('warehouses')
        .select('*', { count: 'exact', head: true });
        
    const { count: activeCount, error: activeError } = await supabase
        .from('warehouses')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

    if (error || activeError) {
        console.error("Error fetching warehouse stats:", error || activeError);
        return { total: 0, active: 0 };
    }
    
    return { total: count ?? 0, active: activeCount ?? 0 };
}


export async function WarehousingDashboardView() {
  const statsData = await getWarehouseStats();

  const stats: StatCardData[] = [
    {
        title: '倉庫總數',
        value: statsData.total.toString(),
        description: '所有已建立的倉庫據點',
        icon: WarehouseIcon,
    },
    {
        title: '啟用中據點',
        value: statsData.active.toString(),
        description: '目前正在運作的倉庫',
        icon: WarehouseIcon,
    }
  ];

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">倉儲管理總覽</h1>
            <p className="text-muted-foreground">管理您的庫存、倉庫和物料移動。</p>
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
