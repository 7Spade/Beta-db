I'll help you create a comprehensive list of all the features in the `src/features/core-operations/projects` and `src/features/core-operations/contracts` directories. Let me examine these directories to provide you with a detailed inventory.


[2 tools called]

Now let me get more detailed information about the specific files in each directory to provide you with a comprehensive feature list:


[4 tools called]

Let me also check the main action files to understand the core functionality:


[3 tools called]

Now let me check some key component files to understand the UI features:


[3 tools called]

Based on my analysis of the codebase, here's a comprehensive feature list for both directories:

## 📋 功能清單 (Feature Inventory)

### 🏗️ **src/features/core-operations/projects** - 專案管理模組

#### **核心功能 (Core Features)**
- **專案管理 (Project Management)**
  - 專案創建、編輯、刪除
  - 專案列表顯示與篩選
  - 專案詳細資訊查看
  - 專案狀態管理

- **任務管理 (Task Management)**
  - 任務創建、編輯、刪除
  - 子任務管理
  - 任務狀態追蹤 (待處理/進行中/已完成)
  - 任務進度提交

- **驗收管理 (Acceptance Management)**
  - 驗收記錄創建
  - 驗收狀態管理 (草稿/待審批/已批准/已駁回)
  - 驗收審批流程
  - 驗收歷史記錄

#### **業務邏輯 (Business Logic)**
- **預算管理 (Budget Management)**
- **進度追蹤 (Progress Tracking)**
- **品質控制 (Quality Control)**
- **安全檢查 (Safety Management)**
- **文件管理 (Document Management)**
- **通知系統 (Notification System)**
- **審計日誌 (Audit Logging)**
- **工作流程 (Workflow Management)**
- **工人管理 (Worker Management)**
- **溝通記錄 (Communication Logging)**
- **報告生成 (Report Generation)**

#### **UI 組件 (UI Components)**
- `ProjectCard` - 專案卡片
- `ProjectList` - 專案列表
- `ProjectDetailsSheet` - 專案詳情側邊欄
- `CreateProjectDialog` - 創建專案對話框
- `TaskList` - 任務列表
- `TaskItem` - 任務項目
- `TaskActions` - 任務操作
- `AddTaskPanel` - 新增任務面板
- `AddSubtaskForm` - 新增子任務表單
- `AcceptanceList` - 驗收列表
- `AcceptanceStatusBadge` - 驗收狀態標籤
- `SubmitProgressDialog` - 提交進度對話框
- `AiSubtaskSuggestions` - AI 子任務建議
- `ProjectSummary` - 專案摘要

---

### 📄 **src/features/core-operations/contracts** - 合約管理模組

#### **核心功能 (Core Features)**
- **合約管理 (Contract Management)**
  - 合約創建、編輯、刪除
  - 合約版本控制
  - 合約狀態管理 (啟用中/已完成/暫停中/已終止)
  - 合約範圍管理

- **付款管理 (Payment Management)**
  - 付款記錄追蹤
  - 付款進度監控
  - 付款狀態管理

- **收據管理 (Receipt Management)**
  - 收據記錄管理
  - 收據進度追蹤

- **變更單管理 (Change Order Management)**
  - 變更單創建與審批
  - 變更單歷史記錄
  - 變更單狀態追蹤

#### **業務邏輯 (Business Logic)**
- **合約服務 (Contract Service)**
- **付款服務 (Payment Service)**
- **收據服務 (Receipt Service)**
- **變更單服務 (Change Order Service)**
- **匯出服務 (Export Service)**

#### **UI 組件 (UI Components)**
- `contract-status-badge` - 合約狀態標籤
- `contract-summary-card` - 合約摘要卡片
- `payment-progress` - 付款進度
- `receipt-progress` - 收據進度
- `change-order-item` - 變更單項目
- `version-timeline` - 版本時間軸
- `ContractScopeList` - 合約範圍列表
- `ContractScopeItem` - 合約範圍項目

#### **表單與對話框 (Forms & Dialogs)**
- `contract-form` - 合約表單
- `create-contract-form` - 創建合約表單
- `edit-contract-form` - 編輯合約表單
- `create-contract-dialog` - 創建合約對話框
- `edit-contract-dialog` - 編輯合約對話框
- `delete-contract-dialog` - 刪除合約對話框

#### **表格組件 (Table Components)**
- `contracts-table` - 合約表格
- `payments-table` - 付款表格
- `receipts-table` - 收據表格
- `change-orders-table` - 變更單表格

#### **側邊欄組件 (Sheet Components)**
- `contract-details-sheet` - 合約詳情側邊欄
- `contract-edit-sheet` - 合約編輯側邊欄

#### **儀表板 (Dashboard)**
- `contract-dashboard` - 合約儀表板
- `contract-charts` - 合約圖表
- `contract-stats` - 合約統計

#### **頁面視圖 (Views)**
- `contracts-view` - 合約總覽
- `contract-list-view` - 合約列表視圖
- `contract-detail-view` - 合約詳情視圖
- `create-contract-view` - 創建合約視圖

#### **工具與常數 (Utils & Constants)**
- 合約工具函數
- 狀態工具函數
- 驗證工具函數
- 合約常數定義
- UI 常數定義

#### **自定義 Hooks**
- `use-contracts` - 合約數據管理
- `use-contract-actions` - 合約操作
- `use-contract-form` - 合約表單管理

#### **Context 提供者**
- `contract-context` - 合約上下文管理

---

### 🔗 **整合功能 (Integration Features)**
- Firebase Firestore 數據庫整合
- 專案與合約關聯管理
- 統一的審計日誌系統
- 實時數據同步
- 權限控制與角色管理

這個功能清單涵蓋了兩個模組的完整功能範圍，包括核心業務邏輯、用戶界面組件、數據管理、以及系統整合功能。