/**
 * @fileoverview Unified Warehousing View
 * @description Simplified warehousing view that focuses on the unified stock management interface.
 */
'use server';

import { Skeleton } from '@/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { BarChart3, LayoutDashboard } from 'lucide-react';
import { Suspense } from 'react';
import { StockLevelsView } from './stock-levels-view';
import { WarehousingDashboardView } from './warehousing-dashboard-view';

const LoadingFallback = () => (
  <div className="space-y-4 pt-4">
    <Skeleton className="h-10 w-1/3" />
    <Skeleton className="h-48 w-full" />
  </div>
);

export async function WarehousingView() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="stock-management" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            總覽
          </TabsTrigger>
          <TabsTrigger value="stock-management">
            <BarChart3 className="mr-2 h-4 w-4" />
            庫存管理
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Suspense fallback={<LoadingFallback />}>
            <WarehousingDashboardView />
          </Suspense>
        </TabsContent>

        <TabsContent value="stock-management">
          <Suspense fallback={<LoadingFallback />}>
            <StockLevelsView />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
