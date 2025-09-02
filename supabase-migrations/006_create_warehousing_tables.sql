-- 仓库表 (Warehouses)
-- 定义所有实体的仓库或库位
CREATE TABLE IF NOT EXISTS public.warehouses (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    location text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);
COMMENT ON TABLE public.warehouses IS '仓库或库位的主档资料。';

-- 新增：租赁合约表 (Lease Agreements)
-- 专门用于记录仓库的租赁合约历史
CREATE TABLE IF NOT EXISTS public.lease_agreements (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    warehouse_id uuid NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
    lease_start_date timestamptz NOT NULL,
    lease_end_date timestamptz NOT NULL,
    monthly_rent numeric,
    lessor_name text,
    contract_document_url text,
    status text NOT NULL CHECK (status IN ('Active', 'Expired', 'Upcoming')),
    created_at timestamp with time zone DEFAULT now()
);
COMMENT ON TABLE public.lease_agreements IS '仓库租赁合约历史记录。';
CREATE INDEX IF NOT EXISTS idx_lease_agreements_warehouse_id ON public.lease_agreements(warehouse_id);


-- 物料分类表 (Inventory Categories)
CREATE TABLE IF NOT EXISTS public.inventory_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.inventory_categories IS '物料的分类主档。';


-- 物料主档表 (Inventory Items)
-- 定义所有物料的基础资讯
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    category text REFERENCES public.inventory_categories(name) ON DELETE SET NULL,
    unit text,
    safe_stock_level integer,
    created_at timestamp with time zone DEFAULT now(),
    -- v3.1: 核心身份与管理属性
    item_type text NOT NULL DEFAULT 'consumable'::text CHECK (item_type IN ('asset', 'consumable')),
    has_expiry_tracking boolean DEFAULT false NOT NULL,
    requires_maintenance boolean DEFAULT false NOT NULL,
    requires_inspection boolean DEFAULT false NOT NULL,
    is_serialized boolean DEFAULT false NOT NULL
);
COMMENT ON TABLE public.inventory_items IS '物料的规格主档目录。';

-- 库存档案表 (Inventory Levels)
-- 记录特定物料在特定仓库的当前库存量
CREATE TABLE IF NOT EXISTS public.inventory_levels (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    warehouse_id uuid NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
    quantity integer NOT NULL DEFAULT 0,
    last_updated timestamptz DEFAULT now(),
    UNIQUE (item_id, warehouse_id)
);
COMMENT ON TABLE public.inventory_levels IS '物料在各仓库的当前库存水平。';

-- 库存档案移动记录表 (Inventory Movements)
-- 记录每一次库存变动的历史流水帐
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE RESTRICT,
    warehouse_id uuid NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    type text NOT NULL CHECK (type IN ('inbound', 'outbound', 'adjust')),
    quantity integer NOT NULL,
    unit_price numeric,
    project_id text,
    notes text,
    operator_id text,
    timestamp timestamptz DEFAULT now()
);
COMMENT ON TABLE public.inventory_movements IS '所有库存变动的不可变流水帐记录。';
CREATE INDEX IF NOT EXISTS idx_inventory_movements_item_id ON public.inventory_movements(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_warehouse_id ON public.inventory_movements(warehouse_id);

-- 启用所有表的 RLS
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lease_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

-- 为所有表创建允许公共读取的策略
CREATE POLICY "Public read access" ON public.warehouses FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.lease_agreements FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.inventory_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.inventory_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.inventory_levels FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.inventory_movements FOR SELECT USING (true);

-- 为所有表创建允许公共写入的策略（配合 Firebase Auth 使用）
CREATE POLICY "Public insert access" ON public.warehouses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON public.lease_agreements FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON public.inventory_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON public.inventory_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON public.inventory_levels FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON public.inventory_movements FOR INSERT WITH CHECK (true);

-- 为所有表创建允许公共更新的策略
CREATE POLICY "Public update access" ON public.warehouses FOR UPDATE USING (true);
CREATE POLICY "Public update access" ON public.lease_agreements FOR UPDATE USING (true);
CREATE POLICY "Public update access" ON public.inventory_categories FOR UPDATE USING (true);
CREATE POLICY "Public update access" ON public.inventory_items FOR UPDATE USING (true);
CREATE POLICY "Public update access" ON public.inventory_levels FOR UPDATE USING (true);
CREATE POLICY "Public update access" ON public.inventory_movements FOR UPDATE USING (true);

-- 为所有表创建允许公共删除的策略
CREATE POLICY "Public delete access" ON public.warehouses FOR DELETE USING (true);
CREATE POLICY "Public delete access" ON public.lease_agreements FOR DELETE USING (true);
CREATE POLICY "Public delete access" ON public.inventory_categories FOR DELETE USING (true);
CREATE POLICY "Public delete access" ON public.inventory_items FOR DELETE USING (true);
CREATE POLICY "Public delete access" ON public.inventory_levels FOR DELETE USING (true);
CREATE POLICY "Public delete access" ON public.inventory_movements FOR DELETE USING (true);
