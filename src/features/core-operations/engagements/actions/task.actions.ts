/**
 * @fileoverview 任務相關的 Server Actions
 */
'use server';

import { revalidatePath } from 'next/cache';
import { engagementService, notificationService } from '../services';
import type {
  CreateTaskInput,
  TaskStatus,
  UpdateTaskInput,
} from '../types';

/**
 * 添加任務到 Engagement
 */
export async function addTaskAction(
  engagementId: string,
  input: CreateTaskInput
): Promise<{ success: boolean; taskId?: string; error?: string }> {
  try {
    // 獲取當前的 Engagement
    const engagementResult = await engagementService.getEngagement(engagementId);
    if (!engagementResult.success || !engagementResult.engagement) {
      return { success: false, error: 'Engagement 不存在' };
    }

    const engagement = engagementResult.engagement;

    // 創建新任務
    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...input,
      status: '待處理' as TaskStatus,
      lastUpdated: new Date(),
      subTasks: [],
      completedQuantity: 0,
      createdBy: 'system', // TODO: 從認證上下文獲取
      createdAt: new Date(),
      updatedBy: 'system', // TODO: 從認證上下文獲取
      updatedAt: new Date(),
    };

    // 更新 Engagement 的任務列表
    const updatedTasks = [...engagement.tasks, newTask];
    const result = await engagementService.updateEngagement(engagementId, {
      tasks: updatedTasks,
    });

    if (result.success) {
      // 發送任務分配通知
      if (input.assignedTo) {
        await notificationService.sendTaskAssignmentNotification(
          engagementId,
          input.title,
          input.assignedTo
        );
      }

      revalidatePath('/engagements');
      revalidatePath(`/engagements/${engagementId}`);
    }

    return { success: result.success, taskId: newTask.id, error: result.error };
  } catch (error) {
    console.error('添加任務 Action 失敗:', error);
    const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: `添加失敗: ${errorMessage}` };
  }
}

/**
 * 更新任務
 */
export async function updateTaskAction(
  engagementId: string,
  taskId: string,
  input: UpdateTaskInput
): Promise<{ success: boolean; error?: string }> {
  try {
    // 獲取當前的 Engagement
    const engagementResult = await engagementService.getEngagement(engagementId);
    if (!engagementResult.success || !engagementResult.engagement) {
      return { success: false, error: 'Engagement 不存在' };
    }

    const engagement = engagementResult.engagement;

    // 找到並更新任務
    const updatedTasks = engagement.tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          ...input,
          lastUpdated: new Date(),
          updatedBy: 'system', // TODO: 從認證上下文獲取
          updatedAt: new Date(),
        };
      }
      return task;
    });

    const result = await engagementService.updateEngagement(engagementId, {
      tasks: updatedTasks,
    });

    if (result.success) {
      revalidatePath('/engagements');
      revalidatePath(`/engagements/${engagementId}`);
    }

    return result;
  } catch (error) {
    console.error('更新任務 Action 失敗:', error);
    const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: `更新失敗: ${errorMessage}` };
  }
}

/**
 * 刪除任務
 */
export async function deleteTaskAction(
  engagementId: string,
  taskId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 獲取當前的 Engagement
    const engagementResult = await engagementService.getEngagement(engagementId);
    if (!engagementResult.success || !engagementResult.engagement) {
      return { success: false, error: 'Engagement 不存在' };
    }

    const engagement = engagementResult.engagement;

    // 移除任務
    const updatedTasks = engagement.tasks.filter(task => task.id !== taskId);
    const result = await engagementService.updateEngagement(engagementId, {
      tasks: updatedTasks,
    });

    if (result.success) {
      revalidatePath('/engagements');
      revalidatePath(`/engagements/${engagementId}`);
    }

    return result;
  } catch (error) {
    console.error('刪除任務 Action 失敗:', error);
    const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: `刪除失敗: ${errorMessage}` };
  }
}

/**
 * 變更任務狀態
 */
export async function changeTaskStatusAction(
  engagementId: string,
  taskId: string,
  status: TaskStatus
): Promise<{ success: boolean; error?: string }> {
  return updateTaskAction(engagementId, taskId, { status });
}

/**
 * 分配任務
 */
export async function assignTaskAction(
  engagementId: string,
  taskId: string,
  assignedTo: string
): Promise<{ success: boolean; error?: string }> {
  const result = await updateTaskAction(engagementId, taskId, { assignedTo });

  if (result.success) {
    // 發送分配通知
    const engagementResult = await engagementService.getEngagement(engagementId);
    if (engagementResult.success && engagementResult.engagement) {
      const task = engagementResult.engagement.tasks.find(t => t.id === taskId);
      if (task) {
        await notificationService.sendTaskAssignmentNotification(
          engagementId,
          task.title,
          assignedTo
        );
      }
    }
  }

  return result;
}

/**
 * 更新任務進度
 */
export async function updateTaskProgressAction(
  engagementId: string,
  taskId: string,
  completedQuantity: number
): Promise<{ success: boolean; error?: string }> {
  return updateTaskAction(engagementId, taskId, { completedQuantity });
}

/**
 * 完成任務
 */
export async function completeTaskAction(
  engagementId: string,
  taskId: string
): Promise<{ success: boolean; error?: string }> {
  return updateTaskAction(engagementId, taskId, {
    status: '已完成',
    completedDate: new Date(),
  });
}