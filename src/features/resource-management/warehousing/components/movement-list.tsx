/**
 * @fileoverview Inventory Movements Component
 * @description The main component for managing inventory movements, now fetching data from Supabase.
 */
'use server';

import { createClient } from '@/features/integrations/database/supabase/server';
import type {
  InventoryItem,
  InventoryMovement,
  Warehouse,
} from '@root/src/shared/types/types';
import { cookies } from 'next/headers';
import { InventoryMovementsClientView } from './movement-list-client';

async function getWarehousingData() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const [movementsRes, itemsRes, warehousesRes] = await Promise.all([
    supabase
      .from('inventory_movements')
      .select('*')
      .order('timestamp', { ascending: false }),
    supabase.from('inventory_items').select('*'),
    supabase.from('warehouses').select('*'),
  ]);

  if (movementsRes.error || itemsRes.error || warehousesRes.error) {
    console.error(
      'Error fetching warehousing data:',
      movementsRes.error,
      itemsRes.error,
      warehousesRes.error
    );
    return { movements: [], items: [], warehouses: [] };
  }

  const movements = (movementsRes.data || []).map((m) => ({
    ...m,
    timestamp: new Date(m.timestamp!),
  })) as InventoryMovement[];

  const items = (itemsRes.data || []).map(item => ({
    id: item.id,
    name: item.name,
    category: item.category,
    unit: item.unit,
    safeStockLevel: item.safe_stock_level,
    createdAt: item.created_at ? new Date(item.created_at) : undefined,
    itemType: item.item_type,
    hasExpiryTracking: item.has_expiry_tracking,
    requiresMaintenance: item.requires_maintenance,
    requiresInspection: item.requires_inspection,
    isSerialized: item.is_serialized,
  })) as InventoryItem[];

  const warehouses = (warehousesRes.data || []).map((wh) => ({
    id: wh.id,
    name: wh.name,
    location: wh.location || undefined,
    isActive: wh.is_active || false,
    createdAt: wh.created_at ? new Date(wh.created_at) : undefined,
  })) as Warehouse[];

  return {
    movements,
    items,
    warehouses,
  };
}

export async function MovementList() {
  const { movements, items, warehouses } = await getWarehousingData();
  return (
    <InventoryMovementsClientView
      initialMovements={movements}
      initialItems={items}
      initialWarehouses={warehouses}
    />
  );
}
