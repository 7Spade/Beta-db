/**
 * @fileoverview Engagement 相關的 Server Actions
 */
'use server';

import { revalidatePath } from 'next/cache';
import { engagementService, notificationService } from '../services';
import type {
  CreateEngagementInput,
  UpdateEngagementInput,
  EngagementStatus,
  EngagementPhase,
} from '../types';

/**
 * 創建新的 Engagement
 */
export async function createEngagementAction(
  input: CreateEngagementInput
): Promise<{ success: boolean; engagementId?: string; error?: string }> {
  try {
    const result = await engagementService.createEngagement(input);
    
    if (result.success) {
      revalidatePath('/engagements');
      revalidatePath('/dashboard');
    }
    
    return result;
  } catch (error) {
    console.error('創建 Engagement Action 失敗:', error);
    const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: `創建失敗: ${errorMessage}` };
  }
}

/**
 * 更新 Engagement
 */
export async function updateEngagementAction(
  id: string,
  input: UpdateEngagementInput
): Promise<{ success: boolean; error?: string }> {
  try {
    // 如果需要發送狀態變更通知，先獲取舊的狀態
    let oldStatus: EngagementStatus | undefined;
    let oldPhase: EngagementPhase | undefined;
    
    if (input.status || input.phase) {
      const currentResult = await engagementService.getEngagement(id);
      if (currentResult.success && currentResult.engagement) {
        oldStatus = currentResult.engagement.status;
        oldPhase = currentResult.engagement.phase;
      }
    }

    const result = await engagementService.updateEngagement(id, input);
    
    if (result.success) {
      // 發送通知
      if (input.status && oldStatus && input.status !== oldStatus) {
        const engagementResult = await engagementService.getEngagement(id);
        if (engagementResult.success && engagementResult.engagement) {
          await notificationService.sendStatusChangeNotification(
            engagementResult.engagement,
            oldStatus,
            input.status
          );
        }
      }
      
      if (input.phase && oldPhase && input.phase !== oldPhase) {
        const engagementResult = await engagementService.getEngagement(id);
        if (engagementResult.success && engagementResult.engagement) {
          await notificationService.sendPhaseChangeNotification(
            engagementResult.engagement,
            oldPhase,
            input.phase
          );
        }
      }
      
      revalidatePath('/engagements');
      revalidatePath(`/engagements/${id}`);
      revalidatePath('/dashboard');
    }
    
    return result;
  } catch (error) {
    console.error('更新 Engagement Action 失敗:', error);
    const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: `更新失敗: ${errorMessage}` };
  }
}

/**
 * 刪除 Engagement
 */
export async function deleteEngagementAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await engagementService.deleteEngagement(id);
    
    if (result.success) {
      revalidatePath('/engagements');
      revalidatePath('/dashboard');
    }
    
    return result;
  } catch (error) {
    console.error('刪除 Engagement Action 失敗:', error);
    const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: `刪除失敗: ${errorMessage}` };
  }
}

/**
 * 批量更新 Engagements
 */
export async function batchUpdateEngagementsAction(
  updates: Array<{ id: string; data: UpdateEngagementInput }>
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await engagementService.batchUpdateEngagements(updates);
    
    if (result.success) {
      revalidatePath('/engagements');
      revalidatePath('/dashboard');
    }
    
    return result;
  } catch (error) {
    console.error('批量更新 Engagements Action 失敗:', error);
    const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: `批量更新失敗: ${errorMessage}` };
  }
}

/**
 * 變更 Engagement 狀態
 */
export async function changeEngagementStatusAction(
  id: string,
  status: EngagementStatus
): Promise<{ success: boolean; error?: string }> {
  return updateEngagementAction(id, { status });
}

/**
 * 變更 Engagement 階段
 */
export async function changeEngagementPhaseAction(
  id: string,
  phase: EngagementPhase
): Promise<{ success: boolean; error?: string }> {
  return updateEngagementAction(id, { phase });
}

/**
 * 標記 Engagement 為已完成
 */
export async function completeEngagementAction(
  id: string,
  actualEndDate?: Date
): Promise<{ success: boolean; error?: string }> {
  const updateData: UpdateEngagementInput = {
    status: '已完成',
    phase: '收尾',
  };
  
  if (actualEndDate) {
    updateData.actualEndDate = actualEndDate;
  }
  
  return updateEngagementAction(id, updateData);
}

/**
 * 暫停 Engagement
 */
export async function pauseEngagementAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  return updateEngagementAction(id, { status: '暫停' });
}

/**
 * 恢復 Engagement
 */
export async function resumeEngagementAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  return updateEngagementAction(id, { status: '進行中' });
}

/**
 * 取消 Engagement
 */
export async function cancelEngagementAction(
  id: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const updateData: UpdateEngagementInput = {
    status: '已取消',
    phase: '收尾',
  };
  
  // TODO: 可以將取消原因存儲在 notes 或其他欄位中
  
  return updateEngagementAction(id, updateData);
}