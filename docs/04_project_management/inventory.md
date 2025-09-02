
# 「倉儲管理」系統 - 設計藍圖 v3.0

本文件旨在設計一個能滿足**多倉庫、跨地區**營運需求的現代化倉儲管理系統，並已根據最新的技術決策更新為 **Supabase (PostgreSQL)** 架構。

## 1. 核心目標 (Core Objectives)

此系統旨在解決傳統營造業在工具、耗材管理上的核心痛點：
- **多據點管理**: 集中管理分散在各地的多個倉庫或工地的庫存。
- **物料中心化**: 建立一個統一的物料主檔（目錄），清晰定義所有可用的工具和耗材。
- **即時庫存追蹤**: 實現物料在**特定倉庫**的即時出庫、入庫追蹤，確保數據準確性。
- **處理跨倉調撥**: 清晰地記錄物料從 A 倉庫轉移到 B 倉庫的場景，並保留完整的追蹤軌跡。
- **成本歸屬**: 將物料消耗與特定專案掛鉤，為精準的成本分析提供數據支持。
- **供應鏈優化**: 提供各倉庫的低庫存警示，協助採購決策。

## 2. 資料庫設計 (Supabase / PostgreSQL)

為實現結構化數據的完整性和複雜查詢的能力，整個倉儲管理模組的資料將儲存在 Supabase (PostgreSQL) 中。

### 資料表 1: `warehouses`
此資料表定義了所有實體的倉庫或庫存地點。

| 欄位         | 類型      | 描述                                |
|--------------|-----------|-------------------------------------|
| `id`         | `uuid`    | 主鍵，自動生成。                    |
| `name`       | `text`    | 倉庫的唯一名稱（如：台北內湖倉）。|
| `location`   | `text`    | (可選) 倉庫的地址或區域描述。       |
| `is_active`  | `boolean` | 標記此倉庫是否仍在運作中，預設 `true`。 |
| `created_at` | `timestamptz` | 記錄建立時間。                  |


### 資料表 2: `inventory_items`
此資料表是物料的**主檔目錄**，定義了所有物料的基礎資訊。

| 欄位             | 類型      | 描述                                       |
|------------------|-----------|--------------------------------------------|
| `id`             | `uuid`    | 主鍵，自動生成。                           |
| `name`           | `text`    | 物料/工具的名稱（如：S腰帶防墜器）。     |
| `category`       | `text`    | (可選) 物料分類（如：安全護具）。        |
| `unit`           | `text`    | (可選) 計量單位（如：個、組、箱）。        |
| `safe_stock_level`| `integer`| (可選) 建議的安全庫存水位。            |
| `created_at`     | `timestamptz` | 記錄建立時間。                       |


### 資料表 3: `inventory_levels`
**核心庫存資料表**。每一行代表「一個特定物料在一個特定倉庫的庫存數量」。

- **複合唯一鍵**: (`item_id`, `warehouse_id`)

| 欄位          | 類型      | 描述                                      |
|---------------|-----------|-------------------------------------------|
| `id`          | `uuid`    | 主鍵，自動生成。                          |
| `item_id`     | `uuid`    | **[外鍵]** 關聯到 `inventory_items` 的 ID。 |
| `warehouse_id`| `uuid`    | **[外鍵]** 關聯到 `warehouses` 的 ID。      |
| `quantity`    | `integer` | **核心欄位**。當前的實際庫存數量。      |
| `last_updated`| `timestamptz`| 最後一次庫存變動的時間。              |


### 資料表 4: `inventory_movements`
此資料表作為不可變的流水帳，記錄每一次庫存的變動歷史。

| 欄位         | 類型      | 描述                                                       |
|--------------|-----------|------------------------------------------------------------|
| `id`         | `uuid`    | 主鍵，自動生成。                                           |
| `item_id`    | `uuid`    | **[外鍵]** 關聯到 `inventory_items` 的 ID。              |
| `warehouse_id`| `uuid`  | **[外鍵]** 關聯到 `warehouses` 的 ID。                 |
| `type`       | `text`    | 變動類型: 'inbound', 'outbound', 'adjust'。                |
| `quantity`   | `integer` | 變動的數量（出庫為負，入庫為正）。                         |
| `unit_price` | `numeric` | (可選) 本次變動的單價，用於成本計算。                    |
| `project_id` | `text`    | (可選) 如果是出庫，關聯到的 `projects` 文件 ID。        |
| `notes`      | `text`    | (可選) 備註，如採購單號、領料人等。                        |
| `operator_id`| `text`    | (可選) 執行此操作的使用者 `users` ID。                 |
| `timestamp`  | `timestamptz` | 變動發生的時間。                                       |


## 3. 前端架構與路由 (Frontend Architecture)

前端的檔案結構將保持不變，但所有與資料庫的互動，都將透過 `warehousing-actions.ts` 中使用 Supabase client 的 Server Actions 來完成。

### 結構樹 (Structure Tree)
```
src/
├── app/
│   └── (dashboard)/
│       └── warehousing/              
│           ├── items/                    # 物料主檔管理
│           │   └── page.tsx
│           ├── movements/                # 出入庫歷史
│           │   └── page.tsx
│           ├── warehouses/               # 倉庫管理
│           │   └── page.tsx
│           ├── transfers/                # 調撥專用頁面
│           │   └── page.tsx
│           └── page.tsx                  # 倉儲儀表板
├── features/
│   └── warehousing/                
│       ├── actions/
│       │   └── warehousing-actions.ts  <-- **核心修改點**: 所有邏輯改為呼叫 Supabase
│       └── ...                       # 其他表單和視圖元件
└── supabase-migrations/
    └── 006_create_warehousing_tables.sql  <-- **新增**: 資料庫 Schema 的唯一事實來源
```
