// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://7si:m9PIsSOktMQr5X9E@beta.jflbvbr.mongodb.net/?retryWrites=true&w=majority&appName=beta";


/**
 * 確保 MongoDB 連線可重用 (避免 hot reload 時多次連線)
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
