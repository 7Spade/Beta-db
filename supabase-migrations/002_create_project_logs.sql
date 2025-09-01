-- 檔案: 002_create_project_logs.sql
-- 目的: 建立用於記錄專案關鍵事件的日誌表，以供儀表板快速查詢。

CREATE TABLE IF NOT EXISTS project_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'CREATED', 'COMPLETED', 'VALUE_UPDATED', 'STATUS_CHANGED'
    project_id TEXT NOT NULL,
    value_change INT DEFAULT 0, -- 專案價值的變化量 (+/-)
    status_change TEXT, -- 'IN_PROGRESS', 'COMPLETED', etc.
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN project_logs.event_type IS '記錄的事件類型';
COMMENT ON COLUMN project_logs.project_id IS '關聯的 Firestore projects 集合文件 ID';
COMMENT ON COLUMN project_logs.value_change IS '專案總價值的變化，用於統計總價值';
COMMENT ON COLUMN project_logs.status_change IS '專案狀態的變化';
COMMENT ON COLUMN project_logs.created_at IS '日誌記錄的建立時間';

-- 為了快速查詢，在常用欄位上建立索引
CREATE INDEX IF NOT EXISTS idx_project_logs_event_type ON project_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_project_logs_created_at ON project_logs(created_at);
