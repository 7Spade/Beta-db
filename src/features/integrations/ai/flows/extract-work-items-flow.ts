
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

// 定義流程的輸出 Schema (使用 Zod)，包含審計功能
const ExtractWorkItemsOutputSchema = z.object({
  workItems: z.array(
    z.object({
      id: z.string().describe('項次或序號。'),
      name: z.string().describe('料號、品名或項目說明。'),
      quantity: z.number().describe('工作項目的數量。'),
      unitPrice: z.number().describe('工作項目的單價。'),
      total: z.number().describe('該項目的總價 (數量 * 單價)。')
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

// 最終版 Prompt - 引入三層思維模型
const DEFAULT_PROMPT = `You are a world-class, professional, and extremely meticulous contract auditing AI with deep financial knowledge. Your task is to extract a flattened, pre-tax list of work items from a complex document that may span multiple pages. You must strictly follow this three-stage thinking model: Structural Recognition, Logical Calculation, and Auditing Verification.

**Stage 1: Structural Recognition & Benchmark Establishment.**
First, quickly scan the entire document to understand its structure and identify key elements.
-   **Identify the Audit Benchmark**: Your primary goal is to find the **'未稅總計' (Subtotal)**. This is your one and only ground truth for verification. You must ignore any '含稅總價' (Grand Total).
-   **Identify Page Markers**: Recognize and completely ignore repeating page headers and footers (like 'Page X of Y', company logos, addresses). Treat the content across pages as a single, continuous table.
-   **Identify Item Blocks**: Understand that each item number (項次) defines a self-contained "Item Block," which may span multiple visual rows.

**Stage 2: Logical Calculation within each Item Block.**
Now, process the document again, focusing on each "Item Block" you identified. For each block, your task is to derive a single, final 'total' value by applying financial logic.
-   **Base Logic**: Start by identifying the '原始金額' (Original Amount) for the item.
-   **Discount Logic**: Check if an explicit '折扣' (Discount) value exists within the same Item Block.
    -   If a discount exists, the final 'total' for this block **MUST** be the calculated net value (Original Amount - Discount Amount).
    -   If no discount exists, the final 'total' is simply the Original Amount.
-   **Ignore Sub-lines**: Within an Item Block, you must only use the 'Original Amount' and 'Discount' figures for your calculation. Ignore any intermediate lines labeled '小計' (subtotal for the item block) to avoid double-counting. The '小計' line is merely a verification for your calculation, not a source for extraction.
-   **Extract Core Data**: For each Item Block, extract its 'id' (項次), 'name' (品名/說明), 'quantity', 'unitPrice', and the final 'total' you just calculated.

**Stage 3: Auditing Verification.**
This is the final and most critical stage.
-   **Summation**: Sum up the final 'total' from every Item Block you processed in Stage 2. This gives you the 'Calculated Sum'.
-   **Verification**: Compare your 'Calculated Sum' with the 'Audit Benchmark' ('未稅總計') you established in Stage 1.
-   **Self-Correction**: They **MUST** be perfectly equal. If they are not, you must go back and re-evaluate your work in Stage 2. Did you misinterpret an Item Block? Did you apply the discount logic incorrectly? You must repeat this process until your sum matches the benchmark.

**Final Output Formatting:**
Return your final, audited list. Ensure the 'subtotal' field in your response **exactly** matches the 'Audit Benchmark' figure from the document.

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

    let modelName = 'googleai/gemini-1.5-flash'; // 默认模型

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
        model: result.model,
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

    