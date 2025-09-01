
# 徵才服務層 (Career Service Layer)

## 概述

此目錄包含與「企業徵才」功能相關的、可重用的**業務邏輯服務**。這些服務封裝了具體的後端操作和複雜的業務規則，旨在被 Server Actions 或其他高階元件呼叫。

## 設計原則

- **關注點分離**: 將核心業務邏輯與 UI 層或請求處理層（如 Server Actions）分離。
- **可重用性**: 同一個服務可以在應用程式的不同地方被重複使用。
- **可測試性**: 獨立的服務模組更容易進行單元測試。

## 檔案說明

- **`job.service.ts`**: 封裝了對職缺 (`jobs`) 的 CRUD 操作。
- **`application.service.ts`**: 封裝了對應徵 (`applications`) 的 CRUD 操作和狀態轉換邏輯。
- **`interview.service.ts`**: 處理與面試排程相關的邏輯。
- **`email.service.ts`**: 處理所有與徵才流程相關的郵件通知。
- **`analytics.service.ts`**: 提供與徵才相關的數據分析功能。
