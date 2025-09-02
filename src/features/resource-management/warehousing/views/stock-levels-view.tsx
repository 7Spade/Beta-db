/**
 * @fileoverview Stock Levels View - The main hub for inventory management.
 * @description This view now integrates warehouse management functionalities directly.
 */
'use client';

import type {
  InventoryCategory,
  InventoryItem,
  InventoryMovement,
  Warehouse,
} from '@root/src/shared/types/types';
import { useState } from 'react';
import { WarehouseSelector } from '../components/warehouse-selector';
import { CategoryFormDialog } from '../forms/category-form';
import { ItemFormDialog } from '../forms/item-form';
import { WarehouseFormDialog } from '../forms/warehouse-form';
import { StockLevelTable } from '../tables/stock-level-table';
import { ItemListView } from './item-list-view';

interface StockLevelsViewProps {
  initialData: {
    warehouses: Warehouse[];
    items: InventoryItem[];
    categories: InventoryCategory[];
    movements: InventoryMovement[];
  };
}

export function StockLevelsView({ initialData }: StockLevelsViewProps) {
  const { warehouses, items, categories, movements } = initialData;
  const [isWarehouseFormOpen, setWarehouseFormOpen] = useState(false);
  const [warehouseToEdit, setWarehouseToEdit] = useState<Warehouse | null>(
    null
  );

  const handleAddWarehouse = () => {
    setWarehouseToEdit(null);
    setWarehouseFormOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-1">
          <WarehouseSelector
            warehouses={warehouses}
            onAddWarehouse={handleAddWarehouse}
          />
        </div>
        <div className="lg:col-span-3">
          <StockLevelTable items={items} warehouses={warehouses} />
        </div>
      </div>

      <WarehouseFormDialog
        isOpen={isWarehouseFormOpen}
        onOpenChange={setWarehouseFormOpen}
        warehouse={warehouseToEdit}
      />

      {/* The other management dialogs can be added here if needed,
          or triggered from within their respective components. */}
    </>
  );
}
