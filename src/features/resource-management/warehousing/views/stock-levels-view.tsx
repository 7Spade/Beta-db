/**
 * @fileoverview Stock Levels View
 * @description Main interactive view for checking stock levels, combining warehouse selection and stock details.
 */
'use server';

import { getWarehousingData } from '@/features/resource-management/warehousing/actions/warehousing-actions';
import { WarehouseSelector } from '@/features/resource-management/warehousing/components/warehouse-selector';
import { StockLevelTable } from '@/features/resource-management/warehousing/tables/stock-level-table';

export async function StockLevelsView() {
  const { warehouses, items } = await getWarehousingData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      <div className="lg:col-span-1">
        <WarehouseSelector warehouses={warehouses} />
      </div>
      <div className="lg:col-span-3">
        <StockLevelTable items={items} warehouses={warehouses} />
      </div>
    </div>
  );
}
