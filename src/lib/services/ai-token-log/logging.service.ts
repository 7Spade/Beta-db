
'use server';

import type { AiTokenLog as AiTokenLogType } from '@/lib/types/types';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import type { AiTokenLogInsert } from '@/lib/db/supabase';

type LogData = Omit<AiTokenLogType, 'id' | 'timestamp'>;

/**
 * Asynchronously logs AI token usage to Supabase.
 * This is a "fire-and-forget" operation and does not re-throw errors,
 * ensuring it doesn't block the primary application flow.
 * @param logData The data to be logged.
 */
async function logToSupabase(logData: LogData): Promise<void> {
    try {
        const supabase = getSupabaseAdmin();
        
        const insertData: AiTokenLogInsert = {
            flow_name: logData.flowName,
            total_tokens: logData.totalTokens,
            status: logData.status,
            user_id: logData.userId,
            error: logData.error,
            timestamp: new Date().toISOString(),
        };

        const { error } = await supabase
            .from('ai_token_logs')
            .insert(insertData);

        if (error) {
            throw error;
        }
    } catch (error) {
        // In a production environment, you might want to log this error to a different monitoring service.
        console.error("Failed to log AI token usage to Supabase:", error);
    }
}

/**
 * Logs an AI token usage event.
 * Currently, this dispatches only to Supabase, which is optimized for
 * high-frequency, append-only writes typical of logging.
 * @param logData - The data to be logged.
 */
export async function logAiTokenUsage(logData: LogData): Promise<void> {
    // Intentionally not awaiting the promise here.
    // This allows the logging to happen in the background without blocking
    // the main application flow that called this function.
    logToSupabase(logData);
}
