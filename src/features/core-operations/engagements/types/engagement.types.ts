/**
 * @fileoverview 統一的 Engagement 類型定義
 * 整合了專案管理和合約管理的所有功能
 */
import type { Timestamp } from 'firebase/firestore';

// 導入其他類型
import type { ChangeOrder } from './change.types';
import type { Communication, Meeting } from './communication.types';
import type { Attachment, AuditLogEntry, Document } from './document.types';
import type { Invoice, Payment, Receipt } from './financial.types';
import type { Deliverable, EngagementVersion, Milestone } from './progress.types';
import type { AcceptanceRecord, QualityCheck } from './quality.types';
import type { Issue, Risk } from './risk.types';
import type { Task } from './task.types';

// 統一的狀態類型
export type EngagementStatus =
  | '草稿'
  | '已簽約'
  | '進行中'
  | '暫停'
  | '已完成'
  | '已終止'
  | '已取消';

export type EngagementPhase =
  | '規劃'
  | '執行'
  | '監控'
  | '收尾'
  | '維護';

// 主要的 Engagement 介面
export interface Engagement {
  // 基本資訊
  id: string;
  customId?: string;
  name: string;
  description: string;

  // 參與方資訊
  contractor: string;
  client: string;
  clientRepresentative?: string;

  // 時間管理
  startDate: Date | Timestamp;
  endDate: Date | Timestamp;
  actualStartDate?: Date | Timestamp;
  actualEndDate?: Date | Timestamp;

  // 財務資訊
  totalValue: number;
  paidAmount: number;
  pendingAmount: number;
  currency: string;

  // 狀態管理
  status: EngagementStatus;
  phase: EngagementPhase;

  // 工作範疇
  scope: string;
  tasks: Task[];

  // 財務管理
  payments: Payment[];
  receipts: Receipt[];
  invoices: Invoice[];

  // 變更管理
  changeOrders: ChangeOrder[];
  versions: EngagementVersion[];

  // 進度管理
  milestones: Milestone[];
  deliverables: Deliverable[];

  // 品質管理
  acceptanceRecords: AcceptanceRecord[];
  qualityChecks: QualityCheck[];

  // 風險管理
  risks: Risk[];
  issues: Issue[];

  // 溝通管理
  communications: Communication[];
  meetings: Meeting[];

  // 文件管理
  documents: Document[];
  attachments: Attachment[];

  // 審計追蹤
  auditLog: AuditLogEntry[];
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedBy: string;
  updatedAt: Date | Timestamp;
}

// Engagement 摘要介面
export interface EngagementSummary {
  id: string;
  customId?: string;
  name: string;
  contractor: string;
  client: string;
  startDate: Date | Timestamp;
  endDate: Date | Timestamp;
  totalValue: number;
  status: EngagementStatus;
  phase: EngagementPhase;
  progressPercentage: number;
}

// 創建 Engagement 的輸入類型
export interface CreateEngagementInput {
  name: string;
  description: string;
  contractor: string;
  client: string;
  clientRepresentative?: string;
  startDate: Date;
  endDate: Date;
  totalValue: number;
  currency: string;
  scope: string;
}

// 更新 Engagement 的輸入類型
export interface UpdateEngagementInput {
  name?: string;
  description?: string;
  contractor?: string;
  client?: string;
  clientRepresentative?: string;
  startDate?: Date;
  endDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  totalValue?: number;
  currency?: string;
  status?: EngagementStatus;
  phase?: EngagementPhase;
  scope?: string;
}

// 導入其他相關類型
export type { AuditLogEntry } from './audit.types';
export type { ChangeOrder, EngagementVersion } from './change.types';
export type { Communication, Meeting } from './communication.types';
export type { Attachment, Document } from './document.types';
export type { Invoice, Payment, Receipt } from './financial.types';
export type { Deliverable, Milestone } from './progress.types';
export type { AcceptanceRecord, QualityCheck } from './quality.types';
export type { Issue, Risk } from './risk.types';
export type { Task } from './task.types';
