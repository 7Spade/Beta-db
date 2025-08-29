# 核心專案管理元件 (Core Project Components)

此目錄包含與核心「專案管理」功能相關的 React 元件。這是應用程式最初的核心業務邏輯所在。

## 架構

本模組已升級為**伺服器優先 (Server-First)** 架構：
- **Server Actions**: 所有資料的修改（新增、更新、刪除）都由 `actions/` 目錄下的 Server Actions 處理。
- **無客戶端狀態**: 不再使用全局的 `ProjectContext`。資料的更新和 UI 的同步由 Next.js 的 `revalidatePath` 機制自動處理。
- **數據流**: 頁面 (`page.tsx`) 在伺服器端獲取最新數據 -> 將數據作為 props 傳遞給 `views` -> `views` 和 `components` 中的互動觸發 Server Actions -> Server Actions 更新資料庫並重新驗證路徑 -> Next.js 自動刷新 UI。

## 元件

- **`views/projects-view.tsx`**: 專案管理的主視圖，用於展示所有專案的列表卡片。
- **`components/project-details-sheet.tsx`**: 以側邊欄 (Sheet) 形式顯示單一專案的詳細資訊，包括其任務列表。
- **`components/create-project-dialog.tsx`**: 用於建立新專案的彈出對話方塊。
- **`components/task-item.tsx`**: 專案中的最小可互動單元，用於顯示單一任務及其子任務，並允許狀態變更。
- **`components/ai-subtask-suggestions.tsx`**: 一個與 Genkit 整合的 AI 元件，能根據父任務的標題，為使用者提供智慧化的子任務建議。

這些元件共同構成了應用程式中最核心的專案與任務追蹤功能。
