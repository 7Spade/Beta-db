/**
 * @fileoverview Documents 相關類型定義
 */

import type { DocToWorkItemsOutput } from '@/ai/flows/doc-to-work-items-flow';

// AI Flow 的原始輸出項目結構
export type WorkItem = DocToWorkItemsOutput['workItems'][0] & { 
  /**
   * 前端計算的總價 (quantity * unitPrice)
   */
  total?: number;
};

// 文件處理 action 的狀態
export interface DocumentActionState {
  data?: DocToWorkItemsOutput;
  error?: string;
  fileName?: string;
  totalTokens?: number;
}

// 文件驗證 action 的狀態
export interface DocumentValidationState {
  isValid: boolean;
  error?: string;
  fileType?: string;
}

// 建立專案與合約時，從前端傳遞的文件詳細資料
export interface DocDetails {
    customId: string;
    name: string;
    client: string;
    clientRepresentative: string;
}

// 文件上傳輸入
export interface DocumentUploadInput {
  file: File;
  metadata?: {
    description?: string;
    tags?: string[];
    category?: string;
  };
}

// 文件處理結果
export interface DocumentProcessingResult {
  success: boolean;
  data?: DocToWorkItemsOutput;
  error?: string;
  fileName?: string;
  processingTime?: number;
}
