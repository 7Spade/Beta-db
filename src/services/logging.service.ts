
'use server';

import { firestore } from '@/lib/firebase';
import type { AiTokenLog as AiTokenLogType } from '@/lib/types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { connectDB } from '@/lib/mongodb';
import AiTokenLog from '@/models/ai-token-log.model';

type LogData = Omit<AiTokenLogType, 'id' | 'timestamp'>;

/**
 * Asynchronously logs AI token usage to Firestore.
 * This is a "fire-and-forget" operation and does not re-throw errors.
 * @param logData The data to be logged.
 */
async function logToFirestore(logData: LogData): Promise<void> {
    try {
        const logPayload = {
            ...logData,
            timestamp: serverTimestamp(),
        };
        await addDoc(collection(firestore, 'aiTokenLogs'), logPayload);
    } catch (error) {
        console.error("Failed to log AI token usage to Firestore:", error);
    }
}

/**
 * Asynchronously logs AI token usage to MongoDB.
 * This is a "fire-and-forget" operation and does not re-throw errors.
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
        console.error("Failed to log AI token usage to MongoDB:", error);
    }
}

/**
 * Logs an AI token usage event to all configured data stores (Firestore, MongoDB).
 * This function acts as a dispatcher and ensures that failures in one logging
 * system do not affect others.
 * @param logData - The data to be logged.
 */
export async function logAiTokenUsage(logData: LogData): Promise<void> {
    // We intentionally don't await these promises here.
    // This allows the logging to happen in the background without blocking
    // the main application flow that called this function.
    logToFirestore(logData);
    logToMongoDB(logData);
}
