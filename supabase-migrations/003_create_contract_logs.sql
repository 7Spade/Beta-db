-- 檔案: 003_create_contract_logs.sql
-- 目的: 建立用於記錄合約關鍵事件的日誌表。

CREATE TABLE IF NOT EXISTS contract_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'CREATED', 'COMPLETED', 'VALUE_UPDATED', 'STATUS_CHANGED'
    contract_id TEXT NOT NULL,
    value_change INT DEFAULT 0,
    status_change TEXT, -- '啟用中', '已完成', etc.
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN contract_logs.event_type IS '記錄的事件類型';
COMMENT ON COLUMN contract_logs.contract_id IS '關聯的 Firestore contracts 集合文件 ID';
COMMENT ON COLUMN contract_logs.value_change IS '合約總價值的變化';
COMMENT ON COLUMN contract_logs.status_change IS '合約狀態的變化';
COMMENT ON COLUMN contract_logs.created_at IS '日誌記錄的建立時間';

-- 建立索引以優化查詢性能
CREATE INDEX IF NOT EXISTS idx_contract_logs_event_type ON contract_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_contract_logs_created_at ON contract_logs(created_at);
