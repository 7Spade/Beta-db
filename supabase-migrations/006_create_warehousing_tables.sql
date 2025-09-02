-- 迁移档案: 006_create_warehousing_tables.sql
-- 功能: 建立所有与仓储管理相关的资料表

-- 仓库/据点表
CREATE TABLE IF NOT EXISTS public.warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.warehouses IS '储存所有仓库或工地的实体据点';
COMMENT ON COLUMN public.warehouses.name IS '仓库的唯一名称';
COMMENT ON COLUMN public.warehouses.is_active IS '标记此仓库是否仍在运作中';

-- 物料主档表 (物料目录)
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    unit TEXT,
    safe_stock_level NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.inventory_items IS '物料的主档目录，不包含库存数量信息';
COMMENT ON COLUMN public.inventory_items.name IS '物料/工具的名称';
COMMENT ON COLUMN public.inventory_items.safe_stock_level IS '安全库存水位';

-- 库存水平表 (核心)
CREATE TABLE IF NOT EXISTS public.inventory_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
    quantity NUMERIC NOT NULL DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(item_id, warehouse_id)
);

COMMENT ON TABLE public.inventory_levels IS '代表一个物料在一个仓库的即时库存量';
COMMENT ON COLUMN public.inventory_levels.quantity IS '当前的实际库存数量';

-- 库存移动纪录表 (流水帐)
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE RESTRICT,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    type TEXT NOT NULL CHECK (type IN ('inbound', 'outbound', 'adjust')),
    quantity NUMERIC NOT NULL,
    unit_price NUMERIC,
    project_id TEXT, -- Can be linked to projects later
    notes TEXT,
    operator_id TEXT, -- Can be linked to users later
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.inventory_movements IS '记录每一次库存变动的流水帐';
COMMENT ON COLUMN public.inventory_movements.type IS '变动类型: inbound, outbound, adjust';
COMMENT ON COLUMN public.inventory_movements.quantity IS '变动的数量 (正数)';
