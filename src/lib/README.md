# 函式庫目錄 (Library)

`lib` 是 "library" 的縮寫，此目錄是應用程式的後端和通用邏輯的核心。它存放了所有非 React 元件、與特定 UI 無關的輔助程式碼、服務和設定。

## 🏗️ 目錄結構與職責

### 🗄️ 資料庫層 (Database Layer)
- **`db/`**: 資料庫連線和操作層
  - `firebase-client/`: 客戶端 Firebase SDK 初始化
  - `firebase-admin/`: 伺服器端 Firebase Admin SDK 初始化
  - `mongoose/`: MongoDB 連線和操作
  - `redis/`: Redis 快取和會話管理
  - `supabase/`: Supabase 關聯式資料庫整合

### 📡 事件系統 (Event System)
- **`events/`**: 事件驅動架構核心
  - `app-events.ts`: 應用程式事件定義和類型
  - `event-dispatcher.ts`: 事件分發和訂閱中心
  - `event-types.ts`: 事件類型定義和驗證

### 🏷️ 資料模型 (Data Models)
- **`models/`**: 資料模型定義
  - Mongoose Schema 定義
  - 資料驗證規則
  - 資料關聯和索引

### 🔧 服務層 (Service Layer)
- **`services/`**: 業務邏輯服務
  - `ai-token-log`: AI 使用記錄服務
  - `activity-log`: 活動日誌服務
  - `notification`: 通知服務
  - `contracts`: 合約管理服務
  - `auth`: 身份驗證服務

### 📝 類型定義 (Type Definitions)
- **`types/`**: 全域 TypeScript 類型
  - 共用介面和類型
  - API 請求和回應類型
  - 業務邏輯類型定義

### 🛠️ 工具函數 (Utility Functions)
- **`utils/`**: 通用工具函數
  - `cn`: CSS 類別合併工具
  - `formatDate`: 日期格式化
  - `validation`: 資料驗證工具
  - `crypto`: 加密和雜湊工具

### ⚙️ 配置管理 (Configuration)
- **`config/`**: 應用程式配置
  - 環境變數配置
  - 功能開關設定
  - 第三方服務配置

### 🔐 常數定義 (Constants)
- **`constants/`**: 系統常數
  - 角色和權限定義
  - 業務規則常數
  - 系統限制和閾值

## 🎯 設計原則

### 模組化設計
- **高內聚**: 相關功能集中在同一模組
- **低耦合**: 模組間最小化依賴關係
- **可測試**: 每個模組都可以獨立測試

### 類型安全
- **TypeScript 優先**: 所有新功能都使用 TypeScript
- **嚴格類型檢查**: 啟用所有 TypeScript 嚴格模式
- **類型推斷**: 充分利用 TypeScript 的類型推斷

### 錯誤處理
- **統一錯誤處理**: 標準化的錯誤處理機制
- **錯誤日誌**: 完整的錯誤追蹤和記錄
- **用戶友好**: 向用戶顯示友好的錯誤訊息

## 🔄 與其他模組的整合

### 前端整合
- **React Hooks**: 提供自定義 Hooks 給前端使用
- **Server Actions**: 支援 Next.js Server Actions
- **API 路由**: 提供 RESTful API 端點

### 外部服務整合
- **Firebase**: 身份驗證和雲端服務
- **Supabase**: 關聯式資料庫和即時功能
- **Google AI**: AI 和機器學習服務
- **Redis**: 快取和會話管理

## 📋 開發狀態

- ✅ **已完成**: 資料庫層、事件系統、基礎服務
- 🚧 **開發中**: 進階服務、配置管理
- 📋 **規劃中**: 微服務架構、API 網關
- 🔄 **持續改進**: 性能優化、安全性強化

## 🚀 未來規劃

- **微服務化**: 將大型服務拆分成微服務
- **API 版本管理**: 支援多版本 API 管理
- **效能監控**: 實作服務效能監控和分析
- **自動化測試**: 增加服務層的單元測試和整合測試
- **文檔生成**: 自動生成 API 文檔和類型定義
