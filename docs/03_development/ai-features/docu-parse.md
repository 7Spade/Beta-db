# 文件解析功能檔案清單 (DocuParse Feature Files List)

本文件列出了 Beta-db 整合平台中所有與「智慧文件解析 (DocuParse)」功能相關的檔案。

## 📁 目錄結構

### 1. 核心功能元件 (Core Feature Components)
```
src/components/features/docu-parse/
├── README.md                           # DocuParse 模組概述
├── actions/
│   └── docu-parse-actions.ts           # 呼叫 AI 流程的 Server Action
├── components/
│   └── file-selector.tsx               # 從雲端硬碟選擇檔案的介面元件
├── constants/
│   └── file-constants.ts               # 支援的檔案類型等常數
├── tables/
│   └── work-items-table.tsx            # 用於顯示和編輯提取數據的互動式表格
├── types/
│   └── docu-parse.types.ts             # 模組專用的 TypeScript 類型 (WorkItem, DocDetails)
├── utils/
│   └── export.utils.ts                 # 數據匯出 (CSV, JSON) 功能
└── views/
    └── docu-parse-view.tsx             # 整個功能的主視圖和狀態管理中心
```

### 2. 後端 AI 流程 (Backend AI Flow)
```
src/ai/flows/
└── extract-work-items-flow.ts          # 從檔案中提取工料清單的 Genkit AI 流程
```

### 3. 頁面入口 (Page Entry)
```
src/app/(dashboard)/docu-parse/
└── page.tsx                            # 文件解析頁面
```

### 4. 關聯功能 (Related Features)
```
src/components/features/contracts/
└── actions/contract-actions.ts         # 包含 createProjectAndContractFromDocument Action

src/components/features/cloud-drive/    # 文件解析功能依賴雲端硬碟來選擇檔案
```

## 🔧 技術架構

- **前端框架**: Next.js (App Router)
- **後端 AI**: Google Genkit (`gemini-pro-vision` 模型)
- **資料流**: `Client Component` -> `Server Action` -> `Genkit Flow`
- **狀態管理**: `useActionState` Hook
- **UI 元件**: shadcn/ui

## 📊 核心流程

1.  **選擇檔案**:
    - 使用者進入 `/docu-parse` 頁面。如果 URL 中沒有 `filePath` 參數，`docu-parse-view.tsx` 會渲染 `<FileSelector />` 元件。
    - `<FileSelector />` 允許使用者瀏覽雲端硬碟，並選擇一個支援的檔案。
    - 選擇檔案後，`onFileSelect` 回調函數會觸發 `router.push`，將檔案路徑附加到 URL 參數中。

2.  **觸發 AI 解析**:
    - `docu-parse-view.tsx` 中的 `useEffect` 監聽到 URL 中 `filePath` 的變化。
    - 它會呼叫 `formAction({ filePath })`，這會觸發 `docu-parse-actions.ts` 中的 `extractWorkItemsFromDocument` Server Action。

3.  **後端處理**:
    - `extractWorkItemsFromDocument` Action 首先從 Firebase Storage 讀取檔案的中繼資料和內容。
    - 然後，它呼叫 `src/ai/flows/extract-work-items-flow.ts` 中的 `extractWorkItemsFlow` 流程。
    - AI Flow 將檔案內容（轉換為 Data URI）傳遞給 Gemini 模型，並根據預設的提示詞和輸出 Schema，返回一個結構化的 `workItems` JSON 物件。

4.  **顯示與審查**:
    - Server Action 完成後，`useActionState` Hook 會更新 `state` 物件。
    - `docu-parse-view.tsx` 檢測到 `state.data` 的存在，並將提取出的 `workItems` 傳遞給 `<WorkItemsTable />`。
    - 使用者可以在互動式表格中審查、修改、新增或刪除 AI 提取的工料清單。

5.  **建立專案與合約**:
    - 使用者填寫文件名稱、客戶等元數據。
    - 點擊「建立專案與合約」按鈕。
    - `docu-parse-view.tsx` 呼叫 `src/components/features/contracts/actions/contract-actions.ts` 中的 `createProjectAndContractFromDocument` Server Action。
    - 此 Action 會在一個批次寫入中，同時在 `projects` 和 `contracts` 集合中建立新文件。
    - 成功後，使用者被重導向至新建立的合約詳情頁面。

## 📚 相關文件

- [AI 功能檔案清單](./ai.md)
- [合約相關檔案清單](../core-modules/contracts.md)
- [雲端硬碟功能檔案清單](./cloud-drive.md)
- [資料庫設計文件](../../02_architecture/database.md)
