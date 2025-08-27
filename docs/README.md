# 專案文件 (Project Documentation)

此目錄是 Beta-db 整合平台所有規劃、架構和設計文件的**唯一事實來源 (Single Source of Truth)**。它遵循一個清晰的、可擴展的分類體系，旨在全面地支持專案的開發、使用、維護和傳承。

## 📖 文件導覽

### 1. 核心架構 (Core Architecture)
> 定義應用程式的「骨架」，回答「**如何建構**」的問題。

- **[架構總覽](./1-architecture/README.md)**
- **[資料庫設計](./1-architecture/database.md)**
- **[認證系統](./1-architecture/auth.md)**
- **[佈局系統](./1-architecture/layout.md)**
- **[事件驅動架構](./1-architecture/events.md)**

### 2. 核心模組 (Core Modules)
> 介紹應用程式中每一個獨立的、核心的業務功能模組。

- **[模組總覽](./2-core-modules/README.md)**
- **[專案管理](./2-core-modules/project.md)**
- **[合約管理](./2-core-modules/contracts.md)**
- **[合作夥伴](./2-core-modules/partnerverse.md)**
- **[內部團隊](./2-core-modules/team.md)**
- **[部落格](./2-core-modules/blog.md)**

### 3. AI 功能 (AI Features)
> 集中管理所有與 AI 相關的設計和流程文件。

- **[AI 總覽](./3-ai-features/README.md)**
- **[雲端硬碟](./3-ai-features/cloud-drive.md)**
- **[智慧文件解析](./3-ai-features/docu-parse.md)**

### 4. 系統藍圖 (System Blueprints)
> 存放所有新功能的詳細設計文檔和開發路線圖，回答「**接下來做什麼**」的問題。

- **[藍圖總覽](./4-system-blueprints/README.md)**
- **[開發路線圖](./4-system-blueprints/development-roadmap.md)**
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
