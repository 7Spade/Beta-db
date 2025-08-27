# 事件驅動架構 (Event-Driven Architecture)

本文件說明了 Beta-db 整合平台中基於 `emit-ts` 的事件驅動系統。這個系統是實現模組化、低耦合架構的關鍵。

## 📁 核心檔案

```
src/lib/events/
├── app-events.ts                       # 定義所有事件名稱及其對應的 payload 類型
└── event-dispatcher.ts                 # 提供 dispatch 和 subscribe 函數的核心實現
```
```
src/lib/services/
├── activity-log/
│   └── activity-log.listeners.ts       # 訂閱事件以記錄活動日誌
└── notification/
    └── notification.listeners.ts       # 訂閱事件以發送通知
```

## 🎯 設計理念

傳統的應用程式設計中，一個操作（例如「用戶註冊」）常常需要在同一個函數裡完成多件事情：建立用戶、發送歡迎郵件、通知管理員、寫入活動日誌等。這會導致函數職責不清，且模組之間緊密耦合。

我們的事件驅動架構解決了這個問題：

1.  **單一職責**: 一個操作只做最核心的事情，然後「廣播」一個事件。例如，`register` 函數只負責在 Firebase Auth 中建立帳號和在 Firestore 中建立用戶文檔，然後廣播一個 `'user.registered'` 事件。
2.  **解耦模組**: 其他關心「用戶註冊」這件事的模組（如通知模組、活動日誌模組）可以「訂閱」這個事件。它們不需要知道是誰、在哪裡觸發了這個事件。
3.  **可擴展性**: 如果未來我們需要在庫存系統中為新用戶建立一個預設倉庫，我們只需要再寫一個新的監聽器來訂閱 `'user.registered'` 事件即可，完全不需要修改原始的註冊代碼。

## 📊 核心流程

1.  **定義事件**: 在 `app-events.ts` 中，為一個新的業務事件新增一個唯一的名稱（例如 `'contract.created'`）和它的 `payload` 類型（例如 `{ contractId: string; userId: string }`）。

2.  **廣播事件 (Dispatch)**: 在完成一個核心業務邏輯後，從 `event-dispatcher.ts` 導入 `dispatch` 函數，並廣播事件。
    ```typescript
    // In some function after creating a contract...
    import { dispatch } from '@/lib/events/event-dispatcher';

    // ... a contract was created with newContractId by someUser.
    await dispatch('contract.created', { contractId: newContractId, userId: someUser.id });
    ```

3.  **訂閱事件 (Subscribe)**: 在需要對該事件做出反應的模組中（通常是在一個 `listeners.ts` 檔案中），導入 `subscribe` 函數並註冊一個監聽器。
    ```typescript
    // In e.g., activity-log.listeners.ts
    import { subscribe } from '@/lib/events/event-dispatcher';
    import { createLogEntry } from '@/lib/services/activity-log.service';

    subscribe('contract.created', async ({ contractId, userId }) => {
      await createLogEntry({
        actorId: userId,
        entityType: 'contract',
        entityId: contractId,
        action: 'contract.created',
      });
    });
    ```

## 🔧 目前已實現的事件

-   **`user.registered`**: 當一個新用戶成功註冊時觸發。
    -   **監聽器**:
        -   `activity-log.listeners.ts`: 記錄用戶註冊的活動。
        -   `notification.listeners.ts`: 向所有管理員發送「新用戶待審核」的通知。
-   **`user.approved`**: 當管理員核准一個用戶時觸發。
    -   **監聽器**:
        -   `activity-log.listeners.ts`: 記錄用戶被核准的活動。
        -   `notification.listeners.ts`: 向被核准的用戶發送「帳號已啟用」的通知。
-   **`user.rejected`**: 當管理員拒絕一個用戶時觸發。
     -   **監聽器**:
        -   `activity-log.listeners.ts`: 記錄用戶被拒絕的活動。
        -   `notification.listeners.ts`: 向被拒絕的用戶發送「申請被拒絕」的通知。

## 📚 相關文件
- [資料庫設計文件](./database.md) (涉及 `notifications` 和 `activity_logs` 集合)