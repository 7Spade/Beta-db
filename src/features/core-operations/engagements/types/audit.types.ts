/**
 * @fileoverview 審計追蹤相關類型定義
 */
import type { Timestamp } from 'firebase/firestore';

// 審計日誌條目
export type AuditAction = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'approve' 
  | 'reject' 
  | 'submit' 
  | 'assign' 
  | 'complete' 
  | 'cancel' 
  | 'archive' 
  | 'restore';

export type AuditEntity = 
  | 'engagement' 
  | 'task' 
  | 'payment' 
  | 'receipt' 
  | 'invoice' 
  | 'change_order' 
  | 'milestone' 
  | 'deliverable' 
  | 'acceptance_record' 
  | 'quality_check' 
  | 'risk' 
  | 'issue' 
  | 'communication' 
  | 'meeting' 
  | 'document' 
  | 'attachment';

export interface AuditLogEntry {
  id: string;
  entityType: AuditEntity;
  entityId: string;
  action: AuditAction;
  userId: string;
  userName: string;
  timestamp: Date | Timestamp;
  changes?: AuditChange[];
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditChange {
  field: string;
  oldValue?: any;
  newValue?: any;
  changeType: 'added' | 'modified' | 'removed';
}

// 審計摘要
export interface AuditSummary {
  totalEntries: number;
  entriesByAction: Record<AuditAction, number>;
  entriesByEntity: Record<AuditEntity, number>;
  entriesByUser: Record<string, number>;
  recentEntries: AuditLogEntry[];
  lastActivity: Date | Timestamp;
}

// 審計查詢參數
export interface AuditQuery {
  entityType?: AuditEntity;
  entityId?: string;
  action?: AuditAction;
  userId?: string;
  startDate?: Date | Timestamp;
  endDate?: Date | Timestamp;
  limit?: number;
  offset?: number;
}