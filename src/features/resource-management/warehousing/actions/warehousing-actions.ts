/**
 * @fileoverview 倉儲管理 Server Actions
 * @description 處理所有與倉庫、物料、庫存相關的後端業務邏輯
 */
'use server';

import { createClient } from '@/features/integrations/database/supabase/server';
import {
  mapInventoryCategory,
  mapInventoryItem,
  mapInventoryMovement,
  mapWarehouse
} from '@/features/resource-management/warehousing/utils/data-mappers';
import type {
  InventoryCategory,
  InventoryItem,
  Warehouse
} from '@root/src/shared/types/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const WAREHOUSING_PATH = '/resource-management/warehousing';

type ActionResult = {
  success: boolean;
  error?: string;
};

// 通用錯誤處理函數
const handleError = (error: unknown, operation: string): ActionResult => {
  const message = error instanceof Error ? error.message : '發生未知錯誤';
  console.error(`${operation}時發生錯誤:`, message, error);
  return { success: false, error: `${operation}失敗: ${message}` };
};

// 通用 Supabase 客戶端獲取
const getSupabaseClient = async () => {
  const cookieStore = await cookies();
  return createClient(cookieStore);
};

// --- Data Fetching Actions ---

export async function getWarehousingData() {
  try {
    const supabase = await getSupabaseClient();

    const [warehousesRes, itemsRes, categoriesRes, movementsRes] =
      await Promise.all([
        supabase.from('warehouses').select('*').order('name'),
        supabase.from('inventory_items').select('*').order('name'),
        supabase.from('inventory_categories').select('*').order('name'),
        supabase
          .from('inventory_movements')
          .select('*')
          .order('timestamp', { ascending: false }),
      ]);

    // 檢查是否有錯誤
    if (warehousesRes.error) {
      console.error('獲取倉庫數據錯誤:', warehousesRes.error);
    }
    if (itemsRes.error) {
      console.error('獲取物料數據錯誤:', itemsRes.error);
    }
    if (categoriesRes.error) {
      console.error('獲取分類數據錯誤:', categoriesRes.error);
    }
    if (movementsRes.error) {
      console.error('獲取移動記錄錯誤:', movementsRes.error);
    }

    // 使用統一的數據映射
    const warehouses = (warehousesRes.data || []).map(mapWarehouse);
    const items = (itemsRes.data || []).map(mapInventoryItem);
    const categories = (categoriesRes.data || []).map(mapInventoryCategory);
    const movements = (movementsRes.data || []).map(mapInventoryMovement);

    return {
      warehouses,
      items,
      categories,
      movements,
    };
  } catch (error) {
    console.error('獲取倉儲數據時發生錯誤:', error);
    return {
      warehouses: [],
      items: [],
      categories: [],
      movements: [],
    };
  }
}

// --- Warehouse Actions ---

export async function saveWarehouseAction(
  data: Omit<Warehouse, 'id' | 'createdAt'>,
  warehouseId?: string
): Promise<ActionResult> {
  try {
    const supabase = await getSupabaseClient();
    const { name, location, isActive } = data;
    const warehouseData = { name, location, is_active: isActive };

    const { error } = warehouseId
      ? await supabase.from('warehouses').update(warehouseData).eq('id', warehouseId)
      : await supabase.from('warehouses').insert(warehouseData);

    if (error) throw error;
    revalidatePath(WAREHOUSING_PATH);
    return { success: true };
  } catch (error) {
    return handleError(error, '儲存倉庫');
  }
}

export async function deleteWarehouseAction(warehouseId: string): Promise<ActionResult> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase.from('warehouses').delete().eq('id', warehouseId);
    if (error) throw error;
    revalidatePath(WAREHOUSING_PATH);
    return { success: true };
  } catch (error) {
    return handleError(error, '刪除倉庫');
  }
}

// --- Inventory Item Actions ---
type ItemData = Omit<InventoryItem, 'id' | 'createdAt'>;

export async function saveItemAction(data: ItemData, itemId?: string): Promise<ActionResult> {
  try {
    const supabase = await getSupabaseClient();
    const {
      name,
      category,
      unit,
      safeStockLevel,
      itemType,
      hasExpiryTracking,
      requiresMaintenance,
      requiresInspection,
      isSerialized,
    } = data;

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

    const { error } = itemId
      ? await supabase.from('inventory_items').update(itemData).eq('id', itemId)
      : await supabase.from('inventory_items').insert(itemData);

    if (error) throw error;
    revalidatePath(WAREHOUSING_PATH);
    return { success: true };
  } catch (error) {
    return handleError(error, '儲存物料');
  }
}

export async function deleteItemAction(itemId: string): Promise<ActionResult> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase.from('inventory_items').delete().eq('id', itemId);
    if (error) throw error;
    revalidatePath(WAREHOUSING_PATH);
    return { success: true };
  } catch (error) {
    return handleError(error, '刪除物料');
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

export async function recordMovementAction(input: RecordMovementInput): Promise<ActionResult> {
  try {
    const supabase = await getSupabaseClient();

    // 1. Get current stock level
    const { data: level, error: levelError } = await supabase
      .from('inventory_levels')
      .select('id, quantity')
      .eq('item_id', input.itemId)
      .eq('warehouse_id', input.warehouseId)
      .single();

    if (levelError && levelError.code !== 'PGRST116') throw levelError;

    const currentQty = level?.quantity || 0;
    const change = input.type === 'inbound' || input.type === 'adjust' ? input.quantity : -input.quantity;
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
    const { error: movementError } = await supabase.from('inventory_movements').insert({
      item_id: input.itemId,
      warehouse_id: input.warehouseId,
      type: input.type,
      quantity: input.quantity,
      unit_price: input.unitPrice,
      project_id: input.projectId,
      notes: input.notes,
      operator_id: input.operatorId,
    });

    if (movementError) throw movementError;
    revalidatePath(WAREHOUSING_PATH);
    return { success: true };
  } catch (error) {
    return handleError(error, '紀錄庫存移動');
  }
}

// --- Inventory Category Actions ---

export async function saveCategoryAction(
  data: Omit<InventoryCategory, 'id' | 'createdAt'>,
  categoryId?: string
): Promise<ActionResult> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = categoryId
      ? await supabase.from('inventory_categories').update(data).eq('id', categoryId)
      : await supabase.from('inventory_categories').insert(data);

    if (error) throw error;
    revalidatePath(WAREHOUSING_PATH);
    return { success: true };
  } catch (error) {
    return handleError(error, '儲存分類');
  }
}

export async function deleteCategoryAction(categoryId: string): Promise<ActionResult> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase.from('inventory_categories').delete().eq('id', categoryId);
    if (error) throw error;
    revalidatePath(WAREHOUSING_PATH);
    return { success: true };
  } catch (error) {
    return handleError(error, '刪除分類');
  }
}
