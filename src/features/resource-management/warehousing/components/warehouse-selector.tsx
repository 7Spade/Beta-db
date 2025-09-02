/**
 * @fileoverview Warehouse Selector Component
 * @description A reusable component for selecting a warehouse, which controls other views.
 */
'use client';

import { Button } from '@/ui/button';
import { cn } from '@root/src/shared/utils';
import type { Warehouse } from '@root/src/shared/types/types';
import { Warehouse as WarehouseIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface WarehouseSelectorProps {
  warehouses: Warehouse[];
}

export function WarehouseSelector({ warehouses }: WarehouseSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedWarehouseId = searchParams.get('warehouseId');

  const handleSelect = (warehouseId: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (warehouseId) {
      params.set('warehouseId', warehouseId);
    } else {
      params.delete('warehouseId');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold px-2">選擇倉庫</h3>
      <Button
        variant={!selectedWarehouseId ? 'secondary' : 'ghost'}
        className="w-full justify-start gap-2"
        onClick={() => handleSelect(null)}
      >
        <WarehouseIcon className="h-4 w-4" />
        所有倉庫
      </Button>
      {warehouses.map((wh) => (
        <Button
          key={wh.id}
          variant={selectedWarehouseId === wh.id ? 'secondary' : 'ghost'}
          className={cn(
            'w-full justify-start gap-2',
            !wh.isActive && 'text-muted-foreground'
          )}
          onClick={() => handleSelect(wh.id)}
        >
          <WarehouseIcon className="h-4 w-4" />
          {wh.name}
        </Button>
      ))}
    </div>
  );
}
