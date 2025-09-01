-- 檔案: 004_create_partner_logs.sql
-- 目的: 建立用於記錄合作夥伴關鍵事件的日誌表。

CREATE TABLE IF NOT EXISTS partner_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'CREATED', 'APPROVED', 'STATUS_CHANGED'
    partner_id TEXT NOT NULL,
    status_change TEXT, -- '啟用中', '停用中', '待審核'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN partner_logs.event_type IS '記錄的事件類型';
COMMENT ON COLUMN partner_logs.partner_id IS '關聯的 Firestore partners 集合文件 ID';
COMMENT ON COLUMN partner_logs.status_change IS '合作夥伴狀態的變化';
COMMENT ON COLUMN partner_logs.created_at IS '日誌記錄的建立時間';

-- 建立索引以優化查詢性能
CREATE INDEX IF NOT EXISTS idx_partner_logs_event_type ON partner_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_partner_logs_created_at ON partner_logs(created_at);
