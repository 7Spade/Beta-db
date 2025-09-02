/**
 * @fileoverview Category List Component
 * @description Fetches and displays inventory categories with management actions.
 */
'use server';

import { createClient } from '@/features/integrations/database/supabase/server';
import type { InventoryCategory } from '@root/src/shared/types/types';
import { cookies } from 'next/headers';
import { InventoryCategoriesClientView } from './category-list-client';

async function getCategories(): Promise<InventoryCategory[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from('inventory_categories')
    .select('*')
    .order('name');
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return (data || []).map((cat) => ({
    id: cat.id,
    name: cat.name,
    createdAt: cat.created_at ? new Date(cat.created_at) : undefined,
  }));
}

export async function CategoryList() {
  const categories = await getCategories();
  return <InventoryCategoriesClientView initialCategories={categories} />;
}
