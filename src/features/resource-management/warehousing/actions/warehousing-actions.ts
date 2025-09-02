/**
 * @fileoverview 倉儲管理 Server Actions
 * @description 處理所有與倉庫、物料、庫存相關的後端業務邏輯。
 */
'use server';

import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import type { Warehouse } from '@root/src/shared/types/types';
import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const WAREHOUSES_PATH = '/resource-management/warehousing/warehouses';

type ActionResult = {
    success: boolean;
    error?: string;
}

/**
 * 建立或更新一個倉庫據點。
 * @param data - 要儲存的倉庫資料。
 * @param warehouseId - (可選) 如果提供，則更新現有倉庫；否則，建立新倉庫。
 * @returns 一個包含操作結果的 Promise。
 */
export async function saveWarehouseAction(
    data: Omit<Warehouse, 'id'>,
    warehouseId?: string
): Promise<ActionResult> {
    try {
        if (warehouseId) {
            // 更新現有倉庫
            const warehouseRef = doc(firestore, 'warehouses', warehouseId);
            await setDoc(warehouseRef, data, { merge: true });
        } else {
            // 新增倉庫
            await addDoc(collection(firestore, 'warehouses'), data);
        }
        // 操作成功後，使相關頁面的快取失效以重新獲取最新資料
        revalidatePath(WAREHOUSES_PATH);
        return { success: true };
    } catch (e) {
        const error = e instanceof Error ? e.message : '發生未知錯誤';
        console.error("儲存倉庫時發生錯誤:", error);
        return { success: false, error: `儲存失敗: ${error}` };
    }
}

/**
 * 刪除一個倉庫據點。
 * @param warehouseId - 要刪除的倉庫 ID。
 * @returns 一個包含操作結果的 Promise。
 */
export async function deleteWarehouseAction(warehouseId: string): Promise<ActionResult> {
    try {
        // TODO: 在刪除前，應檢查倉庫是否仍有庫存。
        await deleteDoc(doc(firestore, 'warehouses', warehouseId));
        revalidatePath(WAREHOUSES_PATH);
        return { success: true };
    } catch (e) {
        const error = e instanceof Error ? e.message : '發生未知錯誤';
        console.error("刪除倉庫時發生錯誤:", error);
        return { success: false, error: `刪除失敗: ${error}` };
    }
}
