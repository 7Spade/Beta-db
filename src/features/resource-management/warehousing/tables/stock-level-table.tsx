/**
 * @fileoverview Stock Level Table
 * @description Displays the stock levels for items, with logic to filter by warehouse and expand rows.
 */
'use client';

import { createClient } from '@/features/integrations/database/supabase/client';
import { Badge } from '@/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import type { InventoryItem, Warehouse } from '@root/src/shared/types/types';
import { cn } from '@root/src/shared/utils';
import { ChevronRight, Package } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type StockLevel = {
  item_id: string;
  warehouse_id: string;
  quantity: number;
};

type ExpandedStockLevel = {
  warehouseName: string;
  quantity: number;
};

interface StockLevelTableProps {
  items: InventoryItem[];
  warehouses: Warehouse[];
}

export function StockLevelTable({ items, warehouses }: StockLevelTableProps) {
  const searchParams = useSearchParams();
  const selectedWarehouseId = searchParams.get('warehouseId');
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    const fetchStockLevels = async () => {
      const { data, error } = await supabase
        .from('inventory_levels')
        .select('*');
      if (error) {
        console.error('Error fetching stock levels:', error);
      } else {
        setStockLevels(data || []);
      }
    };
    fetchStockLevels();
  }, []);

  const warehouseMap = useMemo(
    () => new Map(warehouses.map((w) => [w.id, w.name])),
    [warehouses]
  );

  const filteredItems = useMemo(() => {
    if (!selectedWarehouseId) return items;
    const warehouseItems = new Set(
      stockLevels
        .filter((sl) => sl.warehouse_id === selectedWarehouseId)
        .map((sl) => sl.item_id)
    );
    return items.filter((item) => warehouseItems.has(item.id));
  }, [items, stockLevels, selectedWarehouseId]);

  const getStockFor = (itemId: string, warehouseId?: string | null): number => {
    const levels = stockLevels.filter(
      (sl) =>
        sl.item_id === itemId &&
        (!warehouseId || sl.warehouse_id === warehouseId)
    );
    return levels.reduce((sum, level) => sum + level.quantity, 0);
  };

  const getStockDistribution = (itemId: string): ExpandedStockLevel[] => {
    return stockLevels
      .filter((sl) => sl.item_id === itemId && sl.quantity > 0)
      .map((sl) => ({
        warehouseName: warehouseMap.get(sl.warehouse_id) || '未知倉庫',
        quantity: sl.quantity,
      }));
  };

  const toggleRow = (itemId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedWarehouseId
            ? warehouseMap.get(selectedWarehouseId)
            : '所有倉庫'}{' '}
          - 庫存水平
        </CardTitle>
        <CardDescription>
          {selectedWarehouseId
            ? '此倉庫中所有物料的當前庫存。'
            : '所有物料在全部倉庫中的庫存總覽。'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">無庫存資料</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              此倉庫目前沒有任何庫存品項。
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>物料名稱</TableHead>
                <TableHead>分類</TableHead>
                <TableHead className="text-right">庫存數量</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const isExpanded = expandedRows.has(item.id);
                const distribution = !selectedWarehouseId
                  ? getStockDistribution(item.id)
                  : [];
                return (
                  <Collapsible
                    key={item.id}
                    open={isExpanded}
                    onOpenChange={() => toggleRow(item.id)}
                  >
                    <TableRow className="hover:bg-muted/50">
                      <TableCell>
                        {!selectedWarehouseId && distribution.length > 0 && (
                          <CollapsibleTrigger asChild>
                            <button className="p-1 rounded-md hover:bg-muted">
                              <ChevronRight
                                className={cn(
                                  'h-4 w-4 transition-transform',
                                  isExpanded && 'rotate-90'
                                )}
                              />
                            </button>
                          </CollapsibleTrigger>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.category || '未分類'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {getStockFor(item.id, selectedWarehouseId)}{' '}
                        {item.unit}
                      </TableCell>
                    </TableRow>
                    {!selectedWarehouseId && (
                      <CollapsibleContent asChild>
                        <TableRow>
                          <TableCell colSpan={4} className="p-0">
                            <div className="bg-muted/50 p-4 pl-16">
                              <h4 className="font-semibold mb-2">
                                各倉庫庫存分佈
                              </h4>
                              <ul className="space-y-1 text-sm">
                                {distribution.map((dist) => (
                                  <li
                                    key={dist.warehouseName}
                                    className="flex justify-between"
                                  >
                                    <span>{dist.warehouseName}</span>
                                    <span className="font-mono">
                                      {dist.quantity} {item.unit}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
