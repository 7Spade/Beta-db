/**
 * @fileoverview Warehousing Dashboard View
 * @description The main view for the warehousing dashboard, acting as a hub for the module.
 */
'use server';

import {
  DashboardStats,
  type StatCardData,
} from '@/features/business-intelligence/reporting-analytics/dashboard/dashboard-stats';
import { createClient } from '@/features/integrations/database/supabase/server';
import { Package, Wrench, Warehouse as WarehouseIcon } from 'lucide-react';
import { cookies } from 'next/headers';

async function getWarehouseStats() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const [warehousesRes, itemsRes, assetsRes] = await Promise.all([
    supabase
      .from('warehouses')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase.from('inventory_items').select('*', { count: 'exact', head: true }),
    supabase
      .from('inventory_items')
      .select('*', { count: 'exact', head: true })
      .eq('item_type', 'asset'),
  ]);

  const { count: activeCount, error: activeError } = warehousesRes;
  const { count: itemsCount, error: itemsError } = itemsRes;
  const { count: assetsCount, error: assetsError } = assetsRes;

  if (activeError || itemsError || assetsError) {
    console.error(
      'Error fetching warehouse stats:',
      activeError || itemsError || assetsError
    );
    return { activeWarehouses: 0, totalItems: 0, totalAssets: 0 };
  }

  return {
    activeWarehouses: activeCount ?? 0,
    totalItems: itemsCount ?? 0,
    totalAssets: assetsCount ?? 0,
  };
}

interface WarehousingDashboardViewProps {
  isEmbedded?: boolean;
}

export async function WarehousingDashboardView({
  isEmbedded = false,
}: WarehousingDashboardViewProps) {
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
    },
    {
      title: '資產/工具總數',
      value: statsData.totalAssets.toString(),
      description: '需追蹤管理的資產型物料',
      icon: Wrench,
    },
  ];

  return (
    <div className="space-y-6">
      {!isEmbedded && (
        <div>
          <h1 className="text-3xl font-bold tracking-tight">倉儲管理總覽</h1>
          <p className="text-muted-foreground">
            管理您的庫存、倉庫和物料移動。
          </p>
        </div>
      )}

      <DashboardStats stats={stats} />
    </div>
  );
}
