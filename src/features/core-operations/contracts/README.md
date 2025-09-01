# 合約模組 (Contracts Module)

## 概述

合約模組是 Beta-db 整合平台的核心功能之一，負責管理所有營造合約、付款追蹤、變更單和版本控制。這是一個高度複雜且功能完整的模組。

## 架構設計

本模組採用了清晰、可擴展的目錄結構，將不同關注點分離：

```
contracts/
├── actions/                  # Server Actions (例如: createContract)
├── components/               # 可在模組內部重用的小型元件 (例如: ContractStatusBadge)
├── constants/                # 模組內使用的常數 (例如: 合約狀態)
├── dashboard/                # 專用於合約模組的儀表板元件
├── dialogs/                  # 對話框元件 (例如: CreateContractDialog)
├── forms/                    # 表單元件與 Zod 驗證 schemas
├── hooks/                    # 專用於此模組的自定義 Hooks (例如: useContracts)
├── providers/                # 狀態管理的 Context Provider (ContractProvider)
├── services/                 # 核心業務邏輯服務 (例如: contractService)
├── sheets/                   # 側邊欄 (Sheet) 元件 (例如: ContractDetailsSheet)
├── tables/                   # 表格元件 (例如: ContractsTable)
├── types/                    # 核心的 TypeScript 類型定義
├── utils/                    # 工具函數
└── views/                    # 構成頁面的主要 React 元件
```

## 核心功能

- **合約管理**: 創建、編輯、刪除、查看合約。
- **付款追蹤**: 管理付款請求、狀態和進度。
- **變更單管理**: 處理合約修改和修訂。
- **版本控制**: 追蹤合約版本歷史。
- **數據匯出**: 支援將合約列表匯出為 CSV 格式。
- **與 DocuParse 整合**: 可以從「智慧文件解析」模組的結果直接創建合約。

## 使用方式

此模組的功能主要由 `ContractsView` 統一呈現，它被用於 `/app/(dashboard)/contracts` 頁面。該視圖內部會組合使用 `ContractDashboard` 和 `ContractsTable` 等元件。

要使用此模組的功能，應將其包裹在 `ContractProvider` 中，以提供必要的狀態和上下文。

```tsx
// src/app/(dashboard)/contracts/layout.tsx
import { ContractProvider } from '@/features/core-operations/contracts/providers';

export default function ContractsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContractProvider>{children}</ContractProvider>;
}
```
