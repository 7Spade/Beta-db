# 函式庫目錄 (Library)

`lib` 是 "library" 的縮寫，此目錄是應用程式的後端和通用邏輯的核心。它存放了所有非 React 元件、與特定 UI 無關的輔助程式碼、服務和設定。

## 目錄結構與職責

- **`db/`**: **資料庫連線層**。包含所有與資料庫初始化和連線相關的程式碼。
  - `firebase-client/`: 初始化供**客戶端**使用的 Firebase SDK。
  - `firebase-admin/`: 初始化供**伺服器端**使用的 Firebase Admin SDK。
  - `mongoose/`: 處理與 MongoDB 的連線。

- **`events/`**: **事件驅動架構核心**。這是實現模組化和低耦合的關鍵。
  - `app-events.ts`: 定義應用程式中所有可用的事件及其類型。
  - `event-dispatcher.ts`: 提供 `dispatch` 和 `subscribe` 方法，作為事件的廣播和訂閱中心。

- **`models/`**: **資料模型定義**。存放 Mongoose 的 Schema 定義，定義了資料在 MongoDB 中的結構。

- **`services/`**: **服務層**。封裝了獨立的業務邏輯，例如日誌記錄 (`ai-token-log`, `activity-log`)、通知 (`notification`) 和合約 (`contracts`) 的核心操作。這些服務可以被 Server Actions 或 AI Flows 呼叫。

- **`types/`**: **全域類型定義**。存放應用程式共享的 TypeScript 類型和介面。

- **`utils/`**: **通用工具函數**。包含可以在整個應用程式中重用的輔助函數，如 `cn` (用於合併 class) 和 `formatDate`。
