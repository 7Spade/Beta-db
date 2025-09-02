/**
 * @fileoverview Inventory Items Component
 * @description Fetches items and categories from Supabase and passes them to the client component.
 */
'use server';

import { createClient } from '@/features/integrations/database/supabase/server';
import type {
  InventoryCategory,
  InventoryItem,
} from '@root/src/shared/types/types';
import { cookies } from 'next/headers';
import { mapInventoryCategory, mapInventoryItem } from '../utils/data-mappers';
import { InventoryItemsClientView } from './item-list-client';

async function getItemsAndCategories(): Promise<{
  items: InventoryItem[];
  categories: InventoryCategory[];
}> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const [itemsRes, categoriesRes] = await Promise.all([
    supabase.from('inventory_items').select('*').order('name'),
    supabase.from('inventory_categories').select('*').order('name'),
  ]);

  if (itemsRes.error || categoriesRes.error) {
    console.error('Error fetching items/categories:', itemsRes.error, categoriesRes.error);
    return { items: [], categories: [] };
  }

  return {
    items: (itemsRes.data || []).map(mapInventoryItem),
    categories: (categoriesRes.data || []).map(mapInventoryCategory),
  };
}

export async function ItemList() {
  const { items, categories } = await getItemsAndCategories();
  return (
    <InventoryItemsClientView
      initialItems={items}
      initialCategories={categories}
    />
  );
}
