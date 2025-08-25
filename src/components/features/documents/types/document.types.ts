/**
 * @fileoverview Documents 相關類型定義
 */

import type { DocToWorkItemsOutput } from '@/ai/flows/doc-to-work-items-flow';

/**
 * 從 AI Flow 的原始輸出中提取的單個工作項目結構。
 */
export type WorkItem = DocToWorkItemsOutput['workItems'][0] & { 
  /**
   * 前端計算的總價 (quantity * unitPrice)，用於 UI 顯示。
   */
  total?: number;
};

/**
 * 文件處理 Server Action 的狀態，由 useActionState 管理。
 */
export interface DocumentActionState {
  data?: DocToWorkItemsOutput;
  error?: string;
  fileName?: string;
  totalTokens?: number;
  storageUrl?: string; // 新增，用於保存文件的存儲路徑
}

/**
 * 文件驗證 Server Action 的狀態。
 */
export interface DocumentValidationState {
  isValid: boolean;
  error?: string;
  fileType?: string;
}

/**
 * 在建立專案與合約時，從前端 `documents-view` 傳遞給 Server Action 的文件詳細資料。
 * 這是在前端收集的、與文件本身相關的元數據。
 */
export interface DocDetails {
    customId: string;
    name: string;
    client: string;
    clientRepresentative: string;
}
