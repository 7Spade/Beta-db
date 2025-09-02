/**
 * @fileoverview 統一的類型定義導出
 */

// 主要類型
export * from './engagement.types';
export * from './task.types';
export * from './financial.types';
export * from './change.types';
export * from './progress.types';
export * from './quality.types';
export * from './risk.types';
export * from './communication.types';
export * from './document.types';
export * from './audit.types';

// 重新導出常用類型以便於使用
export type {
  Engagement,
  EngagementSummary,
  EngagementStatus,
  EngagementPhase,
  CreateEngagementInput,
  UpdateEngagementInput,
} from './engagement.types';

export type {
  Task,
  TaskSummary,
  TaskStatus,
  TaskPriority,
  CreateTaskInput,
  UpdateTaskInput,
} from './task.types';

export type {
  Payment,
  Receipt,
  Invoice,
  PaymentStatus,
  ReceiptStatus,
  InvoiceStatus,
  FinancialSummary,
} from './financial.types';

export type {
  ChangeOrder,
  EngagementVersion,
  ChangeOrderStatus,
  CreateChangeOrderInput,
  UpdateChangeOrderInput,
} from './change.types';

export type {
  Milestone,
  Deliverable,
  MilestoneStatus,
  DeliverableStatus,
  DeliverableType,
  ProgressSummary,
  CreateMilestoneInput,
  CreateDeliverableInput,
} from './progress.types';

export type {
  AcceptanceRecord,
  QualityCheck,
  AcceptanceStatus,
  QualityCheckStatus,
  QualitySummary,
  CreateAcceptanceRecordInput,
  CreateQualityCheckInput,
} from './quality.types';

export type {
  Risk,
  Issue,
  RiskStatus,
  IssueStatus,
  RiskLevel,
  IssuePriority,
  RiskIssueSummary,
  CreateRiskInput,
  CreateIssueInput,
} from './risk.types';

export type {
  Communication,
  Meeting,
  CommunicationType,
  MeetingType,
  MeetingStatus,
  CommunicationSummary,
  CreateCommunicationInput,
  CreateMeetingInput,
} from './communication.types';

export type {
  Document,
  Attachment,
  DocumentType,
  DocumentStatus,
  DocumentSummary,
  CreateDocumentInput,
  CreateAttachmentInput,
} from './document.types';

export type {
  AuditLogEntry,
  AuditAction,
  AuditEntity,
  AuditSummary,
  AuditQuery,
} from './audit.types';