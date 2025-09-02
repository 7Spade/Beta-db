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
import {
  mapInventoryItem,
  mapInventoryMovement,
  mapWarehouse,
} from '../utils/data-mappers';
import { InventoryMovementsClientView } from './movement-list-client';

async function getWarehousingData(): Promise<{
  movements: InventoryMovement[];
  items: InventoryItem[];
  warehouses: Warehouse[];
}> {
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

  return {
    movements: (movementsRes.data || []).map(mapInventoryMovement),
    items: (itemsRes.data || []).map(mapInventoryItem),
    warehouses: (warehousesRes.data || []).map(mapWarehouse),
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
