/**
 * @fileoverview 財務相關的工具函數
 */
import type {
  Invoice,
  InvoiceStatus,
  Payment,
  PaymentStatus,
  Receipt,
  ReceiptStatus
} from '../types';

/**
 * 安全地將 Date | Timestamp 轉換為 Date
 */
function toDate(date: Date | any): Date {
  if (date instanceof Date) {
    return date;
  }
  if (date && typeof date.toDate === 'function') {
    return date.toDate();
  }
  return new Date(date);
}

/**
 * 格式化貨幣 (財務專用)
 */
export function formatFinancialCurrency(amount: number, currency: string = 'TWD'): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * 格式化百分比
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * 計算付款摘要
 */
export function calculatePaymentSummary(payments: Payment[]) {
  const totalRequested = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPaid = payments
    .filter(p => p.status === '已付款')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments
    .filter(p => p.status === '待處理')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments
    .filter(p => p.status === '已逾期')
    .reduce((sum, p) => sum + p.amount, 0);

  const progressPercentage = totalRequested > 0 ? (totalPaid / totalRequested) * 100 : 0;

  return {
    totalRequested,
    totalPaid,
    totalPending,
    totalOverdue,
    progressPercentage: Math.round(progressPercentage),
  };
}

/**
 * 計算收款摘要
 */
export function calculateReceiptSummary(receipts: Receipt[]) {
  const totalRequested = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
  const totalReceived = receipts
    .filter(r => r.status === '已收款')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalPending = receipts
    .filter(r => r.status === '待處理')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalOverdue = receipts
    .filter(r => r.status === '已逾期')
    .reduce((sum, r) => sum + r.amount, 0);

  const progressPercentage = totalRequested > 0 ? (totalReceived / totalRequested) * 100 : 0;

  return {
    totalRequested,
    totalReceived,
    totalPending,
    totalOverdue,
    progressPercentage: Math.round(progressPercentage),
  };
}

/**
 * 計算發票摘要
 */
export function calculateInvoiceSummary(invoices: Invoice[]) {
  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  const paidAmount = invoices
    .filter(i => i.status === '已付款')
    .reduce((sum, i) => sum + i.totalAmount, 0);
  const pendingAmount = invoices
    .filter(i => i.status === '已發送')
    .reduce((sum, i) => sum + i.totalAmount, 0);
  const overdueAmount = invoices
    .filter(i => i.status === '已逾期')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const progressPercentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

  return {
    totalInvoices,
    totalAmount,
    paidAmount,
    pendingAmount,
    overdueAmount,
    progressPercentage: Math.round(progressPercentage),
  };
}

/**
 * 獲取付款狀態顏色 (財務專用)
 */
export function getFinancialPaymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case '已付款': return 'bg-green-100 text-green-800';
    case '待處理': return 'bg-yellow-100 text-yellow-800';
    case '已逾期': return 'bg-red-100 text-red-800';
    case '已取消': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 獲取收款狀態顏色 (財務專用)
 */
export function getFinancialReceiptStatusColor(status: ReceiptStatus): string {
  switch (status) {
    case '已收款': return 'bg-green-100 text-green-800';
    case '待處理': return 'bg-yellow-100 text-yellow-800';
    case '已逾期': return 'bg-red-100 text-red-800';
    case '已取消': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 獲取發票狀態顏色 (財務專用)
 */
export function getFinancialInvoiceStatusColor(status: InvoiceStatus): string {
  switch (status) {
    case '草稿': return 'bg-gray-100 text-gray-800';
    case '已發送': return 'bg-blue-100 text-blue-800';
    case '已付款': return 'bg-green-100 text-green-800';
    case '已逾期': return 'bg-red-100 text-red-800';
    case '已取消': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 檢查付款是否逾期
 */
export function isPaymentOverdue(payment: Payment): boolean {
  if (payment.status === '已付款' || payment.status === '已取消') {
    return false;
  }

  const requestDate = toDate(payment.requestDate);
  const today = new Date();
  const daysDiff = Math.ceil((today.getTime() - requestDate.getTime()) / (1000 * 60 * 60 * 24));

  return daysDiff > 30; // 假設30天為逾期標準
}

/**
 * 檢查收款是否逾期
 */
export function isReceiptOverdue(receipt: Receipt): boolean {
  if (receipt.status === '已收款' || receipt.status === '已取消') {
    return false;
  }

  const requestDate = toDate(receipt.requestDate);
  const today = new Date();
  const daysDiff = Math.ceil((today.getTime() - requestDate.getTime()) / (1000 * 60 * 60 * 24));

  return daysDiff > 30; // 假設30天為逾期標準
}

/**
 * 檢查發票是否逾期
 */
export function isInvoiceOverdue(invoice: Invoice): boolean {
  if (invoice.status === '已付款' || invoice.status === '已取消') {
    return false;
  }

  const dueDate = toDate(invoice.dueDate);
  const today = new Date();

  return dueDate < today;
}

/**
 * 計算財務健康度分數
 */
export function calculateFinancialHealthScore(
  totalValue: number,
  payments: Payment[],
  receipts: Receipt[],
  invoices: Invoice[]
): number {
  const paymentSummary = calculatePaymentSummary(payments);
  const receiptSummary = calculateReceiptSummary(receipts);
  const invoiceSummary = calculateInvoiceSummary(invoices);

  // 計算各項指標的分數 (0-100)
  const paymentScore = paymentSummary.progressPercentage;
  const receiptScore = receiptSummary.progressPercentage;
  const invoiceScore = invoiceSummary.progressPercentage;

  // 計算逾期懲罰
  const overduePenalty = Math.min(
    (paymentSummary.totalOverdue + receiptSummary.totalOverdue + invoiceSummary.overdueAmount) / totalValue * 100,
    50
  );

  // 綜合分數
  const overallScore = (paymentScore + receiptScore + invoiceScore) / 3 - overduePenalty;

  return Math.max(0, Math.min(100, Math.round(overallScore)));
}

/**
 * 生成財務報表數據
 */
export function generateFinancialReportData(
  payments: Payment[],
  receipts: Receipt[],
  invoices: Invoice[]
) {
  const paymentSummary = calculatePaymentSummary(payments);
  const receiptSummary = calculateReceiptSummary(receipts);
  const invoiceSummary = calculateInvoiceSummary(invoices);

  return {
    payments: {
      summary: paymentSummary,
      data: payments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        requestDate: payment.requestDate,
        paidDate: payment.paidDate,
        description: payment.description,
        isOverdue: isPaymentOverdue(payment),
      })),
    },
    receipts: {
      summary: receiptSummary,
      data: receipts.map(receipt => ({
        id: receipt.id,
        amount: receipt.amount,
        status: receipt.status,
        requestDate: receipt.requestDate,
        receivedDate: receipt.receivedDate,
        description: receipt.description,
        invoiceNumber: receipt.invoiceNumber,
        isOverdue: isReceiptOverdue(receipt),
      })),
    },
    invoices: {
      summary: invoiceSummary,
      data: invoices.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.totalAmount,
        status: invoice.status,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        paidDate: invoice.paidDate,
        description: invoice.description,
        isOverdue: isInvoiceOverdue(invoice),
      })),
    },
  };
}