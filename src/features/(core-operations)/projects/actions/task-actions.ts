'use server';

import type {
  Project,
  Task,
} from '@/features/(core-operations)/projects/types';
import { firestore } from '@/lib/db/firebase-client/firebase-client';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

async function getProject(projectId: string): Promise<Project> {
  const projectRef = doc(firestore, 'projects', projectId);
  const projectSnap = await getDoc(projectRef);
  if (!projectSnap.exists()) {
    throw new Error('Project not found');
  }
  return { id: projectSnap.id, ...projectSnap.data() } as Project;
}

function findTask(
  tasks: Task[],
  taskId: string
): { task: Task; parent: Task[] } | null {
  for (const task of tasks) {
    if (task.id === taskId) {
      return { task, parent: tasks };
    }
    if (task.subTasks && task.subTasks.length > 0) {
      const found = findTask(task.subTasks, taskId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

export async function addTaskAction(
  projectId: string,
  parentTaskId: string | null,
  taskTitle: string
): Promise<{ success: boolean; error?: string; newTask?: Task }> {
  const project = await getProject(projectId);
  const tasks = project.tasks || [];

  const newTask: Task = {
    id: `task-${Date.now()}`,
    title: taskTitle,
    lastUpdated: new Date().toISOString(),
    subTasks: [],
    quantity: 1,
    unitPrice: 0,
    value: 0,
    completedQuantity: 0,
  };

  const addRecursive = (currentTasks: Task[]): Task[] => {
    return currentTasks.map((task) => {
      if (task.id === parentTaskId) {
        return { ...task, subTasks: [...(task.subTasks || []), newTask] };
      }
      if (task.subTasks && task.subTasks.length > 0) {
        return { ...task, subTasks: addRecursive(task.subTasks) };
      }
      return task;
    });
  };

  const newTasks = parentTaskId ? addRecursive(tasks) : [...tasks, newTask];

  try {
    const projectRef = doc(firestore, 'projects', projectId);
    await updateDoc(projectRef, { tasks: newTasks });
    revalidatePath('/projects');
    return { success: true, newTask };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '發生未知錯誤。';
    return { success: false, error: `新增任務失敗: ${errorMessage}` };
  }
}

export async function updateTaskAction(
  projectId: string,
  taskId: string,
  updates: Partial<Pick<Task, 'title' | 'quantity' | 'unitPrice'>>
): Promise<{ success: boolean; error?: string }> {
  const project = await getProject(projectId);
  const tasks = project.tasks || [];

  const updateRecursive = (currentTasks: Task[]): Task[] => {
    return currentTasks.map((task) => {
      if (task.id === taskId) {
        const newQuantity = updates.quantity ?? task.quantity;
        const newUnitPrice = updates.unitPrice ?? task.unitPrice;
        return {
          ...task,
          ...updates,
          value: newQuantity * newUnitPrice,
          lastUpdated: new Date().toISOString(),
        };
      }
      if (task.subTasks && task.subTasks.length > 0) {
        return { ...task, subTasks: updateRecursive(task.subTasks) };
      }
      return task;
    });
  };

  const newTasks = updateRecursive(tasks);

  try {
    const projectRef = doc(firestore, 'projects', projectId);
    await updateDoc(projectRef, { tasks: newTasks });
    revalidatePath('/projects');
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '發生未知錯誤。';
    return { success: false, error: `更新任務失敗: ${errorMessage}` };
  }
}

export async function updateTaskStatusAction(
  projectId: string,
  taskId: string,
  isComplete: boolean
): Promise<{ success: boolean; error?: string }> {
  const project = await getProject(projectId);
  const tasks = project.tasks || [];

  const updateRecursive = (currentTasks: Task[]): Task[] => {
    return currentTasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          completedQuantity: isComplete ? task.quantity : 0,
          lastUpdated: new Date().toISOString(),
        };
      }
      if (task.subTasks && task.subTasks.length > 0) {
        return { ...task, subTasks: updateRecursive(task.subTasks) };
      }
      return task;
    });
  };
  const newTasks = updateRecursive(tasks);

  try {
    const projectRef = doc(firestore, 'projects', projectId);
    await updateDoc(projectRef, { tasks: newTasks });
    revalidatePath('/projects');
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '發生未知錯誤。';
    return { success: false, error: `更新任務狀態失敗: ${errorMessage}` };
  }
}

export async function deleteTaskAction(
  projectId: string,
  taskId: string
): Promise<{ success: boolean; error?: string }> {
  const project = await getProject(projectId);
  const tasks = project.tasks || [];

  const deleteRecursive = (currentTasks: Task[]): Task[] => {
    return currentTasks.filter((task) => {
      if (task.id === taskId) {
        return false;
      }
      if (task.subTasks && task.subTasks.length > 0) {
        task.subTasks = deleteRecursive(task.subTasks);
      }
      return true;
    });
  };

  const newTasks = deleteRecursive(tasks);

  try {
    const projectRef = doc(firestore, 'projects', projectId);
    await updateDoc(projectRef, { tasks: newTasks });
    revalidatePath('/projects');
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '發生未知錯誤。';
    return { success: false, error: `刪除任務失敗: ${errorMessage}` };
  }
}
