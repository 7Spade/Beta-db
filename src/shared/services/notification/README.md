# 通知服務 (Notification Service)

## 概述

此服務是 Beta-db 整合平台中**即時互動**和**資訊同步**的核心。它負責根據應用程式中發生的各種業務事件，向相關使用者發送目標明確的通知。

本服務與**事件驅動架構 (`/lib/events`)** 緊密整合，實現了高度的模組解耦。

## 架構與工作流程

1.  **事件觸發**: 應用程式的其他部分（如 Server Actions）在完成一個關鍵操作後，會廣播一個事件，例如 `dispatch('user.approved', { userId: '...' })`。
2.  **事件監聽**: `notification.listeners.ts` 檔案中註冊了多個監聽器，它們會訂閱自己感興趣的事件。
3.  **服務呼叫**: 當監聽器捕獲到對應的事件後，它會呼叫 `notification.service.ts` 中的 `createNotification` 函數。
4.  **資料庫寫入**: `createNotification` 函數負責在 Firestore 的 `notifications` 集合中建立一筆新的通知文件，其中包含了接收者 ID、訊息內容、連結等資訊。
5.  **前端顯示**: 前端的使用者介面（特別是 `useNotifications` Hook）會即時監聽 `notifications` 集合的變化，並將新的通知顯示在 `NotificationCenter` 元件中。

## 檔案說明

- **`notification.service.ts`**:
  - **職責**: 提供單一、原子化的 `createNotification` 服務。它的職責很單純：就是將一筆準備好的通知資料寫入資料庫。它不關心通知是如何被觸發的。

- **`notification.listeners.ts`**:
  - **職責**: 作為**業務邏輯層**，將特定的業務事件（如「使用者被批准」）轉化為具體的通知內容（如「您的帳號已通過審核」）。
  - 這是連接「事件」和「通知服務」的橋樑。

這種分離確保了 `createNotification` 服務的高度可重用性，同時也讓業務邏輯集中在 `listeners` 中，易於管理和擴展。
