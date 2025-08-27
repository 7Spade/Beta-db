# AI 功能檔案清單 (AI Feature Files List)

本文件列出了 Beta-db 整合平台中所有與 AI 功能相關的檔案，主要基於 Genkit 框架。

## 📁 目錄結構

### 1. AI 核心設定 (AI Core Configuration)
```
src/ai/
├── README.md                           # AI 功能模組說明文件
├── dev.ts                              # Genkit 開發環境進入點
└── genkit.ts                           # Genkit 核心實例與插件配置
```

### 2. AI 工作流程 (AI Flows)
```
src/ai/flows/
├── extract-work-items-flow.ts          # 從文件中提取工料清單的流程
├── generate-knowledge-entry-flow.ts    # 自動生成工法庫文章的流程
├── generate-skill-flow.ts              # 根據主題建議相關技能的流程
└── generate-subtasks-flow.ts           # 為工程任務智慧分解子任務的流程
```

### 3. AI 服務與模型 (AI Services and Models)
```
src/lib/services/ai-token-log/
└── logging.service.ts                  # 記錄 Token 消耗的服務

src/lib/models/
└── ai-token-log.model.ts               # Token 紀錄的 Mongoose 模型
```

### 4. 與 AI 相關的前端元件 (AI-related Frontend Components)

#### 4.1 文件解析 (DocuParse)
```
src/components/features/docu-parse/
├── actions/docu-parse-actions.ts       # 呼叫 AI 流程的 Server Action
└── views/docu-parse-view.tsx           # 文件解析的主視圖
```

#### 4.2 專案管理 (Project Management)
```
src/components/features/projects/components/
└── ai-subtask-suggestions.tsx          # AI 子任務建議元件
```

#### 4.3 團隊管理 (Team Management)
```
src/components/features/team/knowledge-base/
└── entry-form-dialog.tsx               # 包含 AI 生成內容功能的工法編輯對話方塊

src/components/features/team/skills/
└── skill-form-dialog.tsx               # 包含 AI 建議技能功能的技能編輯對話方塊
```

## 🔧 技術架構

- **核心框架**: Google Genkit
- **主要模型**: Gemini
- **資料庫整合**:
  - **Firestore**: 用於即時任務和大部分業務數據。
  - **MongoDB**: 透過 Mongoose 儲存 AI Token 消耗日誌。

## 📊 主要功能

1. **智慧文件解析**: 從 PDF、Word 等文件中自動提取結構化的工料清單。
2. **內容生成**: 自動為工法工序庫撰寫專業的文章內容、分類和標籤。
3. **智慧建議**:
   - 為團隊技能庫建議相關的技能。
   - 為大型工程任務建議可行的子任務列表。

## 🚀 開發指南

1. **新增 AI 流程**: 在 `src/ai/flows/` 目錄下建立新的 `*.ts` 檔案，定義新的 Genkit Flow。
2. **註冊流程**: 在 `src/ai/dev.ts` 中導入新建的流程檔案，以便在開發環境中啟用。
3. **前端整合**:
   - 建立一個 Server Action (例如在 `src/components/features/[your-feature]/actions/`) 來作為前端與 AI 流程之間的安全橋樑。
   - 在前端元件中呼叫該 Server Action。
4. **日誌記錄**: 在 AI 流程的 `defineFlow` 邏輯中，務必呼叫 `logAiTokenUsage` 服務來記錄 Token 消耗。

## 📚 相關文件

- [專案相關檔案清單](../core-modules/project.md)
- [合約相關檔案清單](../core-modules/contracts.md)
- [資料庫設計文件](../../02_architecture/database.md)
