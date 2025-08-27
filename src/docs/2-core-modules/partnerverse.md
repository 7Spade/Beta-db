# 合作夥伴功能檔案清單 (PartnerVerse Feature Files List)

本文件列出了 Beta-db 整合平台中所有與「合作夥伴關係管理 (PartnerVerse)」功能相關的檔案。這是一個類似 CRM 的複雜功能模組。

## 📁 目錄結構

### 1. 核心功能元件 (Core Feature Components)
```
src/components/features/partnerverse/
├── README.md                           # PartnerVerse 模組概述
├── partners/
│   ├── partners-view.tsx               # 整個功能的主視圖與狀態管理中心
│   ├── list/partner-list.tsx           # 合作夥伴列表元件
│   ├── profile/
│   │   ├── partner-profile.tsx         # 合作夥伴詳細資料的主元件 (含 Tabs)
│   │   └── profile-header.tsx          # 合作夥伴詳細資料的頁首
│   └── forms/partner-form.tsx          # 新增/編輯合作夥伴的對話方塊表單
├── contacts/
│   ├── contacts-tab.tsx                # 「聯絡人」標籤頁內容
│   └── forms/contact-form.tsx          # 新增/編輯聯絡人的對話方塊表單
├── financials/
│   ├── financials-tab.tsx              # 「財務」標籤頁內容
│   └── workflow-designer.tsx           # 應收/應付流程設計器
├── workflows/
│   └── workflow-builder.tsx            # 財務單據管理的主介面
├── overview/
│   └── overview-tab.tsx                # 「概覽」標籤頁內容
├── contracts/
│   └── contracts-tab.tsx               # 「合約」標籤頁內容
├── transactions/
│   └── transactions-tab.tsx            # 「交易紀錄」標籤頁內容
├── performance/
│   └── performance-tab.tsx             # 「績效」標籤頁內容
├── compliance/
│   └── compliance-tab.tsx              # 「合規文件」標籤頁內容
└── dashboard/
    └── dashboard.tsx                   # 專用於 PartnerVerse 的儀表板統計元件
```

### 2. 頁面入口 (Page Entries)
```
src/app/(dashboard)/partnerverse/
├── partners/page.tsx                   # 合作夥伴列表頁面
└── workflows/page.tsx                  # 收支流程管理頁面
```

### 3. 相關資料庫集合 (Related Collections)
- **`partners`**: 在 `docs/database.md` 中定義，儲存所有合作夥伴的詳細資料。
- **`financial_documents`**: 儲存所有應收與應付單據。
- **`contracts`**: `contracts-tab.tsx` 會查詢此集合以顯示關聯合約。

## 🔧 技術架構

- **前端框架**: Next.js (App Router)
- **資料庫**: Firebase Firestore
- **狀態管理**: 主要使用 `useState` 和 `useEffect` 進行元件級別的狀態管理。
- **UI 元件**: shadcn/ui

## 📊 核心流程

1.  **主視圖 (`partners-view.tsx`)**:
    - 作為功能的進入點，從 Firestore 的 `partners` 集合中即時獲取所有合作夥伴的數據。
    - 管理當前顯示的是列表 (`PartnerList`) 還是單一夥伴的詳細資料 (`PartnerProfile`)。
    - 管理新增/編輯夥伴 (`PartnerForm`) 和新增/編輯聯絡人 (`ContactForm`) 對話方塊的開啟狀態和數據流。

2.  **列表視圖 (`partner-list.tsx`)**:
    - 以卡片形式展示所有合作夥伴。
    - 提供基於名稱、狀態、類別的搜尋和篩選功能。
    - 點擊卡片會觸發 `onSelectPartner` 回調，通知主視圖切換到詳細資料頁面。

3.  **詳細資料視圖 (`partner-profile.tsx`)**:
    - 使用 `<Tabs>` 元件來組織一個合作夥伴的不同維度資訊。
    - 每個標籤頁（如 `ContactsTab`, `ContractsTab` 等）都是一個獨立的元件，負責顯示其對應的特定資訊。
    - 例如，`ContractsTab` 會根據當前夥伴的名稱，去 `contracts` 集合中查詢所有客戶欄位與之匹配的合約。

4.  **財務流程 (`workflow-designer.tsx` & `workflow-builder.tsx`)**:
    - `workflow-designer.tsx` 允許使用者為每個夥伴自定義應收和應付的流程步驟（例如：「開立發票」->「等待付款」->「確認收款」）。
    - `workflow-builder.tsx` 則是一個更完整的介面，用於管理基於這些自定義流程所建立的財務單據 (`financial_documents`)，並可以推進單據的狀態。

## 📚 相關文件

- [資料庫設計文件](./database.md) (`partners`, `financial_documents` 集合)
- [合約相關檔案清單](./contracts.md)