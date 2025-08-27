# 活動日誌系統設計文件 (Activity Log System Design)

本文檔詳細說明了 Beta-db 整合平台中，一個基於事件驅動架構的、模組化的「活動日誌與稽核追蹤」系統的完整設計方案。

## 1. 設計理念：被動的事件傾聽者 (Passive Event Listener)

為實現最高程度的模組化與最低的耦合度，活動日誌系統將被設計成一個**被動的事件傾聽者**。

-   **核心思想**：核心業務模組（如使用者管理、合約管理）在完成其操作後，僅負責向系統**廣播**一個定義好的事件（例如 `user.approved`），而不直接呼叫日誌服務。
-   **系統角色**：活動日誌模組作為一個獨立的監聽者，它會**訂閱**所有它關心的事件。當監聽到特定事件時，才觸發自己的業務邏輯——格式化數據並將其寫入資料庫。

這種模式確保了核心業務邏輯的純粹性，使其完全無需感知日誌系統的存在，從而實現了真正的關注點分離和未來的高度可擴展性。

---

## 2. 系統職責

本系統的核心職責是回答以下關鍵問題，以確保系統的可追溯性、安全性與合規性：

-   **是誰 (Who)**：哪個使用者或系統進程執行了操作？
-   **做了什麼 (What)**：執行了什麼具體的動作？操作了哪個實體？
-   **在何時 (When)**：操作發生的精確時間是什麼？

---

## 3. 結構樹規劃 (Structural Plan)

本設計將完美融入現有專案結構，並複用已規劃的事件驅動核心。

```diff
src/
├── components/
│   └── features/
│       └── admin/
│           └── actions/
│               └── user-actions.ts  <-- [整合點] 只需發送事件，無需修改
├── docs/
│   ├── database.md                <-- [修改點] 新增 activity_logs 集合定義
+│   └── activity-log.md            <-- [新檔案] 本設計文件
├── lib/
│   └── events/
│       ├── app-events.ts          <-- [修改點] 擴充事件字典
│       └── event-dispatcher.ts    <-- (無需修改)
└── services/
    ├── notification/
    │   └── ... (通知模組)
+   └── activity-log/              <-- [新目錄] 活動日誌模組
+       ├── activity-log.listeners.ts <-- [新檔案] 事件監聽器 (日誌系統的核心)
+       └── activity-log.service.ts   <-- [新檔案] 負責將日誌寫入資料庫的服務
```

---

## 4. 系統組件詳解

### 4.1. 數據層 (Data Layer)

-   **檔案**: `docs/database.md`
-   **變動**: **修改**此檔案，在 `notifications` 集合之後新增 `activity_logs` 集合的定義。
-   **`activity_logs` 集合文件結構**:
    | 欄位 (Field) | 類型 (Type) | 描述 |
    |--------------|-------------|----------------------------------------------------------------------|
    | `actorId`    | `string`    | **執行者**: 執行此操作的使用者 `users` 文件 ID。                     |
    | `entityType` | `string`    | **操作對象類型**: 被操作的實體類型，例如：`'user'`, `'project'`, `'contract'`。 |
    | `entityId`   | `string`    | **操作對象ID**: 被操作的實體文件 ID。                                |
    | `action`     | `string`    | **執行的動作**: 具體的動作名稱，應與事件名稱對應，如 `'user.approved'`。 |
    | `details`    | `Map`       | (可選) **操作細節**: 提供額外的上下文，例如：`{ from: 'pending', to: 'approved' }`。 |
    | `timestamp`  | `Timestamp` | **時間戳**: 操作發生的時間。                                         |

### 4.2. 事件核心 (Event Core)

-   **檔案**: `src/lib/events/app-events.ts`
-   **變動**: **修改**此檔案，擴充事件字典，為所有需要被稽核追蹤的活動定義標準化的事件類型。
    ```typescript
    // 範例
    export type AppEvent =
      | { name: 'user.approved'; payload: { userId: string; adminId: string; } }
      | { name: 'user.registered'; payload: { userId: string; email: string; } }
      | { name: 'contract.created'; payload: { contractId: string; creatorId: string; } }
      // ... 更多事件
    ```

### 4.3. 活動日誌模組 (`services/activity-log/`)

這是日誌系統的核心業務邏輯。

-   **`activity-log.service.ts`**
    -   **職責**: 提供一個 `createLogEntry` 函式。
    -   **功能**: 此函式接收一個結構化的日誌物件，並負責將其寫入 Firestore 的 `activity_logs` 集合。它是一個純粹的資料庫寫入服務。

-   **`activity-log.listeners.ts`**
    -   **職責**: **日誌系統的大腦**。此檔案會在應用程式啟動時，向 `event-dispatcher` **訂閱**所有需要記錄的事件。
    -   **功能**:
        1.  從 `event-dispatcher` 導入 `subscribe` 函式。
        2.  從 `activity-log.service` 導入 `createLogEntry` 函式。
        3.  為每一個需要記錄的事件建立一個訂閱。監聽器在接收到事件後，會將事件的 `payload` 轉換為 `createLogEntry` 所需的格式，然後呼叫它。

### 4.4. 前端表現層 (Presentation Layer)

-   **初期設計**: 在專案初期，**無需**為活動日誌建立專門的前端 UI。它的主要價值在於後端的稽核與追蹤。
-   **未來擴充**: 當需要一個管理介面來查看日誌時，可以輕易地建立一個新的頁面（例如 `/admin/activity-logs`），該頁面只需從 `activity_logs` 集合中讀取並顯示數據即可，無需與其他業務模組產生任何耦合。

此設計方案確保了活動日誌系統的獨立性、可擴展性和可維護性，使其成為一個強大的、符合企業級應用標準的後台基礎設施。
