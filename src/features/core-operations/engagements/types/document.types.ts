/**
 * @fileoverview 文件管理相關類型定義
 */
import type { Timestamp } from 'firebase/firestore';

// 文件相關類型
export type DocumentType = 'contract' | 'proposal' | 'report' | 'specification' | 'manual' | 'other';
export type DocumentStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  description?: string;
  version: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  tags?: string[];
  category?: string;
  accessLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedBy: string;
  updatedAt: Date | Timestamp;
  publishedDate?: Date | Timestamp;
  archivedDate?: Date | Timestamp;
}

// 附件相關類型
export interface Attachment {
  id: string;
  name: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  category?: string;
  uploadedBy: string;
  uploadedAt: Date | Timestamp;
}

// 文件版本歷史
export interface DocumentVersion {
  version: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  changeDescription?: string;
  createdBy: string;
  createdAt: Date | Timestamp;
}

// 文件摘要
export interface DocumentSummary {
  totalDocuments: number;
  draftDocuments: number;
  reviewDocuments: number;
  approvedDocuments: number;
  publishedDocuments: number;
  archivedDocuments: number;
  totalSize: number;
  recentDocuments: Document[];
}

// 創建輸入類型
export interface CreateDocumentInput {
  title: string;
  type: DocumentType;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  tags?: string[];
  category?: string;
  accessLevel: 'public' | 'internal' | 'confidential' | 'restricted';
}

export interface UpdateDocumentInput {
  title?: string;
  type?: DocumentType;
  status?: DocumentStatus;
  description?: string;
  tags?: string[];
  category?: string;
  accessLevel?: 'public' | 'internal' | 'confidential' | 'restricted';
  publishedDate?: Date;
  archivedDate?: Date;
}

export interface CreateAttachmentInput {
  name: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  category?: string;
}