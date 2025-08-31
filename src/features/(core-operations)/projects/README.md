# 核心專案管理元件 (Core Project Components)

此目錄包含與核心「專案管理」功能相關的所有資源，遵循功能切片(Feature-Sliced)設計原則，使其成為一個高內聚、低耦合的獨立模組。

## 架構

本模組已升級為**伺服器優先 (Server-First)** 架構：

- **Server Actions**: 所有資料的修改（新增、更新、刪除）都由 `actions/` 目錄下的 Server Actions 處理。
- **無客戶端狀態**: 不再使用全局的 `ProjectContext`。資料的更新和 UI 的同步由 Next.js 的 `revalidatePath` 機制自動處理。
- **數據流**: 頁面 (`page.tsx`) 在伺服器端獲取最新數據 -> 將數據作為 props 傳遞給 `views` -> `views` 和 `components` 中的互動觸發 Server Actions -> Server Actions 更新資料庫並重新驗證路徑 -> Next.js 自動刷新 UI。

## 目錄結構

- **`actions/`**: 存放所有與專案和任務相關的 Server Actions。
  - `project.actions.ts`: 處理專案級別的操作。
  - `task.actions.ts`: 處理頂層任務的操作。
  - `subtask.actions.ts`: 專門處理巢狀子任務的遞迴邏輯。
  - `acceptance.actions.ts`: 處理驗收單相關的後端操作。
- **`components/`**: 存放所有構成專案管理 UI 的可重用 React 元件。
- **`constants/`**: (預留) 存放與專案管理相關的常數。
- **`hooks/`**: (預留) 存放專用於此模組的自定義 Hooks。
- **`types/`**: 定義 `Project`、`Task` 等此模組專用的核心 TypeScript 類型。
- **`utils/`**: 存放與專案資料相關的格式化及計算輔助函數。
- **`views/`**: 存放頁面級別的主視圖元件，負責組合 `components` 中的元件來構成完整頁面。
