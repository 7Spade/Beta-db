# AI Token 消耗紀錄服務 (ai-token-log) - [已棄用]

**注意：此模組的功能已被整合到統一的 `activity-log` 服務中，並將在未來的重構中被移除。**

## 原始職責

此服務的原始目的是提供一個 `logAiTokenUsage` 函數，用於非同步地將 Genkit AI 流程的 Token 消耗紀錄寫入資料庫。

## 整合後的架構

在新的事件驅動架構下，AI 流程不再直接呼叫此服務。取而代之的是：
1. AI 流程在執行完畢後，會廣播一個 `ai_flow.executed` 事件。
2. `activity-log.listeners.ts` 會訂閱此事件。
3. 當事件觸發時，監聽器會呼叫 `activity-log.service.ts` 來建立一筆標準化的活動日誌，其中 `entityType` 為 `'ai_flow'`，並在 `details` 欄位中記錄 Token 數量等資訊。

這種方式使得日誌記錄的邏輯更加統一和中心化。
