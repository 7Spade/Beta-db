/**
 * @fileoverview 文件相關常數定義
 * @description 此檔案定義了在文件上傳和處理過程中使用的所有常數，
 * 包括支援的文件 MIME 類型和檔案大小限制。這有助於在一個地方集中管理這些配置，
 * 方便未來的維護和更新。
 * 
 * @關聯檔案
 * - `src/components/features/docu-parse/actions/docu-parse-actions.ts`: 使用此處定義的常數來驗證上傳的檔案。
 */

// 支援的文件類型陣列
export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'text/plain', // .txt
  'image/jpeg',
  'image/png'
] as const;

// 從常數陣列推導出支援的文件類型聯合型別
export type SupportedFileType = typeof SUPPORTED_FILE_TYPES[number];

// 文件大小限制（以 bytes 為單位）
export const FILE_SIZE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  WARNING_SIZE: 5 * 1024 * 1024, // 5MB
} as const;


// 匯出檔案名稱
export const EXPORT_FILE_NAMES = {
    WORK_ITEMS: 'work-items'
} as const;
