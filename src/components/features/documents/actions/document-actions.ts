/**
 * @fileoverview 文件處理相關的 Server Actions
 * @description 此檔案包含了用於處理文件上傳、驗證和數據提取的 Next.js Server Actions。
 * 這些 Action 被前端元件直接呼叫，以執行伺服器端的邏輯，例如與 AI 模型的互動。
 * 
 * @關聯檔案
 * - `src/ai/flows/extract-work-items-flow.ts`: `extractWorkItemsFromDocument` Action 會呼叫此 AI 流程來進行文件解析。
 * - `src/components/features/documents/views/documents-view.tsx`: 前端 UI，呼叫此處定義的 Actions。
 * - `src/components/features/documents/constants/file-constants.ts`: `validateDocument` Action 使用此檔案中的常數來進行檔案驗證。
 */

"use server";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { extractWorkItems } from '@/ai/flows/extract-work-items-flow';
import type { DocumentActionState, DocumentValidationState } from '../types';
import { SUPPORTED_FILE_TYPES, FILE_SIZE_LIMITS } from '../constants';

/**
 * Server Action: 從文件提取工作項目數據
 * 此函數接收來自前端的 FormData，將文件上傳到 Firebase Storage，
 * 然後使用文件的 URL 呼叫 AI 流程來解析文件內容，最後返回解析結果或錯誤訊息。
 * 遵循 NextJS 15 Server Actions 最佳實踐。
 * @param prevState - 上一個 Action 的狀態，由 useActionState Hook 管理。
 * @param formData - 從前端表單提交的數據。
 * @returns {Promise<DocumentActionState>} - 返回一個包含解析數據、檔名或錯誤訊息的狀態物件。
 */
export async function extractWorkItemsFromDocument(
  prevState: DocumentActionState,
  formData: FormData
): Promise<DocumentActionState> {
  const file = formData.get('file') as File | null;
  
  if (!file || file.size === 0) {
    return { error: '請選擇要上傳的檔案。' };
  }

  try {
    // 步驟 1: 上傳文件到 Firebase Storage
    const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
    const uploadResult = await uploadBytes(storageRef, file);
    const storageUrl = await getDownloadURL(uploadResult.ref);

    // 步驟 2: 調用 Genkit AI 流程以提取工作項目
    const result = await extractWorkItems({ storageUrl });
    
    if (!result || !result.workItems) {
        return { error: '提取資料失敗。AI 模型回傳了非預期的結果。' };
    }

    // 步驟 3: 返回成功的結果
    return { 
      data: result, 
      fileName: file.name, 
      totalTokens: result.totalTokens,
    };
  } catch (e) {
    console.error('文件處理錯誤:', e);
    const errorMessage = e instanceof Error ? e.message : '發生未知錯誤。';
    return { error: `處理文件失敗。請確認檔案未損壞並再試一次。` };
  }
}

/**
 * Server Action: 驗證文件格式
 * 此函數在文件上傳前進行初步驗證，檢查檔案大小和類型是否符合規定。
 * @param prevState - 上一個 Action 的狀態。
 * @param formData - 從前端表單提交的數據。
 * @returns {Promise<DocumentValidationState>} - 返回一個包含驗證結果及錯誤訊息的狀態物件。
 */
export async function validateDocument(
  prevState: DocumentValidationState,
  formData: FormData
): Promise<DocumentValidationState> {
  const file = formData.get('file') as File | null;
  
  if (!file) {
    return { isValid: false, error: '請選擇要驗證的檔案。' };
  }

  // 檢查文件大小是否超過限制
  if (file.size > FILE_SIZE_LIMITS.MAX_SIZE) {
    return { isValid: false, error: `檔案大小不能超過 ${FILE_SIZE_LIMITS.MAX_SIZE / (1024 * 1024)}MB。` };
  }

  // 檢查文件 MIME 類型是否在支援列表中
  if (!SUPPORTED_FILE_TYPES.includes(file.type as any)) {
    return { isValid: false, error: '不支援的檔案類型。' };
  }

  // 驗證通過
  return { isValid: true, fileType: file.type };
}
