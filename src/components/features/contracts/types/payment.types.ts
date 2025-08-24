/**
 * @fileoverview 付款相關類型定義
 */

export type PaymentStatus = "已付款" | "待處理" | "已逾期";

export interface Payment {
  id: string;
  amount: number;
  status: PaymentStatus;
  requestDate: Date;
  paidDate?: Date;
  description?: string;
}

export interface PaymentSummary {
  totalRequested: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  progressPercentage: number;
}
