/**
 * @fileoverview 變更管理相關類型定義
 */
import type { Timestamp } from 'firebase/firestore';

// 變更單相關類型
export type ChangeOrderStatus = '已核准' | '待處理' | '已拒絕' | '已取消';

export interface ChangeOrder {
  id: string;
  title: string;
  description: string;
  status: ChangeOrderStatus;
  date: Date | Timestamp;
  impact: {
    cost: number;
    scheduleDays: number;
    scope?: string;
  };
  approvedBy?: string;
  approvedDate?: Date | Timestamp;
  rejectedBy?: string;
  rejectedDate?: Date | Timestamp;
  rejectionReason?: string;
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedBy: string;
  updatedAt: Date | Timestamp;
}

export interface ChangeOrderSummary {
  totalApproved: number;
  totalPending: number;
  totalRejected: number;
  totalCostImpact: number;
  totalScheduleImpact: number;
}

// 版本管理相關類型
export interface EngagementVersion {
  version: number;
  date: Date | Timestamp;
  changeSummary: string;
  changes: VersionChange[];
  createdBy: string;
  approvedBy?: string;
  approvedDate?: Date | Timestamp;
}

export interface VersionChange {
  type: 'added' | 'modified' | 'removed';
  field: string;
  oldValue?: any;
  newValue?: any;
  description: string;
}

export interface VersionSummary {
  currentVersion: number;
  totalVersions: number;
  lastModified: Date | Timestamp;
  lastModifiedBy: string;
}

// 創建輸入類型
export interface CreateChangeOrderInput {
  title: string;
  description: string;
  impact: {
    cost: number;
    scheduleDays: number;
    scope?: string;
  };
}

export interface UpdateChangeOrderInput {
  title?: string;
  description?: string;
  status?: ChangeOrderStatus;
  impact?: {
    cost?: number;
    scheduleDays?: number;
    scope?: string;
  };
  approvedBy?: string;
  approvedDate?: Date | Timestamp;
  rejectedBy?: string;
  rejectedDate?: Date | Timestamp;
  rejectionReason?: string;
}

export interface CreateVersionInput {
  changeSummary: string;
  changes: Omit<VersionChange, 'type'>[];
}