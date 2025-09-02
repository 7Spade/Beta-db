/**
 * @fileoverview Warehouses View (Server Component)
 * @description Fetches warehouses from Supabase and passes them to the client component.
 */
'use server';

import { createClient } from '@/features/integrations/database/supabase/server';
import type { Warehouse } from '@root/src/shared/types/types';
import { cookies } from 'next/headers';
import { WarehousesClientView } from './warehouses-client-view';

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

export async function WarehousesView() {
  const warehouses = await getWarehouses();
  return <WarehousesClientView initialWarehouses={warehouses} />;
}
