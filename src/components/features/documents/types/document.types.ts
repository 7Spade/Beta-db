/**
 * @fileoverview Documents 相關類型定義
 */

import type { DocToWorkItemsOutput } from '@/ai/flows/doc-to-work-items-flow';

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

// 文件上傳的輸入格式
export interface DocumentUploadInput {
  file: File;
  metadata?: {
    description?: string;
    tags?: string[];
    category?: string;
  };
}

// 文件處理的結果
export interface DocumentProcessingResult {
  success: boolean;
  data?: DocToWorkItemsOutput;
  error?: string;
  fileName?: string;
  processingTime?: number;
}
