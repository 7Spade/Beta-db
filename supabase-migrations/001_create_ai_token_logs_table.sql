-- Create ai_token_logs table for logging AI token usage
CREATE TABLE IF NOT EXISTS public.ai_token_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    flow_name TEXT NOT NULL,
    total_tokens INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('succeeded', 'failed')),
    user_id TEXT,
    error TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_token_logs_timestamp ON public.ai_token_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_token_logs_user_id ON public.ai_token_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_token_logs_status ON public.ai_token_logs(status);
CREATE INDEX IF NOT EXISTS idx_ai_token_logs_flow_name ON public.ai_token_logs(flow_name);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ai_token_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read their own logs
CREATE POLICY "Users can read their own AI token logs" ON public.ai_token_logs
    FOR SELECT USING (auth.uid()::text = user_id);

-- Create policy to allow service role to insert logs (for server-side operations)
CREATE POLICY "Service role can insert AI token logs" ON public.ai_token_logs
    FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.ai_token_logs TO authenticated;
GRANT ALL ON public.ai_token_logs TO service_role;
