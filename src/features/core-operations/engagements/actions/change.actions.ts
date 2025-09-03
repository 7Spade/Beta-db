/**
 * @fileoverview 變更管理相關的 Server Actions
 */
'use server';

import { revalidatePath } from 'next/cache';
import { engagementService, notificationService } from '../services';
import type {
  CreateChangeOrderInput,
  UpdateChangeOrderInput,
  ChangeOrderStatus,
} from '../types';

/**
 * 添加變更單
 */
export async function addChangeOrderAction(
  engagementId: string,
  input: CreateChangeOrderInput
): Promise<{ success: boolean; changeOrderId?: string; error?: string }> {
  try {
    // 獲取當前的 Engagement
    const engagementResult = await engagementService.getEngagement(engagementId);
    if (!engagementResult.success || !engagementResult.engagement) {
      return { success: false, error: 'Engagement 不存在' };
    }

    const engagement = engagementResult.engagement;
    
    // 創建新變更單
    const newChangeOrder = {
      id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...input,
      status: '待處理' as ChangeOrderStatus,
      date: new Date(),
      createdBy: 'system', // TODO: 從認證上下文獲取
      createdAt: new Date(),
      updatedBy: 'system', // TODO: 從認證上下文獲取
      updatedAt: new Date(),
    };

    // 更新 Engagement 的變更單列表
    const updatedChangeOrders = [...engagement.changeOrders, newChangeOrder];
    const result = await engagementService.updateEngagement(engagementId, {
      changeOrders: updatedChangeOrders as any, // 保持類型兼容，服務層負責驗證
    });

    if (result.success) {
      revalidatePath('/engagements');
      revalidatePath(`/engagements/${engagementId}`);
    }

    return { success: result.success, changeOrderId: newChangeOrder.id, error: result.error };
  } catch (error) {
    console.error('添加變更單 Action 失敗:', error);
    const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: `添加失敗: ${errorMessage}` };
  }
}

/**
 * 更新變更單
 */
export async function updateChangeOrderAction(
  engagementId: string,
  changeOrderId: string,
  input: UpdateChangeOrderInput
): Promise<{ success: boolean; error?: string }> {
  try {
    // 獲取當前的 Engagement
    const engagementResult = await engagementService.getEngagement(engagementId);
    if (!engagementResult.success || !engagementResult.engagement) {
      return { success: false, error: 'Engagement 不存在' };
    }

    const engagement = engagementResult.engagement;
    
    // 找到並更新變更單
    const updatedChangeOrders = engagement.changeOrders.map(changeOrder => {
      if (changeOrder.id === changeOrderId) {
        const mergedImpact = input.impact
          ? {
              cost: input.impact.cost ?? changeOrder.impact.cost,
              scheduleDays: input.impact.scheduleDays ?? changeOrder.impact.scheduleDays,
              scope: input.impact.scope ?? changeOrder.impact.scope,
            }
          : changeOrder.impact;

        return {
          ...changeOrder,
          ...input,
          impact: mergedImpact,
          updatedBy: 'system', // TODO: 從認證上下文獲取
          updatedAt: new Date(),
        };
      }
      return changeOrder;
    });

    const result = await engagementService.updateEngagement(engagementId, {
      changeOrders: updatedChangeOrders,
    });

    if (result.success) {
      revalidatePath('/engagements');
      revalidatePath(`/engagements/${engagementId}`);
    }

    return result;
  } catch (error) {
    console.error('更新變更單 Action 失敗:', error);
    const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: `更新失敗: ${errorMessage}` };
  }
}

/**
 * 審批變更單
 */
export async function approveChangeOrderAction(
  engagementId: string,
  changeOrderId: string,
  approvedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await updateChangeOrderAction(engagementId, changeOrderId, {
      status: '已核准',
      approvedBy,
      approvedDate: new Date(),
    });

    if (result.success) {
      // 發送審批通知
      const engagementResult = await engagementService.getEngagement(engagementId);
      if (engagementResult.success && engagementResult.engagement) {
        const changeOrder = engagementResult.engagement.changeOrders.find(co => co.id === changeOrderId);
        if (changeOrder) {
          await notificationService.sendApprovalRequestNotification(
            engagementId,
            '變更單',
            changeOrder.title,
            approvedBy
          );
        }
      }
    }

    return result;
  } catch (error) {
    console.error('審批變更單 Action 失敗:', error);
    const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: `審批失敗: ${errorMessage}` };
  }
}

/**
 * 拒絕變更單
 */
export async function rejectChangeOrderAction(
  engagementId: string,
  changeOrderId: string,
  rejectedBy: string,
  rejectionReason: string
): Promise<{ success: boolean; error?: string }> {
  return updateChangeOrderAction(engagementId, changeOrderId, {
    status: '已拒絕',
    rejectedBy,
    rejectedDate: new Date(),
    rejectionReason,
  });
}