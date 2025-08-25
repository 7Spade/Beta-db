"use server";

import { docToWorkItems, type DocToWorkItemsOutput } from '@/ai/flows/doc-to-work-items-flow';
import { z } from 'zod';
import type { DocumentActionState, DocumentValidationState } from './types';
import { SUPPORTED_FILE_TYPES, FILE_SIZE_LIMITS } from '../constants/file-constants';

// 輸入驗證 Schema
const actionInputSchema = z.object({
  documentDataUri: z.string().startsWith('data:'),
});

/**
 * Server Action: 從文件提取工作項目數據
 * 遵循 NextJS 15 Server Actions 最佳實踐
 */
export async function extractDataFromDocument(
  prevState: DocumentActionState,
  formData: FormData
): Promise<DocumentActionState> {
  const file = formData.get('file') as File | null;
  
  if (!file || file.size === 0) {
    return { error: '請選擇要上傳的檔案。' };
  }

  try {
    // 轉換文件為 base64
    const fileBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(fileBuffer).toString('base64');
    const documentDataUri = `data:${file.type};base64,${base64String}`;
    
    // 驗證輸入
    const validatedInput = actionInputSchema.safeParse({ documentDataUri });
    if (!validatedInput.success) {
      return { error: '無效的檔案資料 URI。' };
    }

    // 調用 AI 流程提取工作項目
    const result = await docToWorkItems(validatedInput.data);
    
    if (!result || !result.workItems) {
        return { error: '提取資料失敗。AI 模型回傳了非預期的結果。' };
    }

    return { data: result, fileName: file.name };
  } catch (e) {
    console.error('文件處理錯誤:', e);
    const errorMessage = e instanceof Error ? e.message : '發生未知錯誤。';
    return { error: `處理文件失敗。請確認檔案未損壞並再試一次。` };
  }
}

/**
 * Server Action: 驗證文件格式
 */
export async function validateDocument(
  prevState: DocumentValidationState,
  formData: FormData
): Promise<DocumentValidationState> {
  const file = formData.get('file') as File | null;
  
  if (!file) {
    return { isValid: false, error: '請選擇要驗證的檔案。' };
  }

  // 檢查文件大小
  if (file.size > FILE_SIZE_LIMITS.MAX_SIZE) {
    return { isValid: false, error: `檔案大小不能超過 ${FILE_SIZE_LIMITS.MAX_SIZE / (1024 * 1024)}MB。` };
  }

  // 檢查文件類型
  if (!SUPPORTED_FILE_TYPES.includes(file.type as any)) {
    return { isValid: false, error: '不支援的檔案類型。' };
  }

  return { isValid: true, fileType: file.type };
}
