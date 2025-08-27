# 團隊管理功能檔案清單 (Team Management Feature Files List)

本文件列出了 Beta-db 整合平台中所有與「內部團隊」管理相關的檔案。

## 📁 目錄結構

### 1. 團隊管理功能元件 (Team Feature Components)
```
src/components/features/team/
├── README.md                           # 團隊模組概述
├── index.ts                            # 模組統一導出
├── members/
│   ├── create-member-dialog.tsx        # 新增團隊成員的對話方塊
│   └── README.md                       # 團隊成員元件說明
├── skills/
│   ├── skills-list.tsx                 # 技能列表主元件
│   ├── skill-form-dialog.tsx           # 新增/編輯技能的對話方塊 (含 AI 建議)
│   └── README.md                       # 團隊技能元件說明
├── knowledge-base/
│   ├── entry-form-dialog.tsx           # 新增/編輯工法的對話方塊 (含 AI 生成)
│   ├── actions/                        # Server Actions 目錄
│   │   ├── knowledge-actions.ts        # 知識庫 CRUD Server Actions
│   │   └── types.ts                    # Action 相關類型
│   └── README.md                       # 知識庫元件說明
└── schedule/
    └── README.md                       # 團隊排程元件說明 (規劃中)
```

### 2. 頁面入口 (Page Entries)
```
src/app/(dashboard)/team/
├── members/page.tsx                    # 同伴列表頁面
├── skills/page.tsx                     # 技能清單頁面
├── knowledge-base/page.tsx             # 工法工序庫頁面
└── schedule/page.tsx                   # 排班表頁面 (開發中)
```

### 3. 相關資料庫集合 (Related Collections)
- **`teamMembers`**: 儲存內部團隊成員的資訊。
- **`skills`**: 儲存所有可用於團隊成員的技能。
- **`knowledgeBaseEntries`**: 儲存所有工法工序庫的文章。

### 4. 相關 AI 流程 (Related AI Flows)
```
src/ai/flows/
├── generate-skill-flow.ts              # 為技能庫建議新技能
└── generate-knowledge-entry-flow.ts    # 為工法庫生成文章內容
```

## 🔧 技術架構

- **前端框架**: Next.js (App Router)
- **資料庫**: Firebase Firestore
- **AI 整合**: Google Genkit，用於技能建議和內容生成。
- **狀態管理**: 主要使用 `useState` 和 `useEffect` 進行元件級別的狀態管理，並透過 `onSnapshot` 實現即時數據更新。
- **UI 元件**: shadcn/ui

## 📊 核心功能

1.  **同伴列表 (`/team/members`)**:
    - 以卡片形式展示所有內部團隊成員。
    - 提供「新增同伴」功能，彈出 `CreateMemberDialog` 對話方塊來輸入成員資訊。

2.  **技能清單 (`/team/skills`)**:
    - 顯示所有已定義的技能列表。
    - 提供新增和編輯技能的功能。
    - **AI 整合**: 在 `SkillFormDialog` 中，使用者可以輸入一個主題（如「專案經理」），系統會呼叫 `generateSkillSuggestion` AI 流程來智慧推薦相關的技能名稱和描述，使用者點擊後即可快速填入表單。

3.  **工法工序庫 (`/team/knowledge-base`)**:
    - 以卡片形式展示所有工法文章。
    - 提供搜尋和分類篩選功能。
    - **AI 整合**: 在 `EntryFormDialog` 中，使用者只需輸入一個標題，系統即可呼叫 `generateKnowledgeEntry` AI 流程來自動生成一篇結構完整的 Markdown 文章，包含分類和標籤。

4.  **排班表 (`/team/schedule`)**:
    - 目前為規劃中頁面，未來將用於團隊成員的排班和任務指派。
    - **未來方向**: 可能會整合 AI，根據成員的 `skills` 和專案需求來推薦最佳排班方案。

## 📚 相關文件

- [資料庫設計文件](./database.md) (`teamMembers`, `skills`, `knowledgeBaseEntries` 集合)
- [AI 功能檔案清單](./ai.md)