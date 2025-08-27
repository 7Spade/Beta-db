/**
 * @fileoverview AI Token 消耗紀錄 Mongoose 模型
 * @description 此檔案定義了用於儲存 Genkit AI 流程 Token 使用紀錄的 MongoDB 資料模型。
 * 它使用了 Mongoose 來建立一個 schema，並匯出一個可供其他服務使用的模型。
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * @interface IAiTokenLog
 * @description 定義了 AI Token Log 檔案在 TypeScript 中的型別。
 * @extends {Document} - 繼承自 Mongoose 的 Document 介面，使其擁有 Mongoose 檔案的屬性。
 */
export interface IAiTokenLog extends Document {
  /**
   * @property {string} flowName - 被呼叫的 Genkit 流程的名稱。
   */
  flowName: string;
  /**
   * @property {number} totalTokens - 該次 AI 操作所消耗的總 Token 數量。
   */
  totalTokens: number;
  /**
   * @property {'succeeded' | 'failed'} status - 操作的最終狀態（成功或失敗）。
   */
  status: 'succeeded' | 'failed';
  /**
   * @property {Date} timestamp - 該筆紀錄的建立時間戳。
   */
  timestamp: Date;
  /**
   * @property {string} [userId] - (可選) 執行此操作的使用者 ID。
   */
  userId?: string;
  /**
   * @property {string} [error] - (可選) 如果狀態為 'failed'，則記錄錯誤訊息。
   */
  error?: string;
}

/**
 * @const AiTokenLogSchema
 * @description 定義了 AI Token Log 在 MongoDB 中的資料結構、型別和驗證規則。
 */
const AiTokenLogSchema: Schema<IAiTokenLog> = new Schema({
  flowName: { type: String, required: true, trim: true, index: true },
  totalTokens: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['succeeded', 'failed'], required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  userId: { type: String, trim: true, index: true },
  error: { type: String },
});

/**
 * @const AiTokenLog
 * @description Mongoose 模型，提供了對 `ai_token_logs` 集合的 CRUD (建立、讀取、更新、刪除) 操作介面。
 * 這裡使用了 Mongoose 的最佳實踐，避免在熱重載 (hot-reloading) 環境下重複編譯模型。
 */
const AiTokenLog: Model<IAiTokenLog> = mongoose.models.AiTokenLog || mongoose.model<IAiTokenLog>('AiTokenLog', AiTokenLogSchema);

export default AiTokenLog;
