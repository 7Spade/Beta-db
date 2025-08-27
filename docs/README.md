# 文件 (Docs)

此目錄存放所有與 Constructo 專案相關的規劃、架構和設計文件。保持這些文件的更新對於團隊協作和專案的長期維護至關重要。

為了讓架構更清晰，詳細的設計文件已移至 `/src/docs` 目錄下，並根據其性質進行了分類。

## 文件導覽

- **核心架構 (Core Architecture)**
  - **[認證系統 (Authentication)](../src/docs/1-architecture/auth.md)**: 描述使用者註冊、登入和權限管理的完整流程。
  - **[資料庫設計 (Database)](../src/docs/1-architecture/database.md)**: 所有 Firestore 集合的結構定義，是專案的數據模型唯一事實來源。
  - **[事件驅動架構 (Events)](../src/docs/1-architecture/events.md)**: 解釋了應用程式如何透過事件實現模組解耦。
  - **[佈局系統 (Layout)](../src/docs/1-architecture/layout.md)**: 概述了應用程式的 UI 佈局、元件層級和響應式設計策略。

- **核心模組 (Core Modules)**
  - **[專案管理 (Projects)](../src/docs/2-core-modules/project.md)**
  - **[合約管理 (Contracts)](../src/docs/2-core-modules/contracts.md)**
  - **[合作夥伴 (PartnerVerse)](../src/docs/2-core-modules/partnerverse.md)**
  - **[內部團隊 (Team)](../src/docs/2-core-modules/team.md)**
  - **[部落格 (Blog)](../src/docs/2-core-modules/blog.md)**

- **AI 功能 (AI Features)**
  - **[AI 總覽 (Overview)](../src/docs/3-ai-features/ai.md)**
  - **[雲端硬碟 (Cloud Drive)](../src/docs/3-ai-features/cloud-drive.md)**
  - **[智慧文件解析 (DocuParse)](../src/docs/3-ai-features/docu-parse.md)**

- **系統藍圖 (System Blueprints)**
  - **[進度計價與審批 (Progress Billing)](../src/docs/4-system-blueprints/progress-billing.md)**
  - **[成本與預算追蹤 (Cost Tracking)](../src/docs/4-system-blueprints/cost-tracking.md)**
  - **[工地日報 (Daily Reports)](../src/docs/4-system-blueprints/daily-report.md)**
  - **[資源與排程 (Resource Scheduling)](../src/docs/4-system-blueprints/resource-scheduling.md)**
  - **[庫存管理 (Inventory)](../src/docs/4-system-blueprints/inventory.md)**

## 如何維護

- **同步更新**: 當您對應用程式的程式碼進行重大更改時（例如，新增一個主要功能、修改資料庫模型），請務必同時更新 `/src/docs` 中相關的文件。
- **保持簡潔**: 文件應該清晰、簡潔且易於理解。
- **版本控制**: 所有文件都應納入 Git 版本控制，以便追蹤變更歷史。
