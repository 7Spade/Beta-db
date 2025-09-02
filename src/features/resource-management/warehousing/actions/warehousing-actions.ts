/**
 * @fileoverview 仓储管理 Server Actions
 * @description 处理所有与仓库、物料、库存相关的后端业务逻辑，现在使用 Supabase。
 */
'use server';

import { createClient } from '@/features/integrations/database/supabase/server';
import type { Warehouse } from '@root/src/shared/types/types';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const WAREHOUSES_PATH = '/resource-management/warehousing/warehouses';
const ITEMS_PATH = '/resource-management/warehousing/items';
const MOVEMENTS_PATH = '/resource-management/warehousing/movements';

type ActionResult = {
  success: boolean;
  error?: string;
};

// --- Warehouse Actions ---

export async function saveWarehouseAction(
  data: Omit<Warehouse, 'id'>,
  warehouseId?: string
): Promise<ActionResult> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { name, location, isActive } = data;
    const warehouseData = { name, location, is_active: isActive };

    if (warehouseId) {
      const { error } = await supabase
        .from('warehouses')
        .update(warehouseData)
        .eq('id', warehouseId);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('warehouses').insert(warehouseData);
      if (error) throw error;
    }

    revalidatePath(WAREHOUSES_PATH);
    return { success: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : '发生未知错误';
    console.error('儲存倉庫時發生錯誤:', error);
    return { success: false, error: `儲存失敗: ${error}` };
  }
}

export async function deleteWarehouseAction(
  warehouseId: string
): Promise<ActionResult> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const { error } = await supabase
      .from('warehouses')
      .delete()
      .eq('id', warehouseId);
    if (error) throw error;

    revalidatePath(WAREHOUSES_PATH);
    return { success: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : '发生未知错误';
    console.error('刪除倉庫時發生錯誤:', error);
    return { success: false, error: `刪除失敗: ${error}` };
  }
}

// --- Inventory Item Actions ---
type ItemData = {
  name: string;
  category?: string;
  unit?: string;
  safeStockLevel?: number;
};
export async function saveItemAction(
  data: ItemData,
  itemId?: string
): Promise<ActionResult> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { name, category, unit, safeStockLevel } = data;
    const itemData = {
      name,
      category,
      unit,
      safe_stock_level: safeStockLevel,
    };

    if (itemId) {
      const { error } = await supabase
        .from('inventory_items')
        .update(itemData)
        .eq('id', itemId);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('inventory_items').insert(itemData);
      if (error) throw error;
    }
    revalidatePath(ITEMS_PATH);
    return { success: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : '发生未知错误';
    console.error('儲存物料時發生錯誤:', error);
    return { success: false, error: `儲存失敗: ${error}` };
  }
}

export async function deleteItemAction(itemId: string): Promise<ActionResult> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', itemId);
    if (error) throw error;

    revalidatePath(ITEMS_PATH);
    return { success: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : '发生未知错误';
    console.error('刪除物料時發生錯誤:', error);
    return { success: false, error: `刪除失敗: ${error}` };
  }
}

// --- Inventory Movement Actions ---

interface RecordMovementInput {
  itemId: string;
  warehouseId: string;
  type: 'inbound' | 'outbound' | 'adjust';
  quantity: number;
  unitPrice?: number;
  projectId?: string;
  notes?: string;
  operatorId: string;
}

export async function recordMovementAction(
  input: RecordMovementInput
): Promise<ActionResult> {
  const cookieStore = cookies();
  // For transactions, we should use the service role key to bypass RLS
  const supabase = createClient(cookieStore);

  try {
    // In a real application, this should be a PostgreSQL transaction (RPC function).
    // For now, we simulate it with sequential calls.
    
    // 1. Get current stock level
    const { data: level, error: levelError } = await supabase
      .from('inventory_levels')
      .select('id, quantity')
      .eq('item_id', input.itemId)
      .eq('warehouse_id', input.warehouseId)
      .single();

    if (levelError && levelError.code !== 'PGRST116') { // Ignore 'no rows' error
      throw levelError;
    }

    const currentQty = level?.quantity || 0;
    const change = input.type === 'outbound' ? -input.quantity : input.quantity;
    const newQty = currentQty + change;

    if (newQty < 0) {
      throw new Error('庫存不足，無法出庫。');
    }

    // 2. Upsert inventory level
    const { error: upsertError } = await supabase
      .from('inventory_levels')
      .upsert({
        id: level?.id, // Pass id for update, null for insert
        item_id: input.itemId,
        warehouse_id: input.warehouseId,
        quantity: newQty,
        last_updated: new Date().toISOString()
      }, { onConflict: 'item_id, warehouse_id' });

    if (upsertError) throw upsertError;

    // 3. Create movement record
    const { error: movementError } = await supabase.from('inventory_movements').insert({
      item_id: input.itemId,
      warehouse_id: input.warehouseId,
      type: input.type,
      quantity: input.quantity, // Always positive
      unit_price: input.unitPrice,
      project_id: input.projectId,
      notes: input.notes,
      operator_id: input.operatorId
    });

    if (movementError) throw movementError;

    revalidatePath(MOVEMENTS_PATH);
    return { success: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : '发生未知错误';
    console.error('紀錄庫存移動時發生錯誤:', error);
    return { success: false, error: `操作失敗: ${error}` };
  }
}
