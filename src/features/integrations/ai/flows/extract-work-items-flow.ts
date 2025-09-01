
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

// 最终版 Prompt
const DEFAULT_PROMPT = `You are a world-class financial auditing AI specializing in complex commercial documents. Your task is to extract a flattened, pre-tax list of work items with absolute accuracy. Follow these steps meticulously:

**Step 1: Establish the Audit Benchmark.**
Scan the entire document to find the final **'未稅總計' (Subtotal before tax)**. This is your single, non-negotiable verification target. Ignore all other totals like '含稅總價'.

**Step 2: Identify and Extract Item Amounts Using Structural Rules.**
Analyze each line item sequentially. You must apply the following structural rules to determine the effective amount for each item:
*   **Rule for Simple Items**: If all information for an item (description, quantity, price, total) is contained within a **single row**, extract that row's amount directly as its \`total\`.
*   **Rule for Complex Items**: If an item's information spans **multiple rows** (e.g., it has separate lines for '金額', '折扣', '小計'), your task is to find and extract **only the '小計' (subtotal) amount** for that item block. This '小計' is the sole valid \`total\` for that complex item.
*   **Exclusion Rule**: You must ignore any line that is a summary of other items (e.g., a grand total row) and is not part of a specific item block's structure.

**Step 3: Perform Final Audit.**
Sum up all the effective \`total\` amounts you extracted according to the rules in Step 2. This sum is your 'calculated total'.

**Verification**: Your 'calculated total' **must perfectly match** the 'verification target' from Step 1. If it does not, you must repeat Step 2, re-evaluating your application of the structural rules until the audit passes.

**Step 4: Format Output.**
Return your final, audited list. The 'subtotal' field in your response must be the 'verification target' you audited against.

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
        model: result.model || 'unknown',
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
