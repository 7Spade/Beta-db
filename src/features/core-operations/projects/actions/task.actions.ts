/**
 * @fileoverview Server Actions for Top-Level Tasks
 * @description This file contains Server Actions that operate directly on the root
 * task list of a project. For operations on nested subtasks, see `subtask.actions.ts`.
 */
'use server';

import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import { doc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { Task } from '../types';

/**
 * Adds a new top-level task to a project.
 */
export async function addTaskAction(
  projectId: string,
  tasks: Task[],
  taskTitle: string,
  quantity: number,
  unitPrice: number
): Promise<{ success: boolean; error?: string }> {
  const projectRef = doc(firestore, 'projects', projectId);

  const newTask: Task = {
    id: `task-${Date.now()}`,
    title: taskTitle,
    lastUpdated: new Date().toISOString(),
    subTasks: [],
    quantity: quantity,
    unitPrice: unitPrice,
    value: quantity * unitPrice,
    completedQuantity: 0,
  };

  const newTasks = [...tasks, newTask];

  try {
    await updateDoc(projectRef, { tasks: newTasks });
    revalidatePath('/projects');
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '發生未知錯誤。';
    return { success: false, error: `新增任務失敗: ${errorMessage}` };
  }
}
