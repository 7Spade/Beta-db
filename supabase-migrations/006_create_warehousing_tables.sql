-- 檔案: supabase-migrations/006_create_warehousing_tables.sql
-- 描述: 建立倉儲管理系統所需的核心資料表

-- 啟用 pgcrypto 擴充套件以使用 uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. 倉庫資料表 (warehouses)
-- 儲存所有實體的倉庫或庫存地點。
CREATE TABLE IF NOT EXISTS public.warehouses (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    location text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

COMMENT ON TABLE public.warehouses IS 'Stores physical warehouse or stock locations.';
COMMENT ON COLUMN public.warehouses.name IS 'The unique name of the warehouse.';

-- 2. 物料類別資料表 (inventory_categories)
-- 儲存所有物料的分類。
CREATE TABLE IF NOT EXISTS public.inventory_categories (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now()
);
COMMENT ON TABLE public.inventory_categories IS 'Stores categories for inventory items.';

-- 3. 物料主檔資料表 (inventory_items)
-- 物料的目錄，定義了所有物料的基礎資訊。
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    category text,
    unit text,
    safe_stock_level integer,
    created_at timestamp with time zone DEFAULT now()
);

COMMENT ON TABLE public.inventory_items IS 'Master catalog of all inventory items.';
COMMENT ON COLUMN public.inventory_items.category IS 'The category of the item.';

-- 4. 庫存水平資料表 (inventory_levels)
-- 核心庫存資料表，代表一個物料在一個倉庫的庫存量。
CREATE TABLE IF NOT EXISTS public.inventory_levels (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    warehouse_id uuid NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
    quantity integer NOT NULL DEFAULT 0,
    last_updated timestamp with time zone DEFAULT now(),
    UNIQUE (item_id, warehouse_id)
);

CREATE INDEX IF NOT EXISTS idx_inventory_levels_item_id ON public.inventory_levels(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_levels_warehouse_id ON public.inventory_levels(warehouse_id);
COMMENT ON TABLE public.inventory_levels IS 'Tracks the quantity of each item in each warehouse.';

-- 5. 庫存移動紀錄資料表 (inventory_movements)
-- 作為不可變的流水帳，記錄每一次庫存的變動歷史。
CREATE TYPE public.movement_type AS ENUM ('inbound', 'outbound', 'adjust');
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE RESTRICT,
    warehouse_id uuid NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    type public.movement_type NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric,
    project_id text,
    notes text,
    operator_id text,
    timestamp timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_item_id ON public.inventory_movements(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_warehouse_id ON public.inventory_movements(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_timestamp ON public.inventory_movements(timestamp);
COMMENT ON TABLE public.inventory_movements IS 'Immutable log of all inventory transactions.';
