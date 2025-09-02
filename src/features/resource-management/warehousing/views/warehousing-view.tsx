/**
 * @fileoverview Unified Warehousing View
 * @description The single main view for the entire warehousing module, using tabs to organize functionality.
 */
'use server';

import { createClient } from '@/features/integrations/database/supabase/server';
import { InventoryCategoriesClientView } from '@/features/resource-management/warehousing/components/category-list-client';
import { InventoryItemsClientView } from '@/features/resource-management/warehousing/components/item-list-client';
import { InventoryMovementsClientView } from '@/features/resource-management/warehousing/components/movement-list-client';
import { WarehousesClientView } from '@/features/resource-management/warehousing/components/warehouse-list-client';

import { Skeleton } from '@/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import {
  Package,
  Shapes,
  Truck,
  Warehouse as WarehouseIcon,
} from 'lucide-react';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { WarehousingDashboardView } from './warehousing-dashboard-view';

async function getData() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const [warehousesRes, itemsRes, categoriesRes, movementsRes, leasesRes] =
    await Promise.all([
      supabase.from('warehouses').select('*').order('name'),
      supabase.from('inventory_items').select('*').order('name'),
      supabase.from('inventory_categories').select('*').order('name'),
      supabase
        .from('inventory_movements')
        .select('*')
        .order('timestamp', { ascending: false }),
      supabase.from('lease_agreements').select('*').order('lease_end_date', { ascending: false }),
    ]);

  // 檢查是否有錯誤
  if (warehousesRes.error) {
    console.error('獲取倉庫數據錯誤:', warehousesRes.error);
  }
  if (itemsRes.error) {
    console.error('獲取物料數據錯誤:', itemsRes.error);
  }
  if (categoriesRes.error) {
    console.error('獲取分類數據錯誤:', categoriesRes.error);
  }
  if (movementsRes.error) {
    console.error('獲取移動記錄錯誤:', movementsRes.error);
  }
  if (leasesRes.error) {
    console.error('獲取租約數據錯誤:', leasesRes.error);
  }

  // 映射數據庫字段到 TypeScript 類型
  const warehouses = (warehousesRes.data || []).map((wh) => ({
    id: wh.id,
    name: wh.name,
    location: wh.location || undefined,
    isActive: wh.is_active || false,
    createdAt: wh.created_at ? new Date(wh.created_at) : undefined,
  }));

  const items = (itemsRes.data || []).map((item) => ({
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
  }));

  const categories = (categoriesRes.data || []).map((c) => ({
    id: c.id,
    name: c.name,
    createdAt: c.created_at ? new Date(c.created_at) : undefined,
  }));

  const movements = (movementsRes.data || []).map((m) => ({
    ...m,
    timestamp: new Date(m.timestamp!),
  }));

  const leases = (leasesRes.data || []).map((l) => ({
    id: l.id,
    warehouse_id: l.warehouse_id,
    lease_start_date: l.lease_start_date,
    lease_end_date: l.lease_end_date,
    monthly_rent: l.monthly_rent,
    lessor_name: l.lessor_name,
    contract_document_url: l.contract_document_url,
    status: l.status,
    createdAt: l.created_at ? new Date(l.created_at) : undefined,
  }));

  return {
    warehouses,
    items,
    categories,
    movements,
    leases,
  };
}

const LoadingFallback = () => (
  <div className="space-y-4 pt-4">
    <Skeleton className="h-10 w-1/3" />
    <Skeleton className="h-48 w-full" />
  </div>
);

export async function WarehousingView() {
  const { warehouses, items, categories, movements, leases } = await getData();

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
          <WarehousesClientView initialWarehouses={warehouses} initialLeases={leases} />
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
