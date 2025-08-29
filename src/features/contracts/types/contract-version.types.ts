/**
 * @fileoverview 合約版本相關類型定義
 */
import type { Timestamp } from 'firebase-admin/firestore';

export interface ContractVersion {
  version: number;
  date: Date | Timestamp;
  changeSummary: string;
  changedBy?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvalDate?: Date | Timestamp;
  approvalBy?: string;
}

export interface VersionHistory {
  currentVersion: number;
  totalVersions: number;
  lastModified: Date | Timestamp;
  lastModifiedBy: string;
}
