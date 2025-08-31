# API 伺服器端 (API Server)

## 概述

此目錄包含了所有**後端**用於處理 API 請求的邏輯。這些程式碼通常在 Next.js 的 API Routes (`/pages/api`) 或 Server Actions 中被呼叫。

將這些處理邏輯從 API Routes/Server Actions 中分離出來，可以讓進入點的程式碼更簡潔，並讓核心邏輯更容易進行單元測試。

## 目錄結構

- **/handlers/**: 核心請求處理程序。每個檔案對應一個資源。例如 `project.handler.ts` 會包含 `handleGetProjects`, `handleCreateProject` 等函式。API Route 的程式碼只需導入並呼叫這些 handler 即可。
- **/middleware/**: 存放可重用的中介軟體，例如 `authMiddleware` (驗證使用者 JWT), `logMiddleware` (記錄請求日誌) 等。
- **/validators/**: 存放後端數據驗證邏輯。雖然 Zod schemas 定義在 `shared` 層，但這裡可以有更複雜的、需要查詢資料庫的驗證（例如，檢查 email 是否已存在）。
