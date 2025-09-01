# 合約服務 (Contract Services)

此目錄存放與合約管理相關的、更偏向後端或與框架無關的業務服務實現。

**目前狀態：** 這些檔案大多是為未來更複雜的後端架構預留的佔位符。目前大部分的合約邏輯都實現在 `/components/features/contracts/` 目錄下的 Hooks 和 Server Actions 中。

## 服務檔案

- **`firebase-contract.service.ts`**: 一個基於 Firebase Admin SDK 的服務類，封裝了對 Firestore 中 `contracts` 集合的 CRUD (建立、讀取、更新、刪除) 操作。這是在純後端環境（如 Firebase Functions）中操作合約的理想方式。
- **`contract-api.service.ts`**: 一個佔位符，用於未來如果將合約後端遷移到一個獨立的 RESTful API 時，存放與該 API 互動的客戶端。
- **`contract-cache.service.ts`**: 一個佔位符，用於未來在客戶端實現更高級的快取策略（如使用 IndexedDB），以減少對 Firestore 的重複讀取。

## 未來發展

隨著應用程式的發展，可以將更多在前端 Hooks 和 Server Actions 中的複雜業務邏輯（如權限檢查、複雜查詢、數據驗證）逐步遷移到這個服務層中，以實現更清晰的關注點分離。