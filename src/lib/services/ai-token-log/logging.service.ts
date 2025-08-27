
'use server';

import type { AiTokenLog as AiTokenLogType } from '@/lib/types/types';
import { connectDB } from '@/lib/db/mongoose/mongodb';
import AiTokenLog from '@/lib/models/ai-token-log.model';

type LogData = Omit<AiTokenLogType, 'id' | 'timestamp'>;

/**
 * Asynchronously logs AI token usage to MongoDB.
 * This is a "fire-and-forget" operation and does not re-throw errors,
 * ensuring it doesn't block the primary application flow.
 * @param logData The data to be logged.
 */
async function logToMongoDB(logData: LogData): Promise<void> {
    try {
        await connectDB();
        const mongoLog = new AiTokenLog({
            ...logData,
            timestamp: new Date(),
        });
        await mongoLog.save();
    } catch (error) {
        // In a production environment, you might want to log this error to a different monitoring service.
        console.error("Failed to log AI token usage to MongoDB:", error);
    }
}

/**
 * Logs an AI token usage event.
 * Currently, this dispatches only to MongoDB, which is optimized for
 * high-frequency, append-only writes typical of logging.
 * @param logData - The data to be logged.
 */
export async function logAiTokenUsage(logData: LogData): Promise<void> {
    // Intentionally not awaiting the promise here.
    // This allows the logging to happen in the background without blocking
    // the main application flow that called this function.
    logToMongoDB(logData);
}
