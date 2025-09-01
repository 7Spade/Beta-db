/**
 * @fileoverview Warehouse Selector Component
 * @description A reusable component for selecting a warehouse.
 */
'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';

interface Warehouse {
  id: string;
  name: string;
}

interface WarehouseSelectorProps {
  warehouses: Warehouse[];
  onSelect: (warehouseId: string) => void;
  selectedWarehouseId?: string;
}

export function WarehouseSelector({ warehouses, onSelect, selectedWarehouseId }: WarehouseSelectorProps) {
  return (
    <Select value={selectedWarehouseId} onValueChange={onSelect}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="選擇一個倉庫..." />
      </SelectTrigger>
      <SelectContent>
        {warehouses.map(wh => (
          <SelectItem key={wh.id} value={wh.id}>{wh.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
