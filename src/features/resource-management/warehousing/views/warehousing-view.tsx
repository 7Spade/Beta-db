/**
 * @fileoverview Unified Warehousing View
 * @description The single main view for the entire warehousing module, using tabs to organize functionality.
 */
'use server';

import { createClient } from '@/features/integrations/database/supabase/server';
import type {
  InventoryCategory,
  InventoryItem,
  InventoryMovement,
  Warehouse,
} from '@root/src/shared/types/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import {
  Package,
  Shapes,
  Truck,
  Warehouse as WarehouseIcon,
} from 'lucide-react';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { WarehousesClientView } from './warehouses-client-view';
import { InventoryItemsClientView } from './inventory-items-client-view';
import { InventoryCategoriesClientView } from './inventory-categories-client-view';
import { InventoryMovementsClientView } from './inventory-movements-client-view';
import { WarehousingDashboardView } from './warehousing-dashboard-view';
import { Skeleton } from '@/ui/skeleton';

async function getWarehousingData() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const [warehousesRes, itemsRes, categoriesRes, movementsRes] =
    await Promise.all([
      supabase.from('warehouses').select('*').order('name'),
      supabase.from('inventory_items').select('*').order('name'),
      supabase.from('inventory_categories').select('*').order('name'),
      supabase
        .from('inventory_movements')
        .select('*')
        .order('timestamp', { ascending: false }),
    ]);

  const warehouses = (warehousesRes.data || []).map((wh) => ({
    id: wh.id,
    name: wh.name,
    location: wh.location || undefined,
    isActive: wh.is_active || false,
    createdAt: wh.created_at ? new Date(wh.created_at) : undefined,
  })) as Warehouse[];

  const items = (itemsRes.data || []).map(
    (item) =>
      ({
        id: item.id,
        name: item.name,
        category: item.category,
        unit: item.unit,
        safeStockLevel: item.safe_stock_level,
        createdAt: item.created_at ? new Date(item.created_at) : undefined,
        itemType: item.item_type,
        hasExpiryTracking: item.has_expiry_tracking,
        requiresMaintenance: item.requires_maintenance,
        requiresInspection: item.requires_inspection,
        isSerialized: item.is_serialized,
      }) as InventoryItem
  );

  const categories = (categoriesRes.data || []) as InventoryCategory[];
  const movements = (movementsRes.data || []).map((m) => ({
    ...m,
    timestamp: new Date(m.timestamp!),
  })) as InventoryMovement[];

  return { warehouses, items, categories, movements };
}

const LoadingFallback = () => (
  <div className="space-y-4 pt-4">
    <Skeleton className="h-10 w-1/3" />
    <Skeleton className="h-48 w-full" />
  </div>
);

export async function WarehousingView() {
  const { warehouses, items, categories, movements } =
    await getWarehousingData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">倉儲管理中心</h1>
        <p className="text-muted-foreground">
          集中管理您的倉庫、物料主檔、分類和所有庫存移動紀錄。
        </p>
      </div>
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">總覽</TabsTrigger>
          <TabsTrigger value="warehouses">
            <WarehouseIcon className="mr-2 h-4 w-4" />
            倉庫管理
          </TabsTrigger>
          <TabsTrigger value="items">
            <Package className="mr-2 h-4 w-4" />
            物料主檔
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Shapes className="mr-2 h-4 w-4" />
            物料類別
          </TabsTrigger>
          <TabsTrigger value="movements">
            <Truck className="mr-2 h-4 w-4" />
            出入庫紀錄
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <Suspense fallback={<LoadingFallback />}>
            <WarehousingDashboardView />
          </Suspense>
        </TabsContent>
        <TabsContent value="warehouses">
          <WarehousesClientView initialWarehouses={warehouses} />
        </TabsContent>
        <TabsContent value="items">
          <InventoryItemsClientView
            initialItems={items}
            initialCategories={categories}
          />
        </TabsContent>
        <TabsContent value="categories">
          <InventoryCategoriesClientView initialCategories={categories} />
        </TabsContent>
        <TabsContent value="movements">
          <InventoryMovementsClientView
            initialMovements={movements}
            initialItems={items}
            initialWarehouses={warehouses}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
