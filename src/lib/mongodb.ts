// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
      "請在您的 .env.local 檔案中定義 MONGODB_URI 環境變數"
    );
}

// 驗證連線字串中是否包含資料庫名稱
const dbNameMatch = MONGODB_URI.match(/\/([^/?]+)\?/);
if (!dbNameMatch || !dbNameMatch[1]) {
    throw new Error(
      "您的 MONGODB_URI 連線字串缺少資料庫名稱。它應該是這樣的格式：mongodb+srv://.../<資料庫名稱>?..."
    );
}


/**
 * 確保 MongoDB 連線可重用 (避免 hot reload 時多次連線)
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("MongoDB 連線成功！");
      return mongoose;
    }).catch(err => {
        console.error("MongoDB 連線失敗:", err.message);
        throw new Error("無法連線到 MongoDB。請檢查您的 MONGODB_URI 環境變數是否正確，並包含資料庫名稱。");
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // 在失敗時重置 promise，以便下次可以重試
    throw e;
  }
  
  return cached.conn;
}
