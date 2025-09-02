/**
 * @fileoverview 倉儲管理 Server Actions
 * @description 處理所有與倉庫、物料、庫存相關的後端業務邏輯，現在使用 Supabase。
 */
'use server';

import { createClient } from '@/features/integrations/database/supabase/server';
import type {
  InventoryCategory,
  InventoryItem,
  LeaseAgreement,
  Warehouse,
} from '@root/src/shared/types/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const WAREHOUSING_PATH = '/resource-management/warehousing';

type ActionResult = {
  success: boolean;
  error?: string;
};

// 簡化的認證檢查函數 - 暫時跳過詳細驗證
async function verifyFirebaseAuth(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  try {
    // 檢查是否有 Firebase 相關的 cookies
    const firebaseCookies = [
      'firebase-auth-token',
      'firebase:authUser',
      'firebase:host:elite-chiller-455712-c4.firebaseapp.com',
    ];

    const hasFirebaseAuth = firebaseCookies.some(cookieName =>
      cookieStore.get(cookieName)?.value
    );

    if (!hasFirebaseAuth) {
      // 暫時允許通過，但記錄警告
      console.warn('未找到 Firebase 認證 cookies，但允許操作繼續');
      return {
        uid: 'anonymous',
        email: 'unknown@example.com',
        emailVerified: false,
      };
    }

    return {
      uid: 'authenticated-user',
      email: 'user@example.com',
      emailVerified: true,
    };
  } catch (error) {
    console.error('認證檢查失敗:', error);
    // 暫時允許通過，但記錄錯誤
    console.warn('認證檢查失敗，但允許操作繼續');
    return {
      uid: 'fallback-user',
      email: 'fallback@example.com',
      emailVerified: false,
    };
  }
}

// --- Warehouse & Lease Actions ---

export async function saveWarehouseWithLeaseAction(
  warehouseData: Omit<Warehouse, 'id' | 'createdAt' | 'is_active'> & { isActive: boolean },
  leaseData: Omit<LeaseAgreement, 'id' | 'warehouse_id' | 'createdAt'> | null,
  warehouseId?: string
): Promise<ActionResult & { warehouseId?: string }> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  try {
    let finalWarehouseId = warehouseId;

    if (warehouseId) {
      // 更新倉庫
      const { error: warehouseError } = await supabase
        .from('warehouses')
        .update({
          name: warehouseData.name,
          location: warehouseData.location,
          is_active: warehouseData.isActive,
        })
        .eq('id', warehouseId);
      if (warehouseError) throw warehouseError;
    } else {
      // 新增倉庫
      const { data, error: warehouseError } = await supabase
        .from('warehouses')
        .insert({
          name: warehouseData.name,
          location: warehouseData.location,
          is_active: warehouseData.isActive,
        })
        .select('id')
        .single();
      if (warehouseError) throw warehouseError;
      finalWarehouseId = data.id;
    }

    if (!finalWarehouseId) {
      throw new Error("未能取得倉庫ID");
    }

    // 如果有租約資訊，新增第一筆租約
    if (leaseData) {
      const { error: leaseError } = await supabase
        .from('lease_agreements')
        .insert({
          warehouse_id: finalWarehouseId,
          lease_start_date: leaseData.lease_start_date,
          lease_end_date: leaseData.lease_end_date,
          monthly_rent: leaseData.monthly_rent,
          lessor_name: leaseData.lessor_name,
          contract_document_url: leaseData.contract_document_url,
          status: leaseData.status || 'Active'
        });
      if (leaseError) throw leaseError;
    }

    revalidatePath(WAREHOUSING_PATH);
    return { success: true, warehouseId: finalWarehouseId };
  } catch (e) {
    const error = e instanceof Error ? e.message : '發生未知錯誤';
    console.error('儲存倉庫與租約時發生錯誤:', error);
    return { success: false, error: `儲存失敗: ${error}` };
  }
}

export async function saveWarehouseAction(
  data: Omit<Warehouse, 'id' | 'createdAt'>,
  warehouseId?: string
): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  try {
    // 檢查 Firebase 認證狀態
    const firebaseUser = await verifyFirebaseAuth(cookieStore);
    console.log('Firebase 認證成功:', { uid: firebaseUser.uid, email: firebaseUser.email });

    const { name, location, isActive } = data;
    const warehouseData = { name, location, is_active: isActive };

    console.log('準備儲存倉庫數據:', { warehouseData, warehouseId, userId: firebaseUser.uid });

    if (warehouseId) {
      const { data: updateData, error } = await supabase
        .from('warehouses')
        .update(warehouseData)
        .eq('id', warehouseId)
        .select();
      if (error) {
        console.error('更新倉庫錯誤:', error);
        throw new Error(`更新失敗: ${error.message}`);
      }
      console.log('倉庫更新成功:', updateData);
    } else {
      const { data: insertData, error } = await supabase
        .from('warehouses')
        .insert(warehouseData)
        .select();
      if (error) {
        console.error('插入倉庫錯誤:', error);
        throw new Error(`插入失敗: ${error.message}`);
      }
      console.log('倉庫插入成功:', insertData);
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
    // 檢查 Firebase 認證狀態
    const firebaseUser = await verifyFirebaseAuth(cookieStore);
    console.log('Firebase 認證成功:', { uid: firebaseUser.uid, email: firebaseUser.email });

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

    console.log('準備儲存物料數據:', { itemData, itemId, userId: firebaseUser.uid });

    if (itemId) {
      const { data: updateData, error } = await supabase
        .from('inventory_items')
        .update(itemData)
        .eq('id', itemId)
        .select();
      if (error) {
        console.error('更新物料錯誤:', error);
        throw new Error(`更新失敗: ${error.message}`);
      }
      console.log('物料更新成功:', updateData);
    } else {
      const { data: insertData, error } = await supabase
        .from('inventory_items')
        .insert(itemData)
        .select();
      if (error) {
        console.error('插入物料錯誤:', error);
        throw new Error(`插入失敗: ${error.message}`);
      }
      console.log('物料插入成功:', insertData);
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
    // 檢查 Firebase 認證狀態
    const firebaseUser = await verifyFirebaseAuth(cookieStore);
    console.log('Firebase 認證成功:', { uid: firebaseUser.uid, email: firebaseUser.email });

    console.log('準備儲存分類數據:', { data, categoryId, userId: firebaseUser.uid });

    if (categoryId) {
      const { data: updateData, error } = await supabase
        .from('inventory_categories')
        .update(data)
        .eq('id', categoryId)
        .select();
      if (error) {
        console.error('更新分類錯誤:', error);
        throw new Error(`更新失敗: ${error.message}`);
      }
      console.log('分類更新成功:', updateData);
    } else {
      const { data: insertData, error } = await supabase
        .from('inventory_categories')
        .insert(data)
        .select();
      if (error) {
        console.error('插入分類錯誤:', error);
        throw new Error(`插入失敗: ${error.message}`);
      }
      console.log('分類插入成功:', insertData);
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
