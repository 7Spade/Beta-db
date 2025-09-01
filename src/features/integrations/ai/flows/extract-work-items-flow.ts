
/**
 * @fileOverview 從檔案解析工料清單流程 (Extract Work Items Flow)
 * @description 此檔案定義了一個 Genkit AI 流程，其主要功能是接收一個指向 Cloud Storage 的檔案路徑，
 * 並在後端使用 Firebase Admin SDK 直接讀取該檔案，然後使用 AI 模型從中解析並提取結構化的工作項目。
 * 這是整個「智慧檔案解析」功能的核心 AI 邏輯。
 * 
 * @exports extractWorkItems - 觸發資料提取過程的主要函數。
 * @exports ExtractWorkItemsInput - `extractWorkItems` 函數的輸入 Zod Schema 型別。
 * @exports ExtractWorkItemsOutput - `extractWorkItems` 函數的輸出 Zod Schema 型別。
 */

'use server';

import { logAiTokenUsage } from '@/api/services/ai-token-log.service';
import { ai } from '@/features/integrations/ai/genkit';
import { adminStorage } from '@root/src/features/integrations/database/firebase-admin/firebase-admin';
import { createClient } from '@root/src/features/integrations/database/supabase/server';
import { z } from 'genkit';
import { cookies } from 'next/headers';

// 定義流程的輸入 Schema (使用 Zod)
const ExtractWorkItemsInputSchema = z.object({
  storagePath: z
    .string()
    .describe(
      "一份檔案（合約、報價單或估價單）在 Firebase Storage 中的路徑 (e.g., 'uploads/document.pdf')。"
    )
});
export type ExtractWorkItemsInput = z.infer<typeof ExtractWorkItemsInputSchema>;

// 定義流程的輸出 Schema (使用 Zod)，現在只提取基礎數據
const ExtractWorkItemsOutputSchema = z.object({
  workItems: z.array(
    z.object({
      id: z.string().describe('項次或序號。'),
      name: z.string().describe('料號、品名或項目說明。'),
      quantity: z.number().describe('工作項目的數量。'),
      unitPrice: z.number().describe('工作項目的單價。'),
    })
  ).
    describe('一個包含提取出的工作項目及其數量和單價的列表。'),
  subtotal: z.number().describe("從文件上提取出的、明確標示的『未稅總計』金額。").optional(),
});
export type ExtractWorkItemsOutput = z.infer<typeof ExtractWorkItemsOutputSchema>;

/**
 * 導出的異步函數，作為外部呼叫此 AI 流程的入口點。
 * @param {ExtractWorkItemsInput} input - 包含檔案 Storage 路徑的輸入物件。
 * @returns {Promise<ExtractWorkItemsOutput>} - 返回一個包含解析出的工料清單的 Promise。
 * @throws 如果流程沒有返回結果，則拋出錯誤。
 */
export async function extractWorkItems(input: ExtractWorkItemsInput): Promise<ExtractWorkItemsOutput> {
  const result = await extractWorkItemsFlow(input);
  if (!result) {
    throw new Error('Flow returned no result');
  }
  return result;
}

// 最终版 Prompt (Token 最優化策略)
const DEFAULT_PROMPT = `You are a top-notch financial auditing artificial intelligence. Your goal is to extract a list of work items and a final subtotal from the document.

Key Concepts:
- Data Points: Extract the item number (項次), description (品名), quantity (數量), and unit price (單價). DO NOT extract the total price for each item.
- Audit Target: The final '未稅總計' (subtotal before tax) is your single source of truth for the grand total.

Document: {{media url=fileDataUri}}`;

const prompt = ai.definePrompt({
  name: 'extractWorkItemsPrompt',
  input: { schema: z.object({ fileDataUri: z.string() }) },
  output: { schema: ExtractWorkItemsOutputSchema },
  prompt: DEFAULT_PROMPT,
});


// 定義 Genkit Flow
const extractWorkItemsFlow = ai.defineFlow(
  {
    name: 'extractWorkItemsFlow', // Flow 的唯一名稱
    inputSchema: ExtractWorkItemsInputSchema,
    outputSchema: ExtractWorkItemsOutputSchema,
  },
  // Flow 的核心執行邏輯
  async (input) => {
    const startTime = Date.now();
    let result;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const modelName = 'googleai/gemini-1.5-flash'; // 默认模型

    try {
      // 步驟 1: 使用 Firebase Admin SDK 直接讀取檔案內容
      const bucket = adminStorage.bucket();
      const file = bucket.file(input.storagePath);

      const [metadata, fileBuffer] = await Promise.all([
        file.getMetadata(),
        file.download().then(data => data[0])
      ]);

      const mimeType = metadata[0].contentType || 'application/octet-stream';

      // 步驟 2: 將檔案內容轉換為 Data URI
      const fileDataUri = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

      // 步驟 3: 呼叫定義好的 prompt，並傳入 Data URI
      result = await prompt({ fileDataUri }, { model: modelName });
      const output = result.output;
      if (!output) {
        throw new Error('No output from AI');
      }

      const durationMs = Date.now() - startTime;

      // Log the metadata without returning it to the client
      await logAiTokenUsage(supabase, {
        flow_name: 'extractWorkItemsFlow',
        model: result.model || 'unknown',
        status: 'succeeded',
        input_tokens: result.usage?.inputTokens,
        output_tokens: result.usage?.outputTokens,
        total_tokens: result.usage?.totalTokens,
        duration_ms: durationMs,
        user_id: 'system' // Placeholder for user ID
      });

      // Return only the business data
      return output;

    } catch (error) {
      const durationMs = Date.now() - startTime;
      await logAiTokenUsage(supabase, {
        flow_name: 'extractWorkItemsFlow',
        model: result?.model,
        status: 'failed',
        input_tokens: result?.usage?.inputTokens,
        output_tokens: result?.usage?.outputTokens,
        total_tokens: result?.usage?.totalTokens,
        duration_ms: durationMs,
        error: error instanceof Error ? error.message : 'Unknown error',
        user_id: 'system' // Placeholder for user ID
      });
      // 向上拋出錯誤
      throw error;
    }
  }
);
