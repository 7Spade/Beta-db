/**
 * @fileoverview Stock Level Table
 * @description Displays the stock levels for items, with logic to filter by warehouse and expand rows.
 */
'use client';

import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip';
import type {
  InventoryItem,
  InventoryMovement,
  Warehouse,
} from '@root/src/shared/types/types';
import { cn } from '@root/src/shared/utils';
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Eye,
  Package,
  PlusCircle,
  ShieldCheck,
  Tag,
  Watch,
  Wrench,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/features/integrations/database/supabase/client';
import { MovementListView } from '../views/movement-list-view';

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
  onAddItem: () => void;
  onAddCategory: () => void;
}

export function StockLevelTable({
  items,
  warehouses,
  onAddItem,
  onAddCategory,
}: StockLevelTableProps) {
  const searchParams = useSearchParams();
  const selectedWarehouseId = searchParams.get('warehouseId');
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [historyItemId, setHistoryItemId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const fetchStockLevels = async () => {
      const { data, error } = await supabase
        .from('inventory_levels')
        .select('*');
      if (error) console.error('Error fetching stock levels:', error);
      else setStockLevels(data || []);
    };

    const fetchMovements = async () => {
      const { data, error } = await supabase
        .from('inventory_movements')
        .select('*');
      if (error) console.error('Error fetching movements:', error);
      else setMovements(data || []);
    };

    fetchStockLevels();
    fetchMovements();
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

  const handleShowHistory = (itemId: string) => {
    setHistoryItemId(itemId);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
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
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onAddCategory}>
              <PlusCircle className="mr-2 h-4 w-4" />
              新增類別
            </Button>
            <Button size="sm" onClick={onAddItem}>
              <PlusCircle className="mr-2 h-4 w-4" />
              新增物料
            </Button>
          </div>
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
                  <TableHead>核心類型</TableHead>
                  <TableHead>業務分類</TableHead>
                  <TableHead>管理屬性</TableHead>
                  <TableHead className="text-right">庫存數量</TableHead>
                  <TableHead className="text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const isExpanded = expandedRows.has(item.id);
                  const distribution = !selectedWarehouseId
                    ? getStockDistribution(item.id)
                    : [];
                  return (
                    <React.Fragment key={item.id}>
                      <TableRow className="hover:bg-muted/50">
                        <TableCell>
                          {!selectedWarehouseId && distribution.length > 0 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => toggleRow(item.id)}
                            >
                              <ChevronRight
                                className={cn(
                                  'h-4 w-4 transition-transform',
                                  isExpanded && 'rotate-90'
                                )}
                              />
                            </Button>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.itemType === 'asset'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {item.itemType === 'asset' ? '資產/工具' : '消耗品'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.category || '未分類'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <div className="flex flex-wrap gap-2">
                              {item.hasExpiryTracking && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="outline">
                                      <Watch className="h-4 w-4" />
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>需效期管理</TooltipContent>
                                </Tooltip>
                              )}
                              {item.requiresMaintenance && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="outline">
                                      <Wrench className="h-4 w-4" />
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>需定期維護</TooltipContent>
                                </Tooltip>
                              )}
                              {item.requiresInspection && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="outline">
                                      <ShieldCheck className="h-4 w-4" />
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>需定期檢驗</TooltipContent>
                                </Tooltip>
                              )}
                              {item.isSerialized && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="outline">
                                      <Tag className="h-4 w-4" />
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>需序號管理</TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {getStockFor(item.id, selectedWarehouseId)}{' '}
                          {item.unit}
                        </TableCell>
                        <TableCell className="text-center space-x-1">
                          <Button variant="outline" size="sm">
                            <ArrowUp className="mr-1 h-3 w-3" />
                            出庫
                          </Button>
                          <Button variant="outline" size="sm">
                            <ArrowDown className="mr-1 h-3 w-3" />
                            入庫
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleShowHistory(item.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      {!selectedWarehouseId && isExpanded && (
                        <TableRow>
                          <TableCell colSpan={7} className="p-0">
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
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {historyItemId && (
        <MovementListView
          isOpen={!!historyItemId}
          onOpenChange={(open) => !open && setHistoryItemId(null)}
          initialMovements={movements}
          initialItems={items}
          initialWarehouses={warehouses}
          filterByItemId={historyItemId}
        />
      )}
    </>
  );
}
