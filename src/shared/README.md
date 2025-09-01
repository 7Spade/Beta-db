# 共享資源層 (Shared Resources Layer)

## 概述

此 `shared` 目錄是應用程式中所有**可重用、與框架無關**的核心資源的所在地。這裡的程式碼應該是純粹的、不依賴於任何特定 UI 框架（如 React）或後端框架（如 Next.js API Routes）的邏輯。

其目標是建立一個穩定的、可被應用程式任何部分（前端、後端、AI 流程）安全引用的通用函式庫。

## 統一導出

所有共享資源都透過 `src/shared/index.ts` 統一導出，使用方式：

```typescript
// 導入任何共享資源
import { Role, ROLES, useToast, formatDate, Project } from '@/shared';
```

## 目錄結構與功能

```
src/shared/
├── index.ts          # 統一匯出檔案 - 提供所有共享資源的統一導入點
├── README.md         # 綜合文檔 - 詳細的功能說明和使用指南
├── constants/        # 常數定義 - 存放應用程式範圍的硬編碼常數值
├── enums/           # 枚舉定義 - 定義結構化的選項集合和類型安全的值
├── events/          # 事件系統 - 提供事件發布與訂閱機制，實現鬆耦合通訊
├── hooks/           # 自定義 Hooks - 可重用的 React 狀態邏輯和副作用管理
├── models/          # 資料模型 - Mongoose Schema 定義，提供資料庫結構規範
├── schemas/         # 驗證結構 - Zod schemas 用於前後端資料驗證
├── services/        # 服務層 - 後端業務邏輯封裝，提供可重用的業務功能
├── types/           # 類型定義 - 共享的 TypeScript 介面和類型
└── utils/           # 工具函數 - 純函數工具庫，提供通用輔助功能
```

### 📁 constants/
存放應用程式範圍內使用的硬編碼常數值。

**檔案：**
- `roles.ts` - 使用者角色相關常數和類型定義

**功能：**
- 避免「魔術數字」或「魔術字串」散落在程式碼各處
- 方便未來統一修改
- 確保整個應用程式使用一致的值

**範例：**
```typescript
import { Role, ROLES, isRole, canEditPartner } from '@/shared';
```

### 📁 enums/
定義應用程式中使用的 TypeScript 枚舉或類似枚舉的常數物件。

**功能：**
- 提高程式碼的可讀性
- 將一組相關的常數值組織在一起
- 限制變數只能接受特定的值

**範例：**
- `UserStatus.enum.ts` (例如: `PENDING`, `APPROVED`, `REJECTED`)
- `TaskPriority.enum.ts` (例如: `HIGH`, `MEDIUM`, `LOW`)

### 📁 events/
事件系統的核心，提供應用程式範圍內的事件發布與訂閱機制。

**檔案：**
- `app-events.ts` - 定義所有應用程式事件類型
- `event-dispatcher.ts` - 事件分發器實現

**功能：**
- 解耦模組間的依賴關係
- 提供統一的事件管理機制
- 支援跨模組的通訊

### 📁 hooks/
存放應用程式中所有可重用的自定義 React Hooks。

**檔案：**
- `use-mobile.tsx` - 偵測行動裝置斷點的 Hook
- `use-notifications.ts` - 通知中心管理 Hook
- `use-toast.ts` - Toast 通知顯示 Hook

**功能：**
- 將元件的狀態邏輯提取出來，便於多個元件間共享
- 讓程式碼更乾淨、更易於維護
- 提供響應式設計和通知管理功能

**範例：**
```typescript
import { useMobile, useNotifications, useToast } from '@/shared';

// 在元件中使用
const isMobile = useMobile();
const { notifications, unreadCount } = useNotifications();
const toast = useToast();
```

### 📁 models/
存放應用程式的 **Mongoose 資料模型**。

**檔案：**
- `ai-token-log.model.ts` - AI Token 使用日誌的 Schema

**功能：**
- 為非結構化的 MongoDB 資料提供結構和規範
- 確保寫入資料庫的數據是乾淨和一致的
- 提供類型安全的資料操作

**設計原則：**
- 一個檔案一個模型
- 每個 Schema 都配有一個對應的 TypeScript `interface`
- 使用 `mongoose.models.ModelName || mongoose.model(...)` 模式防止重複編譯

### 📁 schemas/
存放使用 Zod 定義的資料驗證結構 (Schemas)。

**功能：**
- 單一事實來源：同一個 schema 可同時用於前端表單驗證和後端 API 請求驗證
- 類型推斷：自動從 schema 推斷出 TypeScript 類型
- 減少重複定義

**範例：**
- `auth.schema.ts` (包含登入、註冊的驗證)
- `project.schema.ts`

### 📁 services/
應用程式**後端業務邏輯**的所在地，將可重用的業務邏輯封裝成獨立的服務。

#### Activity Log 服務
- `activity-log.service.ts` - 活動日誌核心服務
- `activity-log.listeners.ts` - 活動日誌事件監聽器

#### AI Token Log 服務
- `logging.service.ts` - AI Token 使用記錄服務

#### Blog 服務
- `blog.service.ts` - 部落格內容管理服務
- `cache.service.ts` - 快取管理服務
- `media.service.ts` - 媒體檔案管理服務

#### Career 服務
- `analytics.service.ts` - 職涯分析服務
- `application.service.ts` - 求職申請管理服務
- `email.service.ts` - 職涯相關郵件服務
- `interview.service.ts` - 面試管理服務
- `job.service.ts` - 職位管理服務

#### Contracts 服務
- `contract-api.service.ts` - 合約 API 服務
- `contract-cache.service.ts` - 合約快取服務
- `firebase-contract.service.ts` - Firebase 合約服務

#### Notification 服務
- `notification.service.ts` - 通知系統核心服務
- `notification.listeners.ts` - 通知事件監聽器

**設計原則：**
- **關注點分離**：讓 Server Actions 專注於處理請求，將業務邏輯委託給服務層
- **可重用性**：同一個服務可以被多個不同的呼叫者使用
- **可測試性**：獨立的服務模組更容易進行單元測試
- **事件驅動整合**：服務可以與事件系統互動

### 📁 types/
存放應用程式中**共享的、全局性的 TypeScript 類型定義**。

**檔案：**
- `types.ts` - 核心資料實體結構定義（Project, Task, Partner, TeamMember, Skill 等）
- `errors.ts` - 錯誤類型定義
- `env.types.ts` - 環境變數類型定義

**功能：**
- 確保整個應用程式對同一種資料有一致的理解和結構
- 避免在不同模組中重複定義相同的類型
- 提供類型安全的開發體驗

**使用原則：**
- 當一個類型需要在多個功能模組之間共享時，定義在 `types.ts` 中
- 如果一個類型僅在單一功能模組內部使用，可定義在該功能模組的 `types` 子目錄下

### 📁 utils/
包含純粹的、無副作用的、可在整個應用程式中重用的通用輔助函數。

**檔案：**
- `utils.ts` - 通用工具函數
- `auth-utils.ts` - 認證相關工具函數
- `date-utils.ts` - 日期處理工具函數

**功能：**
- 提供可預測的純函數：給定相同的輸入，總是返回相同的輸出
- 無外部依賴（除了其他 `utils` 或 `constants`）
- 提高程式碼的可重用性和可維護性

**範例：**
```typescript
import { formatDate, formatMoney, truncate } from '@/shared';
```

## 使用指南

### 導入方式

```typescript
// 統一導入（推薦）
import { Role, useToast, formatDate, Project } from '@/shared';

// 或分別導入
import { Role } from '@/shared/constants/roles';
import { useToast } from '@/shared/hooks/use-toast';
```

### 開發原則

1. **框架無關性**：此層的程式碼不應依賴於任何特定的 UI 或後端框架
2. **純函數優先**：工具函數應該是純函數，無副作用
3. **類型安全**：所有導出都應有完整的 TypeScript 類型定義
4. **單一職責**：每個檔案應專注於單一功能領域
5. **可測試性**：所有程式碼都應易於進行單元測試

### 新增資源

當需要新增共享資源時：

1. 在對應的目錄下建立檔案
2. 在 `src/shared/index.ts` 中新增導出
3. 更新此 README.md 文件
4. 確保新增的程式碼符合上述開發原則

## 注意事項

- 此層的程式碼變更會影響整個應用程式，請謹慎修改
- 新增依賴時請確保不會造成循環依賴
- 保持向後相容性，避免破壞性變更
- 定期檢查和清理未使用的導出