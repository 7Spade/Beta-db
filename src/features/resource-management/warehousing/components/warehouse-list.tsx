/**
 * @fileoverview Warehouses List Component
 * @description Fetches warehouses from Supabase and renders the client-side UI.
 */
'use server';

import { createClient } from '@/features/integrations/database/supabase/server';
import type { Warehouse } from '@root/src/shared/types/types';
import { cookies } from 'next/headers';
import { mapWarehouse } from '../utils/data-mappers';
import { WarehousesClientView } from './warehouse-list-client';

async function getWarehouses(): Promise<Warehouse[]> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching warehouses:', error);
    return [];
  }

  // Map from snake_case to camelCase
  return (data || []).map(mapWarehouse);
}

export async function WarehouseList() {
  const warehouses = await getWarehouses();
  return <WarehousesClientView initialWarehouses={warehouses} />;
}
