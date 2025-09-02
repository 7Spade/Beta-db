/**
 * @fileoverview 倉儲管理 Server Actions
 * @description 處理所有與倉庫、物料、庫存相關的後端業務邏輯。
 */
'use server';

import { connectDB } from '@/features/integrations/database/mongoose/mongodb';
import InventoryMovement from '@/shared/models/inventory-movement.model';
import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import type { InventoryItem, Warehouse } from '@root/src/shared/types/types';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
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
  try {
    if (warehouseId) {
      const warehouseRef = doc(firestore, 'warehouses', warehouseId);
      await setDoc(warehouseRef, data, { merge: true });
    } else {
      await addDoc(collection(firestore, 'warehouses'), data);
    }
    revalidatePath(WAREHOUSES_PATH);
    return { success: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : '發生未知錯誤';
    console.error('儲存倉庫時發生錯誤:', error);
    return { success: false, error: `儲存失敗: ${error}` };
  }
}

export async function deleteWarehouseAction(
  warehouseId: string
): Promise<ActionResult> {
  try {
    await deleteDoc(doc(firestore, 'warehouses', warehouseId));
    revalidatePath(WAREHOUSES_PATH);
    return { success: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : '發生未知錯誤';
    console.error('刪除倉庫時發生錯誤:', error);
    return { success: false, error: `刪除失敗: ${error}` };
  }
}

// --- Inventory Item Actions ---

export async function saveItemAction(
  data: Omit<InventoryItem, 'id'>,
  itemId?: string
): Promise<ActionResult> {
  try {
    if (itemId) {
      const itemRef = doc(firestore, 'inventory_items', itemId);
      await setDoc(itemRef, data, { merge: true });
    } else {
      await addDoc(collection(firestore, 'inventory_items'), {
        ...data,
        createdAt: serverTimestamp(),
      });
    }
    revalidatePath(ITEMS_PATH);
    return { success: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : '發生未知錯誤';
    console.error('儲存物料時發生錯誤:', error);
    return { success: false, error: `儲存失敗: ${error}` };
  }
}

export async function deleteItemAction(itemId: string): Promise<ActionResult> {
  try {
    await deleteDoc(doc(firestore, 'inventory_items', itemId));
    revalidatePath(ITEMS_PATH);
    return { success: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : '發生未知錯誤';
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
  try {
    await connectDB(); // 連接 MongoDB

    // 1. Firestore Transaction to update inventory_levels
    await runTransaction(firestore, async (transaction) => {
      const levelId = `${input.itemId}_${input.warehouseId}`;
      const levelRef = doc(firestore, 'inventory_levels', levelId);
      const levelDoc = await transaction.get(levelRef);

      const change = input.type === 'outbound' ? -input.quantity : input.quantity;

      if (levelDoc.exists()) {
        const currentQty = levelDoc.data().quantity || 0;
        const newQty = currentQty + change;
        if (newQty < 0) {
          throw new Error('庫存不足，無法出庫。');
        }
        transaction.update(levelRef, {
          quantity: newQty,
          lastUpdated: serverTimestamp(),
        });
      } else {
        if (change < 0) {
          throw new Error('庫存不足，無法出庫。');
        }
        transaction.set(levelRef, {
          itemId: input.itemId,
          warehouseId: input.warehouseId,
          quantity: change,
          lastUpdated: serverTimestamp(),
        });
      }
    });

    // 2. Create movement record in MongoDB
    await InventoryMovement.create({
      ...input,
      timestamp: new Date(),
    });
    
    revalidatePath(MOVEMENTS_PATH);
    return { success: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : '發生未知錯誤';
    console.error('紀錄庫存移動時發生錯誤:', error);
    return { success: false, error: `操作失敗: ${error}` };
  }
}
