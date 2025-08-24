/**
 * @fileoverview 文件相關常數定義
 */

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
