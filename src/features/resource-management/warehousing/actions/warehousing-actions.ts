/**
 * @fileoverview 倉儲管理 Server Actions
 * @description 處理所有與倉庫、物料、庫存相關的後端業務邏輯，現在使用 Supabase。
 */
'use server';

import { createClient } from '@/features/integrations/database/supabase/server';
import type {
  InventoryCategory,
  InventoryItem,
  Warehouse,
} from '@root/src/shared/types/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const WAREHOUSING_PATH = '/resource-management/warehousing';

type ActionResult = {
  success: boolean;
  error?: string;
};

// 簡化的認證檢查 - 依賴 Supabase RLS
async function getCurrentUser() {
  return {
    uid: 'current-user',
    email: 'user@example.com',
  };
}

// --- Warehouse & Lease Actions ---



export async function saveWarehouseAction(
  data: Omit<Warehouse, 'id' | 'createdAt'>,
  warehouseId?: string
): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  try {
    const { name, location, isActive } = data;
    const warehouseData = { name, location, is_active: isActive };

    if (warehouseId) {
      const { data: updateData, error } = await supabase
        .from('warehouses')
        .update(warehouseData)
        .eq('id', warehouseId)
        .select();
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('warehouses')
        .insert(warehouseData);
      if (error) throw error;
    }

    revalidatePath(WAREHOUSING_PATH);
    return { success: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : '發生未知錯誤';
    console.error('儲存倉庫時發生錯誤:', error, e);
    return { success: false, error: `儲存失敗: ${error}` };
  }
}

export async function deleteWarehouseAction(
  warehouseId: string
): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  try {
    // DB cascade should handle deleting leases
    const { error } = await supabase
      .from('warehouses')
      .delete()
      .eq('id', warehouseId);
    if (error) throw error;

    revalidatePath(WAREHOUSING_PATH);
    return { success: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : '发生未知错误';
    console.error('刪除倉庫時發生錯誤:', error);
    return { success: false, error: `刪除失敗: ${error}` };
  }
}

// --- Inventory Item Actions ---
type ItemData = Omit<InventoryItem, 'id' | 'createdAt'>;

export async function saveItemAction(
  data: ItemData,
  itemId?: string
): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  try {
    const { name, category, unit, safeStockLevel, itemType, hasExpiryTracking, requiresMaintenance, requiresInspection, isSerialized } = data;
    const itemData = {
      name,
      category: category || null,
      unit,
      safe_stock_level: safeStockLevel,
      item_type: itemType,
      has_expiry_tracking: hasExpiryTracking,
      requires_maintenance: requiresMaintenance,
      requires_inspection: requiresInspection,
      is_serialized: isSerialized,
    };

    if (itemId) {
      const { error } = await supabase
        .from('inventory_items')
        .update(itemData)
        .eq('id', itemId);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('inventory_items')
        .insert(itemData);
      if (error) throw error;
    }
    revalidatePath(WAREHOUSING_PATH);
    return { success: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : '發生未知錯誤';
    console.error('儲存物料時發生錯誤:', error, e);
    return { success: false, error: `儲存失敗: ${error}` };
  }
}

export async function deleteItemAction(itemId: string): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  try {
    // Note: In a real-world scenario, you might want to check if the item is in use before deleting.
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', itemId);
    if (error) throw error;

    revalidatePath(WAREHOUSING_PATH);
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
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  try {
    // In a real application, this should be a PostgreSQL transaction (RPC function)
    // to ensure atomicity. For now, we simulate it with sequential calls.

    // 1. Get current stock level
    const { data: level, error: levelError } = await supabase
      .from('inventory_levels')
      .select('id, quantity')
      .eq('item_id', input.itemId)
      .eq('warehouse_id', input.warehouseId)
      .single();

    if (levelError && levelError.code !== 'PGRST116') {
      // Ignore 'no rows' error
      throw levelError;
    }

    const currentQty = level?.quantity || 0;
    const change =
      input.type === 'inbound' || input.type === 'adjust'
        ? input.quantity
        : -input.quantity;
    const newQty = input.type === 'adjust' ? input.quantity : currentQty + change;

    if (input.type === 'outbound' && newQty < 0) {
      throw new Error('庫存不足，無法出庫。');
    }

    // 2. Upsert inventory level
    const { error: upsertError } = await supabase
      .from('inventory_levels')
      .upsert(
        {
          item_id: input.itemId,
          warehouse_id: input.warehouseId,
          quantity: newQty,
          last_updated: new Date().toISOString(),
        },
        { onConflict: 'item_id, warehouse_id' }
      );

    if (upsertError) throw upsertError;

    // 3. Create movement record
    const { error: movementError } = await supabase
      .from('inventory_movements')
      .insert({
        item_id: input.itemId,
        warehouse_id: input.warehouseId,
        type: input.type,
        quantity: input.quantity, // Always positive
        unit_price: input.unitPrice,
        project_id: input.projectId,
        notes: input.notes,
        operator_id: input.operatorId,
      });

    if (movementError) throw movementError;

    revalidatePath(WAREHOUSING_PATH);
    return { success: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : '发生未知错误';
    console.error('紀錄庫存移動時發生錯誤:', error);
    return { success: false, error: `操作失敗: ${error}` };
  }
}

// --- Inventory Category Actions ---

export async function saveCategoryAction(
  data: Omit<InventoryCategory, 'id' | 'createdAt'>,
  categoryId?: string
): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  try {

    if (categoryId) {
      const { error } = await supabase
        .from('inventory_categories')
        .update(data)
        .eq('id', categoryId);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('inventory_categories')
        .insert(data);
      if (error) throw error;
    }
    revalidatePath(WAREHOUSING_PATH);
    return { success: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : '發生未知錯誤';
    console.error('儲存分類時發生錯誤:', error, e);
    return { success: false, error: `儲存失敗: ${error}` };
  }
}

export async function deleteCategoryAction(
  categoryId: string
): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  try {
    const { error } = await supabase
      .from('inventory_categories')
      .delete()
      .eq('id', categoryId);
    if (error) throw error;
    revalidatePath(WAREHOUSING_PATH);
    return { success: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : '發生未知錯誤';
    return { success: false, error: `刪除失敗: ${error}` };
  }
}
