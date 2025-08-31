# 專案相關檔案清單 (Project Files List)

本文件列出了 Beta-db 整合平台中所有與專案管理功能相關的檔案，包括元件、服務、類型定義、頁面、上下文等。

## 📁 目錄結構

### 1. 專案管理元件 (Project Management Components)

```
src/components/features/projects/
├── README.md                           # 核心專案管理元件說明文件
├── actions/project.actions.ts          # 專案與任務的 Server Actions
├── components/
│   ├── ai-subtask-suggestions.tsx      # AI 子任務建議元件
│   ├── create-project-dialog.tsx       # 建立專案對話方塊
│   ├── project-details-sheet.tsx       # 專案詳細資訊側邊欄
│   └── task-item.tsx                   # 任務項目元件
└── views/
    └── projects-view.tsx               # 專案列表視圖
```

### 2. 專案頁面 (Project Pages)

```
src/app/(dashboard)/projects/
└── page.tsx                            # 專案管理頁面
```

### 3. 專案相關功能 (Project-Related Features)

#### 3.1 快捷操作 (Quick Actions)

```
src/app/(dashboard)/quick-actions/
├── daily-report/                        # 日報功能
│   └── page.tsx                        # 日報頁面
├── project-progress/                    # 專案進度
│   └── page.tsx                        # 專案進度頁面
└── staff-attendance/                    # 員工出勤
    └── page.tsx                        # 員工出勤頁面
```

#### 3.2 團隊管理 (Team Management)

```
src/app/(dashboard)/team/
├── knowledge-base/                      # 知識庫
│   └── page.tsx                        # 知識庫頁面
├── members/                             # 團隊成員
│   └── page.tsx                        # 團隊成員頁面
├── schedule/                            # 排程管理
│   └── page.tsx                        # 排程頁面
└── skills/                              # 技能管理
    └── page.tsx                        # 技能頁面
```

#### 3.3 文件解析 (Document Parsing)

```
src/app/(dashboard)/docu-parse/
└── page.tsx                            # 文件解析頁面
```

### 4. 相關服務與 AI 流程 (Related Services & AI)

#### 4.1 AI 服務

```
src/ai/
└── flows/
    ├── extract-work-items-flow.ts      # 從文件提取工料清單的流程
    └── generate-subtasks-flow.ts       # 為工程任務智慧分解子任務的流程
```

#### 4.2 活動日誌與通知服務

```
src/lib/services/activity-log/
src/lib/services/notification/
```

### 5. 專案相關類型 (Project-Related Types)

```
src/lib/types/types.ts                  # 主要類型定義 (包含 Project, Task 等)
```

## 🔧 技術架構

### 前端技術

- **框架**: Next.js 15+ (App Router)
- **語言**: TypeScript 5.0+
- **UI 庫**: shadcn/ui + Tailwind CSS
- **狀態管理**: Server Actions + `revalidatePath` (取代了舊的 Context API)
- **路由**: Next.js App Router

### 後端技術

- **資料庫**: Firebase Firestore
- **AI 整合**: Genkit

## 📊 主要功能

1. **專案管理**: 建立、編輯、刪除、查看專案
2. **任務管理**: 任務建立、狀態追蹤、無限層級子任務管理
3. **AI 輔助**: 智慧子任務建議
4. **與其他模組的整合**:
   - **文件解析**: 從解析結果直接建立專案
   - **團隊管理**: 未來可將成員指派至任務
   - **快捷操作**: 提供日報、進度回報等入口

## 📝 檔案說明

### 核心檔案

- **`projects-view.tsx`**: 專案列表的主視圖元件。
- **`project-details-sheet.tsx`**: 顯示專案詳細資訊和任務樹的側邊欄。
- **`task-item.tsx`**: 可互動的任務項元件，支援狀態變更和子任務新增。
- **`project.actions.ts`**: 處理所有專案和任務資料庫操作的 Server Actions。
- **`ai-subtask-suggestions.tsx`**: AI 子任務建議元件，呼叫 `generate-subtasks-flow`。

## 🚀 開發指南

- **新增專案功能**: 在 `/src/components/features/projects/` 目錄下建立新的元件。
- **修改資料模型**: 在 `src/lib/types/types.ts` 中更新 `Project` 或 `Task` 的類型定義。
- **新增後端邏輯**: 在 `project.actions.ts` 中新增或修改 Server Action。

## 📚 相關文件

- [資料庫設計文件](../../02_architecture/database.md)
- [任務委派與驗收系統藍圖](../../04_project_management/delegation-and-acceptance-system.md)
- [專案管理 v1.0 升級藍圖](../../04_project_management/project_v1.md)
