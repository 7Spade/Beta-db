
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

import { ai } from '@/features/integrations/ai/genkit';
import { logAiTokenUsage } from '@/api/services/ai-token-log.service';
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
    ),
});
export type ExtractWorkItemsInput = z.infer<typeof ExtractWorkItemsInputSchema>;

// 定義流程的輸出 Schema (使用 Zod)
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

// 定義 Genkit Prompt
const extractWorkItemsPrompt = ai.definePrompt({
  name: 'extractWorkItemsPrompt', // Prompt 的唯一名稱
  input: { schema: z.object({ fileDataUri: z.string() }) }, // 輸入改為接收 Data URI
  output: { schema: ExtractWorkItemsOutputSchema }, // 輸出 Schema，讓 AI 知道要以何種格式回應
  // 提示語模板 (使用 Handlebars 語法)
  prompt: `You are an expert AI assistant specialized in parsing construction and engineering documents like contracts, quotes, and estimates to extract a bill of materials or work items.

  Analyze the provided document and extract every single work item you can find. For each item, you must extract the following four fields:
  1.  **id**: The item number or serial number (e.g., "1", "A-1", "項次一").
  2.  **name**: The material code, product name, or description of the work (e.g., "RC混凝土", "防水工程", "不銹鋼板").
  3.  **quantity**: The quantity of the item. If not explicitly provided, default to 1.
  4.  **unitPrice**: The price per unit for the item. If not explicitly provided, do your best to find it. If it's impossible, default to 0.

  Document: {{media url=fileDataUri}}
  
  Ensure that the extracted data is accurate and well-formatted. Do NOT extract the total price, only the unit price.
  `,
});

// 定義 Genkit Flow
const extractWorkItemsFlow = ai.defineFlow(
  {
    name: 'extractWorkItemsFlow', // Flow 的唯一名稱
    inputSchema: ExtractWorkItemsInputSchema,
    outputSchema: ExtractWorkItemsOutputSchema, // Output schema is now pure business data
  },
  // Flow 的核心執行邏輯
  async (input) => {
    const startTime = Date.now();
    let result;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

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
      result = await extractWorkItemsPrompt({ fileDataUri });
      const output = result.output;
      if (!output) {
        throw new Error('No output from AI');
      }
      
      const durationMs = Date.now() - startTime;

      // Log the metadata without returning it to the client
      await logAiTokenUsage(supabase, {
        flow_name: 'extractWorkItemsFlow',
        model: result.model,
        status: 'succeeded',
        input_tokens: result.usage?.inputTokens,
        output_tokens: result.usage?.outputTokens,
        total_tokens: result.usage?.totalTokens,
        duration_ms: durationMs,
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
      });
      // 向上拋出錯誤
      throw error;
    }
  }
);
