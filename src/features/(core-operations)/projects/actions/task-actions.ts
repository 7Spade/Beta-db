'use server';

import type { Task } from '@/features/(core-operations)/projects/types';
import { firestore } from '@/lib/db/firebase-client/firebase-client';
import { doc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function addTaskAction(
  projectId: string,
  tasks: Task[],
  parentTaskId: string | null,
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

  const addRecursive = (currentTasks: Task[]): Task[] => {
    if (parentTaskId === null) {
      return [...currentTasks, newTask];
    }
    return currentTasks.map((task) => {
      if (task.id === parentTaskId) {
        return { ...task, subTasks: [...task.subTasks, newTask] };
      }
      if (task.subTasks && task.subTasks.length > 0) {
        return { ...task, subTasks: addRecursive(task.subTasks) };
      }
      return task;
    });
  };

  const newTasks = addRecursive(tasks);

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
