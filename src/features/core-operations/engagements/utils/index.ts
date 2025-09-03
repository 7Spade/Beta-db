/**
 * @fileoverview 工具函數統一導出
 */

// 日期工具
export * from './date.utils';

// 財務工具（重命名衝突的函數）
export {
  calculateFinancialHealthScore, calculateInvoiceSummary, calculatePaymentSummary,
  calculateReceiptSummary, formatCurrency, formatFinancialCurrency,
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

// 數據庫驗證工具
export * from './database-validation.utils';

// 錯誤處理工具
export * from './error-handling.utils';

// 性能優化工具
export * from './performance.utils';

// 數據庫修復工具
export * from './database-repair.utils';

// 並發控制工具
export * from './concurrency-control.utils';

