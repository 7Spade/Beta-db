# 驗證結構 (Validation Schemas)

此目錄存放使用 Zod 定義的資料驗證結構 (Schemas)。

將 Zod schemas 放在共享層有極大的好處：

- **單一事實來源**: 同一個 schema 可以同時被前端的表單驗證和後端的 API 請求驗證使用，確保了資料在進入系統的每一層都符合相同的規則。
- **類型推斷**: 自動從 schema 推斷出 TypeScript 類型，減少重複定義。

**範例**:

- `auth.schema.ts` (包含登入、註冊的驗證)
- `project.schema.ts`
