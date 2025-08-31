# 文件解析功能檔案清單 (DocuParse Feature Files List)

本文件列出了 Beta-db 整合平台中所有與「智慧文件解析 (DocuParse)」功能相關的檔案。

## 📁 目錄結構

### 1. 核心功能元件 (Core Feature Components)

```
src/features/docu-parse/
├── README.md                           # DocuParse 模組概述
├── actions/
│   ├── docu-parse-actions.ts           # 呼叫 AI 流程以提取數據的 Server Action
│   └── docu-parse-commit.actions.ts    # 將確認後的數據建立為專案和合約的 Server Action
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
src/features/cloud-drive/    # 文件解析功能依賴雲端硬碟來選擇檔案
```

## 🔧 技術架構

- **前端框架**: Next.js (App Router)
- **後端 AI**: Google Genkit (`gemini-pro-vision` 模型)
- **資料流**: `Client Component` -> `Server Action` -> `Genkit Flow`
- **狀態管理**: `useActionState` Hook
- **UI 元件**: shadcn/ui

## 📊 核心流程 (兩階段)

### 階段一：數據提取

1.  **選擇檔案**:
    - 使用者進入 `/docu-parse` 頁面，`docu-parse-view.tsx` 渲染 `<FileSelector />`。
    - 使用者選擇檔案後，其路徑被附加到 URL。
2.  **觸發 AI 解析**:
    - `docu-parse-view.tsx` 監聽到 URL 變化，觸發 `docu-parse-actions.ts` 中的 `extractWorkItemsFromDocument` Server Action。
3.  **後端處理**:
    - `extractWorkItemsFromDocument` Action 呼叫 `extractWorkItemsFlow` Genkit AI 流程。
    - AI 流程將文件內容傳給 Gemini 模型，返回一個結構化的 `workItems` JSON 物件。
4.  **顯示與審查**:
    - Server Action 完成後，`useActionState` Hook 更新 `state`。
    - `docu-parse-view.tsx` 將 `workItems` 傳遞給 `<WorkItemsTable />` 供使用者審查和修改。

### 階段二：數據建立

1.  **使用者確認**:
    - 使用者在 UI 中填寫文件名稱、客戶等元數據，並對工料清單做最終確認。
    - 點擊「建立專案與合約」按鈕。
2.  **觸發建立動作**:
    - `docu-parse-view.tsx` 呼叫 `docu-parse-commit.actions.ts` 中的 `createProjectAndContractFromParsedData` Server Action。
3.  **後端處理**:
    - 此 Action 接收到最終確認的數據。
    - 在一個**批次寫入 (Batch Write)** 中，同時在 `projects` 和 `contracts` 集合中建立新文件。
4.  **完成**:
    - Action 成功後，前端顯示成功訊息，使用者可以選擇導航至新建立的專案或合約頁面。

## 📚 相關文件

- [AI 功能檔案清單](./ai.md)
- [合約相關檔案清單](../core-modules/contracts.md)
- [雲端硬碟功能檔案清單](./cloud-drive.md)
- [資料庫設計文件](../../02_architecture/database.md)
