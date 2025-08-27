# 智慧文件解析 (DocuParse) 模組

## 概述

此模組是「智慧文件解析」功能的核心，它實現了一個完整的業務閉環：

1.  **選擇文件**: 讓使用者從雲端硬碟中選擇一個文件（如合約、估價單）。
2.  **AI 解析**: 呼叫後端的 Genkit AI 流程 (`extract-work-items-flow`)，從文件中提取結構化的工料清單。
3.  **審查與編輯**: 將提取出的數據呈現在一個互動式表格中，允許使用者進行審查、修改和確認。
4.  **建立專案**: 在使用者確認後，將這些結構化數據無縫轉換為一個新的「專案」和一份關聯的「合約」，並跳轉到對應的頁面。

## 架構設計

本模組遵循清晰的目錄結構，將不同關注點分離：

-   **`actions/`**: 包含與後端 AI 流程互動的 Server Action。
-   **`components/`**: 模組內部使用的小型元件，如 `file-selector`。
-   **`constants/`**: 定義支援的文件類型等靜態常數。
-   **`tables/`**: `work-items-table.tsx`，用於顯示和編輯提取數據的互動式表格。
-   **`types/`**: 所有與此模組相關的 TypeScript 類型定義。
-   **`utils/`**: 工具函數，如數據匯出功能。
-   **`views/`**: `docu-parse-view.tsx`，整個功能的主視圖和狀態機。

## 核心檔案

-   **`views/docu-parse-view.tsx`**: 功能主頁面，負責協調整個流程的狀態（文件選擇、等待 AI、數據審核、建立專案）。
-   **`tables/work-items-table.tsx`**: 一個互動式表格，用於顯示、編輯和驗證從文件中提取出的工料清單。
-   **`actions/docu-parse-actions.ts`**: Server Action，作為前端與後端 Genkit AI 流程之間的安全橋樑。
