/**
 * @fileoverview Inventory Movements View
 * @description The main view for managing inventory movements, now fetching data from Supabase.
 */
'use server';

import { createClient } from '@/features/integrations/database/supabase/server';
import type {
  InventoryItem,
  InventoryMovement,
  Warehouse,
} from '@root/src/shared/types/types';
import { cookies } from 'next/headers';
import { InventoryMovementsClientView } from './inventory-movements-client-view';

async function getWarehousingData() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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
    movements: movementsRes.data.map(m => ({...m, timestamp: new Date(m.timestamp!)})) as InventoryMovement[],
    items: itemsRes.data as InventoryItem[],
    warehouses: warehousesRes.data as Warehouse[],
  };
}

export async function InventoryMovementsView() {
  const { movements, items, warehouses } = await getWarehousingData();
  return (
    <InventoryMovementsClientView
      initialMovements={movements}
      initialItems={items}
      initialWarehouses={warehouses}
    />
  );
}
