/**
 * @fileoverview Engagements 模組統一導出
 * 整合了專案管理和合約管理的所有功能
 */

// 類型定義
export * from './types';

// 服務層
export * from './services';

// Actions
export * from './actions';

// 視圖
export * from './views';

// Hooks
export * from './hooks';

// Providers
export * from './providers';

// 工具函數
export * from './utils';

// 常數
export * from './constants';

// 組件（明確導出以避免衝突）
export {
  AddSubtaskForm, AttachmentList, CommunicationList, ConfirmationDialog, CreateEngagementForm, DashboardCharts, DeleteEngagementDialog, DocumentList, EditEngagementForm,
  EngagementCard,
  // 新增的圖表組件
  EngagementChart,
  // 新增的彈窗組件
  EngagementDetailsDialog, EngagementDialog, EngagementReport,
  // 新增的表格組件
  EngagementsTable, EngagementSummaryCard, EngagementTable, FinancialChart, FinancialReport, FinancialSummary, InvoiceList, MeetingList, PaymentList, PaymentsTable, ProgressChart, ProgressReport, QualityChart, QualityReport, SubtaskActions, SubtaskList, TaskCard,
  TaskForm, TaskList, TasksTable, TaskTable
} from './components';

