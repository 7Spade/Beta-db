/**
 * @fileoverview Unified Stock Management View
 * @description Comprehensive stock management interface combining all warehousing functions.
 */
'use server';

import { getWarehousingData } from '@/features/resource-management/warehousing/actions/warehousing-actions';
import { WarehouseSelector } from '@/features/resource-management/warehousing/components/warehouse-selector';
import { StockLevelTable } from '@/features/resource-management/warehousing/tables/stock-level-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import {
  BarChart3,
  Package,
  Shapes,
  Truck,
  Warehouse as WarehouseIcon
} from 'lucide-react';
import { CategoryListView } from './category-list-view';
import { ItemListView } from './item-list-view';
import { MovementListView } from './movement-list-view';
import { WarehouseListView } from './warehouse-list-view';

export async function StockLevelsView() {
  const { warehouses, items, movements } = await getWarehousingData();

  // Get categories data
  const { createClient } = await import('@/features/integrations/database/supabase/server');
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: categoriesData, error: categoriesError } = await supabase
    .from('inventory_categories')
    .select('*')
    .order('name');

  const { mapInventoryCategory } = await import('../utils/data-mappers');
  const categories = categoriesError ? [] : (categoriesData || []).map(mapInventoryCategory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">庫存管理中心</h1>
        <p className="text-muted-foreground">
          統一的庫存管理界面，包含倉庫、物料、分類和移動紀錄管理。
        </p>
      </div>

      <Tabs defaultValue="stock-levels" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="stock-levels">
            <BarChart3 className="mr-2 h-4 w-4" />
            庫存水平
          </TabsTrigger>
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

        <TabsContent value="stock-levels">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            <div className="lg:col-span-1">
              <WarehouseSelector warehouses={warehouses} />
            </div>
            <div className="lg:col-span-3">
              <StockLevelTable items={items} warehouses={warehouses} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="warehouses">
          <WarehouseListView initialWarehouses={warehouses} />
        </TabsContent>

        <TabsContent value="items">
          <ItemListView
            initialItems={items}
            initialCategories={categories}
          />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryListView initialCategories={categories} />
        </TabsContent>

        <TabsContent value="movements">
          <MovementListView
            initialMovements={movements}
            initialItems={items}
            initialWarehouses={warehouses}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
