# 合約模組 (Contracts Module)

## 概述

合約模組是 Beta-db 整合平台的核心功能之一，負責管理所有營造合約、付款追蹤、變更單和版本控制。

## 架構設計

### 目錄結構

```
contracts/
├── types/                    # 類型定義
├── hooks/                    # 自定義 Hooks
├── services/                 # 業務邏輯服務
├── utils/                    # 工具函數
├── constants/                # 常數定義
├── components/               # 可重用組件
├── forms/                    # 表單組件
├── dialogs/                  # 對話框組件
├── sheets/                   # 側邊欄組件
├── tables/                   # 表格組件
├── dashboard/                # 儀表板組件
├── views/                    # 頁面視圖組件
└── providers/                # Context 提供者
```

### 核心功能

- **合約管理**: 創建、編輯、刪除、查看合約
- **付款追蹤**: 管理付款請求、狀態和進度
- **變更單管理**: 處理合約修改和修訂
- **版本控制**: 追蹤合約版本歷史
- **數據匯出**: 支援 CSV 格式匯出

## 使用方式

### 基本使用

```tsx
import { ContractsView } from '@/components/features/contracts';

function MyPage() {
  return (
    <ContractProvider>
      <ContractsView />
    </ContractProvider>
  );
}
```

### 使用 Context

```tsx
import { useContractContext } from '@/components/features/contracts';

function MyComponent() {
  const { state, dispatch } = useContractContext();
  
  // 使用合約狀態
  const { contracts, loading } = state;
  
  return (
    // 組件內容
  );
}
```

## 組件說明

### 主要組件

- `ContractsView`: 合約主視圖，包含儀表板和列表
- `ContractDashboard`: 合約統計儀表板
- `ContractsTable`: 合約列表表格
- `ContractDetailsSheet`: 合約詳情側邊欄
- `CreateContractDialog`: 創建合約對話框

### 可重用組件

- `ContractStatusBadge`: 合約狀態標籤
- `PaymentProgress`: 付款進度條
- `ChangeOrderItem`: 變更單項目
- `VersionTimeline`: 版本時間軸

## 類型定義

### 核心類型

- `Contract`: 合約主體
- `Payment`: 付款記錄
- `ChangeOrder`: 變更單
- `ContractVersion`: 合約版本

### 狀態類型

- `ContractStatus`: 合約狀態
- `PaymentStatus`: 付款狀態
- `ChangeOrderStatus`: 變更單狀態

## 服務層

### 主要服務

- `ContractService`: 合約 CRUD 操作
- `PaymentService`: 付款管理
- `ChangeOrderService`: 變更單管理
- `ExportService`: 數據匯出

## 開發指南

### 添加新功能

1. 在適當的目錄下創建新檔案
2. 更新對應的 `index.ts` 導出
3. 在主 `index.ts` 中添加導出
4. 更新 README 文檔

### 測試

```bash
# 運行測試
npm test

# 運行特定測試
npm test -- contracts
```

## 依賴關係

- **UI 組件**: `@/components/ui/*`
- **工具函數**: `@/lib/utils`
- **類型定義**: `@/lib/types`
- **Firebase**: `@/lib/firebase`

## 注意事項

- 所有組件都使用 TypeScript 嚴格模式
- 遵循 React 19 最佳實踐
- 使用 Next.js 15 App Router
- 支援響應式設計
- 整合 Firebase 後端服務