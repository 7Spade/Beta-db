
# 「倉儲管理」系統 - 設計藍圖 v2.1

本文件根據使用者反饋進行了重大更新，旨在設計一個能滿足**多倉庫、跨地區**營運需求的現代化倉儲管理系統，特別適用於追蹤工具和耗材。v2.1 版本特別強化了對「跨倉調撥」流程的支援。

## 1. 核心目標 (Core Objectives)

此系統旨在解決傳統營造業在工具、耗材管理上的核心痛點：
- **多據點管理**: 集中管理分散在台灣各地的多個倉庫或工地的庫存。
- **物料中心化**: 建立一個統一的物料主檔（目錄），清晰定義所有可用的工具和耗材。
- **即時庫存追蹤**: 實現物料在**特定倉庫**的即時出庫、入庫追蹤，確保數據準確性。
- **處理跨倉調撥**: 清晰地記錄物料從 A 倉庫取出，歸還至 B 倉庫的場景，並保留完整的追蹤軌跡。
- **成本歸屬**: 將物料消耗與特定專案掛鉤，為精準的成本分析提供數據支持。
- **供應鏈優化**: 提供各倉庫的低庫存警示，協助採購決策。

## 2. 功能規劃 (Feature Breakdown)

- **倉庫管理**:
  - 建立、編輯、停用不同的倉庫據點（例如：台北內湖倉、台中南屯倉、A專案工地倉）。
- **物料主檔管理 (`Inventory Items`)**:
  - 維護一個全公司統一的「物料目錄」，定義所有可用的工具與耗材。
  - 每個物料包含：名稱、規格、類別（如：手工具、安全護具、五金耗材）、預設供應商等。
- **庫存水平檢視**:
  - **核心功能**: 能夠**按倉庫**篩選，查看特定倉庫中所有物料的當前庫存量。
  - 提供一個總覽視圖，可以快速切換或比較不同倉庫的庫存狀況。
- **出入庫與調撥管理**:
  - **入庫**: 記錄採購來的物料，並明確選擇要存入的**目標倉庫**。
  - **出庫**: 從**指定的倉庫**領料，並可選擇關聯到哪個專案。
  - **調撥**: **核心功能**。記錄物料從一個倉庫轉移到另一個倉庫的完整過程。
- **庫存報告**:
  - 產生特定倉庫在特定時間範圍內的出入庫明細。
  - 篩選出所有倉庫中，庫存低於安全水位的物料列表。

## 3. 資料庫設計 (Database Design)

為實現多倉庫管理與成本效益，我們將採用一個**混合數據庫策略**。核心主檔和需要即時同步前端的數據存放在 Firestore，而高頻寫入的流水帳則存放在 MongoDB。

### Firestore 集合

#### 集合 1: `warehouses`
此集合定義了所有實體的倉庫或庫存地點。

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:
| 欄位         | 類型     | 描述                                |
|--------------|----------|-------------------------------------|
| `name`       | `string` | 倉庫的唯一名稱（如：台北內湖倉）。|
| `location`   | `string` | (可選) 倉庫的地址或區域描述。       |
| `managerId`  | `string` | (可選) 關聯到 `users` 的倉庫管理員 ID。 |
| `isActive`   | `boolean`| 標記此倉庫是否仍在運作中。        |

#### 集合 2: `inventory_items`
此集合是物料的**主檔目錄**。**它本身不包含任何庫存數量信息。**

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:
| 欄位             | 類型          | 描述                                       |
|------------------|---------------|--------------------------------------------|
| `name`           | `string`      | 物料/工具的名稱（如：S腰帶防墜器）。     |
| `sku`            | `string`      | (可選) 唯一的物料單位識別碼。              |
| `category`       | `string`      | 物料分類（如：安全護具、五金耗材）。     |
| `unit`           | `string`      | 計量單位（如：個、組、箱）。               |
| `safeStockLevel` | `number`      | 全公司範圍的建議安全庫存總量。           |
| `supplierId`     | `string`      | (可選) 預設供應商，關聯到 `partners` 集合。|

#### 集合 3: `inventory_levels`
**核心庫存集合**。此集合的每一份文件代表「一個特定物料在一個特定倉庫的庫存數量」。

- **文件 ID**: 建議使用組合 ID `"{itemId}_{warehouseId}"` 以確保唯一性。
- **文件結構**:
| 欄位         | 類型     | 描述                                  |
|--------------|----------|---------------------------------------|
| `itemId`     | `string` | **[關聯]** 對應 `inventory_items` 的 ID。 |
| `warehouseId`| `string` | **[關聯]** 對應 `warehouses` 的 ID。       |
| `quantity`   | `number` | **核心欄位**。當前的實際庫存數量。  |
| `lastUpdated`| `Timestamp`| 最後一次庫存變動的時間。            |

---

### MongoDB 集合

#### 集合 4: `inventory_movements`
此集合作為不可變的流水帳，記錄每一次庫存的變動歷史。**由於其高頻寫入的特性，此集合應儲存在 MongoDB 中以優化成本和性能。**

- **文件 ID**: 自動生成的唯一 ID (`string`)
- **文件結構**:
| 欄位         | 類型                                    | 描述                                                       |
|--------------|-----------------------------------------|------------------------------------------------------------|
| `itemId`     | `string`                                | **[關聯]** 對應 `inventory_items` 的 ID。              |
| `type`       | `string` ('inbound', 'outbound', 'transfer-out', 'transfer-in', 'adjust') | **核心**。變動類型，新增了對調撥的支援。|
| `quantity`   | `number`                                | 變動的數量（出庫/調出為負，入庫/調入為正）。                     |
| `fromWarehouseId` | `string`                           | (可選) **[調撥專用]** 來源倉庫 ID。                          |
| `toWarehouseId` | `string`                             | (可選) **[調撥專用]** 目標倉庫 ID。                          |
| `transferId` | `string`                                | (可選) **[調撥專用]** 唯一標識一次調撥操作的 ID，用於將 `transfer-out` 和 `transfer-in` 兩筆紀錄關聯起來。|
| `unitPrice`  | `number`                                | (可選) 本次變動的單價，用於成本計算。                    |
| `timestamp`  | `Timestamp`                             | 變動發生的時間。                                           |
| `operatorId` | `string`                                | **[關聯]** 執行此操作的使用者 `users` ID。            |
| `projectId`  | `string`                                | (可選) 如果是出庫，關聯到的 `projects` 文件 ID。 |
| `notes`      | `string`                                | (可選) 備註，如採購單號、領料人等。                        |

**自動化邏輯**: 每次向 MongoDB 的 `inventory_movements` 新增一筆紀錄時，應透過後端邏輯（如 Firebase Functions Trigger 或在同一個 Server Action 中）來自動更新 Firestore 中 `inventory_levels` 中對應文件的 `quantity`，確保數據的一致性。對於一次「調撥」操作，前端應觸發一個後端 Action，該 Action 會原子性地寫入兩筆 `inventory_movements` 紀錄（一筆 transfer-out，一筆 transfer-in）並更新兩個倉庫的 `inventory_levels`。

## 4. 前端架構與路由 (Frontend Architecture)

### 結構樹 (Structure Tree)
`\'\'\'
src/
├── app/
│   └── (dashboard)/
│       └── warehousing/              <-- 新路由 (原 inventory)
│           ├── items/                    # 物料主檔管理
│           │   └── page.tsx
│           ├── movements/                # 出入庫歷史
│           │   └── page.tsx
│           ├── warehouses/               # 倉庫管理
│           │   └── page.tsx
│           ├── transfers/                # 調撥專用頁面
│           │   └── page.tsx
│           └── page.tsx                  # 倉儲儀表板 (可按倉庫篩選)
├── features/
│   └── warehousing/                <-- 新目錄 (原 inventory)
│       ├── actions/
│       │   └── warehousing-actions.ts
│       ├── components/
│       │   ├── low-stock-alert.tsx
│       │   └── warehouse-selector.tsx  # 重要的倉庫選擇器元件
│       ├── forms/
│       │   ├── item-form.tsx         # 物料主檔表單
│       │   ├── movement-form.tsx     # 出入庫表單
│       │   ├── transfer-form.tsx     # 調撥表單
│       │   └── warehouse-form.tsx    # 倉庫表單
│       ├── tables/
│       │   └── stock-level-table.tsx   # 顯示特定倉庫庫存水平的表格
│       └── views/
│           └── warehousing-dashboard-view.tsx
└── config/
    └── navigation.config.ts              <-- 修改「庫存管理」為「倉儲管理」
`\'\'\'
