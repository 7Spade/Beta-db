-- 啟用 pgcrypto 擴展（如果尚未啟用），用於 gen_random_uuid()
create extension if not exists "pgcrypto" with schema "public";

-- 刪除舊的表格（如果存在），以便重新建立
drop table if exists public.ai_token_logs;

-- 建立新的、更詳細的 ai_token_logs 表格
create table public.ai_token_logs (
    id uuid not null default gen_random_uuid(),
    timestamp timestamptz not null default now(),
    flow_name text not null,
    model text,
    status text not null,
    input_tokens integer,
    output_tokens integer,
    total_tokens integer,
    duration_ms integer,
    user_id uuid null,
    error text null,

    constraint ai_token_logs_pkey primary key (id)
    -- 注意：user_id 使用 Firebase UID，不與 Supabase auth.users 建立外鍵約束
    -- constraint ai_token_logs_user_id_fkey foreign key (user_id) references auth.users (id) on delete set null
);

-- 為常用查詢欄位添加索引
create index if not exists idx_ai_token_logs_timestamp on public.ai_token_logs using btree (timestamp desc);
create index if not exists idx_ai_token_logs_flow_name on public.ai_token_logs using hash (flow_name);
create index if not exists idx_ai_token_logs_status on public.ai_token_logs using hash (status);
create index if not exists idx_ai_token_logs_user_id on public.ai_token_logs using btree (user_id);
