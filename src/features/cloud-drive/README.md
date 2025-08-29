# 雲端硬碟模組 (Cloud Drive)

## 概述

此模組提供了應用程式內的檔案管理系統，其功能類似於一個迷你的雲端硬碟。它允許使用者瀏覽、上傳、下載和刪除儲存在 Firebase Storage 中的檔案和資料夾。

此模組是**智慧文件解析 (DocuParse)** 功能的前置步驟，使用者需要先透過此介面將文件上傳，然後才能在 DocuParse 中進行解析。

## 架構設計

- **`views/cloud-drive-view.tsx`**: 整個功能的主視圖，作為一個狀態機，管理著檔案列表的載入、UI 互動（如建立資料夾、刪除確認）等。
- **`actions/storage-actions.ts`**: 包含了所有與 Firebase Storage 互動的 Server Actions，例如 `listItems`, `createFolder`, `deleteItem`, `uploadFile` 等。
- **`components/`**: 模組內部的可重用元件，如 `FileCard`, `FolderCard`, `UploadButton`。
- **`types/`**: 定義了 `StorageItem` 等此模組專用的 TypeScript 類型。
- **`utils/`**: 包含路徑處理等工具函數。

## 核心功能

- **檔案與資料夾瀏覽**: 以網格視圖展示儲存桶中的內容。
- **導航**: 提供麵包屑導航，方便使用者在不同層級的資料夾之間切換。
- **檔案操作**:
  - 上傳新檔案。
  - 建立新資料夾。
  - 刪除檔案或資料夾（會永久刪除）。
  - 預覽圖片（當滑鼠懸停在圖片卡片上時）。
  - 下載檔案。