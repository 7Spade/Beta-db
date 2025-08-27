# 專案相關檔案清單 (Project Files List)

本文件列出了 Beta-db 整合平台中所有與專案管理功能相關的檔案，包括元件、服務、類型定義、頁面、上下文等。

## 📁 目錄結構

### 1. 專案管理元件 (Project Management Components)
```
src/components/features/app/
├── README.md                           # 核心專案管理元件說明文件
├── ai-subtask-suggestions.tsx          # AI 子任務建議元件
├── create-project-dialog.tsx           # 建立專案對話方塊
├── project-details-sheet.tsx           # 專案詳細資訊側邊欄
├── projects-view.tsx                   # 專案列表視圖
└── task-item.tsx                       # 任務項目元件
```

### 2. 專案上下文 (Project Context)
```
src/context/
├── README.md                           # Context 目錄說明文件
└── ProjectContext.tsx                  # 專案管理全域上下文
```

### 3. 專案頁面 (Project Pages)
```
src/app/(dashboard)/projects/
└── page.tsx                            # 專案管理頁面
```

### 4. 專案相關功能 (Project-Related Features)

#### 4.1 快速動作 (Quick Actions)
```
src/app/(dashboard)/quick-actions/
├── daily-report/                        # 日報功能
│   └── page.tsx                        # 日報頁面
├── project-progress/                    # 專案進度
│   └── page.tsx                        # 專案進度頁面
└── staff-attendance/                    # 員工出勤
    └── page.tsx                        # 員工出勤頁面
```

#### 4.2 團隊管理 (Team Management)
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

#### 4.3 文件解析 (Document Parsing)
```
src/app/(dashboard)/docu-parse/
└── page.tsx                            # 文件解析頁面
```

### 5. 專案相關元件 (Project-Related Components)

#### 5.1 團隊功能元件
```
src/components/features/team/
├── README.md                           # 團隊功能說明文件
├── knowledge-base/                     # 知識庫相關元件
├── members/                            # 團隊成員相關元件
├── schedule/                           # 排程相關元件
└── skills/                             # 技能相關元件
```

#### 5.2 快速動作元件
```
src/components/features/quick-actions/
├── README.md                           # 快速動作說明文件
├── daily-report/                       # 日報相關元件
├── project-progress/                   # 專案進度相關元件
└── staff-attendance/                   # 員工出勤相關元件
```

#### 5.3 文件解析元件
```
src/components/features/docu-parse/
├── README.md                           # 文件解析說明文件
├── components/                         # 文件解析元件
├── services/                           # 文件解析服務
├── types/                              # 文件解析類型
└── utils/                              # 文件解析工具
```

### 6. 專案相關服務 (Project-Related Services)

#### 6.1 AI 服務
```
src/ai/
├── README.md                           # AI 功能說明文件
├── dev.ts                              # AI 開發配置
├── genkit.ts                           # Genkit AI 整合
└── flows/                              # AI 流程定義
    ├── extract-work-items-flow.ts      # 工作項目提取流程
    ├── generate-knowledge-entry-flow.ts # 知識條目生成流程
    ├── generate-skill-flow.ts          # 技能生成流程
    └── generate-subtasks-flow.ts       # 子任務生成流程
```

#### 6.2 活動日誌服務
```
src/lib/services/activity-log/
├── README.md                           # 活動日誌說明文件
└── firebase-activity-log.service.ts    # Firebase 活動日誌服務
```

#### 6.3 通知服務
```
src/lib/services/notification/
├── README.md                           # 通知服務說明文件
└── firebase-notification.service.ts    # Firebase 通知服務
```

### 7. 專案相關類型 (Project-Related Types)
```
src/lib/types/
├── README.md                           # 類型定義說明文件
└── types.ts                            # 主要類型定義 (包含 Project, Task 等)
```

### 8. 專案相關工具 (Project-Related Utils)
```
src/lib/utils/
└── utils.ts                            # 通用工具函數
```

## 🔧 技術架構

### 前端技術
- **框架**: Next.js 15+ (App Router)
- **語言**: TypeScript 5.0+
- **UI 庫**: shadcn/ui + Tailwind CSS
- **狀態管理**: React Context + Zustand
- **路由**: Next.js App Router (平行路由)

### 後端技術
- **資料庫**: Firebase Firestore
- **認證**: Firebase Auth
- **儲存**: Firebase Storage
- **函數**: Firebase Functions
- **AI 整合**: Genkit

## 📊 主要功能

1. **專案管理**: 建立、編輯、刪除、查看專案
2. **任務管理**: 任務建立、狀態追蹤、子任務管理
3. **團隊協作**: 團隊成員管理、權限控制
4. **知識庫**: 知識條目管理、搜尋和分類
5. **排程管理**: 專案時程規劃、里程碑追蹤
6. **技能管理**: 團隊技能評估、培訓追蹤
7. **AI 輔助**: 智慧任務建議、自動化工作流程
8. **文件解析**: 自動化文件處理和資訊提取
9. **快速動作**: 日常報告、進度追蹤、出勤管理

## 📝 檔案說明

### 核心檔案
- **`ProjectContext.tsx`**: 專案管理的全域狀態管理
- **`projects-view.tsx`**: 專案列表的主要視圖元件
- **`project-details-sheet.tsx`**: 專案詳細資訊的側邊欄元件
- **`task-item.tsx`**: 任務項目的可互動元件
- **`create-project-dialog.tsx`**: 建立新專案的對話方塊

### AI 整合檔案
- **`genkit.ts`**: Genkit AI 框架的配置和初始化
- **`extract-work-items-flow.ts`**: 從文件中提取工作項目的 AI 流程
- **`generate-subtasks-flow.ts`**: 根據父任務生成子任務的 AI 流程

### 支援檔案
- **`types.ts`**: 專案和任務的類型定義
- **`utils.ts`**: 專案管理相關的工具函數
- **`firebase-activity-log.service.ts`**: 專案活動的日誌記錄服務

## 🚀 開發指南

1. **新增專案功能**: 在 `src/components/features/app/` 目錄下建立新的元件
2. **新增專案類型**: 在 `src/lib/types/types.ts` 中定義新的類型
3. **新增專案服務**: 在 `src/lib/services/` 目錄下建立新的服務
4. **更新上下文**: 在 `ProjectContext.tsx` 中添加新的狀態和方法
5. **AI 流程開發**: 在 `src/ai/flows/` 目錄下建立新的 AI 流程

## 🔗 相關模組

### 合約管理
- 專案與合約的關聯管理
- 合約進度追蹤
- 付款與專案里程碑對應

### 合作夥伴管理
- 專案參與者管理
- 外部承包商協作
- 夥伴關係追蹤

### 雲端儲存
- 專案文件管理
- 版本控制
- 協作編輯

## 📚 相關文件

- [合約相關檔案清單](./contracts.md)
- [資料庫設計文件](./database.md)
- [系統架構文件](./layout.md)
- [專案架構文件](../docs/project.md)
