-- 超极简：AI Token 日志表
-- 避免所有类型问题，最简单的配置

-- 删除表（如果存在）
DROP TABLE IF EXISTS public.ai_token_logs;

-- 创建最简单的表结构
CREATE TABLE public.ai_token_logs (
    id TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
    flow_name TEXT NOT NULL,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'succeeded',
    user_id TEXT,
    error TEXT,
    timestamp TEXT DEFAULT now()::text
);

-- 创建基本索引
CREATE INDEX idx_ai_token_logs_timestamp ON public.ai_token_logs(timestamp DESC);

-- 禁用 RLS（最简单的方式）
ALTER TABLE public.ai_token_logs DISABLE ROW LEVEL SECURITY;

-- 授予所有权限
GRANT ALL ON public.ai_token_logs TO authenticated;
GRANT ALL ON public.ai_token_logs TO anon;
GRANT ALL ON public.ai_token_logs TO service_role;
