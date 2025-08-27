# 核心專案管理元件 (Core Project Components)

此目錄包含與核心「專案管理」功能相關的 React 元件。這是應用程式最初的核心業務邏輯所在。

## 元件

- **`projects-view.tsx`**: 專案管理的主視圖，用於展示所有專案的列表卡片。
- **`project-details-sheet.tsx`**: 以側邊欄 (Sheet) 形式顯示單一專案的詳細資訊，包括其任務列表。
- **`create-project-dialog.tsx`**: 用於建立新專案的彈出對話方塊。
- **`task-item.tsx`**: 專案中的最小可互動單元，用於顯示單一任務及其子任務，並允許狀態變更。
- **`ai-subtask-suggestions.tsx`**: 一個與 Genkit 整合的 AI 元件，能根據父任務的標題，為使用者提供智慧化的子任務建議。

這些元件共同構成了應用程式中最核心的專案與任務追蹤功能。
