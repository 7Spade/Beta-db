/**
 * @fileoverview Server Actions for Subtasks
 * @description This file contains Server Actions specifically for manipulating
 * nested subtasks within an engagement's task hierarchy.
 */
'use server';

import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import { doc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { Task } from '../types';

/**
 * Recursively searches for a task by its ID and applies an update function.
 * @param tasks - The array of tasks to search through.
 * @param taskId - The ID of the task to update.
 * @param updateFn - The function to apply to the found task.
 * @returns A tuple: [the updated array of tasks, a boolean indicating if the task was found].
 */
const updateTaskRecursive = (
    tasks: Task[],
    taskId: string,
    updateFn: (task: Task) => Task
): [Task[], boolean] => {
    let taskFound = false;
    const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
            taskFound = true;
            return updateFn(task);
        }
        if (task.subTasks && task.subTasks.length > 0) {
            const [newSubTasks, subTaskFound] = updateTaskRecursive(
                task.subTasks,
                taskId,
                updateFn
            );
            if (subTaskFound) {
                taskFound = true;
                return { ...task, subTasks: newSubTasks };
            }
        }
        return task;
    });
    return [updatedTasks, taskFound];
};

/**
 * Recursively searches for and deletes a subtask by its ID.
 * @param tasks The array of tasks to search through.
 * @param taskId The ID of the task to delete.
 * @returns A tuple: [the updated array of tasks, a boolean indicating if the task was found and deleted].
 */
const deleteTaskRecursive = (
    tasks: Task[],
    taskId: string
): [Task[], boolean] => {
    let taskFound = false;
    const updatedTasks = tasks
        .filter((task) => {
            if (task.id === taskId) {
                taskFound = true;
                return false; // Exclude this task
            }
            return true;
        })
        .map((task) => {
            if (task.subTasks && task.subTasks.length > 0) {
                const [newSubTasks, subTaskFound] = deleteTaskRecursive(
                    task.subTasks,
                    taskId
                );
                if (subTaskFound) {
                    taskFound = true;
                    return { ...task, subTasks: newSubTasks };
                }
            }
            return task;
        });

    return [updatedTasks, taskFound];
};

/**
 * Adds a new subtask under a specified parent task.
 */
export async function addSubtaskAction(
    engagementId: string,
    tasks: Task[],
    parentTaskId: string,
    taskTitle: string,
    quantity: number,
    unitPrice: number
): Promise<{ success: boolean; error?: string }> {
    const engagementRef = doc(firestore, 'engagements', engagementId);

    const newSubtask: Task = {
        id: `task-${Date.now()}`,
        title: taskTitle,
        description: '',
        status: '待處理',
        priority: '中',
        lastUpdated: new Date(),
        subTasks: [],
        value: quantity * unitPrice,
        quantity: quantity,
        unitPrice: unitPrice,
        completedQuantity: 0,
        createdBy: 'system', // TODO: Get from auth context
        createdAt: new Date(),
        updatedBy: 'system',
        updatedAt: new Date(),
    };

    const [newTasks, parentFound] = updateTaskRecursive(
        tasks,
        parentTaskId,
        (parentTask) => ({
            ...parentTask,
            subTasks: [...(parentTask.subTasks || []), newSubtask],
        })
    );

    if (!parentFound) {
        return { success: false, error: '找不到指定的父任務。' };
    }

    try {
        await updateDoc(engagementRef, { tasks: newTasks });
        revalidatePath('/engagements');
        revalidatePath(`/engagements/${engagementId}`);
        return { success: true };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : '發生未知錯誤。';
        return { success: false, error: `新增子任務失敗: ${errorMessage}` };
    }
}

/**
 * Deletes a subtask.
 */
export async function deleteSubtaskAction(
    engagementId: string,
    tasks: Task[],
    taskId: string
): Promise<{ success: boolean; error?: string }> {
    const engagementRef = doc(firestore, 'engagements', engagementId);
    const [newTasks, wasDeleted] = deleteTaskRecursive(tasks, taskId);

    if (!wasDeleted) {
        return { success: false, error: '找不到要刪除的任務。' };
    }

    try {
        await updateDoc(engagementRef, { tasks: newTasks });
        revalidatePath('/engagements');
        revalidatePath(`/engagements/${engagementId}`);
        return { success: true };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : '發生未知錯誤。';
        return { success: false, error: `刪除任務失敗: ${errorMessage}` };
    }
}

/**
 * Updates the status of any task or subtask by marking it as complete.
 */
export async function updateTaskStatusAction(
    engagementId: string,
    tasks: Task[],
    taskId: string
): Promise<{ success: boolean; error?: string }> {
    const engagementRef = doc(firestore, 'engagements', engagementId);

    const [newTasks, taskFound] = updateTaskRecursive(tasks, taskId, (task) => ({
        ...task,
        completedQuantity: task.quantity,
        status: '已完成' as const,
        completedDate: new Date(),
        lastUpdated: new Date(),
        updatedAt: new Date(),
    }));

    if (!taskFound) {
        return { success: false, error: '找不到要更新的任務。' };
    }

    try {
        await updateDoc(engagementRef, { tasks: newTasks });
        revalidatePath('/engagements');
        revalidatePath(`/engagements/${engagementId}`);
        return { success: true };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : '發生未知錯誤。';
        return { success: false, error: `更新任務狀態失敗: ${errorMessage}` };
    }
}
