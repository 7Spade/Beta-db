

/**
 * @fileoverview 文件處理相關的 Server Actions
 * @description 此檔案包含了用於處理文件上傳、驗證和數據提取的 Next.js Server Actions。
 * 這些 Action 被前端元件直接呼叫，以執行伺服器端的邏輯，例如與 AI 模型的互動。
 * 
 * @關聯檔案
 * - `src/ai/flows/extract-work-items-flow.ts`: `extractWorkItemsFromDocument` Action 會呼叫此 AI 流程來進行文件解析。
 * - `src/components/features/docu-parse/views/docu-parse-view.tsx`: 前端 UI，呼叫此處定義的 Actions。
 */

"use server";

import { extractWorkItems } from '@/features/integrations/ai/flows/extract-work-items-flow';
import type { DocuParseActionState } from '@/features/automation-tools/docu-parse/types';
import { getStorage } from 'firebase-admin/storage';

/**
 * Server Action: 從文件提取工作項目數據
 * 此函數接收來自前端的檔案路徑，呼叫 AI 流程來解析文件內容，
 * 最後返回解析結果或錯誤訊息。
 * @param prevState - 上一個 Action 的狀態，由 useActionState Hook 管理。
 * @param payload - 包含檔案路徑的物件。
 * @returns {Promise<DocuParseActionState>} - 返回一個包含解析數據、檔名或錯誤訊息的狀態物件。
 */
export async function extractWorkItemsFromDocument(
  prevState: DocuParseActionState,
  payload: { filePath: string | null }
): Promise<DocuParseActionState> {
  const { filePath } = payload;

  if (!filePath) {
    return { error: '未提供有效的檔案路徑。' };
  }

  try {
    const file = getStorage().bucket().file(filePath);
    const [metadata] = await file.getMetadata();
    const safeName = (metadata && typeof metadata.name === 'string') ? metadata.name : '';
    const fileName = safeName.split('/').pop() || '未知檔案';

    // 步驟 1: 調用 Genkit AI 流程以提取工作項目
    const result = await extractWorkItems({ storagePath: filePath });

    if (!result || !result.workItems) {
      return { error: '提取資料失敗。AI 模型回傳了非預期的結果。' };
    }

    // 步驟 2: 返回成功的結果
    return {
      data: {
        ...result,
        fileName: fileName,
      }
    };
  } catch (e) {
    console.error('文件處理錯誤:', e);
    const errorMessage = e instanceof Error ? e.message : '發生未知錯誤。';
    return { error: `處理文件失敗: ${errorMessage}` };
  }
}
