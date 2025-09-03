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

// 組件 (避免重複導出)
export {
  AddSubtaskForm, AttachmentList, CommunicationList, CreateEngagementForm, DashboardCharts, DocumentList, EditEngagementForm,
  EngagementCard, EngagementReport, EngagementSummaryCard, FinancialReport, FinancialSummary, InvoiceList, MeetingList, PaymentList, ProgressReport,
  QualityReport, SubtaskActions, SubtaskList, TaskCard,
  TaskForm, TaskList
} from './components';

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

// 主要類型重新導出
export type {
  CreateEngagementInput, Engagement, EngagementPhase, EngagementStatus, EngagementSummary, UpdateEngagementInput
} from './types';

// 主要服務重新導出
export {
  documentService, engagementService,
  financialService, notificationService
} from './services';

// 主要組件重新導出
export {
  CreateEngagementForm,
  EditEngagementForm,
  EngagementCard,
  EngagementSummaryCard
} from './components';

// 主要視圖重新導出
export {
  EngagementDashboard, EngagementDetailView, EngagementListView
} from './views';

// 主要 Hooks 重新導出
export {
  useCreateEngagementForm,
  useEditEngagementForm, useEngagement, useEngagementActions, useEngagements
} from './hooks';

// 主要 Providers 重新導出
export {
  EngagementProvider,
  useEngagementContext
} from './providers';
