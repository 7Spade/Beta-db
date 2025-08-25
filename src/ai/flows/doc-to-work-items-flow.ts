'use server';

/**
 * @fileOverview 從文件解析工料清單流程 (Doc to Work Items Flow)
 * @description 此流程使用 AI 從上傳的文件（如報價單、合約）中解析並提取結構化的工作項目、數量、單價和總價。
 * @exports docToWorkItems - 觸發數據提取過程的函數。
 * @exports DocToWorkItemsInput - docToWorkItems 函數的輸入類型。
 * @exports DocToWorkItemsOutput - docToWorkItems 函數的返回類型。
 */

import {ai} from '@/ai/genkit';
import { logAiTokenUsage } from '@/services/logging.service';
import {z} from 'genkit';

const DocToWorkItemsInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The document (contract, quote, or estimate) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DocToWorkItemsInput = z.infer<typeof DocToWorkItemsInputSchema>;

const DocToWorkItemsOutputSchema = z.object({
  workItems: z.array(
    z.object({
      item: z.string().describe('The description of the work item.'),
      quantity: z.number().describe('The quantity of the work item.'),
      price: z.number().describe('The total price for the work item.'),
      unitPrice: z.number().describe('The unit price of the work item.'),
    })
  ).
  describe('A list of extracted work items with their quantities, prices, and unit prices.'),
});
export type DocToWorkItemsOutput = z.infer<typeof DocToWorkItemsOutputSchema>;

export async function docToWorkItems(input: DocToWorkItemsInput): Promise<DocToWorkItemsOutput> {
  const result = await docToWorkItemsFlow(input);
  if (!result) {
    throw new Error('Flow returned no result');
  }
  return result;
}

const docToWorkItemsPrompt = ai.definePrompt({
  name: 'docToWorkItemsPrompt',
  input: {schema: DocToWorkItemsInputSchema},
  output: {schema: DocToWorkItemsOutputSchema},
  prompt: `You are an expert AI assistant specialized in parsing documents like contracts, quotes, and estimates to extract work items, quantities, prices, and unit prices.

  Analyze the provided document and extract every single work item you can find. For each item, extract its description, quantity, total price, and calculate the unit price. Use the following document data.

  Document: {{media url=documentDataUri}}
  
  Ensure that the extracted data is accurate and well-formatted.
  If quantity is not explicitly provided in document, default to 1.
  If unit price is not explicitly provided in document, calculate the unit price by dividing the price by the quantity.
  `,
});

const docToWorkItemsFlow = ai.defineFlow(
  {
    name: 'docToWorkItemsFlow',
    inputSchema: DocToWorkItemsInputSchema,
    outputSchema: DocToWorkItemsOutputSchema,
  },
  async input => {
    let result;
    try {
      result = await docToWorkItemsPrompt(input);
      const output = result.output;
      if (!output) {
        throw new Error('No output from AI');
      }
      
      const totalTokens = result.usage?.totalTokens || 0;
      await logAiTokenUsage({
        flowName: 'docToWorkItemsFlow',
        totalTokens: totalTokens,
        status: 'succeeded',
      });
      
      return output;
    } catch (error) {
        const totalTokens = result?.usage?.totalTokens || 0;
        await logAiTokenUsage({
            flowName: 'docToWorkItemsFlow',
            totalTokens: totalTokens,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        throw error;
    }
  }
);
