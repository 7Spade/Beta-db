/**
 * @fileoverview 變更單相關類型定義
 */
import type { Timestamp } from 'firebase-admin/firestore';

export type ChangeOrderStatus = '已核准' | '待處理' | '已拒絕';

export interface ChangeOrder {
  id: string;
  title: string;
  description: string;
  status: ChangeOrderStatus;
  date: Date | Timestamp;
  impact: {
    cost: number;
    scheduleDays: number;
  };
  approvedBy?: string;
  approvedDate?: Date | Timestamp;
}

export interface ChangeOrderSummary {
  totalApproved: number;
  totalPending: number;
  totalRejected: number;
  totalCostImpact: number;
  totalScheduleImpact: number;
}
