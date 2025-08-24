/**
 * @fileoverview 合約版本相關類型定義
 */

export interface ContractVersion {
  version: number;
  date: Date;
  changeSummary: string;
  changedBy?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvalDate?: Date;
  approvalBy?: string;
}

export interface VersionHistory {
  currentVersion: number;
  totalVersions: number;
  lastModified: Date;
  lastModifiedBy: string;
}
