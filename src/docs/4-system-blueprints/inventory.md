# 庫存系統 - 設計藍圖

本文件詳細闡述了 Beta-db 整合平台中「庫存管理」功能的系統設計、資料庫結構和未來開發的技術藍圖。

## 1. 核心目標 (Core Objectives)

精準的庫存管理是控制營造成本和確保專案順利進行的關鍵。本系統旨在：
- **物料中心化**: 建立一個統一的物料主檔，記錄所有專案可能用到的材料、設備和工具。
- **即時追蹤**: 實現物料的即時出庫、入庫追蹤，確保庫存數據的準確性。
- **成本控制**: 透過追蹤物料消耗，為專案成本分析提供精準數據。
- **供應鏈優化**: 提供低庫存警示，協助採購決策，避免因材料短缺導致的工期延誤。

## 2. 功能規劃 (Feature Breakdown)

- **物料主檔管理 (`Inventory Items`)**:
  - 建立和維護一個包含所有物料的資料庫。
  - 每個物料包含：名稱、規格、類別（如：建材、工具）、供應商、單價、安全庫存量等資訊。
- **庫存儀表板**:
  - 顯示關鍵庫存指標：總庫存價值、低庫存項目數量、近期出入庫動態。
  - 以圖表形式展示各類別物料的庫存佔比。
- **出入庫管理**:
  - **入庫**: 記錄採購來的物料，增加庫存數量。
  - **出庫**: 記錄專案領料，扣減庫存數量，並可關聯到特定專案的特定任務。
  - **盤點**: 定期校準實際庫存與系統庫存的差異。
- **庫存查詢與報告**:
  - 搜尋特定物料，查看其當前庫存和歷史動態。
  - 篩選低於安全庫存量的物料。
  - 產生特定時間範圍內的出入庫報告。

## 3. 資料庫設計 (Database Design)

我們將在 Firestore 中建立兩個新的頂層集合：`inventory_items` 和 `inventory_movements`。

### 集合: `inventory_items`

此集合是物料的主檔資料庫。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:

| 欄位             | 類型          | 描述                                                       |
|------------------|---------------|------------------------------------------------------------|
| `name`           | `string`      | 物料名稱（如：C30混凝土）。                                |
| `sku`            | `string`      | (可選) 唯一的物料單位識別碼。                              |
| `description`    | `string`      | (可選) 詳細描述。                                          |
| `category`       | `string`      | 物料分類（如：主材、耗材、工具）。                         |
| `unit`           | `string`      | 計量單位（如：噸、立方米、個）。                           |
| `currentStock`   | `number`      | **核心欄位**。當前的庫存數量。                             |
| `safeStockLevel` | `number`      | 安全庫存水平，低於此值時應發出警示。                       |
| `averagePrice`   | `number`      | (可選) 加權平均單價，用於成本計算。                        |
| `supplierId`     | `string`      | (可選) **[關聯]** 主要供應商，對應 `partners` 集合的文件 ID。 |
| `lastUpdated`    | `Timestamp`   | 最後一次庫存變動的時間。                                   |

### 集合: `inventory_movements`

此集合記錄每一次庫存的變動（出庫或入庫）。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:

| 欄位         | 類型                                    | 描述                                                       |
|--------------|-----------------------------------------|------------------------------------------------------------|
| `itemId`     | `string`                                | **[關聯]** 對應的 `inventory_items` 文件 ID。              |
| `type`       | `string` ('inbound', 'outbound', 'adjust') | 變動類型：入庫、出庫、盤點調整。                           |
| `quantity`   | `number`                                | 變動的數量（出庫為負數，入庫為正數）。                     |
| `unitPrice`  | `number`                                | 本次變動的單價。                                           |
| `timestamp`  | `Timestamp`                             | 變動發生的時間。                                           |
| `operatorId` | `string`                                | **[關聯]** 執行此操作的使用者 `users` 文件 ID。            |
| `projectId`  | `string`                                | (可選) **[關聯]** 如果是出庫，關聯到的 `projects` 文件 ID。 |
| `taskId`     | `string`                                | (可選) 如果是出庫，關聯到的專案任務 ID。                   |
| `notes`      | `string`                                | (可選) 備註，如採購單號、領料人等。                        |

**注意**: `inventory_items` 中的 `currentStock` 將通過 Firebase Functions 的觸發器或後端邏輯，根據 `inventory_movements` 的新增來自動更新，以確保數據一致性。

## 4. 前端架構與路由 (Frontend Architecture)

- **新導航項目**:
  - 在側邊欄新增「庫存管理」主選單。
- **新頁面路由**:
  - `/app/(dashboard)/inventory`: 庫存儀表板。
  - `/app/(dashboard)/inventory/items`: 物料主檔列表頁。
  - `/app/(dashboard)/inventory/movements`: 出入庫歷史記錄頁。
- **新元件目錄**: `src/components/features/inventory/`
  - `views/inventory-dashboard-view.tsx`: 儀表板主視圖。
  - `tables/items-table.tsx`: 物料列表格。
  - `forms/movement-form.tsx`: 新增出/入庫紀錄的表單。

## 5. 整合點 (Integration Points)

- **專案管理**: 在專案的物料清單 (BoM) 中，可以直接關聯到庫存系統的物料。
- **工地日報**: 在填寫日報的「物料消耗」部分時，可以從庫存中選擇物料，並自動觸發一次「出庫」記錄。
- **合作夥伴**: 物料可以關聯到 `partners` 集合中的供應商。

### 結構樹 (Structure Tree)
```
src/
├── app/
│   └── (dashboard)/
│       └── inventory/                    <-- 新路由
│           ├── items/
│           │   └── page.tsx
│           ├── movements/
│           │   └── page.tsx
│           └── page.tsx                  # 庫存儀表板
├── components/
│   └── features/
│       └── inventory/                    <-- 新目錄
│           ├── actions/
│           │   └── inventory-actions.ts
│           ├── components/
│           │   └── low-stock-alert.tsx
│           ├── forms/
│           │   ├── item-form.tsx
│           │   └── movement-form.tsx
│           ├── tables/
│           │   ├── items-table.tsx
│           │   └── movements-table.tsx
│           ├── types/
│           │   └── inventory-types.ts
│           └── views/
│               └── inventory-dashboard-view.tsx
└── config/
    └── navigation.config.ts              <-- 新增「庫存管理」導航項目

```