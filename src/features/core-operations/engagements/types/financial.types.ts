/**
 * @fileoverview 財務相關類型定義
 */
import type { Timestamp } from 'firebase/firestore';

// 付款相關類型
export type PaymentStatus = '已付款' | '待處理' | '已逾期' | '已取消';

export interface Payment {
  id: string;
  amount: number;
  status: PaymentStatus;
  requestDate: Date | Timestamp;
  paidDate?: Date | Timestamp;
  description?: string;
  paymentMethod?: string;
  referenceNumber?: string;
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedBy: string;
  updatedAt: Date | Timestamp;
}

export interface PaymentSummary {
  totalRequested: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  progressPercentage: number;
}

// 收款相關類型
export type ReceiptStatus = '已收款' | '待處理' | '已逾期' | '已取消';

export interface Receipt {
  id: string;
  amount: number;
  status: ReceiptStatus;
  requestDate: Date | Timestamp;
  receivedDate?: Date | Timestamp;
  description?: string;
  invoiceNumber?: string;
  paymentMethod?: string;
  referenceNumber?: string;
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedBy: string;
  updatedAt: Date | Timestamp;
}

export interface ReceiptSummary {
  totalRequested: number;
  totalReceived: number;
  totalPending: number;
  totalOverdue: number;
  progressPercentage: number;
}

// 發票相關類型
export type InvoiceStatus = '草稿' | '已發送' | '已付款' | '已逾期' | '已取消';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: InvoiceStatus;
  issueDate: Date | Timestamp;
  dueDate: Date | Timestamp;
  paidDate?: Date | Timestamp;
  description?: string;
  items: InvoiceItem[];
  taxAmount?: number;
  totalAmount: number;
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedBy: string;
  updatedAt: Date | Timestamp;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate?: number;
}

export interface InvoiceSummary {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  progressPercentage: number;
}

// 財務摘要
export interface FinancialSummary {
  totalValue: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  paymentProgress: number;
  receiptProgress: number;
  invoiceProgress: number;
  profitMargin?: number;
  costBreakdown: {
    labor: number;
    materials: number;
    equipment: number;
    overhead: number;
    other: number;
  };
}

// 創建輸入類型
export interface CreatePaymentInput {
  amount: number;
  description?: string;
  paymentMethod?: string;
  referenceNumber?: string;
}

export interface CreateReceiptInput {
  amount: number;
  description?: string;
  invoiceNumber?: string;
  paymentMethod?: string;
  referenceNumber?: string;
}

export interface CreateInvoiceInput {
  invoiceNumber: string;
  amount: number;
  dueDate: Date;
  description?: string;
  items: Omit<InvoiceItem, 'id'>[];
  taxAmount?: number;
}