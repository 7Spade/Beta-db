/**
 * @fileoverview Warehouse Selector Component
 * @description A reusable component for selecting a warehouse, which controls other views. Now includes status badges and an add button.
 */
'use client';

import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import type { Warehouse } from '@root/src/shared/types/types';
import { cn } from '@root/src/shared/utils';
import { Plus, Warehouse as WarehouseIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getLeaseStatus } from '../utils/data-mappers';

interface WarehouseSelectorProps {
  warehouses: Warehouse[];
  onAddWarehouse: () => void;
}

export function WarehouseSelector({
  warehouses,
  onAddWarehouse,
}: WarehouseSelectorProps) {
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
      {warehouses.map((wh) => {
        const leaseStatus = getLeaseStatus(wh.leaseEndDate);
        return (
          <Button
            key={wh.id}
            variant={selectedWarehouseId === wh.id ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-between gap-2',
              !wh.isActive && 'text-muted-foreground'
            )}
            onClick={() => handleSelect(wh.id)}
          >
            <div className="flex items-center gap-2 truncate">
              <WarehouseIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{wh.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={leaseStatus.variant}>{leaseStatus.status}</Badge>
              <Badge variant={wh.isActive ? 'default' : 'outline'}>
                {wh.isActive ? '啟用中' : '停用'}
              </Badge>
            </div>
          </Button>
        );
      })}
      <Button
        variant="outline"
        className="w-full justify-center gap-2"
        onClick={onAddWarehouse}
      >
        <Plus className="h-4 w-4" />
        新增倉庫
      </Button>
    </div>
  );
}
