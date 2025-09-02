/**
 * @fileoverview Inventory Categories View (Server Component)
 * @description Fetches categories from Supabase and passes them to the client component.
 */
'use server';

import { createClient } from '@/features/integrations/database/supabase/server';
import type { InventoryCategory } from '@root/src/shared/types/types';
import { cookies } from 'next/headers';
import { InventoryCategoriesClientView } from './inventory-categories-client-view';

async function getCategories(): Promise<InventoryCategory[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from('inventory_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching inventory categories:', error);
    return [];
  }
  return data.map((cat) => ({
    id: cat.id,
    name: cat.name,
    createdAt: new Date(cat.created_at),
  }));
}

export async function InventoryCategoriesView() {
  const categories = await getCategories();
  return <InventoryCategoriesClientView initialCategories={categories} />;
}
