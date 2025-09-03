/**
 * @fileoverview 子任務工具函數
 */
import type { Task } from '../types';

/**
 * 遞歸計算任務的總價值
 */
export function calculateTaskValue(task: Task): number {
    let totalValue = task.value || 0;

    if (task.subTasks && task.subTasks.length > 0) {
        totalValue += task.subTasks.reduce((sum, subtask) => sum + calculateTaskValue(subtask), 0);
    }

    return totalValue;
}

/**
 * 遞歸計算任務的完成進度
 */
export function calculateTaskProgress(task: Task): number {
    if (task.quantity === 0) return 0;

    const completedQuantity = task.completedQuantity || 0;
    let progress = (completedQuantity / task.quantity) * 100;

    // 如果有子任務，計算子任務的加權平均進度
    if (task.subTasks && task.subTasks.length > 0) {
        const subtaskProgress = task.subTasks.reduce((sum, subtask) => {
            return sum + calculateTaskProgress(subtask);
        }, 0);

        const subtaskAverage = subtaskProgress / task.subTasks.length;
        progress = Math.max(progress, subtaskAverage);
    }

    return Math.min(progress, 100);
}

/**
 * 遞歸獲取所有子任務
 */
export function getAllSubtasks(task: Task): Task[] {
    let allSubtasks: Task[] = [];

    if (task.subTasks && task.subTasks.length > 0) {
        task.subTasks.forEach(subtask => {
            allSubtasks.push(subtask);
            allSubtasks = allSubtasks.concat(getAllSubtasks(subtask));
        });
    }

    return allSubtasks;
}

/**
 * 遞歸計算子任務統計
 */
export function calculateSubtaskStats(tasks: Task[]) {
    let totalTasks = 0;
    let completedTasks = 0;
    let totalValue = 0;
    let completedValue = 0;

    const processTask = (task: Task) => {
        totalTasks++;
        totalValue += task.value || 0;

        if (task.status === '已完成') {
            completedTasks++;
            completedValue += task.value || 0;
        }

        if (task.subTasks && task.subTasks.length > 0) {
            task.subTasks.forEach(processTask);
        }
    };

    tasks.forEach(processTask);

    return {
        totalTasks,
        completedTasks,
        totalValue,
        completedValue,
        progressPercentage: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    };
}

/**
 * 檢查任務是否有未完成的子任務
 */
export function hasIncompleteSubtasks(task: Task): boolean {
    if (task.subTasks && task.subTasks.length > 0) {
        return task.subTasks.some(subtask =>
            subtask.status !== '已完成' || hasIncompleteSubtasks(subtask)
        );
    }
    return false;
}

/**
 * 遞歸查找任務
 */
export function findTaskById(tasks: Task[], taskId: string): Task | null {
    for (const task of tasks) {
        if (task.id === taskId) {
            return task;
        }

        if (task.subTasks && task.subTasks.length > 0) {
            const found = findTaskById(task.subTasks, taskId);
            if (found) return found;
        }
    }

    return null;
}
