# 資料模型 (Data Models)

此目錄存放應用程式的 **Mongoose 資料模型**。每個模型檔案都定義了一個特定資料在 **MongoDB** 中的結構 (Schema)、類型和驗證規則。

Mongoose 模型為非結構化的 MongoDB 資料提供了一層結構和規範，確保了寫入資料庫的數據是乾淨和一致的。

## 模型檔案

- **`ai-token-log.model.ts`**: 定義了 AI Token 使用日誌的 Schema。

## 設計原則

- **一個檔案一個模型**: 每個檔案只負責定義一個 Mongoose 模型。
- **類型安全**: 每個 Schema 都配有一個對應的 TypeScript `interface`，確保在程式碼中操作資料時的類型安全。
- **防止重複編譯**: 使用 `mongoose.models.ModelName || mongoose.model(...)` 的模式，以避免在 Next.js 的熱重載 (hot-reloading) 環境下重複編譯模型，從而引發錯誤。
