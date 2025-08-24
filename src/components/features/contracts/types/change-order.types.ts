/**
 * @fileoverview 變更單相關類型定義
 */

export type ChangeOrderStatus = "已核准" | "待處理" | "已拒絕";

export interface ChangeOrder {
  id: string;
  title: string;
  description: string;
  status: ChangeOrderStatus;
  date: Date;
  impact: {
    cost: number;
    scheduleDays: number;
  };
  approvedBy?: string;
  approvedDate?: Date;
}

export interface ChangeOrderSummary {
  totalApproved: number;
  totalPending: number;
  totalRejected: number;
  totalCostImpact: number;
  totalScheduleImpact: number;
}
