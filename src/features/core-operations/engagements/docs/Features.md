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

---

### 📄 **src/features/core-operations/docu-parse** - 文件解析模組

#### **核心功能 (Core Features)**
- **文件處理 (Document Processing)**
  - 文件上傳與驗證
  - AI 驅動的文件解析
  - 工作項目自動提取
  - 文件元數據管理

- **AI 整合 (AI Integration)**
  - Genkit AI 流程整合
  - 工作項目智能提取
  - 文件內容分析
  - 結構化數據生成

- **數據管理 (Data Management)**
  - 工作項目數據結構化
  - 文件詳細信息收集
  - 解析結果存儲
  - 數據驗證與清理

#### **業務邏輯 (Business Logic)**
- **文件解析服務 (Document Parse Service)**
- **工作項目提取 (Work Items Extraction)**
- **文件提交處理 (Document Commit Processing)**
- **數據導出功能 (Data Export)**

#### **UI 組件 (UI Components)**
- `file-selector` - 文件選擇器
- `work-items-table` - 工作項目表格
- `docu-parse-view` - 文件解析主視圖

#### **Server Actions**
- `extractWorkItemsFromDocument` - 從文件提取工作項目
- `commitDocumentData` - 提交文件數據

#### **類型定義 (Type Definitions)**
- `WorkItem` - 工作項目類型
- `DocuParseActionState` - 文件解析狀態
- `DocDetails` - 文件詳細信息

#### **工具函數 (Utils)**
- 文件導出工具
- 數據處理工具
- 文件常數定義

---

### 👥 **src/features/core-operations/crm** - 客戶關係管理模組

#### **核心功能 (Core Features)**
- **合作夥伴管理 (Partner Management)**
  - 合作夥伴創建、編輯、刪除
  - 合作夥伴列表與篩選
  - 合作夥伴檔案管理
  - 合作夥伴狀態追蹤

- **聯絡人管理 (Contact Management)**
  - 聯絡人信息管理
  - 聯絡人表單處理
  - 聯絡人分類與標籤
  - 聯絡人歷史記錄

- **合約管理 (Contract Management)**
  - 合約追蹤與管理
  - 合約狀態監控
  - 合約相關文件管理

- **財務管理 (Financial Management)**
  - 財務數據追蹤
  - 財務工作流程設計
  - 財務報告生成

- **合規管理 (Compliance Management)**
  - 合規檢查與監控
  - 合規報告生成
  - 合規狀態追蹤

- **績效管理 (Performance Management)**
  - 績效指標追蹤
  - 績效分析報告
  - 績效改善建議

- **交易管理 (Transaction Management)**
  - 交易記錄管理
  - 交易狀態追蹤
  - 交易歷史分析

#### **業務邏輯 (Business Logic)**
- **工作流程設計器 (Workflow Designer)**
- **工作流程建構器 (Workflow Builder)**
- **數據分析與報告 (Analytics & Reporting)**
- **實時數據同步 (Real-time Data Sync)**

#### **UI 組件 (UI Components)**
- `dashboard` - CRM 儀表板
- `overview-tab` - 總覽標籤頁
- `contacts-tab` - 聯絡人標籤頁
- `contracts-tab` - 合約標籤頁
- `financials-tab` - 財務標籤頁
- `compliance-tab` - 合規標籤頁
- `performance-tab` - 績效標籤頁
- `transactions-tab` - 交易標籤頁

#### **合作夥伴相關組件 (Partner Components)**
- `partners-view` - 合作夥伴總覽
- `partner-list` - 合作夥伴列表
- `partner-profile` - 合作夥伴檔案
- `profile-header` - 檔案標題
- `partner-form` - 合作夥伴表單
- `contact-form` - 聯絡人表單

#### **工作流程組件 (Workflow Components)**
- `workflow-designer` - 工作流程設計器
- `workflow-builder` - 工作流程建構器

---

### 📦 **src/features/core-operations/warehousing** - 倉儲管理模組

#### **核心功能 (Core Features)**
- **倉庫管理 (Warehouse Management)**
  - 倉庫創建、編輯、刪除
  - 倉庫信息管理
  - 倉庫狀態監控
  - 倉庫選擇器

- **庫存管理 (Inventory Management)**
  - 庫存項目管理
  - 庫存類別管理
  - 庫存水平監控
  - 庫存移動追蹤

- **物料管理 (Material Management)**
  - 物料信息管理
  - 物料分類系統
  - 物料狀態追蹤
  - 物料使用記錄

- **庫存移動 (Inventory Movement)**
  - 入庫管理
  - 出庫管理
  - 庫存轉移
  - 移動記錄追蹤

#### **業務邏輯 (Business Logic)**
- **倉儲數據獲取 (Warehousing Data Fetching)**
- **倉庫管理操作 (Warehouse Management Operations)**
- **庫存項目管理 (Inventory Item Management)**
- **庫存類別管理 (Inventory Category Management)**
- **庫存移動管理 (Inventory Movement Management)**
- **數據映射與轉換 (Data Mapping & Transformation)**

#### **UI 組件 (UI Components)**
- `warehouse-selector` - 倉庫選擇器
- `stock-level-table` - 庫存水平表格
- `warehousing-dashboard-view` - 倉儲儀表板視圖
- `stock-levels-view` - 庫存水平視圖
- `movement-list-view` - 移動列表視圖
- `warehousing-view` - 倉儲主視圖

#### **表單組件 (Form Components)**
- `warehouse-form` - 倉庫表單
- `item-form` - 物料表單
- `category-form` - 類別表單

#### **Server Actions**
- `getWarehousingData` - 獲取倉儲數據
- `createWarehouse` - 創建倉庫
- `updateWarehouse` - 更新倉庫
- `deleteWarehouse` - 刪除倉庫
- `createInventoryItem` - 創建庫存項目
- `updateInventoryItem` - 更新庫存項目
- `deleteInventoryItem` - 刪除庫存項目
- `createInventoryCategory` - 創建庫存類別
- `updateInventoryCategory` - 更新庫存類別
- `deleteInventoryCategory` - 刪除庫存類別
- `createInventoryMovement` - 創建庫存移動
- `updateInventoryMovement` - 更新庫存移動
- `deleteInventoryMovement` - 刪除庫存移動

#### **工具函數 (Utils)**
- `data-mappers` - 數據映射工具
- 倉庫數據映射
- 庫存項目數據映射
- 庫存移動數據映射

---

### 🔗 **整合功能 (Integration Features)**
- **Firebase Firestore 數據庫整合**
- **Supabase 數據庫整合**
- **AI 模型整合 (Genkit)**
- **文件存儲整合 (Firebase Storage)**
- **專案與合約關聯管理**
- **統一的審計日誌系統**
- **實時數據同步**
- **權限控制與角色管理**
- **跨模組數據共享**
- **統一的通知系統**

### 📊 **系統架構特點 (System Architecture Features)**
- **模組化設計 (Modular Design)**
- **類型安全 (Type Safety)**
- **Server Actions 架構**
- **實時數據更新**
- **響應式 UI 設計**
- **錯誤處理與日誌記錄**
- **性能優化**
- **可擴展性設計**

這個功能清單涵蓋了所有核心運營模組的完整功能範圍，包括專案管理、合約管理、文件解析、客戶關係管理、倉儲管理，以及核心業務邏輯、用戶界面組件、數據管理、和系統整合功能。