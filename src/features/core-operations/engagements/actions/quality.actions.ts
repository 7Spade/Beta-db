'use server';

import { revalidatePath } from 'next/cache';
import { engagementService } from '../services/engagement.service';
import type { AcceptanceRecord } from '../types/quality.types';

export async function addAcceptanceRecordAction(
  engagementId: string,
  data: Omit<AcceptanceRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await engagementService.addAcceptanceRecord(engagementId, data as any);
    if (result.success) {
      revalidatePath(`/core-operations/engagements/${engagementId}`);
      revalidatePath('/core-operations/engagements');
    }
    return result;
  } catch (error) {
    console.error('添加驗收記錄失敗:', error);
    return { success: false, error: '添加驗收記錄失敗' };
  }
}

export async function updateAcceptanceRecordAction(
  engagementId: string,
  recordId: string,
  updates: Partial<AcceptanceRecord>
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await engagementService.updateAcceptanceRecord(engagementId, recordId, updates);
    if (result.success) {
      revalidatePath(`/core-operations/engagements/${engagementId}`);
      revalidatePath('/core-operations/engagements');
    }
    return result;
  } catch (error) {
    console.error('更新驗收記錄失敗:', error);
    return { success: false, error: '更新驗收記錄失敗' };
  }
}

export async function deleteAcceptanceRecordAction(
  engagementId: string,
  recordId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await engagementService.deleteAcceptanceRecord(engagementId, recordId);
    if (result.success) {
      revalidatePath(`/core-operations/engagements/${engagementId}`);
      revalidatePath('/core-operations/engagements');
    }
    return result;
  } catch (error) {
    console.error('刪除驗收記錄失敗:', error);
    return { success: false, error: '刪除驗收記錄失敗' };
  }
}


