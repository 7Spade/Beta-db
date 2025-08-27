# 通知系統設計文件 (Notification System Design)

本文檔詳細說明了 Beta-db 整合平台中，一個模組化、事件驅動的通知系統的完整設計方案。

## 1. 設計理念：事件驅動架構 (Event-Driven Architecture)

為實現高度模組化和低耦合，通知系統將採用**事件驅動架構**。此設計的核心思想是：

-   **事件廣播 (Event Broadcasting)**：核心業務模組（如使用者管理）在完成其操作後，僅向系統廣播一個定義好的事件（例如 `user.approved`），而不直接呼叫通知服務。
-   **事件訂閱 (Event Subscription)**：通知模組作為一個獨立的監聽者，訂閱它感興趣的事件。當監聽到特定事件時，才觸發自己的業務邏輯（如建立一筆通知）。

這種模式的優勢在於，未來若想在同一事件發生時觸發其他行為（如寄送 Email），只需建立新的監聽者模組即可，無需修改任何現有業務邏輯，實現了真正的關注點分離。

---

## 2. 結構樹規劃 (Structural Plan)

基於專案現有結構，我們將新增以下檔案與目錄來建構此系統：

```
src/
├─ components/
│  └─ layout/
│     ├─ core/
│     │  └─ app-header.tsx         <-- [整合點]
│     └─ navigation/
│        └─ notification-center.tsx  <-- [新檔案]
├─ docs/
│  └─ database.md                  <-- [修改點]
├─ hooks/
│  └─ use-notifications.ts         <-- [新檔案]
├─ lib/
│  └─ events/                      <-- [新目錄]
│     ├─ app-events.ts              <-- [新檔案]
│     └─ event-dispatcher.ts        <-- [新檔案]
└─ services/
   └─ notification/                <-- [新目錄]
      ├─ notification.listeners.ts  <-- [新檔案]
      └─ notification.service.ts    <-- [新檔案]
```

---

## 3. 系統組件詳解

### 3.1. 數據層 (Data Layer)

-   **檔案**: `docs/database.md`
-   **變動**: **修改**此檔案，新增 `notifications` 集合的定義。
-   **職責**:
    -   作為系統的單一事實來源，定義通知的資料結構。
    -   **`notifications` 集合文件結構**:
        | 欄位 (Field)  | 類型 (Type) | 描述                                                           |
        |---------------|-------------|----------------------------------------------------------------|
        | `recipientId` | `string`    | **核心**: 接收通知的使用者 UID。                               |
        | `type`        | `string`    | 通知的類型，例如：`'new_user_for_approval'`, `'task_assigned'`。 |
        | `message`     | `string`    | 通知的內容，例如：「王小明已註冊，等待您的審核。」               |
        | `link`        | `string`    | (可選) 點擊通知後應導向的頁面路徑。                            |
        | `isRead`      | `boolean`   | **核心**: 標記此通知是否已被讀取，預設為 `false`。             |
        | `createdAt`   | `Timestamp` | 通知建立的時間。                                               |

### 3.2. 事件核心 (Event Core)

-   **目錄**: `src/lib/events/` (新目錄)
-   **職責**: 作為整個事件驅動系統的大腦。
    -   **`app-events.ts`**: 定義系統中所有事件的 TypeScript 類型，確保類型安全。例如：`{ name: 'user.approved', payload: { userId: string } }`。
    -   **`event-dispatcher.ts`**: 提供 `dispatch` 和 `subscribe` 兩個核心函式，並在後端維護一個事件與監聽者的對應列表。

### 3.3. 通知模組 (Notification Module)

-   **目錄**: `src/services/notification/` (新目錄)
-   **職責**: 封裝所有與通知相關的後端業務邏輯。
    -   **`notification.service.ts`**: 一個單純的後端服務，負責執行「將通知寫入 Firestore」這個具體操作。
    -   **`notification.listeners.ts`**: 通知模組的「耳朵」。它會向 `event-dispatcher` 註冊自己關心的事件，並在接收到事件時，呼叫 `notification.service.ts` 來執行相應的動作。

### 3.4. 前端表現層 (Presentation Layer)

-   **職責**: 負責在使用者介面中呈現通知並處理互動。
    -   **`hooks/use-notifications.ts`**: 一個新的 React Hook，使用 Firebase 的 `onSnapshot` 功能，為指定的使用者即時獲取通知列表與未讀計數。
    -   **`components/layout/navigation/notification-center.tsx`**: 一個新的 UI 元件，它會使用 `useNotifications` Hook 來獲取數據，並渲染出「鈴鐺」圖示、徽章以及通知下拉列表。

### 3.5. 整合與觸發

-   **`components/layout/core/app-header.tsx`**: **修改**此檔案，在頂部導航欄的適當位置（例如使用者選單旁）引入並渲染 `<NotificationCenter />`。
-   **各業務的 Server Actions** (例如 `user-actions.ts`): **修改**這些檔案，移除直接呼叫通知服務的邏輯，改為在操作成功後，呼叫 `dispatch()` 來廣播一個事件。

此設計方案將通知系統的各個部分清晰地分離，確保了其作為一個獨立模組的完整性，同時也為應用程式的未來擴展奠定了堅實的基礎。
