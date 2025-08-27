# 活動日誌系統 V1 設計：整合 AI Token 消耗紀錄

本文檔闡述了將 `aiTokenLogs` 功能整合進現有的「活動日誌系統」的設計方案，目標是建立一個統一的、更全面的稽核追蹤與日誌記錄系統。

## 1. 核心理念：單一稽核來源 (Single Source of Audit)

取代分別維護 `activity_logs` 和 `aiTokenLogs` 兩個獨立集合的做法，我們將兩者合併為一個統一的 `activity_logs` 集合。

-   **統一性 (Uniformity)**：所有需要被追蹤的系統活動，無論是使用者操作（如核准使用者）還是系統內部事件（如 AI 流程執行），都將被記錄在同一個地方。
-   **簡化查詢 (Simplified Queries)**：分析特定使用者或特定時間範圍內的所有活動（包括他觸發的 AI 操作）將變得極其簡單，無需跨集合查詢。
-   **一致的事件驅動 (Consistent Event-Driven Model)**：我們將繼續採用事件驅動架構。AI 流程的執行也將被視為一個系統事件，由日誌模組監聽並記錄。

---

## 2. 統一後的資料庫結構

為了同時容納兩種類型的日誌，我們將對 `activity_logs` 集合的結構進行微調和擴充。

-   **檔案**: `docs/database.md`
-   **變動**: **更新**此檔案中 `activity_logs` 集合的定義。
-   **統一後的 `activity_logs` 集合文件結構**:

| 欄位 (Field) | 類型 (Type) | 描述 | 範例 |
|--------------|-------------|--------------------------------------------------------------------------------------------------|----------------------------------------------------|
| `actorId`    | `string`    | **執行者**: 執行此操作的使用者 UID，或在系統自動觸發時為 `'system'`。 | `'user_abc_123'` 或 `'system'` |
| `action`     | `string`    | **執行的動作**: 具體的動作名稱，格式為 `entity.action`。 | `'user.approved'`, `'ai_flow.succeeded'` |
| `entityType` | `string`    | **操作對象類型**: 被操作的實體類型。 | `'user'`, `'contract'`, `'ai_flow'` |
| `entityId`   | `string`    | **操作對象ID**: 被操作的實體文件 ID 或 AI Flow 的名稱。 | `'user_xyz_456'`, `'extractWorkItemsFlow'` |
| `details`    | `Map`       | **操作細節**: 提供額外的上下文。**AI Token 資訊將記錄在此**。 | `{ from: 'pending', to: 'approved' }` 或 `{ totalTokens: 1234 }` |
| `status`     | `string`    | (可選) **結果狀態**: 操作的結果，主要用於 AI 流程。 | `'succeeded'`, `'failed'` |
| `timestamp`  | `Timestamp` | **時間戳**: 操作發生的時間。 | `Timestamp.now()` |

---

## 3. 實作計畫

### 3.1. 事件核心 (`lib/events/`)

-   **`app-events.ts`**: 我們需要擴充事件字典，為 AI 流程的執行定義新的事件類型。
    ```typescript
    // 範例，非實際程式碼
    export type AppEvent =
      // ... 現有事件
      | { 
          name: 'ai_flow.executed'; 
          payload: { 
            flowName: string; 
            status: 'succeeded' | 'failed'; 
            totalTokens: number; 
            userId?: string; 
            error?: string;
          } 
        };
    ```

### 3.2. 整合 `logging.service.ts`

我們將重構現有的 `logAiTokenUsage` 服務，使其成為統一的日誌記錄入口。

-   **檔案**: `src/lib/services/ai-token-log/logging.service.ts`
-   **重構計畫**:
    1.  將此服務重新命名或擴充，使其職責變為通用的「活動日誌服務」。
    2.  修改 `logAiTokenUsage` 函式，使其內部不再直接寫入 `aiTokenLogs`，而是廣播一個 `ai_flow.executed` 事件。

-   **檔案**: `src/ai/flows/*.ts` (所有 AI 流程檔案)
-   **變動**:
    -   在每個 AI Flow 的 `try/catch` 區塊中，移除對 `logAiTokenUsage` 的直接呼叫。
    -   取而代之，使用 `event-dispatcher` 來廣播 `ai_flow.executed` 事件。
    ```typescript
    // 在 AI Flow 中
    try {
        // ... AI 邏輯 ...
        dispatch({ 
            name: 'ai_flow.executed', 
            payload: { flowName: '...', totalTokens: ..., status: 'succeeded', userId: '...' }
        });
    } catch (error) {
        dispatch({ 
            name: 'ai_flow.executed', 
            payload: { flowName: '...', totalTokens: ..., status: 'failed', error: '...', userId: '...' }
        });
    }
    ```

### 3.3. 更新 `activity-log` 模組

-   **檔案**: `src/services/activity-log/activity-log.listeners.ts`
-   **變動**:
    -   在此檔案中，**新增**對 `ai_flow.executed` 事件的訂閱。
    -   當監聽到此事件時，將其 `payload` 轉換為 `activity_logs` 集合所需的格式，然後呼叫 `activity-log.service.ts` 來寫入資料庫。

```typescript
// activity-log.listeners.ts 偽代碼
subscribe('ai_flow.executed', (payload) => {
  createLogEntry({
    actorId: payload.userId || 'system',
    action: `ai_flow.${payload.status}`,
    entityType: 'ai_flow',
    entityId: payload.flowName,
    details: { 
        totalTokens: payload.totalTokens,
        ...(payload.error && { error: payload.error }) // 如果有錯誤，則包含錯誤訊息
    },
    status: payload.status
  });
});
```

透過以上設計，我們可以實現一個高度內聚、低耦合的統一稽核日誌系統。所有業務模組（包括 AI 流程）都只負責廣播事件，而日誌記錄的具體實現則完全封裝在 `activity-log` 模組中，達到了極高的可維護性和擴展性。
