/**
 * @fileoverview 品質管理相關類型定義
 */
import type { Timestamp } from 'firebase/firestore';

// 驗收記錄相關類型
export type AcceptanceStatus = '草稿' | '待審批' | '已批准' | '已駁回';

export interface AcceptanceRecord {
  id: string;
  title: string;
  engagementId: string;
  engagementName: string;
  taskId?: string;
  deliverableId?: string;
  submittedQuantity: number;
  applicantId: string;
  applicantName: string;
  reviewerId?: string;
  reviewerName?: string;
  status: AcceptanceStatus;
  notes?: string;
  attachments?: Array<{ name: string; url: string }>;
  history?: Array<{
    action: string;
    userId: string;
    userName: string;
    timestamp: Date | string | Timestamp;
    notes?: string;
  }>;
  submittedAt: Date | string | Timestamp;
  reviewedAt?: Date | string | Timestamp;
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedBy: string;
  updatedAt: Date | Timestamp;
}

// 品質檢查相關類型
export type QualityCheckStatus = '待檢查' | '檢查中' | '已通過' | '未通過' | '需修正';

export interface QualityCheck {
  id: string;
  title: string;
  description?: string;
  status: QualityCheckStatus;
  type: 'inspection' | 'review' | 'test' | 'audit' | 'other';
  plannedDate: Date | Timestamp;
  actualDate?: Date | Timestamp;
  completedDate?: Date | Timestamp;
  assignedTo?: string;
  assignedToName?: string;
  criteria: QualityCriteria[];
  findings?: QualityFinding[];
  recommendations?: string[];
  attachments?: Array<{ name: string; url: string }>;
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedBy: string;
  updatedAt: Date | Timestamp;
}

export interface QualityCriteria {
  id: string;
  description: string;
  requirement: string;
  status: 'met' | 'not_met' | 'partial' | 'not_applicable';
  notes?: string;
}

export interface QualityFinding {
  id: string;
  type: 'defect' | 'improvement' | 'observation' | 'compliant';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location?: string;
  recommendation?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  dueDate?: Date | Timestamp;
  resolvedDate?: Date | Timestamp;
}

// 品質摘要
export interface QualitySummary {
  totalChecks: number;
  completedChecks: number;
  passedChecks: number;
  failedChecks: number;
  pendingChecks: number;
  totalFindings: number;
  openFindings: number;
  resolvedFindings: number;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  qualityScore: number; // 0-100
}

// 創建輸入類型
export interface CreateAcceptanceRecordInput {
  title: string;
  taskId?: string;
  deliverableId?: string;
  submittedQuantity: number;
  notes?: string;
  attachments?: Array<{ name: string; url: string }>;
}

export interface UpdateAcceptanceRecordInput {
  title?: string;
  status?: AcceptanceStatus;
  notes?: string;
  attachments?: Array<{ name: string; url: string }>;
}

export interface CreateQualityCheckInput {
  title: string;
  description?: string;
  type: 'inspection' | 'review' | 'test' | 'audit' | 'other';
  plannedDate: Date;
  assignedTo?: string;
  criteria: Omit<QualityCriteria, 'id'>[];
}

export interface UpdateQualityCheckInput {
  title?: string;
  description?: string;
  status?: QualityCheckStatus;
  type?: 'inspection' | 'review' | 'test' | 'audit' | 'other';
  plannedDate?: Date;
  actualDate?: Date;
  completedDate?: Date;
  assignedTo?: string;
  criteria?: QualityCriteria[];
  findings?: QualityFinding[];
  recommendations?: string[];
  attachments?: Array<{ name: string; url: string }>;
}