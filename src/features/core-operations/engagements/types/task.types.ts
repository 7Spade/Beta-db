/**
 * @fileoverview 任務相關類型定義
 */
import type { Timestamp } from 'firebase/firestore';

export type TaskStatus = '待處理' | '進行中' | '已完成' | '已暫停' | '已取消';

export type TaskPriority = '低' | '中' | '高' | '緊急';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  lastUpdated: Date | Timestamp;
  subTasks: Task[];
  value: number;
  quantity: number;
  unitPrice: number;
  discount?: number;
  completedQuantity: number;
  assignedTo?: string;
  assignedToName?: string;
  dueDate?: Date | Timestamp;
  completedDate?: Date | Timestamp;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  dependencies?: string[]; // Task IDs
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedBy: string;
  updatedAt: Date | Timestamp;
}

export interface TaskSummary {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  totalValue: number;
  completedValue: number;
  progressPercentage: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  value: number;
  quantity: number;
  unitPrice: number;
  discount?: number;
  assignedTo?: string;
  dueDate?: Date;
  estimatedHours?: number;
  tags?: string[];
  dependencies?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  value?: number;
  quantity?: number;
  unitPrice?: number;
  discount?: number;
  completedQuantity?: number;
  assignedTo?: string;
  dueDate?: Date;
  completedDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  dependencies?: string[];
}