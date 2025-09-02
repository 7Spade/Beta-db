/**
 * @fileoverview Unified Stock Management View
 * @description Comprehensive stock management interface with all functions integrated into one page.
 */
'use server';

import { getWarehousingData } from '@/features/resource-management/warehousing/actions/warehousing-actions';
import { WarehouseSelector } from '@/features/resource-management/warehousing/components/warehouse-selector';
import { StockLevelTable } from '@/features/resource-management/warehousing/tables/stock-level-table';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Separator } from '@/ui/separator';
import {
  BarChart3,
  Package,
  Plus,
  Settings,
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">庫存管理中心</h1>
          <p className="text-muted-foreground">
            統一的庫存管理界面，所有功能整合在一個頁面中。
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            設定
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            新增物料
          </Button>
        </div>
      </div>

      {/* Main Stock Levels Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            庫存水平
          </CardTitle>
          <CardDescription>
            查看和管理所有倉庫的庫存水平
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            <div className="lg:col-span-1">
              <WarehouseSelector warehouses={warehouses} />
            </div>
            <div className="lg:col-span-3">
              <StockLevelTable items={items} warehouses={warehouses} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Warehouse Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WarehouseIcon className="h-5 w-5" />
              倉庫管理
            </CardTitle>
            <CardDescription>
              管理倉庫基本資料和設定
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WarehouseListView initialWarehouses={warehouses} />
          </CardContent>
        </Card>

        {/* Item Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              物料主檔
            </CardTitle>
            <CardDescription>
              管理物料基本資料和規格
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ItemListView
              initialItems={items}
              initialCategories={categories}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shapes className="h-5 w-5" />
              物料類別
            </CardTitle>
            <CardDescription>
              管理物料分類和標籤
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryListView initialCategories={categories} />
          </CardContent>
        </Card>

        {/* Movement History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              出入庫紀錄
            </CardTitle>
            <CardDescription>
              查看所有庫存移動歷史
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MovementListView
              initialMovements={movements}
              initialItems={items}
              initialWarehouses={warehouses}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}