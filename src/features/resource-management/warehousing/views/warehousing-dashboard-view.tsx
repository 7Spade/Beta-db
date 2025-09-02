/**
 * @fileoverview Warehousing Dashboard View
 * @description The main view for the warehousing dashboard, acting as a hub for the module.
 */
'use server';

import { DashboardStats, type StatCardData } from '@/features/business-intelligence/reporting-analytics/dashboard/dashboard-stats';
import { createClient } from '@/features/integrations/database/supabase/server';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { ArrowRight, Package, Shapes, Truck, Warehouse as WarehouseIcon } from 'lucide-react';
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
    title: '物料類別',
    description: '管理物料的分類，以利於組織和篩選。',
    icon: Shapes,
    href: '/resource-management/warehousing/categories',
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

    const [warehousesRes, itemsRes] = await Promise.all([
        supabase
            .from('warehouses')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true),
        supabase
            .from('inventory_items')
            .select('*', { count: 'exact', head: true })
    ]);
        
    const { count: activeCount, error: activeError } = warehousesRes;
    const { count: itemsCount, error: itemsError } = itemsRes;


    if (activeError || itemsError) {
        console.error("Error fetching warehouse stats:", activeError || itemsError);
        return { activeWarehouses: 0, totalItems: 0 };
    }
    
    return { activeWarehouses: activeCount ?? 0, totalItems: itemsCount ?? 0 };
}

interface WarehousingDashboardViewProps {
  isEmbedded?: boolean;
}

export async function WarehousingDashboardView({ isEmbedded = false }: WarehousingDashboardViewProps) {
  const statsData = await getWarehouseStats();

  const stats: StatCardData[] = [
    {
        title: '啟用中倉庫',
        value: statsData.activeWarehouses.toString(),
        description: '目前正在運作的倉庫據點',
        icon: WarehouseIcon,
    },
    {
        title: '物料品項總數',
        value: statsData.totalItems.toString(),
        description: '所有已建立的物料主檔',
        icon: Package,
    }
  ];

  return (
    <div className="space-y-6">
        {!isEmbedded && (
          <div>
              <h1 className="text-3xl font-bold tracking-tight">倉儲管理總覽</h1>
              <p className="text-muted-foreground">管理您的庫存、倉庫和物料移動。</p>
          </div>
        )}
        
        <DashboardStats stats={stats} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
