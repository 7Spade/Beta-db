-- 檔案: 005_create_user_logs.sql
-- 目的: 建立用於記錄使用者關鍵事件的日誌表。

CREATE TABLE IF NOT EXISTS user_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'REGISTERED', 'APPROVED', 'REJECTED'
    user_id TEXT NOT NULL,
    role_change TEXT, -- 'Admin', 'Member'
    status_change TEXT, -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN user_logs.event_type IS '記錄的事件類型';
COMMENT ON COLUMN user_logs.user_id IS '關聯的 Firestore users 集合文件 ID';
COMMENT ON COLUMN user_logs.role_change IS '使用者角色的變化';
COMMENT ON COLUMN user_logs.status_change IS '使用者狀態的變化';
COMMENT ON COLUMN user_logs.created_at IS '日誌記錄的建立時間';

-- 建立索引以優化查詢性能
CREATE INDEX IF NOT EXISTS idx_user_logs_event_type ON user_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_user_logs_created_at ON user_logs(created_at);
