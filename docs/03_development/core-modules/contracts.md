# 合約相關檔案清單 (Contract Files List)

本文件列出了 Beta-db 整合平台中所有與合約功能相關的檔案，包括元件、服務、類型定義、頁面等。

## 📁 目錄結構

### 1. 合約元件 (Contract Components)
```
src/components/features/contracts/
├── README.md                           # 合約模組說明文件
├── index.ts                            # 合約元件匯出檔案
├── actions/                            # Server Actions 目錄
├── components/                         # 可重用的小型元件
├── constants/                          # 常數定義
├── dashboard/                          # 合約儀表板元件
│   └── dashboard.tsx                   # 合約儀表板主元件
├── dialogs/                            # 對話方塊元件
├── forms/                              # 表單元件
├── hooks/                              # 自定義 React Hooks
├── providers/                          # Context Providers
├── services/                           # 服務層
├── sheets/                             # 側邊欄元件
├── tables/                             # 表格元件
├── types/                              # 類型定義
├── utils/                              # 工具函數
└── views/                              # 主要視圖元件
```

### 2. 合約服務 (Contract Services)
```
src/lib/services/contracts/
├── README.md                           # 合約服務說明文件
├── index.ts                            # 服務匯出檔案
├── contract-api.service.ts             # 合約 API 服務
├── contract-cache.service.ts           # 合約快取服務
└── firebase-contract.service.ts        # Firebase 合約服務
```

### 3. 合約類型定義 (Contract Types)
```
src/lib/types/contracts/
├── README.md                           # 合約類型說明文件
├── index.ts                            # 類型匯出檔案
├── change-order.types.ts               # 變更單類型定義
├── contract-version.types.ts           # 合約版本類型定義
├── contract.types.ts                   # 合約主要類型定義
└── payment.types.ts                    # 付款類型定義
```

### 4. 合約頁面 (Contract Pages)
```
src/app/(dashboard)/contracts/
├── page.tsx                            # 合約列表頁面
├── layout.tsx                          # 合約頁面佈局
├── create/                             # 建立合約頁面
│   └── page.tsx                        # 建立合約表單
└── [id]/                               # 合約詳細頁面
    └── page.tsx                        # 合約詳細資訊
```

### 5. 合約相關功能 (Contract-Related Features)

#### 5.1 合作夥伴合約 (Partner Contracts)
```
src/components/features/partnerverse/contracts/
├── README.md                           # 合作夥伴合約說明
└── contracts-tab.tsx                   # 合作夥伴合約標籤頁
```

#### 5.2 合約儀表板 (Contract Dashboard)
```
src/components/features/dashboard/
└── dashboard.tsx                       # 主要儀表板 (包含合約統計)
```

## 🔧 技術架構

### 前端技術
- **框架**: Next.js 15+ (App Router)
- **語言**: TypeScript 5.0+
- **UI 庫**: shadcn/ui + Tailwind CSS
- **狀態管理**: React Context + Zustand
- **圖表**: Recharts

### 後端技術
- **資料庫**: Firebase Firestore
- **認證**: Firebase Auth
- **儲存**: Firebase Storage
- **函數**: Firebase Functions

## 📊 主要功能

1. **合約管理**: 建立、編輯、刪除、查看合約
2. **版本控制**: 合約版本追蹤和管理
3. **變更單管理**: 處理合約變更請求
4. **付款追蹤**: 追蹤合約付款狀態
5. **儀表板**: 合約統計和概覽
6. **權限控制**: 基於角色的存取控制 (RBAC)

## 📝 檔案說明

### 核心檔案
- **`contract.types.ts`**: 定義合約的主要資料結構
- **`firebase-contract.service.ts`**: 處理與 Firebase 的合約資料互動
- **`dashboard.tsx`**: 合約儀表板的主要元件
- **`contracts-tab.tsx`**: 在合作夥伴頁面中顯示相關合約

### 支援檔案
- **`change-order.types.ts`**: 變更單相關的類型定義
- **`payment.types.ts`**: 付款相關的類型定義
- **`contract-version.types.ts`**: 合約版本控制的類型定義

## 🚀 開發指南

1. **新增合約類型**: 在 `src/lib/types/contracts/` 目錄下建立新的類型檔案
2. **新增合約服務**: 在 `src/lib/services/contracts/` 目錄下建立新的服務檔案
3. **新增合約元件**: 在 `src/components/features/contracts/` 目錄下建立新的元件
4. **更新類型**: 確保所有相關的類型定義都已匯出到 `index.ts` 檔案中

## 📚 相關文件

- [專案架構文件](../1-architecture/project.md)
- [資料庫設計文件](../1-architecture/database.md)
- [系統架構文件](../1-architecture/layout.md)
