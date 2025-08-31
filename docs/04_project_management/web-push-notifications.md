# 「網路推播通知」系統 - 設計藍圖

本文件詳細闡述了如何在 Beta-db 整合平台中，實作一個安全、高效的「網路推播通知 (Web Push Notifications)」系統。

## 1. 核心目標 (Core Objectives)

傳統的應用程式內通知，只有在使用者打開網站時才能看到。Web Push 技術允許我們的平台**在使用者未開啟網站的情況下**，將重要通知直接推送到他們的手機或電腦桌面，從而實現：

- **即時觸達**: 當任務狀態變更、有新消息或需要審批時，相關人員能第一時間獲知，無論他們當時是否在操作平台。
- **提升互動**: 主動將重要資訊推送給使用者，而不是被動地等待他們登入查看，大幅提升使用者參與度和反應速度。
- **跨平台覆蓋**: 一次性支援所有主流瀏覽器（Chrome, Firefox, Safari, Edge）的桌面和行動版本，無需為不同平台開發原生 App。

## 2. 功能規劃與技術核心

### 2.1 使用者流程
1.  **請求權限**: 當使用者首次登入或在設定頁面中，系統會透過瀏覽器原生對話方塊，詢問使用者是否同意接收來自「Beta-db 平台」的通知。
2.  **訂閱**: 如果使用者同意，瀏覽器會生成一個獨一無二的「訂閱物件 (PushSubscription)」，其中包含一個用於接收通知的端點 URL。
3.  **後端儲存**: 前端會將這個「訂閱物件」傳送至我們的後端並安全地儲存起來，與對應的使用者 ID 關聯。

### 2.2 技術核心：VAPID 金鑰 (The "Credential")
VAPID (Voluntary Application Server Identification) 金鑰是確保推播安全性的核心，它扮演著我們應用程式的「數位身分證」角色。

- **公鑰 (Public Key)**: 當使用者訂閱通知時，我們的網站會提供此公鑰給瀏覽器。這等於是告訴瀏覽器，只有持有對應私鑰的伺服器才是合法的發送者。
- **私鑰 (Private Key)**: 此金鑰將被安全地存放在我們的伺服器環境中（例如 Google Secret Manager），絕不外洩。
- **工作流程**: 當我們要發送推播時，伺服器會使用**私鑰**對通知內容進行簽名，然後發送到使用者的訂閱端點 URL。推播服務（如 Google 的 FCM）會使用它們存儲的**公鑰**來驗證簽名，確保通知來源合法，然後再將其投遞到使用者的設備上。

## 3. 資料庫設計影響 (Database Design Impact)

為儲存使用者的訂閱資訊，需要建立一個新的頂層集合：`push_subscriptions`。

### 集合: `push_subscriptions`
此集合的每一份文件代表一個使用者在一個特定設備/瀏覽器上的訂閱。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:
| 欄位 | 類型 | 描述 |
| :--- | :--- | :--- |
| `userId` | `string` | **[關聯]** 這是哪個使用者的訂閱，關聯到 `users` 集合。 |
| `subscription`| `Map` | 儲存瀏覽器回傳的完整 `PushSubscription` JSON 物件。 |
| `createdAt` | `Timestamp` | 訂閱建立的時間。 |
| `userAgent` | `string` | (可選) 訂閱時的瀏覽器 User Agent，方便偵錯。 |

## 4. 前後端架構影響 (Frontend & Backend Architecture Impact)

### 4.1 前端
- **Service Worker (`public/sw.js`)**: 需要建立一個 Service Worker 檔案，它會在背景運行，負責接收並顯示收到的推播通知。
- **訂閱邏輯 (`usePushNotifications.ts`)**: 需要建立一個新的 Hook，負責：
  - 檢查瀏覽器是否支援推播。
  - 處理向使用者請求權限的邏輯。
  - 獲取使用者的訂閱物件，並將其發送到後端儲存。
- **UI 元件**: 在設定頁面或首次登入時，提供一個 UI 元素讓使用者可以啟用通知。

### 4.2 後端
- **API 端點/Server Action**: 需要一個 Server Action 來接收前端傳來的訂閱物件，並將其存入 `push_subscriptions` 集合。
- **推播觸發邏輯**:
  - **核心整合點**: 修改 `src/lib/services/notification/notification.service.ts`。
  - 當 `createNotification` 函數被呼叫時，它除了在 `notifications` 集合中寫入一筆站內通知外，還應**同時**觸發一個新的推播任務。
  - 這個任務會根據 `recipientId` 查找 `push_subscriptions` 集合，找到該使用者的所有訂閱端點，然後使用 Web Push 函式庫（如 `web-push`）和我們的 VAPID 私鑰，將通知內容分別發送到這些端點。

### 結構樹 (Structure Tree)
```text
public/
├── sw.js                         <-- 新檔案: Service Worker
src/
├── app/
│   └── (dashboard)/
│       └── settings/
│           └── page.tsx            <-- 新增啟用通知的 UI
├── components/
│   └── features/
│       └── settings/
│           └── enable-push-button.tsx  <-- 新元件
├── hooks/
│   └── use-push-notifications.ts     <-- 新 Hook
└── lib/
    ├── services/
    │   ├── notification/
    │   │   └── notification.service.ts <-- 修改此檔案，增加觸發推播的邏輯
    │   └── push/                       <-- 新目錄
    │       ├── push-actions.ts       # 儲存訂閱的 Server Action
    │       └── push.service.ts       # 發送推播的核心邏輯
    └── util/
        └── vapid-keys.ts               # (伺服器端) 管理 VAPID 金鑰

```

---
**結論**: Web Push 是將我們的平台從一個被動的工具轉變為一個主動的協作夥伴的關鍵技術。它的實施將極大地提升資訊傳遞的效率和即時性，是下一階段提升平台價值的核心功能之一。
