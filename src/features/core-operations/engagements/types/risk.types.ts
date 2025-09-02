/**
 * @fileoverview 風險管理相關類型定義
 */
import type { Timestamp } from 'firebase/firestore';

// 風險相關類型
export type RiskStatus = '已識別' | '評估中' | '已緩解' | '已接受' | '已關閉';
export type RiskLevel = '低' | '中' | '高' | '極高';
export type RiskCategory = '技術' | '財務' | '進度' | '品質' | '資源' | '外部' | '其他';

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  level: RiskLevel;
  status: RiskStatus;
  probability: number; // 0-100
  impact: number; // 0-100
  riskScore: number; // probability * impact
  mitigationPlan?: string;
  contingencyPlan?: string;
  owner?: string;
  ownerName?: string;
  identifiedDate: Date | Timestamp;
  targetDate?: Date | Timestamp;
  actualDate?: Date | Timestamp;
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedBy: string;
  updatedAt: Date | Timestamp;
}

// 問題相關類型
export type IssueStatus = '新增' | '處理中' | '已解決' | '已關閉';
export type IssuePriority = '低' | '中' | '高' | '緊急';
export type IssueType = '缺陷' | '變更請求' | '問題' | '改進建議' | '其他';

export interface Issue {
  id: string;
  title: string;
  description: string;
  type: IssueType;
  priority: IssuePriority;
  status: IssueStatus;
  assignedTo?: string;
  assignedToName?: string;
  reportedBy: string;
  reportedByName: string;
  reportedDate: Date | Timestamp;
  dueDate?: Date | Timestamp;
  resolvedDate?: Date | Timestamp;
  resolution?: string;
  attachments?: Array<{ name: string; url: string }>;
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedBy: string;
  updatedAt: Date | Timestamp;
}

// 風險和問題摘要
export interface RiskIssueSummary {
  totalRisks: number;
  openRisks: number;
  highRisks: number;
  criticalRisks: number;
  totalIssues: number;
  openIssues: number;
  highPriorityIssues: number;
  urgentIssues: number;
  overdueRisks: number;
  overdueIssues: number;
}

// 創建輸入類型
export interface CreateRiskInput {
  title: string;
  description: string;
  category: RiskCategory;
  level: RiskLevel;
  probability: number;
  impact: number;
  mitigationPlan?: string;
  contingencyPlan?: string;
  owner?: string;
  targetDate?: Date;
}

export interface UpdateRiskInput {
  title?: string;
  description?: string;
  category?: RiskCategory;
  level?: RiskLevel;
  status?: RiskStatus;
  probability?: number;
  impact?: number;
  mitigationPlan?: string;
  contingencyPlan?: string;
  owner?: string;
  targetDate?: Date;
  actualDate?: Date;
}

export interface CreateIssueInput {
  title: string;
  description: string;
  type: IssueType;
  priority: IssuePriority;
  assignedTo?: string;
  dueDate?: Date;
}

export interface UpdateIssueInput {
  title?: string;
  description?: string;
  type?: IssueType;
  priority?: IssuePriority;
  status?: IssueStatus;
  assignedTo?: string;
  dueDate?: Date;
  resolvedDate?: Date;
  resolution?: string;
  attachments?: Array<{ name: string; url: string }>;
}