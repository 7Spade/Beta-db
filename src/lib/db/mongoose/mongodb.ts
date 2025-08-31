// lib/mongodb.ts
import mongoose from "mongoose";

// 注意：不要在模組載入時就讀取或驗證環境變數，避免在
// Next.js build/prerender 階段觸發連線或丟出錯誤。

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * 確保 MongoDB 連線可重用 (避免 hot reload 時多次連線)
 */
let cached = (global as { mongoose?: CachedConnection }).mongoose;

if (!cached) {
  cached = (global as { mongoose?: CachedConnection }).mongoose = { conn: null, promise: null };
}

// 类型断言：确保cached不为undefined
const cachedConnection = cached as CachedConnection;

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "請在您的環境變數中定義 MONGODB_URI（建議使用 Secret 注入）"
    );
  }

  // 驗證連線字串中是否包含資料庫名稱
  const dbNameMatch = mongoUri.match(/\/([^\/?]+)\?/);
  if (!dbNameMatch || !dbNameMatch[1]) {
    throw new Error(
      "您的 MONGODB_URI 連線字串缺少資料庫名稱。它應該是這樣的格式：mongodb+srv://.../<資料庫名稱>?..."
    );
  }

  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    const opts = {
      bufferCommands: false,
    };
    
    cachedConnection.promise = mongoose.connect(mongoUri!, opts).then((mongoose) => {
      console.log("MongoDB 連線成功！");
      return mongoose;
    }).catch(err => {
        console.error("MongoDB 連線失敗:", err.message);
        throw new Error("無法連線到 MongoDB。請檢查您的 MONGODB_URI 環境變數是否正確，並包含資料庫名稱。");
    });
  }

  try {
    cachedConnection.conn = await cachedConnection.promise;
  } catch (e) {
    cachedConnection.promise = null; // 在失敗時重置 promise，以便下次可以重試
    throw e;
  }
  
  return cachedConnection.conn;
}
