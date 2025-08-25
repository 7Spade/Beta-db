/**
 * @fileOverview 從文件解析工料清單流程 (Extract Work Items Flow)
 * @description 此檔案定義了一個 Genkit AI 流程，其主要功能是接收一個指向 Cloud Storage 的文件 URL，
 * 並使用 AI 模型從中解析並提取結構化的工作項目、數量和單價。
 * 這是整個「智能文件解析」功能的核心 AI 邏輯。
 * 
 * @exports extractWorkItems - 觸發數據提取過程的主要函數。
 * @exports ExtractWorkItemsInput - `extractWorkItems` 函數的輸入 Zod Schema 型別。
 * @exports ExtractWorkItemsOutput - `extractWorkItems` 函數的輸出 Zod Schema 型別。
 */

'use server';

import {ai} from '@/ai/genkit';
import { logAiTokenUsage } from '@/services/logging.service';
import {z} from 'genkit';
import { media } from 'genkit/ai';

// 定義流程的輸入 Schema (使用 Zod)
const ExtractWorkItemsInputSchema = z.object({
  storageUrl: z
    .string()
    .describe(
      "一份文件（合約、報價單或估價單）在 Firebase Storage 中的 URL。"
    ),
});
export type ExtractWorkItemsInput = z.infer<typeof ExtractWorkItemsInputSchema>;

// 定義流程的輸出 Schema (使用 Zod)，現在包含 totalTokens
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
  totalTokens: z.number().describe('該次操作消耗的總 token 數量。'),
});
export type ExtractWorkItemsOutput = z.infer<typeof ExtractWorkItemsOutputSchema>;

/**
 * 導出的異步函數，作為外部呼叫此 AI 流程的入口點。
 * @param {ExtractWorkItemsInput} input - 包含文件 Storage URL 的輸入物件。
 * @returns {Promise<ExtractWorkItemsOutput>} - 返回一個包含解析出的工料清單和 token 消耗量的 Promise。
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
  input: {schema: ExtractWorkItemsInputSchema}, // 輸入 Schema
  output: {schema: ExtractWorkItemsOutputSchema.omit({ totalTokens: true })}, // 輸出 Schema，讓 AI 知道要以何種格式回應
  // 提示語模板 (使用 Handlebars 語法)
  prompt: `You are an expert AI assistant specialized in parsing construction and engineering documents like contracts, quotes, and estimates to extract a bill of materials or work items.

  Analyze the provided document and extract every single work item you can find. For each item, you must extract the following four fields:
  1.  **id**: The item number or serial number (e.g., "1", "A-1", "項次一").
  2.  **name**: The material code, product name, or description of the work (e.g., "RC混凝土", "防水工程", "不銹鋼板").
  3.  **quantity**: The quantity of the item. If not explicitly provided, default to 1.
  4.  **unitPrice**: The price per unit for the item. If not explicitly provided, do your best to find it. If it's impossible, default to 0.

  Document: {{media url=storageUrl}}
  
  Ensure that the extracted data is accurate and well-formatted. Do NOT extract the total price, only the unit price.
  `,
});

// 定義 Genkit Flow
const extractWorkItemsFlow = ai.defineFlow(
  {
    name: 'extractWorkItemsFlow', // Flow 的唯一名稱
    inputSchema: ExtractWorkItemsInputSchema,
    outputSchema: ExtractWorkItemsOutputSchema,
  },
  // Flow 的核心執行邏輯
  async input => {
    let result;
    try {
      // 呼叫定義好的 prompt，並傳入輸入
      result = await extractWorkItemsPrompt(input);
      const output = result.output;
      if (!output) {
        throw new Error('No output from AI');
      }
      
      const totalTokens = result.usage?.totalTokens || 0;
      // 記錄 AI Token 使用量（成功時）
      await logAiTokenUsage({
        flowName: 'extractWorkItemsFlow',
        totalTokens: totalTokens,
        status: 'succeeded',
      });
      
      return {
        ...output,
        totalTokens: totalTokens,
      };
    } catch (error) {
        // 記錄 AI Token 使用量（失敗時）
        const totalTokens = result?.usage?.totalTokens || 0;
        await logAiTokenUsage({
            flowName: 'extractWorkItemsFlow',
            totalTokens: totalTokens,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        // 向上拋出錯誤
        throw error;
    }
  }
);
