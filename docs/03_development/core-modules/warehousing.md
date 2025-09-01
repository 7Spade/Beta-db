# 倉儲管理功能檔案清單 (Warehousing Feature Files List)

本文件列出了 Beta-db 整合平台中所有與「倉儲管理」功能相關的檔案，此功能取代了舊的「庫存管理」系統。

## 📁 目錄結構

### 1. 核心功能元件 (Core Feature Components)
```
src/features/resource-management/warehousing/
├── README.md                           # 倉儲管理模組概述
├── actions/
│   └── warehousing-actions.ts          # 所有與倉庫、物料、庫存相關的 Server Actions
├── components/
│   └── warehouse-selector.tsx        # 可重用的倉庫選擇器元件
├── forms/
│   ├── warehouse-form.tsx            # 新增/編輯倉庫的對話方塊表單
│   ├── item-form.tsx                 # (規劃中) 物料主檔表單
│   ├── movement-form.tsx             # (規劃中) 出入庫表單
│   └── transfer-form.tsx             # (規劃中) 跨倉調撥表單
├── tables/
│   └── stock-level-table.tsx         # (規劃中) 顯示庫存水平的表格
└── views/
    ├── warehousing-dashboard-view.tsx  # 倉儲儀表板主視圖
    └── warehouses-view.tsx           # 倉庫列表與管理介面
```

### 2. 頁面入口 (Page Entries)
```
src/app/(dashboard)/resource-management/warehousing/
├── page.tsx                          # 倉儲儀表板頁面
├── warehouses/
│   └── page.tsx                      # 倉庫管理頁面
├── items/
│   └── page.tsx                      # 物料主檔管理頁面
├── movements/
│   └── page.tsx                      # 出入庫歷史紀錄頁面
└── transfers/
    └── page.tsx                      # 跨倉調撥頁面
```

### 3. 相關資料庫集合 (Related Collections)
- **`warehouses`**: 在 `docs/04_project_management/inventory.md` 中定義，儲存所有倉庫據點。
- **`inventory_items`**: (規劃中) 儲存所有物料的主檔資料。
- **`inventory_levels`**: (規劃中) 儲存特定物料在特定倉庫的庫存量。
- **`inventory_movements` (MongoDB)**: (規劃中) 記錄所有庫存變動的流水帳。

## 🔧 技術架構

- **前端框架**: Next.js (App Router)
- **資料庫**:
  - **Firestore**: 用於管理 `warehouses` 等核心主檔資料。
  - **MongoDB**: (規劃中) 用於處理高頻寫入的 `inventory_movements` 流水帳。
- **資料操作**: Server Actions (`warehousing-actions.ts`)。
- **UI 元件**: shadcn/ui

## 📊 核心功能 (已實作/規劃中)

1.  **儀表板 (`warehousing-dashboard-view.tsx`)**:
    - 提供一個進入倉儲管理所有子功能的中心入口。
    - 顯示關鍵的統計數據，如倉庫總數、啟用中的據點數量。

2.  **倉庫管理 (`warehouses-view.tsx`)**:
    - **[已實作]** 以列表形式顯示所有倉庫據點。
    - **[已實作]** 提供「新增倉庫」功能，透過 `WarehouseFormDialog` 彈出表單來輸入資訊。
    - **[已實作]** 允許編輯和刪除現有的倉庫。

3.  **物料主檔 (`items/page.tsx`)**:
    - (規劃中) 管理全公司統一的物料目錄。

4.  **庫存追蹤 (`movements/page.tsx` & `transfers/page.tsx`)**:
    - (規劃中) 記錄物料的出入庫和跨倉調撥。

## 📚 相關文件

- [倉儲管理系統藍圖](../../04_project_management/inventory.md)
- [導航配置](../../../components/layout/config/navigation.config.ts) (`resource-management` -> `warehousing`)
