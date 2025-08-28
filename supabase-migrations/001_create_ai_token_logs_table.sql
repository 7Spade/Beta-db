-- 极简化的 AI Token 日志表
CREATE TABLE IF NOT EXISTS public.ai_token_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    flow_name TEXT NOT NULL,
    total_tokens INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('succeeded', 'failed')),
    user_id TEXT,
    error TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 启用 RLS 并创建简单策略
ALTER TABLE public.ai_token_logs ENABLE ROW LEVEL SECURITY;

-- 允许所有认证用户访问（简化策略）
CREATE POLICY "Allow authenticated access" ON public.ai_token_logs
    FOR ALL USING (auth.role() = 'authenticated');

-- 授予权限
GRANT ALL ON public.ai_token_logs TO authenticated;
GRANT ALL ON public.ai_token_logs TO service_role;
