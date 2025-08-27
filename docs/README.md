# 專案文件 (Project Documentation)

此目錄是 Beta-db 整合平台所有規劃、架構和設計文件的**唯一事實來源 (Single Source of Truth)**。它遵循一個清晰的、可擴展的分類體系，旨在全面地支持專案的開發、使用、維護和傳承。

## 📖 文件導覽

### 產品與策略 (Product & Strategy)
> 專案的起點，回答「**為什麼做**」和「**為誰做**」的問題。

- **[開發路線圖](./04_project_management/development-roadmap.md)**

### 設計 (Design)
> 將需求轉化為使用者體驗，回答「**看起來怎樣**」和「**用起來怎樣**」的問題。

- **[UI 佈局系統](./02_architecture/layout.md)**

### 技術架構 (Architecture)
> 專案的技術「藍圖」，回答「**如何建構**」的問題。

- **[資料庫設計](./02_architecture/database.md)**
- **[認證系統](./02_architecture/auth.md)**
- **[事件驅動架構](./02_architecture/events.md)**

### 開發實踐 (Development)
> 為開發者準備的「施工手冊」，回答「**程式碼怎麼寫**」的問題。
- **核心模組**
  - **[專案管理](./03_development/core-modules/project.md)**
  - **[合約管理](./03_development/core-modules/contracts.md)**
  - **[合作夥伴](./03_development/core-modules/partnerverse.md)**
  - **[內部團隊](./03_development/core-modules/team.md)**
  - **[部落格](./03_development/core-modules/blog.md)**
- **AI 功能**
  - **[AI 總覽](./03_development/ai-features/ai.md)**
  - **[雲端硬碟](./03_development/ai-features/cloud-drive.md)**
  - **[智慧文件解析](./03_development/ai-features/docu-parse.md)**

### 專案管理 (Project Management)
> 確保專案順利推進的「管理中心」，回答「**接下來做什麼**」的問題。

- **功能藍圖 (Blueprints)**
  - **[專案管理 v1.0 升級](./04_project_management/project_v1.md)**
  - **[任務委派與驗收](./04_project_management/delegation-and-acceptance-system.md)**
  - **[進度計價與審批](./04_project_management/progress-billing.md)**
  - **[成本與預算追蹤](./04_project_management/cost-tracking.md)**
  - **[工地日報](./04_project_management/daily-report.md)**
  - **[資源與排程](./04_project_management/resource-scheduling.md)**
  - **[倉儲管理](./04_project_management/inventory.md)**
  - **[Web 推播通知](./04_project_management/web-push-notifications.md)**
  - **[動態內容管理 (CMS)](./04_project_management/content-management.md)**
  - **[部落格管理](./04_project_management/blog-management.md)**
  - **[職涯管理](./04_project_management/career-management.md)**
  - **[聯絡管理](./04_project_management/contact-management.md)**
  - **[系統管理](./04_project_management/system-management.md)**

## ✍️ 如何維護

- **同步更新**: 當您對應用程式的程式碼進行重大更改時（例如，新增一個主要功能、修改資料庫模型），請務必同時更新 `/docs` 中相關的文件。
- **保持簡潔**: 文件應該清晰、簡潔且易於理解。
- **版本控制**: 所有文件都應納入 Git 版本控制，以便追蹤變更歷史。
