/**
 * @fileOverview 從文件解析工料清單流程 (Doc to Work Items Flow)
 * @description 此檔案定義了一個 Genkit AI 流程，其主要功能是接收一個文件（如報價單、合約），
 * 並使用 AI 模型從中解析並提取結構化的工作項目、數量、單價和總價。
 * 這是整個「智能文件解析」功能的核心 AI 邏輯。
 * 
 * @exports docToWorkItems - 觸發數據提取過程的主要函數。
 * @exports DocToWorkItemsInput - `docToWorkItems` 函數的輸入 Zod Schema 型別。
 * @exports DocToWorkItemsOutput - `docToWorkItems` 函數的輸出 Zod Schema 型別。
 * 
 * @關聯檔案
 * - `src/components/features/documents/actions/document-actions.ts`: 此檔案中的 Server Action 會呼叫本流程中的 `docToWorkItems` 函數。
 * - `src/services/logging.service.ts`: 在流程執行成功或失敗時，會呼叫此服務來記錄 AI Token 的使用情況。
 */

'use server';

import {ai} from '@/ai/genkit';
import { logAiTokenUsage } from '@/services/logging.service';
import {z} from 'genkit';

// 定義流程的輸入 Schema (使用 Zod)
const DocToWorkItemsInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "一份文件（合約、報價單或估價單），格式為 Data URI，必須包含 MIME 類型和 Base64 編碼。預期格式：'data:<mimetype>;base64,<encoded_data>'。"
    ),
});
export type DocToWorkItemsInput = z.infer<typeof DocToWorkItemsInputSchema>;

// 定義流程的輸出 Schema (使用 Zod)
const DocToWorkItemsOutputSchema = z.object({
  workItems: z.array(
    z.object({
      item: z.string().describe('工作項目的描述。'),
      quantity: z.number().describe('工作項目的數量。'),
      price: z.number().describe('該工作項目的總價。'),
      unitPrice: z.number().describe('工作項目的單價。'),
    })
  ).
  describe('一個包含提取出的工作項目及其數量、總價和單價的列表。'),
});
export type DocToWorkItemsOutput = z.infer<typeof DocToWorkItemsOutputSchema>;

/**
 * 導出的異步函數，作為外部呼叫此 AI 流程的入口點。
 * @param {DocToWorkItemsInput} input - 包含文件 Data URI 的輸入物件。
 * @returns {Promise<DocToWorkItemsOutput>} - 返回一個包含解析出的工料清單的 Promise。
 * @throws 如果流程沒有返回結果，則拋出錯誤。
 */
export async function docToWorkItems(input: DocToWorkItemsInput): Promise<DocToWorkItemsOutput> {
  const result = await docToWorkItemsFlow(input);
  if (!result) {
    throw new Error('Flow returned no result');
  }
  return result;
}

// 定義 Genkit Prompt
const docToWorkItemsPrompt = ai.definePrompt({
  name: 'docToWorkItemsPrompt', // Prompt 的唯一名稱
  input: {schema: DocToWorkItemsInputSchema}, // 輸入 Schema
  output: {schema: DocToWorkItemsOutputSchema}, // 輸出 Schema，讓 AI 知道要以何種格式回應
  // 提示語模板 (使用 Handlebars 語法)
  prompt: `You are an expert AI assistant specialized in parsing documents like contracts, quotes, and estimates to extract work items, quantities, prices, and unit prices.

  Analyze the provided document and extract every single work item you can find. For each item, extract its description, quantity, total price, and calculate the unit price. Use the following document data.

  Document: {{media url=documentDataUri}}
  
  Ensure that the extracted data is accurate and well-formatted.
  If quantity is not explicitly provided in document, default to 1.
  If unit price is not explicitly provided in document, calculate the unit price by dividing the price by the quantity.
  `,
});

// 定義 Genkit Flow
const docToWorkItemsFlow = ai.defineFlow(
  {
    name: 'docToWorkItemsFlow', // Flow 的唯一名稱
    inputSchema: DocToWorkItemsInputSchema,
    outputSchema: DocToWorkItemsOutputSchema,
  },
  // Flow 的核心執行邏輯
  async input => {
    let result;
    try {
      // 呼叫定義好的 prompt，並傳入輸入
      result = await docToWorkItemsPrompt(input);
      const output = result.output;
      if (!output) {
        throw new Error('No output from AI');
      }
      
      // 記錄 AI Token 使用量（成功時）
      const totalTokens = result.usage?.totalTokens || 0;
      await logAiTokenUsage({
        flowName: 'docToWorkItemsFlow',
        totalTokens: totalTokens,
        status: 'succeeded',
      });
      
      return output;
    } catch (error) {
        // 記錄 AI Token 使用量（失敗時）
        const totalTokens = result?.usage?.totalTokens || 0;
        await logAiTokenUsage({
            flowName: 'docToWorkItemsFlow',
            totalTokens: totalTokens,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        // 向上拋出錯誤
        throw error;
    }
  }
);
