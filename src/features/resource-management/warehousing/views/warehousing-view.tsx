/**
 * @fileoverview Unified Warehousing View
 * @description The main view for the entire warehousing module, using tabs to organize functionality.
 */
'use server';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Package, Shapes, Truck, Warehouse as WarehouseIcon } from 'lucide-react';
import { Suspense } from 'react';
import { CategoryList } from '../components/category-list';
import { ItemList } from '../components/item-list';
import { MovementList } from '../components/movement-list';
import { WarehouseList } from '../components/warehouse-list';
import { WarehousingDashboardView } from './warehousing-dashboard-view';
import { Skeleton } from '@/ui/skeleton';

const LoadingFallback = () => (
    <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-48 w-full" />
    </div>
);

export async function WarehousingView() {
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
            <WarehousingDashboardView isEmbedded />
          </Suspense>
        </TabsContent>
        <TabsContent value="warehouses">
          <Suspense fallback={<LoadingFallback />}>
            <WarehouseList />
          </Suspense>
        </TabsContent>
        <TabsContent value="items">
          <Suspense fallback={<LoadingFallback />}>
            <ItemList />
          </Suspense>
        </TabsContent>
        <TabsContent value="categories">
          <Suspense fallback={<LoadingFallback />}>
            <CategoryList />
          </Suspense>
        </TabsContent>
        <TabsContent value="movements">
          <Suspense fallback={<LoadingFallback />}>
            <MovementList />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
