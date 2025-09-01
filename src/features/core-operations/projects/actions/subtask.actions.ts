/**
 * @fileoverview Server Actions for Subtasks
 * @description This file contains Server Actions specifically for manipulating
 * nested subtasks within a project's task hierarchy.
 */
'use server';

import type { Task } from '../types';
import { firestore } from '@/lib/db/firebase-client/firebase-client';
import { doc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

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
  projectId: string,
  tasks: Task[],
  parentTaskId: string,
  taskTitle: string,
  quantity: number,
  unitPrice: number
): Promise<{ success: boolean; error?: string }> {
  const projectRef = doc(firestore, 'projects', projectId);

  const newSubtask: Task = {
    id: `task-${Date.now()}`,
    title: taskTitle,
    lastUpdated: new Date().toISOString(),
    subTasks: [],
    quantity: quantity,
    unitPrice: unitPrice,
    value: quantity * unitPrice,
    completedQuantity: 0,
  };

  const [newTasks, parentFound] = updateTaskRecursive(
    tasks,
    parentTaskId,
    (parentTask) => ({
      ...parentTask,
      subTasks: [...parentTask.subTasks, newSubtask],
    })
  );

  if (!parentFound) {
    return { success: false, error: '找不到指定的父任務。' };
  }

  try {
    await updateDoc(projectRef, { tasks: newTasks });
    revalidatePath('/projects');
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
  projectId: string,
  tasks: Task[],
  taskId: string
): Promise<{ success: boolean; error?: string }> {
  const projectRef = doc(firestore, 'projects', projectId);
  const [newTasks, wasDeleted] = deleteTaskRecursive(tasks, taskId);

  if (!wasDeleted) {
    return { success: false, error: '找不到要刪除的任務。' };
  }

  try {
    await updateDoc(projectRef, { tasks: newTasks });
    revalidatePath('/projects');
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
  projectId: string,
  tasks: Task[],
  taskId: string
): Promise<{ success: boolean; error?: string }> {
  const projectRef = doc(firestore, 'projects', projectId);

  const [newTasks, taskFound] = updateTaskRecursive(tasks, taskId, (task) => ({
    ...task,
    completedQuantity: task.quantity,
    lastUpdated: new Date().toISOString(),
  }));

  if (!taskFound) {
    return { success: false, error: '找不到要更新的任務。' };
  }

  try {
    await updateDoc(projectRef, { tasks: newTasks });
    revalidatePath('/projects');
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '發生未知錯誤。';
    return { success: false, error: `更新任務狀態失敗: ${errorMessage}` };
  }
}
