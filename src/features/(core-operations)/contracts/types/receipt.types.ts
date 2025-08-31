/**
 * @fileoverview 收款相關類型定義
 */
import type { Timestamp } from 'firebase-admin/firestore';

export type ReceiptStatus = '已收款' | '待處理' | '已逾期';

export interface Receipt {
  id: string;
  amount: number;
  status: ReceiptStatus;
  requestDate: Date | Timestamp;
  receivedDate?: Date | Timestamp;
  description?: string;
  invoiceNumber?: string;
}

export interface ReceiptSummary {
  totalRequested: number;
  totalReceived: number;
  totalPending: number;
  totalOverdue: number;
  progressPercentage: number;
}
