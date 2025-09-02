# 倉儲管理模組 (Warehousing Module)

## 概述

此模組負責所有與「倉儲管理」相關的前端元件和業務邏輯。它將涵蓋多倉庫管理、物料主檔、庫存水平追蹤以及物料的出入庫與調撥。

**此模組的資料儲存已全面遷移至 Supabase (PostgreSQL)。**

---

### **倉儲管理模組重構計畫書 (v2)**

#### **1. 核心目標**

本次重構旨在將 `warehousing` 模組的檔案結構與專案的官方標準（`module-structure-standards.md` 和 `file-naming-conventions.md`）完全對齊。這將涉及移動、重命名和組織現有檔案至標準化的子目錄結構中，以提升模組的內聚性、可維護性和開發者體驗。

#### **2. 目標結構 (根據專案規範)**

重構後，`warehousing` 模組將嚴格遵循以下標準化的目錄結構：

```
warehousing/
├── README.md               # (本文件) 模組概述與開發藍圖
├── actions/                # Server Actions
│   └── warehousing-actions.ts
├── components/             # 小型、可重用的 UI 元件
│   └── warehouse-selector.tsx
├── forms/                  # 獨立的表單對話框
│   ├── category-form.tsx
│   ├── item-form.tsx
│   └── warehouse-form.tsx
├── tables/                 # 複雜的表格元件
│   └── stock-level-table.tsx
├── utils/                  # 工具函數
│   └── data-mappers.ts
└── views/                  # 構成主要 UI 區塊的大型視圖元件
    ├── warehousing-dashboard-view.tsx
    ├── category-list-view.tsx
    ├── item-list-view.tsx
    ├── movement-list-view.tsx
    ├── stock-levels-view.tsx
    └── warehouse-list-view.tsx
```

#### **3. 檔案遷移與重構詳解**

- **`actions/`**:
  - `warehousing-actions.ts`: **保留**。職責清晰，符合 `kebab-case.ts` 命名規範。

- **`components/`**:
  - `warehouse-selector.tsx`: **保留**。它是一個可以在模組內多處重用的小型元件，符合 `kebab-case.tsx` 規範。

- **`forms/`**:
  - `category-form.tsx`, `item-form.tsx`, `warehouse-form.tsx`: **保留**。這些對話框表單職責明確，且命名符合規範。
  - `movement-form.tsx`, `transfer-form.tsx`: **移除**。根據我們的討論，這些將被更智慧的「情境化表單」取代，其邏輯會直接在對應的 `view` 中觸發，不再需要獨立檔案。

- **`views/` (核心重構區域)**:
  - `warehousing-dashboard-view.tsx`: **保留**。職責清晰，命名符合規範。
  - `warehousing-view.tsx`: **徹底重構**。移除所有舊的邏輯，只作為一個乾淨的容器，負責匯入和佈局 `views/` 目錄下的各個視圖元件（如 `WarehousingDashboardView`, `StockLevelsView` 等），成為一個純粹的頁面級別的視圖元件。
  - **`category-list-view.tsx` (新檔案)**: 將 `category-list-client.tsx` 和 `category-list.tsx` 的邏輯合併並重命名為此，使其成為一個完整的「分類列表視圖」。
  - **`item-list-view.tsx` (新檔案)**: 將 `item-list-client.tsx` 和 `item-list.tsx` 的邏輯合併並重命名，成為「物料主檔視圖」。
  - **`movement-list-view.tsx` (新檔案)**: 將 `movement-list-client.tsx` 和 `movement-list.tsx` 合併重命名，成為「出入庫歷史視圖」。
  - **`warehouse-list-view.tsx` (新檔案)**: 將 `warehouse-list-client.tsx` 和 `warehouse-list.tsx` 合併重命名，成為「倉庫管理視圖」。
  - **`stock-levels-view.tsx` (從 `components/` 目錄移動至此)**: `stock-levels-view.tsx` 作為一個大型、核心的功能區塊，其職責更符合「視圖 (View)」的定義，而非一個可重用的小型「元件 (Component)」。將其移至 `views/` 目錄能更好地反映其在架構中的層次。

- **`tables/`**:
  - `stock-level-table.tsx`: **保留**。這是一個複雜的表格元件，職責明確，命名符合規範。

- **`utils/`**:
  - `data-mappers.ts`: **保留**。職責清晰，命名符合規範。

#### **4. 待刪除檔案清單**

重構完成後，以下檔案將被安全刪除，以保持結構的整潔：

- `src/features/resource-management/warehousing/components/category-list-client.tsx`
- `src/features/resource-management/warehousing/components/category-list.tsx`
- `src/features/resource-management/warehousing/components/item-list-client.tsx`
- `src/features/resource-management/warehousing/components/item-list.tsx`
- `src/features/resource-management/warehousing/components/movement-list-client.tsx`
- `src/features/resource-management/warehousing/components/movement-list.tsx`
- `src/features/resource-management/warehousing/components/warehouse-list-client.tsx`
- `src/features/resource-management/warehousing/components/warehouse-list.tsx`
- `src/features/resource-management/warehousing/forms/movement-form.tsx`
- `src/features/resource-management/warehousing/forms/transfer-form.tsx`

---

### **後續開發藍圖 (基於新架構)**

在完成上述結構重構後，我們將在此清晰的架構上，實施「作業指揮中心」的功能。

1.  **情境化操作**:
    - 在 `stock-levels-view.tsx` 和 `item-list-view.tsx` 中，為每一行數據增加操作按鈕（例如 "出庫"、"盤點"）。
    - 點擊按鈕時，觸發對應的表單對話框 (`movement-form` 等)，並**預先填入**物料和倉庫資訊，簡化使用者操作。

2.  **借還追蹤儀表板**:
    - 新增一個 `loan-tracking-view.tsx` 視圖。
    - 此視圖將專門查詢並展示所有**尚未歸還**的資產借出紀錄。
    - 使用顏色標示（正常、即將到期、已逾期）來提供視覺警示。
    - 提供「一鍵歸還」功能，以簡化歸還流程。

3.  **資產完整履歷**:
    - 新增一個 `item-details-view.tsx` 視圖。
    - 當使用者點擊任何物料時，此視圖將聚合 `inventory_items`, `inventory_levels`, `inventory_movements` 和 `serial_number_tracking` 的所有相關數據，提供一個 360 度的資產全生命週期視圖。

這份經過更新的計畫書，為我們接下來的工作提供了清晰、標準化的指導。
