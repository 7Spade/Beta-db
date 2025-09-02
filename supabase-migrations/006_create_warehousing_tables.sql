-- 仓库表 (Warehouses) - 極簡租約管理
-- 定义所有实体的仓库或库位，直接在表中存储租约信息
CREATE TABLE IF NOT EXISTS public.warehouses (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    location text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    -- 極簡租約信息
    lease_end_date timestamptz,
    monthly_rent numeric,
    lessor_name text
);
COMMENT ON TABLE public.warehouses IS '仓库或库位的主档资料，包含极简租约信息。';
COMMENT ON COLUMN public.warehouses.lease_end_date IS '租约到期日期';
COMMENT ON COLUMN public.warehouses.monthly_rent IS '月租金';
COMMENT ON COLUMN public.warehouses.lessor_name IS '出租方名称';


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
    type text NOT NULL CHECK (type IN ('inbound', 'outbound', 'adjust', 'transfer')),
    quantity integer NOT NULL,
    unit_price numeric,
    project_id text,
    notes text,
    operator_id text,
    operator_name text, -- 操作員姓名
    timestamp timestamptz DEFAULT now(),
    -- 新增：更詳細的追蹤信息
    recipient_name text, -- 領取人姓名
    recipient_department text, -- 領取部門
    expected_return_date timestamptz, -- 預期歸還日期
    actual_return_date timestamptz, -- 實際歸還日期
    status text DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue', 'lost')), -- 狀態
    serial_numbers text[], -- 序號列表（用於序列化物料）
    purpose text, -- 用途說明
    approval_required boolean DEFAULT false, -- 是否需要審批
    approved_by text, -- 審批人
    approved_at timestamptz -- 審批時間
);
COMMENT ON TABLE public.inventory_movements IS '所有库存变动的不可变流水帐记录，包含详细的追踪信息。';
CREATE INDEX IF NOT EXISTS idx_inventory_movements_item_id ON public.inventory_movements(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_warehouse_id ON public.inventory_movements(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_operator_id ON public.inventory_movements(operator_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_recipient_name ON public.inventory_movements(recipient_name);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_status ON public.inventory_movements(status);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_expected_return ON public.inventory_movements(expected_return_date);

-- 物料借用記錄表 (Item Loans)
-- 專門追蹤資產/工具的借用情況
CREATE TABLE IF NOT EXISTS public.item_loans (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    movement_id uuid NOT NULL REFERENCES public.inventory_movements(id) ON DELETE CASCADE,
    item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    warehouse_id uuid NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
    borrower_name text NOT NULL, -- 借用者姓名
    borrower_department text, -- 借用者部門
    borrower_contact text, -- 借用者聯絡方式
    loan_date timestamptz DEFAULT now(), -- 借用日期
    expected_return_date timestamptz, -- 預期歸還日期
    actual_return_date timestamptz, -- 實際歸還日期
    return_condition text, -- 歸還狀況
    status text DEFAULT 'borrowed' CHECK (status IN ('borrowed', 'returned', 'overdue', 'lost', 'damaged')), -- 狀態
    notes text, -- 備註
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.item_loans IS '物料借用記錄表，專門追蹤資產/工具的借用情況。';
CREATE INDEX IF NOT EXISTS idx_item_loans_item_id ON public.item_loans(item_id);
CREATE INDEX IF NOT EXISTS idx_item_loans_borrower_name ON public.item_loans(borrower_name);
CREATE INDEX IF NOT EXISTS idx_item_loans_status ON public.item_loans(status);
CREATE INDEX IF NOT EXISTS idx_item_loans_expected_return ON public.item_loans(expected_return_date);

-- 序號追蹤表 (Serial Number Tracking)
-- 追蹤序列化物料的具體序號
CREATE TABLE IF NOT EXISTS public.serial_number_tracking (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    warehouse_id uuid NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
    serial_number text NOT NULL, -- 序號
    status text DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'out_on_loan', 'returned', 'lost', 'damaged')), -- 狀態
    current_holder text, -- 當前持有者
    current_department text, -- 當前部門
    loan_date timestamptz, -- 借出日期
    expected_return_date timestamptz, -- 預期歸還日期
    actual_return_date timestamptz, -- 實際歸還日期
    notes text, -- 備註
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (item_id, serial_number)
);
COMMENT ON TABLE public.serial_number_tracking IS '序號追蹤表，追蹤序列化物料的具體序號。';
CREATE INDEX IF NOT EXISTS idx_serial_number_tracking_item_id ON public.serial_number_tracking(item_id);
CREATE INDEX IF NOT EXISTS idx_serial_number_tracking_serial_number ON public.serial_number_tracking(serial_number);
CREATE INDEX IF NOT EXISTS idx_serial_number_tracking_status ON public.serial_number_tracking(status);
CREATE INDEX IF NOT EXISTS idx_serial_number_tracking_holder ON public.serial_number_tracking(current_holder);

-- 启用所有表的 RLS
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.serial_number_tracking ENABLE ROW LEVEL SECURITY;

-- 为所有表创建允许公共读取的策略
CREATE POLICY "Public read access" ON public.warehouses FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.inventory_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.inventory_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.inventory_levels FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.inventory_movements FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.item_loans FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.serial_number_tracking FOR SELECT USING (true);

-- 为所有表创建允许公共写入的策略（配合 Firebase Auth 使用）
CREATE POLICY "Public insert access" ON public.warehouses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON public.inventory_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON public.inventory_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON public.inventory_levels FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON public.inventory_movements FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON public.item_loans FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON public.serial_number_tracking FOR INSERT WITH CHECK (true);

-- 为所有表创建允许公共更新的策略
CREATE POLICY "Public update access" ON public.warehouses FOR UPDATE USING (true);
CREATE POLICY "Public update access" ON public.inventory_categories FOR UPDATE USING (true);
CREATE POLICY "Public update access" ON public.inventory_items FOR UPDATE USING (true);
CREATE POLICY "Public update access" ON public.inventory_levels FOR UPDATE USING (true);
CREATE POLICY "Public update access" ON public.inventory_movements FOR UPDATE USING (true);
CREATE POLICY "Public update access" ON public.item_loans FOR UPDATE USING (true);
CREATE POLICY "Public update access" ON public.serial_number_tracking FOR UPDATE USING (true);

-- 为所有表创建允许公共删除的策略
CREATE POLICY "Public delete access" ON public.warehouses FOR DELETE USING (true);
CREATE POLICY "Public delete access" ON public.inventory_categories FOR DELETE USING (true);
CREATE POLICY "Public delete access" ON public.inventory_items FOR DELETE USING (true);
CREATE POLICY "Public delete access" ON public.inventory_levels FOR DELETE USING (true);
CREATE POLICY "Public delete access" ON public.inventory_movements FOR DELETE USING (true);
CREATE POLICY "Public delete access" ON public.item_loans FOR DELETE USING (true);
CREATE POLICY "Public delete access" ON public.serial_number_tracking FOR DELETE USING (true);

-- 創建有用的視圖
-- 當前借用中的物料視圖
CREATE OR REPLACE VIEW public.current_loans AS
SELECT 
    il.id,
    il.borrower_name,
    il.borrower_department,
    il.borrower_contact,
    il.loan_date,
    il.expected_return_date,
    il.status,
    ii.name as item_name,
    ii.item_type,
    w.name as warehouse_name,
    CASE 
        WHEN il.expected_return_date < NOW() AND il.status = 'borrowed' THEN 'overdue'
        WHEN il.expected_return_date < NOW() + INTERVAL '3 days' AND il.status = 'borrowed' THEN 'due_soon'
        ELSE 'normal'
    END as urgency_status
FROM public.item_loans il
JOIN public.inventory_items ii ON il.item_id = ii.id
JOIN public.warehouses w ON il.warehouse_id = w.id
WHERE il.status IN ('borrowed', 'overdue');

-- 序號追蹤視圖
CREATE OR REPLACE VIEW public.serial_tracking_status AS
SELECT 
    snt.id,
    snt.serial_number,
    snt.status,
    snt.current_holder,
    snt.current_department,
    snt.loan_date,
    snt.expected_return_date,
    ii.name as item_name,
    w.name as warehouse_name,
    CASE 
        WHEN snt.expected_return_date < NOW() AND snt.status = 'out_on_loan' THEN 'overdue'
        WHEN snt.expected_return_date < NOW() + INTERVAL '3 days' AND snt.status = 'out_on_loan' THEN 'due_soon'
        ELSE 'normal'
    END as urgency_status
FROM public.serial_number_tracking snt
JOIN public.inventory_items ii ON snt.item_id = ii.id
JOIN public.warehouses w ON snt.warehouse_id = w.id;

-- 創建更新借用狀態的函數
CREATE OR REPLACE FUNCTION public.update_loan_status()
RETURNS void AS $$
BEGIN
    -- 更新過期的借用記錄
    UPDATE public.item_loans 
    SET status = 'overdue', updated_at = NOW()
    WHERE status = 'borrowed' 
    AND expected_return_date < NOW();
    
    -- 更新過期的序號追蹤
    UPDATE public.serial_number_tracking 
    SET status = 'overdue', updated_at = NOW()
    WHERE status = 'out_on_loan' 
    AND expected_return_date < NOW();
END;
$$ LANGUAGE plpgsql;

-- 創建自動更新借用狀態的觸發器
CREATE OR REPLACE FUNCTION public.trigger_update_loan_status()
RETURNS trigger AS $$
BEGIN
    PERFORM public.update_loan_status();
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 創建定時觸發器（每天檢查一次）
-- 注意：這需要在 Supabase 中設置 cron job
-- SELECT cron.schedule('update-loan-status', '0 9 * * *', 'SELECT public.update_loan_status();');
