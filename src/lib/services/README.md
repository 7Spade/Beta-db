# 服務層 (Services)

此目錄是應用程式**後端業務邏輯**的所在地。它將可重用的業務邏輯封裝成獨立的「服務」，以便被 Server Actions、API 路由或 AI Flows 等不同的進入點呼叫。

## 設計原則

- **關注點分離**: 讓 Server Actions 或 AI Flows 專注於處理請求和協調流程，而將具體的業務邏輯（如資料庫操作、與外部 API 互動、複雜計算）委託給服務層。
- **可重用性**: 同一個服務可以被多個不同的呼叫者使用。例如，`activity-log.service` 可以被任何需要記錄活動的事件監聽器呼叫。
- **可測試性**: 獨立的服務模組比混合了請求/回應處理的 Server Actions 更容易進行單元測試。
- **事件驅動整合**: 服務可以與 `/lib/events` 事件系統互動。例如，`notification.listeners.ts` 和 `activity-log.listeners.ts` 就是透過訂閱事件來觸發對應的服務。

## 服務分類

- **`ai-token-log/`**: **[已棄用]** 此服務的功能已被整合到 `activity-log` 中。
- **`contracts/`**: 包含與合約相關的複雜業務邏輯服務 (目前為佔位符)。
- **`notification/`**: 通知系統的核心，包含建立通知的服務和事件監聽器。
- **`activity-log/`**: 活動日誌系統的核心，包含建立日誌的服務和事件監聽器。
