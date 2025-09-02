/**
 * @fileoverview Stock Levels View - The main hub for inventory management.
 * @description This view now integrates warehouse, item, and category management functionalities.
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
  const [isItemFormOpen, setItemFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  const [isCategoryFormOpen, setCategoryFormOpen] = useState(false);

  const handleAddWarehouse = () => {
    setWarehouseToEdit(null);
    setWarehouseFormOpen(true);
  };

  const handleAddItem = () => {
    setItemToEdit(null);
    setItemFormOpen(true);
  };

  const handleAddCategory = () => {
    setCategoryFormOpen(true);
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
          <StockLevelTable
            items={items}
            warehouses={warehouses}
            onAddItem={handleAddItem}
            onAddCategory={handleAddCategory}
          />
        </div>
      </div>

      <WarehouseFormDialog
        isOpen={isWarehouseFormOpen}
        onOpenChange={setWarehouseFormOpen}
        warehouse={warehouseToEdit}
      />
      <ItemFormDialog
        isOpen={isItemFormOpen}
        onOpenChange={setItemFormOpen}
        item={itemToEdit}
        categories={categories}
      />
      <CategoryFormDialog
        isOpen={isCategoryFormOpen}
        onOpenChange={setCategoryFormOpen}
        category={null}
      />
    </>
  );
}
