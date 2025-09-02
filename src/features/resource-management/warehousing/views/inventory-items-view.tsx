/**
 * @fileoverview Inventory Items View
 * @description The main view for managing inventory items, now fetching data from Supabase.
 */
'use server';

import { createClient } from '@/features/integrations/database/supabase/server';
import { ItemFormDialog } from '@/features/resource-management/warehousing/forms/item-form';
import type { InventoryItem } from '@root/src/shared/types/types';
import { cookies } from 'next/headers';
import { InventoryItemsClientView } from './inventory-items-client-view';

async function getItems(): Promise<InventoryItem[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching inventory items:', error);
    return [];
  }
  return data.map(item => ({
    ...item,
    safeStockLevel: item.safe_stock_level,
    createdAt: item.created_at ? new Date(item.created_at) : undefined,
  })) as InventoryItem[];
}

export async function InventoryItemsView() {
  const items = await getItems();
  return <InventoryItemsClientView initialItems={items} />;
}
