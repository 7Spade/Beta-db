# 應用程式主目錄 (App)

此目錄是 Next.js App Router 的根目錄，負責定義整個應用程式的路由結構、頁面和佈局。

## 目錄結構與路由策略

本專案採用**路由群組 (Route Groups)** 來組織頁面，這是一種強大的策略，用於將不同類型的頁面與其各自的共享佈局綁定，同時保持 URL 的簡潔。

### 主要路由群組

- **`(admin)/`**: **管理後台路由群組**。所有需要管理員權限才能訪問的頁面（如使用者管理、系統設定）都存放在此。它們共享一個專為管理設計的佈局。
- **`(auth)/`**: **身份驗證路由群組**。包含所有與使用者登入、註冊、密碼重設等相關的頁面。它們共享一個置中的簡潔佈局。
- **`(dashboard)/`**: **核心應用路由群組**。這是使用者登入後看到的主要應用程式介面，包含儀表板、專案管理、合約管理等。它們共享包含側邊欄和頁首的完整 `AppShell` 佈局。
- **`(public)/`**: **公開頁面路由群組**。包含所有無需登入即可訪問的頁面（如關於我們、部落格、聯絡我們）。它們共享一個包含網站頁首和頁尾的公開版佈局。

### 核心文件

- **`layout.tsx`**: 根佈局 (Root Layout)，為整個應用程式提供最基礎的 HTML 結構和全域 Context Provider。
- **`globals.css`**: 全域 CSS 樣式和 Tailwind CSS/Shadcn UI 的主題變數定義。
- **`error.tsx`**: 全域錯誤處理頁面，作為捕獲未處理錯誤的最後防線。

## 完整目錄索引

### 📁 (auth) - 身份驗證模組
- **`layout.tsx`** - 認證頁面佈局，提供置中的簡潔佈局
- **`login/page.tsx`** - 登入頁面
- **`register/page.tsx`** - 註冊頁面
- **`profile/page.tsx`** - 用戶資料頁面
- **`profile/[id]/page.tsx`** - 公開用戶資料頁面
- **`pending-approval/page.tsx`** - 帳號待審核頁面
- **`reset-password/page.tsx`** - 密碼重置頁面
- **`verify-email/page.tsx`** - 郵箱驗證頁面

### 📁 (dashboard) - 核心應用模組
- **`layout.tsx`** - 應用程式主佈局，包含 AuthProvider 和 AppProvider
- **`README.md`** - 核心應用程式路由群組說明

#### 🔹 (business-intelligence) - 商業智能模組
- **`README.md`** - 數據分析、報表生成和業務洞察功能

#### 🔹 (communication) - 通訊模組
- **`README.md`** - 多管道溝通整合平台

#### 🔹 (crm-management) - 客戶關係管理模組
- **`README.md`** - 客戶資料管理、銷售追蹤、行銷活動
- **`partners/page.tsx`** - 合作夥伴管理頁面
- **`workflows/page.tsx`** - 工作流程建構器頁面

#### 🔹 (document-management) - 文件管理模組
- **`README.md`** - 文件生命週期管理、版本控制、審核流程

#### 🔹 (enhanced-inventory) - 增強庫存管理模組
- **`README.md`** - 庫存追蹤、預測分析、自動化補貨
- **`items/page.tsx`** - 物料主檔管理頁面
- **`movements/page.tsx`** - 出入庫紀錄頁面
- **`transfers/page.tsx`** - 跨倉調撥頁面
- **`warehouses/page.tsx`** - 倉庫管理頁面

#### 🔹 (quality-management) - 品質管理模組
- **`README.md`** - 品質控制、檢驗流程、問題追蹤

#### 🔹 (finance-management) - 財務管理模組
- **`README.md`** - 會計帳務、預算控制、財務報表

#### 🔹 (hr-management) - 人力資源管理模組
- **`README.md`** - 員工管理、薪資福利、績效評估

#### 🔹 (security-compliance) - 安全合規模組
- **`README.md`** - 安全防護、權限控制、法規遵循

#### 🔹 (workflow-automation) - 工作流程自動化模組
- **`README.md`** - 流程設計、自動化規則、效能監控

#### 🔹 核心功能頁面
- **`dashboard/page.tsx`** - 主儀表板頁面
- **`projects/page.tsx`** - 專案管理頁面
- **`contracts/`** - 合約管理模組
  - **`contracts/page.tsx`** - 合約主頁
  - **`contracts/create/page.tsx`** - 創建合約頁面
  - **`contracts/[id]/page.tsx`** - 合約詳情頁面
  - **`billing/page.tsx`** - 計價作業頁面
- **`team/`** - 團隊管理模組
  - **`members/page.tsx`** - 團隊成員管理頁面
  - **`schedule/page.tsx`** - 排班表頁面
  - **`skills/page.tsx`** - 技能清單頁面
  - **`knowledge-base/page.tsx`** - 工法工序庫頁面
- **`quick-actions/`** - 快速操作模組
  - **`cloud-drive/page.tsx`** - 雲端硬碟頁面
  - **`daily-report/page.tsx`** - 日報頁面
  - **`docu-parse/page.tsx`** - 文件解析頁面
  - **`kanban/page.tsx`** - 看板頁面
  - **`project-progress/page.tsx`** - 專案進度頁面
  - **`staff-attendance/page.tsx`** - 員工出勤頁面
- **`settings/page.tsx`** - 設定頁面

#### 🔹 (website-cms) - 網站內容管理系統
- **`layout.tsx`** - 管理後台佈局
- **`dashboard-management/page.tsx`** - 管理儀表板頁面
- **`user-management/page.tsx`** - 用戶管理頁面
- **`system-management/page.tsx`** - 系統管理頁面
- **`content-management/`** - 內容管理模組
  - **`page.tsx`** - 內容管理主頁
  - **`pages/page.tsx`** - 頁面內容管理
  - **`media/page.tsx`** - 媒體檔案管理
- **`blog-management/`** - 部落格管理模組
  - **`posts/page.tsx`** - 文章管理頁面
  - **`posts/[id]/page.tsx`** - 文章編輯頁面
- **`career-management/`** - 徵才管理模組
  - **`page.tsx`** - 徵才管理主頁
  - **`jobs/page.tsx`** - 職位管理頁面
  - **`applications/page.tsx`** - 應聘者管理頁面
- **`contact-management/page.tsx`** - 聯絡管理頁面

### 📁 (public) - 公開頁面模組
- **`layout.tsx`** - 公開頁面佈局，包含頁首和頁尾
- **`README.md`** - 公開頁面路由群組說明
- **`page.tsx`** - 網站首頁 (Landing Page)
- **`about/page.tsx`** - 關於我們頁面
- **`blog/page.tsx`** - 部落格列表頁面
- **`blog/[slug]/page.tsx`** - 部落格文章詳情頁面
- **`careers/page.tsx`** - 企業徵才頁面
- **`contact/page.tsx`** - 聯絡我們頁面
- **`privacy-policy/page.tsx`** - 隱私權政策頁面
- **`terms-of-service/page.tsx`** - 服務條款頁面

## 技術架構

### 前端技術
- **Next.js 14** - React 全端框架，支援 App Router
- **TypeScript** - 型別安全的 JavaScript 超集
- **Tailwind CSS** - 實用優先的 CSS 框架
- **Shadcn/ui** - 高品質的 React 元件庫

### 後端整合
- **Firebase** - 身份驗證、資料庫、雲端儲存
- **Supabase** - 關聯式資料庫和即時功能
- **Genkit** - AI 功能整合

### 狀態管理
- **React Context** - 全域狀態管理
- **React Hooks** - 元件狀態和副作用管理

## 開發指南

### 新增頁面
1. 在適當的路由群組目錄下建立新的 `page.tsx` 文件
2. 遵循現有的命名慣例和檔案結構
3. 確保頁面元件正確匯入和使用

### 新增功能模組
1. 在 `features/` 目錄下建立新的功能目錄
2. 實作必要的 View 元件和業務邏輯
3. 在對應的路由群組下建立頁面入口

### 佈局自訂
- 每個路由群組都有自己的 `layout.tsx`
- 可以根據需求自訂佈局和樣式
- 共享元件放在 `components/` 目錄下

## 部署與維護

### 建置流程
```bash
npm run build    # 建置生產版本
npm run start    # 啟動生產伺服器
npm run dev      # 開發模式
```

### 環境變數
- 確保所有必要的環境變數都已設定
- 檢查 Firebase 和 Supabase 配置
- 驗證 API 金鑰和端點設定

### 效能優化
- 使用 Next.js 的圖片優化功能
- 實作適當的程式碼分割
- 監控和優化載入效能
