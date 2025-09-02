/**
 * @fileoverview Warehouses List Component
 * @description Fetches warehouses from Supabase and renders the client-side UI.
 */
'use server';

import { createClient } from '@/features/integrations/database/supabase/server';
import type { Warehouse } from '@root/src/shared/types/types';
import { cookies } from 'next/headers';
import { WarehousesClientView } from './warehouse-list-client';

async function getWarehouses(): Promise<Warehouse[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching warehouses:', error);
    return [];
  }

  // Map from snake_case to camelCase
  return data.map((wh) => ({
    id: wh.id,
    name: wh.name,
    location: wh.location || undefined,
    isActive: wh.is_active || false,
    createdAt: wh.created_at ? new Date(wh.created_at) : undefined,
  }));
}

export async function WarehouseList() {
  const warehouses = await getWarehouses();
  return <WarehousesClientView initialWarehouses={warehouses} />;
}
