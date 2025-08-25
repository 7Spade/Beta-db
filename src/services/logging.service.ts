'use server';

import { firestore } from '@/lib/firebase';
import type { AiTokenLog as AiTokenLogType } from '@/lib/types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { connectDB } from '@/lib/mongodb';
import AiTokenLog from '@/models/ai-token-log.model';


/**
 * Logs an AI token usage event to both Firestore and MongoDB.
 * This is a "fire-and-forget" operation and does not throw errors
 * to prevent it from blocking the main application flow.
 * @param logData - The data to be logged.
 */
export async function logAiTokenUsage(
    logData: Omit<AiTokenLogType, 'id' | 'timestamp'>
): Promise<void> {
    try {
        // Log to Firestore
        const logPayload = {
            ...logData,
            timestamp: serverTimestamp(),
        };
        await addDoc(collection(firestore, 'aiTokenLogs'), logPayload);

        // Log to MongoDB
        await connectDB();
        const mongoLog = new AiTokenLog({
            ...logData,
            timestamp: new Date(),
        });
        await mongoLog.save();

    } catch (error) {
        console.error("Failed to log AI token usage:", error);
        // We don't re-throw the error to avoid interrupting the user's flow.
        // Logging failure should not impact the user experience.
    }
}
