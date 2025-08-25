/**
 * @fileoverview 文件處理相關的 Server Actions
 * @description 此檔案包含了用於處理文件上傳、驗證和數據提取的 Next.js Server Actions。
 * 這些 Action 被前端元件直接呼叫，以執行伺服器端的邏輯，例如與 AI 模型的互動。
 * 
 * @關聯檔案
 * - `src/ai/flows/extract-work-items-flow.ts`: `extractWorkItemsFromDocument` Action 會呼叫此 AI 流程來進行文件解析。
 * - `src/components/features/documents/views/documents-view.tsx`: 前端 UI，呼叫此處定義的 Actions。
 */

"use server";

import { extractWorkItems } from '@/ai/flows/extract-work-items-flow';
import type { DocumentActionState } from '../types';

/**
 * Server Action: 從文件提取工作項目數據
 * 此函數接收來自前端的 FormData，使用文件的 Storage URL 呼叫 AI 流程來解析文件內容，
 * 最後返回解析結果或錯誤訊息。
 * @param prevState - 上一個 Action 的狀態，由 useActionState Hook 管理。
 * @param formData - 從前端表單提交的數據。
 * @returns {Promise<DocumentActionState>} - 返回一個包含解析數據、檔名或錯誤訊息的狀態物件。
 */
export async function extractWorkItemsFromDocument(
  prevState: DocumentActionState,
  formData: FormData
): Promise<DocumentActionState> {
  const storageUrl = formData.get('storageUrl') as string | null;
  const fileName = formData.get('fileName') as string | null;
  
  if (!storageUrl || !fileName) {
    return { error: '未提供有效的檔案路徑。' };
  }

  try {
    // 步驟 1: 調用 Genkit AI 流程以提取工作項目
    const result = await extractWorkItems({ storageUrl });
    
    if (!result || !result.workItems) {
        return { error: '提取資料失敗。AI 模型回傳了非預期的結果。' };
    }

    // 步驟 2: 返回成功的結果
    return { 
      data: result, 
      fileName: fileName, 
      totalTokens: result.totalTokens,
    };
  } catch (e) {
    console.error('文件處理錯誤:', e);
    const errorMessage = e instanceof Error ? e.message : '發生未知錯誤。';
    return { error: `處理文件失敗。請確認檔案未損壞並再試一次。` };
  }
}
