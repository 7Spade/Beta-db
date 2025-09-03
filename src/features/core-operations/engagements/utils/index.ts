/**
 * @fileoverview 工具函數統一導出
 */

// 日期工具
export * from './date.utils';

// 財務工具（重命名衝突的函數）
export {
  calculateFinancialHealthScore, calculateInvoiceSummary, calculatePaymentSummary,
  calculateReceiptSummary, formatFinancialCurrency,
  formatPercentage, generateFinancialReportData, getFinancialInvoiceStatusColor, getFinancialPaymentStatusColor,
  getFinancialReceiptStatusColor, isInvoiceOverdue, isPaymentOverdue,
  isReceiptOverdue
} from './financial.utils';

// 其他工具（避免 formatDate 衝突，並與實際導出對齊）
export {
  calculateDaysRemaining, calculateEngagementProgress, filterEngagements,
  // 以別名方式導出以避免與 date.utils 的 formatDate 衝突
  formatDate as formatEngagementDate, generateEngagementSummary,
  // 直接導出原名，避免與 status.utils 的命名衝突
  getPhaseColor,
  getStatusColor, isEngagementOverdue, sortEngagements
} from './engagement.utils';

export * from './status.utils';
export * from './subtask.utils';

