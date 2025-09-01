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

export async function saveWarehouseAction(
    data: Omit<Warehouse, 'id'>,
    warehouseId?: string
): Promise<ActionResult> {
    try {
        if (warehouseId) {
            // Update existing warehouse
            const warehouseRef = doc(firestore, 'warehouses', warehouseId);
            await setDoc(warehouseRef, data, { merge: true });
        } else {
            // Add new warehouse
            await addDoc(collection(firestore, 'warehouses'), data);
        }
        revalidatePath(WAREHOUSES_PATH);
        return { success: true };
    } catch (e) {
        const error = e instanceof Error ? e.message : '發生未知錯誤';
        return { success: false, error };
    }
}


export async function deleteWarehouseAction(warehouseId: string): Promise<ActionResult> {
    try {
        // TODO: Check if warehouse has inventory before deleting
        await deleteDoc(doc(firestore, 'warehouses', warehouseId));
        revalidatePath(WAREHOUSES_PATH);
        return { success: true };
    } catch (e) {
        const error = e instanceof Error ? e.message : '發生未知錯誤';
        return { success: false, error };
    }
}
