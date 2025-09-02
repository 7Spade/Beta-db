-- 檔案: supabase-migrations/006_create_warehousing_tables.sql
-- 描述: 建立倉儲管理系統所需的所有核心資料表

-- 資料表 1: `warehouses` (倉庫)
-- 儲存所有實體的倉庫或庫存地點。
CREATE TABLE IF NOT EXISTS public.warehouses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  location text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 資料表 2: `inventory_categories` (物料類別)
-- 儲存物料的分類，用於組織和篩選。
CREATE TABLE IF NOT EXISTS public.inventory_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- 資料表 3: `inventory_items` (物料主檔)
-- 儲存所有物料的基礎資訊。
-- v3.1: 新增 item_type 和多個管理屬性欄位
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  unit text,
  safe_stock_level integer,
  
  -- 核心身份: 決定了物料最基本的库存和财务逻辑
  item_type text NOT NULL CHECK (item_type IN ('asset', 'consumable')), -- 'asset' (資產/工具), 'consumable' (消耗品)
  
  -- 管理屬性: 觸發特殊的管理流程
  has_expiry_tracking BOOLEAN DEFAULT FALSE,  -- 需要效期管理
  requires_maintenance BOOLEAN DEFAULT FALSE, -- 需要定期維護
  requires_inspection BOOLEAN DEFAULT FALSE, -- 需要定期檢驗
  is_serialized BOOLEAN DEFAULT FALSE,       -- 需要序號管理

  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_category
    FOREIGN KEY(category) 
    REFERENCES inventory_categories(name)
    ON DELETE SET NULL -- 如果類別被刪除，物料的類別欄位設為 NULL
);

-- 資料表 4: `inventory_levels` (庫存水平)
-- 每一行代表「一個物料在一個倉庫的庫存量」。
CREATE TABLE IF NOT EXISTS public.inventory_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  warehouse_id uuid NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  UNIQUE (item_id, warehouse_id)
);

-- 資料表 5: `inventory_movements` (庫存移動紀錄)
-- 作為不可變的流水帳，記錄每一次庫存的變動歷史。
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE RESTRICT, -- 不允許刪除有移動紀錄的物料
  warehouse_id uuid NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT, -- 不允許刪除有移動紀錄的倉庫
  type text NOT NULL CHECK (type IN ('inbound', 'outbound', 'adjust')),
  quantity integer NOT NULL,
  unit_price numeric,
  project_id text, -- 關聯到 Firestore 的 projects ID
  notes text,
  operator_id text, -- 關聯到 Firestore 的 users ID
  timestamp timestamptz DEFAULT now()
);
