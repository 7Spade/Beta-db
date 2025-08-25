'use server';

/**
 * @fileOverview Workflow Optimization AI Flow
 * @description This AI flow analyzes a user's current workflow and historical data to suggest optimizations.
 * @exports suggestWorkflowOptimizations - Triggers the optimization suggestion process.
 * @exports SuggestWorkflowOptimizationsInput - The input type for the function.
 * @exports SuggestWorkflowOptimizationsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { logAiTokenUsage } from '@/services/logging.service';
import { z } from 'zod';

// Input schema for the workflow optimization flow
export const SuggestWorkflowOptimizationsInputSchema = z.object({
  historicalTransactionData: z.string().describe('A summary of historical transaction data, including timings, partner performance, etc.'),
  currentWorkflowDefinition: z.string().describe('A description of the current receivables/payables workflow steps.'),
});
export type SuggestWorkflowOptimizationsInput = z.infer<typeof SuggestWorkflowOptimizationsInputSchema>;

// Output schema for the workflow optimization flow
export const SuggestWorkflowOptimizationsOutputSchema = z.object({
  suggestedOptimizations: z.string().describe('Specific, actionable suggestions to optimize the workflow.'),
  predictedEfficiencyIncrease: z.string().describe('A qualitative or quantitative prediction of the efficiency gain (e.g., "Reduces processing time by ~2 days").'),
  rationale: z.string().describe('The reasoning behind the suggested optimizations.'),
});
export type SuggestWorkflowOptimizationsOutput = z.infer<typeof SuggestWorkflowOptimizationsOutputSchema>;

/**
 * The main exported function that client components will call.
 * @param {SuggestWorkflowOptimizationsInput} input - The workflow data.
 * @returns {Promise<SuggestWorkflowOptimizationsOutput>} - The optimization suggestions.
 */
export async function suggestWorkflowOptimizations(input: SuggestWorkflowOptimizationsInput): Promise<SuggestWorkflowOptimizationsOutput> {
  const result = await workflowOptimizationFlow(input);
  if (!result) {
    throw new Error('Flow returned no result');
  }
  return result;
}

// Define the Genkit prompt for the AI
const optimizationPrompt = ai.definePrompt({
  name: 'workflowOptimizationPrompt',
  input: { schema: SuggestWorkflowOptimizationsInputSchema },
  output: { schema: SuggestWorkflowOptimizationsOutputSchema },
  prompt: `You are an expert in financial process optimization for the construction industry.
Analyze the following current workflow and historical data.

Current Workflow:
{{{currentWorkflowDefinition}}}

Historical Data Summary:
{{{historicalTransactionData}}}

Based on this information, provide the following in Traditional Chinese:
1.  **suggestedOptimizations**: Concrete suggestions to improve the workflow.
2.  **predictedEfficiencyIncrease**: A tangible prediction of the efficiency improvement.
3.  **rationale**: The reasoning for your suggestions.

Generate the analysis now.`,
});

// Define the Genkit flow
const workflowOptimizationFlow = ai.defineFlow(
  {
    name: 'workflowOptimizationFlow',
    inputSchema: SuggestWorkflowOptimizationsInputSchema,
    outputSchema: SuggestWorkflowOptimizationsOutputSchema,
  },
  async (input) => {
    let result;
    try {
      result = await optimizationPrompt(input);
      const output = result.output;
      if (!output) {
        throw new Error('No output from AI');
      }

      const totalTokens = result.usage?.totalTokens || 0;
      await logAiTokenUsage({
        flowName: 'workflowOptimizationFlow',
        totalTokens: totalTokens,
        status: 'succeeded',
      });

      return output;
    } catch (error) {
      const totalTokens = result?.usage?.totalTokens || 0;
      await logAiTokenUsage({
        flowName: 'workflowOptimizationFlow',
        totalTokens: totalTokens,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
);
