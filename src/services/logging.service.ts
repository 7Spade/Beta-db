'use server';

import { connectDB } from '@/lib/mongodb';
import type { AiTokenLog } from '@/lib/types';
import mongoose from 'mongoose';

// 定义 AI Token Log 的 Mongoose Schema
const AiTokenLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  action: { type: String, required: true },
  tokensUsed: { type: Number, required: true },
  model: { type: String, required: true },
  cost: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
});

// 使用 mongoose 的 model 缓存机制
const AiTokenLogModel = mongoose.models.AiTokenLog || mongoose.model('AiTokenLog', AiTokenLogSchema);

/**
 * Logs an AI token usage event to MongoDB.
 * This is a "fire-and-forget" operation and does not throw errors
 * to prevent it from blocking the main application flow.
 * @param logData - The data to be logged.
 */
export async function logAiTokenUsage(
    logData: Omit<AiTokenLog, 'id' | 'timestamp'>
): Promise<void> {
    try {
        // 确保数据库连接
        await connectDB();
        
        const logPayload = {
            ...logData,
            timestamp: new Date(),
        };
        
        await AiTokenLogModel.create(logPayload);
    } catch (error) {
        console.error("Failed to log AI token usage:", error);
        // We don't re-throw the error to avoid interrupting the user's flow.
        // Logging failure should not impact the user experience.
    }
}
