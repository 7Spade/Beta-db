'use server';

import type { Contract } from '@/features/core-operations/contracts/types';
import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';

/**
 * Server Action: 創建合約（與現有服務層整合）
 */
export async function createContractAction(
  data: Omit<Contract, 'id' | 'payments' | 'changeOrders' | 'versions'>
): Promise<{ success: boolean; contractId?: string; error?: string }> {
  try {
    // 這裡可以調用現有的 contractService.createContract
    // 或者直接實現邏輯以保持一致性
    const newContractRef = doc(collection(firestore, 'contracts'));
    const contractId = newContractRef.id;

    const contractData = {
      ...data,
      startDate: Timestamp.fromDate(data.startDate as Date),
      endDate: Timestamp.fromDate(data.endDate as Date),
      payments: [],
      changeOrders: [],
      versions: [
        {
          version: 1,
          date: Timestamp.now(),
          changeSummary: '初始版本',
        },
      ],
    };

    await setDoc(newContractRef, contractData);

    return { success: true, contractId };
  } catch (e) {
    console.error('創建合約時發生錯誤：', e);
    const errorMessage = e instanceof Error ? e.message : '發生未知錯誤。';
    return { success: false, error: `創建失敗：${errorMessage}` };
  }
}
