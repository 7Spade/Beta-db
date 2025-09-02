/**
 * @fileoverview Unified Warehousing View
 * @description Simplified warehousing view that focuses on the unified stock management interface.
 */
'use server';

import { getWarehousingData } from '@/features/resource-management/warehousing/actions/warehousing-actions';
import { Skeleton } from '@/ui/skeleton';
import { Suspense } from 'react';
import { StockLevelsView } from './stock-levels-view';

const LoadingFallback = () => (
  <div className="space-y-4 pt-4">
    <Skeleton className="h-10 w-1/3" />
    <Skeleton className="h-48 w-full" />
  </div>
);

export async function WarehousingView() {
  const data = await getWarehousingData();

  return (
    <div className="space-y-6">
      <Suspense fallback={<LoadingFallback />}>
        <StockLevelsView initialData={data} />
      </Suspense>
    </div>
  );
}
