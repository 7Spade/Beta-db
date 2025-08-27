# 專案文件 (Project Documentation)

此目錄是 Beta-db 整合平台所有規劃、架構和設計文件的**唯一事實來源 (Single Source of Truth)**。保持這些文件的更新對於團隊協作和專案的長期維護至關重要。

## 📖 文件導覽

### 1. 核心架構 (Core Architecture)
- **[認證系統 (Authentication)](./1-architecture/auth.md)**: 描述使用者註冊、登入和權限管理的完整流程。
- **[資料庫設計 (Database)](./1-architecture/database.md)**: 所有 Firestore 集合的結構定義，是專案的數據模型唯一事實來源。
- **[事件驅動架構 (Events)](./1-architecture/events.md)**: 解釋了應用程式如何透過事件實現模組解耦。
- **[佈局系統 (Layout)](./1-architecture/layout.md)**: 概述了應用程式的 UI 佈局、元件層級和響應式設計策略。

### 2. 核心模組 (Core Modules)
- **[專案管理 (Projects)](./2-core-modules/project.md)**
- **[合約管理 (Contracts)](./2-core-modules/contracts.md)**
- **[合作夥伴 (PartnerVerse)](./2-core-modules/partnerverse.md)**
- **[內部團隊 (Team)](./2-core-modules/team.md)**
- **[部落格 (Blog)](./2-core-modules/blog.md)**

### 3. AI 功能 (AI Features)
- **[AI 總覽 (Overview)](./3-ai-features/ai.md)**
- **[雲端硬碟 (Cloud Drive)](./3-ai-features/cloud-drive.md)**
- **[智慧文件解析 (DocuParse)](./3-ai-features/docu-parse.md)**

### 4. 系統藍圖 (System Blueprints)
- **[開發路線圖 (Roadmap)](./4-system-blueprints/development-roadmap.md)**
- **[專案管理 v1.0 升級](./4-system-blueprints/project_v1.md)**
- **[任務委派與驗收](./4-system-blueprints/delegation-and-acceptance-system.md)**
- **[進度計價與審批](./4-system-blueprints/progress-billing.md)**
- **[成本與預算追蹤](./4-system-blueprints/cost-tracking.md)**
- **[工地日報](./4-system-blueprints/daily-report.md)**
- **[資源與排程](./4-system-blueprints/resource-scheduling.md)**
- **[倉儲管理](./4-system-blueprints/inventory.md)**
- **[Web 推播通知](./4-system-blueprints/web-push-notifications.md)**
- **[動態內容管理 (CMS)](./4-system-blueprints/content-management.md)**
- **[部落格管理](./4-system-blueprints/blog-management.md)**
- **[職涯管理](./4-system-blueprints/career-management.md)**
- **[聯絡管理](./4-system-blueprints/contact-management.md)**
- **[系統管理](./4-system-blueprints/system-management.md)**

## ✍️ 如何維護

- **同步更新**: 當您對應用程式的程式碼進行重大更改時（例如，新增一個主要功能、修改資料庫模型），請務必同時更新 `/docs` 中相關的文件。
- **保持簡潔**: 文件應該清晰、簡潔且易於理解。
- **版本控制**: 所有文件都應納入 Git 版本控制，以便追蹤變更歷史。
