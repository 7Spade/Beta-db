import type { Task } from '../types';
import { format } from 'date-fns';

export function formatDate(date: Date | undefined): string {
  if (!date) return 'N/A';
  if (isNaN(date.getTime())) return '無效日期';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface ProgressResult {
  completedValue: number;
  totalValue: number;
}

/**
 * Recursively calculates the total and completed value of a list of tasks.
 * The core logic is that a parent task's value is the sum of its subtasks,
 * and only the leaf nodes (tasks without subtasks) have inherent value.
 * @param tasks - An array of Task objects.
 * @returns An object containing the total completed value and total value.
 */
export function calculateProjectProgress(tasks: Task[]): ProgressResult {
  let totalValue = 0;
  let completedValue = 0;

  function recurse(taskArray: Task[]): ProgressResult {
    let currentLevelTotal = 0;
    let currentLevelCompleted = 0;

    for (const task of taskArray) {
      if (task.subTasks && task.subTasks.length > 0) {
        // If it's a parent task, its value is derived from its children.
        const subTaskProgress = recurse(task.subTasks);
        currentLevelTotal += subTaskProgress.totalValue;
        currentLevelCompleted += subTaskProgress.completedValue;
      } else {
        // This is a leaf node, it has its own value.
        const taskTotal = task.value || 0;
        currentLevelTotal += taskTotal;

        // Progress is based on completedQuantity
        const completedRatio =
          (task.completedQuantity || 0) / (task.quantity || 1);
        currentLevelCompleted += taskTotal * Math.min(completedRatio, 1); // Cap at 100%
      }
    }
    return {
      totalValue: currentLevelTotal,
      completedValue: currentLevelCompleted,
    };
  }

  const result = recurse(tasks);
  totalValue = result.totalValue;
  completedValue = result.completedValue;

  return { totalValue, completedValue };
}
