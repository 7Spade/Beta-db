# AI 功能模組 (AI Module)

此目錄是應用程式中所有人工智慧功能的核心，完全基於 Google 的 **Genkit** 框架。它負責處理需要大型語言模型 (LLM) 或其他生成式 AI 能力的複雜任務。

## 模組職責

- **定義 AI 工作流程 (Flows)**：將多個 AI 步驟（如提示、工具使用）組合成一個完整的業務邏輯單元。
- **配置 Genkit 環境**:
  - `genkit.ts`: 初始化並配置核心的 Genkit 實例，設定預設模型和插件。
  - `dev.ts`: 開發環境的進入點，用於本地啟動和調試 Genkit 服務。

## 核心工作流程 (`/flows`)

- **`extract-work-items-flow.ts`**: 從使用者上傳的文件（如合約、報價單）中，智慧提取結構化的工料清單。
- **`generate-knowledge-entry-flow.ts`**: 根據標題，自動生成一篇結構完整的工法工序庫文章。
- **`generate-skill-flow.ts`**: 根據職位或主題，建議相關的專業技能及其描述。
- **`generate-subtasks-flow.ts`**: 將一個較大的工程任務，智慧分解為數個更小、可執行的子任務。

## 技術棧

- **框架**: Google Genkit
- **語言**: TypeScript
- **執行環境**: 與 Next.js Server Actions 和 Firebase Functions 無縫整合
