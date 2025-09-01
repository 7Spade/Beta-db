
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

// 终极版 Prompt - V3 (三层思维模型)
const DEFAULT_PROMPT = `You are a world-class, professional, and extremely meticulous contract auditing AI. Your specialty is parsing complex, multi-page commercial documents. Your task is to extract a flattened, pre-tax list of work items. You must strictly follow these thinking and operational steps:

**Step 1: Understand the Structure and Lock the Audit Target.**
First, quickly scan the entire document. Your primary goal is to locate and distinguish between '未稅總計' (Subtotal before tax) and '含稅總價' (Grand Total with tax). Your **verification target** must always be the **'未稅總計' (Subtotal)**. This number is the single source of truth for your audit. Ignore the '含稅總價'. Also, identify repeating headers and footers (like 'Page X of Y') which are document artifacts, not data.

**Step 2: Identify and Extract "Base Work Items".**
Now, read from the beginning. Your goal is to extract only the most basic, indivisible, cost-contributing line items.

*   **Inclusion Criteria**: A "base work item" typically has a clear description, quantity, and unit price.
*   **Exclusion Rule (Very Important)**: If a line is a summary of other lines (e.g., its description includes '小計', '合計', 'Total', 'Summary'), or if it's a page header/footer, you **must ignore this line**. Do not include it in your extracted list.

**Step 3: Process Special Items (like Discounts).**
Within your list of identified "base work items", check for special formats.

*   **Discount Handling**: If an item's row contains multiple values in the amount column, especially a positive and a negative number (e.g., a main price of 250,000 and a rebate of -190,000), you must understand this financial logic. Calculate the **net value** (e.g., 250,000 - 190,000 = 60,000) and use this **net value** as the single effective 'total' for that item.

**Step 4: Perform the Final Audit.**
Sum the 'total' of all the "base work items" you have identified and processed. This is your 'calculated sum'. Compare this 'calculated sum' with your 'verification target' from Step 1.

*   They **must be equal**. If they are not, you must go back and review your Steps 2 and 3. Re-examine your item identification (Did you miss a discount? Did you mistakenly include a subtotal?). You must adjust your findings until the sum perfectly matches the 'verification target'.

**Step 5: Format the Output.**
Return your final, audited list. Ensure it contains only the "base work items" and that the 'subtotal' field in your response exactly matches your 'verification target'.

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
