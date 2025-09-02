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
import { InventoryItemsClientView } from './item-list-client';

async function getItemsAndCategories(): Promise<{
  items: InventoryItem[];
  categories: InventoryCategory[];
}> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const [itemsRes, categoriesRes] = await Promise.all([
    supabase.from('inventory_items').select('*').order('name'),
    supabase.from('inventory_categories').select('*').order('name'),
  ]);

  if (itemsRes.error || categoriesRes.error) {
    console.error(
      'Error fetching items/categories:',
      itemsRes.error,
      categoriesRes.error
    );
    return { items: [], categories: [] };
  }

  const items = itemsRes.data.map(
    (item) =>
      ({
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
      }) as InventoryItem
  );

  const categories = categoriesRes.data as InventoryCategory[];

  return { items, categories };
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
