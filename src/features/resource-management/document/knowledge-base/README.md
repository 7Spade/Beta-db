# 工法知識庫元件 (Knowledge Base Components)

此目錄包含所有與「工法工序庫」功能 (`/team/knowledge-base`) 相關的 React 元件。

## 元件

- **`page.tsx` (`KnowledgeBasePage`)**: 頁面的主元件，負責從 Firestore 獲取工法庫列表，並提供搜尋和篩選功能。它也管理著新增/編輯對話方塊的開啟狀態。
- **`entry-form-dialog.tsx`**: 一個功能強大的對話方塊，用於新增或編輯工法條目。它整合了 Genkit AI，可以根據標題智慧生成內容、分類和標籤，極大地簡化了資料建立的流程。
- **`actions/`**: 包含與知識庫 CRUD 操作相關的 Server Actions。

請將任何用於 `/team/knowledge-base` 頁面的新元件放置於此。
