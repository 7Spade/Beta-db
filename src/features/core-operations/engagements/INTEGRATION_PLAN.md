# 專案與合約整合計畫 (Project-Contract Integration Plan)

## 📋 概述 (Overview)

本計畫旨在將現有的專案管理模組 (`projects`) 和合約管理模組 (`contracts`) 整合為一個統一的「專案合約管理」模組 (`engagements`)，實現不向後兼容的完全重構。

## 🔍 現狀分析 (Current State Analysis)

### 專案管理模組 (Projects Module)
- **檔案數量**: 39 個檔案
- **核心功能**:
  - 專案生命週期管理
  - 任務和子任務管理
  - 進度追蹤和驗收
  - 預算和成本控制
  - 工作流程管理

### 合約管理模組 (Contracts Module)
- **檔案數量**: 65 個檔案
- **核心功能**:
  - 合約創建和版本管理
  - 付款和收款管理
  - 變更單處理
  - 合約狀態追蹤
  - 財務報表和分析

## 🔄 重疊功能識別 (Overlapping Functions)

### 1. 數據結構重疊
- **客戶資訊**: 兩個模組都包含 `client` 和 `clientRepresentative`
- **時間管理**: 都有 `startDate` 和 `endDate`
- **任務管理**: 合約模組已引用專案的 `Task` 類型
- **價值計算**: 都有 `value`/`totalValue` 欄位

### 2. 功能重疊
- **狀態管理**: 專案狀態 vs 合約狀態
- **進度追蹤**: 專案進度 vs 合約執行進度
- **文件管理**: 兩個模組都有附件和文件處理
- **審批流程**: 專案驗收 vs 合約變更審批

## 🎯 整合設計 (Integration Design)

### 統一數據模型 (Unified Data Model)

```typescript
// 新的統一 Engagement 類型
export interface Engagement {
  // 基本資訊
  id: string;
  customId?: string;
  name: string;
  description: string;
  
  // 參與方資訊
  contractor: string;
  client: string;
  clientRepresentative?: string;
  
  // 時間管理
  startDate: Date | Timestamp;
  endDate: Date | Timestamp;
  actualStartDate?: Date | Timestamp;
  actualEndDate?: Date | Timestamp;
  
  // 財務資訊
  totalValue: number;
  paidAmount: number;
  pendingAmount: number;
  currency: string;
  
  // 狀態管理
  status: EngagementStatus;
  phase: EngagementPhase;
  
  // 工作範疇
  scope: string;
  tasks: Task[];
  
  // 財務管理
  payments: Payment[];
  receipts: Receipt[];
  invoices: Invoice[];
  
  // 變更管理
  changeOrders: ChangeOrder[];
  versions: EngagementVersion[];
  
  // 進度管理
  milestones: Milestone[];
  deliverables: Deliverable[];
  
  // 品質管理
  acceptanceRecords: AcceptanceRecord[];
  qualityChecks: QualityCheck[];
  
  // 風險管理
  risks: Risk[];
  issues: Issue[];
  
  // 溝通管理
  communications: Communication[];
  meetings: Meeting[];
  
  // 文件管理
  documents: Document[];
  attachments: Attachment[];
  
  // 審計追蹤
  auditLog: AuditLogEntry[];
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedBy: string;
  updatedAt: Date | Timestamp;
}

// 統一的狀態類型
export type EngagementStatus = 
  | '草稿' 
  | '已簽約' 
  | '進行中' 
  | '暫停' 
  | '已完成' 
  | '已終止' 
  | '已取消';

export type EngagementPhase = 
  | '規劃' 
  | '執行' 
  | '監控' 
  | '收尾' 
  | '維護';
```

### 模組架構重組 (Module Architecture Restructure)

```
src/features/core-operations/engagements/
├── types/
│   ├── engagement.types.ts          # 主要類型定義
│   ├── task.types.ts               # 任務相關類型
│   ├── financial.types.ts          # 財務相關類型
│   ├── change.types.ts             # 變更管理類型
│   ├── progress.types.ts           # 進度管理類型
│   ├── quality.types.ts            # 品質管理類型
│   ├── communication.types.ts      # 溝通管理類型
│   └── index.ts
├── actions/
│   ├── engagement.actions.ts       # 主要業務邏輯
│   ├── task.actions.ts             # 任務管理
│   ├── financial.actions.ts        # 財務管理
│   ├── change.actions.ts           # 變更管理
│   ├── progress.actions.ts         # 進度管理
│   ├── quality.actions.ts          # 品質管理
│   ├── communication.actions.ts    # 溝通管理
│   └── index.ts
├── services/
│   ├── engagement.service.ts       # 主要服務
│   ├── financial.service.ts        # 財務服務
│   ├── document.service.ts         # 文件服務
│   ├── notification.service.ts     # 通知服務
│   └── index.ts
├── components/
│   ├── forms/
│   │   ├── create-engagement-form.tsx
│   │   ├── edit-engagement-form.tsx
│   │   └── index.ts
│   ├── dialogs/
│   │   ├── engagement-details-dialog.tsx
│   │   ├── delete-engagement-dialog.tsx
│   │   └── index.ts
│   ├── tables/
│   │   ├── engagements-table.tsx
│   │   ├── tasks-table.tsx
│   │   ├── payments-table.tsx
│   │   └── index.ts
│   ├── cards/
│   │   ├── engagement-card.tsx
│   │   ├── engagement-summary-card.tsx
│   │   └── index.ts
│   ├── charts/
│   │   ├── engagement-charts.tsx
│   │   ├── financial-charts.tsx
│   │   └── index.ts
│   └── index.ts
├── views/
│   ├── engagement-list-view.tsx
│   ├── engagement-detail-view.tsx
│   ├── engagement-dashboard.tsx
│   └── index.ts
├── hooks/
│   ├── use-engagements.ts
│   ├── use-engagement-form.ts
│   ├── use-engagement-actions.ts
│   └── index.ts
├── providers/
│   ├── engagement-context.tsx
│   └── index.ts
├── utils/
│   ├── engagement.utils.ts
│   ├── financial.utils.ts
│   ├── status.utils.ts
│   └── index.ts
├── constants/
│   ├── engagement.constants.ts
│   ├── status.constants.ts
│   └── index.ts
└── index.ts
```

### 未實現功能的文件結構 (Unimplemented Features File Structure)

基於 EXPANSION_PLAN.md 中的分析，以下是需要添加的未實現功能文件結構：

```
src/features/core-operations/engagements/
├── components/
│   ├── tasks/                    # 任務管理組件 (實現)
│   │   ├── task-list.tsx
│   │   ├── task-card.tsx
│   │   ├── task-form.tsx
│   │   ├── task-status-badge.tsx
│   │   ├── task-progress-bar.tsx
│   │   └── index.ts
│   ├── progress/                 # 進度管理組件 (實現)
│   │   ├── milestone-list.tsx
│   │   ├── milestone-card.tsx
│   │   ├── deliverable-list.tsx
│   │   ├── progress-chart.tsx
│   │   ├── progress-summary.tsx
│   │   └── index.ts
│   ├── financial/                # 財務管理增強組件 (實現)
│   │   ├── payment-list.tsx
│   │   ├── invoice-list.tsx
│   │   ├── financial-summary.tsx
│   │   ├── payment-form.tsx
│   │   ├── invoice-form.tsx
│   │   └── index.ts
│   ├── quality/                  # 品質管理組件 (實現)
│   │   ├── acceptance-record-list.tsx
│   │   ├── quality-check-list.tsx
│   │   ├── acceptance-form.tsx
│   │   ├── quality-check-form.tsx
│   │   ├── quality-dashboard.tsx
│   │   └── index.ts
│   ├── risk/                     # 風險管理組件 (實現)
│   │   ├── risk-list.tsx
│   │   ├── issue-list.tsx
│   │   ├── risk-matrix.tsx
│   │   ├── risk-form.tsx
│   │   ├── issue-form.tsx
│   │   └── index.ts
│   ├── communication/            # 溝通管理組件 (實現)
│   │   ├── communication-list.tsx
│   │   ├── communication-card.tsx
│   │   ├── communication-form.tsx
│   │   ├── meeting-list.tsx
│   │   ├── meeting-card.tsx
│   │   ├── meeting-form.tsx
│   │   └── index.ts
│   ├── documents/                # 文件管理組件 (實現)
│   │   ├── document-list.tsx
│   │   ├── document-uploader.tsx
│   │   ├── document-viewer.tsx
│   │   ├── version-history.tsx
│   │   └── index.ts
│   └── reports/                  # 報表組件 (未實現)
│       ├── engagement-report.tsx
│       ├── financial-report.tsx
│       ├── progress-report.tsx
│       ├── quality-report.tsx
│       ├── dashboard-charts.tsx
│       └── index.ts
├── actions/
│   ├── progress.actions.ts       # 進度管理 Actions (未實現)
│   ├── quality.actions.ts        # 品質管理 Actions (未實現)
│   ├── risk.actions.ts           # 風險管理 Actions (未實現)
│   ├── communication.actions.ts  # 溝通管理 Actions (實現)
│   └── document.actions.ts       # 文件管理 Actions (未實現)
├── services/
│   ├── progress.service.ts       # 進度管理服務 (未實現)
│   ├── quality.service.ts        # 品質管理服務 (未實現)
│   ├── risk.service.ts           # 風險管理服務 (未實現)
│   ├── communication.service.ts  # 溝通管理服務 (未實現)
│   └── document.service.ts       # 文件管理服務 (未實現)
├── hooks/
│   ├── use-tasks.ts              # 任務管理 Hook (未實現)
│   ├── use-progress.ts           # 進度管理 Hook (未實現)
│   ├── use-quality.ts            # 品質管理 Hook (未實現)
│   ├── use-risk.ts               # 風險管理 Hook (未實現)
│   ├── use-communication.ts      # 溝通管理 Hook (未實現)
│   └── use-documents.ts          # 文件管理 Hook (未實現)
└── utils/
    ├── task.utils.ts             # 任務工具函數 (未實現)
    ├── progress.utils.ts         # 進度工具函數 (未實現)
    ├── quality.utils.ts          # 品質工具函數 (未實現)
    ├── risk.utils.ts             # 風險工具函數 (未實現)
    ├── communication.utils.ts    # 溝通工具函數 (未實現)
    └── document.utils.ts         # 文件工具函數 (未實現)
```

**說明**:
- 標記為 "(未實現)" 的文件和目錄都是根據 EXPANSION_PLAN.md 中的分析需要添加的
- 這些文件將在功能擴展階段逐步實現
- 每個功能模組都有對應的組件、Actions、服務、Hooks 和工具函數

**未實現功能統計**:
- **組件文件**: 36 個 (6 個功能模組 × 平均 6 個組件) - 溝通管理已完成
- **Actions 文件**: 4 個 - 溝通管理已完成
- **Services 文件**: 5 個  
- **Hooks 文件**: 6 個
- **Utils 文件**: 6 個
- **總計**: 57 個文件需要實現 (已減少 7 個)

## 📅 遷移計畫 (Migration Plan)

### 階段 1: 準備工作 (Preparation Phase) ✅ 已完成
**時間**: 1-2 週

1. **數據備份** ✅
   - 備份現有專案和合約數據
   - 創建數據遷移腳本

2. **新模組架構建立** ✅
   - 創建新的 `engagements` 目錄結構
   - 建立統一的類型定義
   - 設置基本的服務層

3. **數據模型設計** ✅
   - 設計統一的數據庫結構
   - 創建數據遷移映射表

### 階段 2: 核心功能開發 (Core Development Phase) 🔄 進行中
**時間**: 3-4 週

1. **基礎服務開發** ✅
   - 實現 Engagement 的 CRUD 操作
   - 開發財務管理功能
   - 實現任務管理功能

2. **UI 組件開發** 🔄 部分完成
   - 創建主要的表單和對話框 ✅
   - 開發列表和詳細視圖 ✅
   - 實現儀表板組件 ✅
   - 任務管理 UI 組件 ❌ 待實現
   - 進度管理 UI 組件 ❌ 待實現

3. **業務邏輯整合** ✅
   - 整合專案和合約的業務規則
   - 實現統一的狀態管理
   - 開發通知和審批流程

### 階段 3: 進階功能開發 (Advanced Features Phase) ❌ 待開始
**時間**: 2-3 週

1. **進階功能** ❌
   - 實現變更管理
   - 開發進度追蹤
   - 實現品質管理

2. **報表和儀表板** ❌
   - 創建財務報表
   - 開發進度儀表板
   - 實現風險分析

3. **整合測試** ❌
   - 單元測試
   - 整合測試
   - 用戶接受測試

### 階段 4: 功能擴展 (Feature Expansion Phase) 📋 新增階段
**時間**: 4-6 週

1. **任務管理系統** ✅
   - 完整的任務管理 UI
   - 任務狀態追蹤
   - 子任務管理

2. **進度管理系統** ✅
   - 里程碑管理
   - 交付物追蹤
   - 進度視覺化

3. **品質管理系統** ✅
   - 驗收記錄管理
   - 品質檢查流程
   - 品質儀表板

4. **風險管理系統** ✅
   - 風險識別和評估
   - 問題追蹤
   - 風險矩陣

5. **溝通管理系統** ✅
   - 溝通記錄管理
   - 會議管理
   - 後續行動追蹤

詳細的功能擴展計畫請參考 [EXPANSION_PLAN.md](./EXPANSION_PLAN.md)

### 階段 5: 數據遷移和部署 (Migration & Deployment Phase)
**時間**: 1-2 週

1. **數據遷移**
   - 執行數據遷移腳本
   - 驗證數據完整性
   - 處理數據衝突

2. **系統部署**
   - 部署新系統
   - 配置生產環境
   - 執行回滾計畫

3. **用戶培訓**
   - 準備培訓材料
   - 進行用戶培訓
   - 收集反饋

## ⚠️ 風險評估 (Risk Assessment)

### 高風險項目
1. **數據遷移風險**
   - 數據丟失或損壞
   - 遷移過程中的系統停機
   - 數據格式不兼容

2. **功能缺失風險**
   - 新系統功能不完整
   - 用戶工作流程中斷
   - 業務邏輯錯誤

### 風險緩解措施
1. **數據安全**
   - 多重備份策略
   - 分階段遷移
   - 回滾機制

2. **功能完整性**
   - 詳細的功能對照表
   - 用戶驗收測試
   - 並行運行期

## 📊 成功指標 (Success Metrics)

### 技術指標
- 系統性能提升 20%
- 代碼重複率降低 50%
- 維護成本降低 30%

### 業務指標
- 用戶滿意度 > 90%
- 數據準確性 > 99%
- 系統可用性 > 99.5%

## 🚀 實施建議 (Implementation Recommendations)

### 1. 採用漸進式遷移
- 先實現核心功能
- 逐步添加進階功能
- 保持系統穩定性

### 2. 重視用戶體驗
- 保持熟悉的操作界面
- 提供充分的培訓
- 收集持續反饋

### 3. 確保數據完整性
- 實施嚴格的數據驗證
- 建立審計追蹤
- 定期數據備份

### 4. 建立支援體系
- 技術支援團隊
- 用戶文檔
- 故障排除指南

## 📝 結論 (Conclusion)

這個整合計畫將創建一個更強大、更統一的專案合約管理系統，消除現有系統中的重複功能，提供更好的用戶體驗和更高效的業務流程。通過仔細的規劃和執行，我們可以成功實現這個重要的系統升級。

---

**文件版本**: 1.0  
**創建日期**: 2024年12月  
**最後更新**: 2024年12月  
**負責人**: 開發團隊
