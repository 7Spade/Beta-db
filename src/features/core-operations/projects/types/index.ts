
import type { Timestamp } from 'firebase/firestore';

export type TaskStatus = '待處理' | '進行中' | '已完成';

export interface Task {
  id: string;
  title: string;
  lastUpdated: string; // ISO 8601 string
  subTasks: Task[];
  value: number;
  quantity: number;
  unitPrice: number;
  discount?: number; // 新增折扣欄位
  completedQuantity: number;
}

export interface Project {
  id: string;
  customId?: string;
  title: string;
  description: string;
  client?: string;
  clientRepresentative?: string;
  startDate: Date;
  endDate: Date;
  tasks: Task[];
  value: number;
}

export type AcceptanceStatus = '草稿' | '待審批' | '已批准' | '已駁回';

export interface AcceptanceRecord {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  taskId: string; // New field
  submittedQuantity: number; // New field
  applicantId: string;
  applicantName: string;
  reviewerId: string;
  status: AcceptanceStatus;
  notes?: string;
  attachments?: Array<{ name: string; url: string }>;
  history?: Array<{
    action: string;
    userId: string;
    timestamp: Date | string | Timestamp;
  }>;
  submittedAt: Date | string | Timestamp;
  reviewedAt?: Date | string | Timestamp;
}
