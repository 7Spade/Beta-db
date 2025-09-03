/**
 * @fileoverview 進度管理相關類型定義
 */
import type { Timestamp } from 'firebase/firestore';

// 里程碑相關類型
export type MilestoneStatus = '未開始' | '進行中' | '已完成' | '已延遲' | '已取消';

export interface Milestone {
  id: string;
  title: string;
  name: string;
  description?: string;
  status: MilestoneStatus;
  plannedDate: Date | Timestamp;
  dueDate: Date | Timestamp;
  actualDate?: Date | Timestamp;
  progress: number; // 0-100
  dependencies?: string[]; // Milestone IDs
  deliverables?: string[]; // Deliverable IDs
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedBy: string;
  updatedAt: Date | Timestamp;
}

// 交付物相關類型
export type DeliverableStatus = '未開始' | '進行中' | '已完成' | '已驗收' | '已拒絕';

export interface Deliverable {
  id: string;
  title: string;
  name: string;
  description?: string;
  status: DeliverableStatus;
  type: 'document' | 'product' | 'service' | 'report' | 'other';
  plannedDate: Date | Timestamp;
  actualDate?: Date | Timestamp;
  acceptedDate?: Date | Timestamp;
  progress: number; // 0-100
  assignedTo?: string;
  assignedToName?: string;
  acceptanceCriteria?: string[];
  attachments?: string[]; // File URLs
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedBy: string;
  updatedAt: Date | Timestamp;
}

// 進度摘要
export interface ProgressSummary {
  overallProgress: number;
  milestoneProgress: number;
  deliverableProgress: number;
  taskProgress: number;
  completedMilestones: number;
  totalMilestones: number;
  completedDeliverables: number;
  totalDeliverables: number;
  onTimeMilestones: number;
  delayedMilestones: number;
  onTimeDeliverables: number;
  delayedDeliverables: number;
}

// 進度報告
export interface ProgressReport {
  id: string;
  engagementId: string;
  reportDate: Date | Timestamp;
  period: {
    startDate: Date | Timestamp;
    endDate: Date | Timestamp;
  };
  summary: ProgressSummary;
  milestones: Milestone[];
  deliverables: Deliverable[];
  issues: string[];
  risks: string[];
  nextSteps: string[];
  createdBy: string;
  createdAt: Date | Timestamp;
}

// 創建輸入類型
export interface CreateMilestoneInput {
  title: string;
  description?: string;
  plannedDate: Date;
  dependencies?: string[];
  deliverables?: string[];
}

export interface UpdateMilestoneInput {
  title?: string;
  description?: string;
  status?: MilestoneStatus;
  plannedDate?: Date;
  actualDate?: Date;
  progress?: number;
  dependencies?: string[];
  deliverables?: string[];
}

export interface CreateDeliverableInput {
  title: string;
  description?: string;
  type: 'document' | 'product' | 'service' | 'report' | 'other';
  plannedDate: Date;
  assignedTo?: string;
  acceptanceCriteria?: string[];
}

export interface UpdateDeliverableInput {
  title?: string;
  description?: string;
  status?: DeliverableStatus;
  type?: 'document' | 'product' | 'service' | 'report' | 'other';
  plannedDate?: Date;
  actualDate?: Date;
  acceptedDate?: Date;
  progress?: number;
  assignedTo?: string;
  acceptanceCriteria?: string[];
  attachments?: string[];
}