/**
 * @fileoverview Documents Server Actions 相關類型定義
 */

import type { ExtractWorkItemsOutput } from '@/ai/flows/extract-work-items-flow';

// 文件處理狀態
export interface DocumentActionState {
  data?: ExtractWorkItemsOutput;
  error?: string;
  fileName?: string;
}

// 文件驗證狀態
export interface DocumentValidationState {
  isValid: boolean;
  error?: string;
  fileType?: string;
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
  data?: ExtractWorkItemsOutput;
  error?: string;
  fileName?: string;
  processingTime?: number;
}

// 支援的文件類型
export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/jpeg',
  'image/png'
] as const;

export type SupportedFileType = typeof SUPPORTED_FILE_TYPES[number];

// 文件大小限制
export const FILE_SIZE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  WARNING_SIZE: 5 * 1024 * 1024, // 5MB
} as const;