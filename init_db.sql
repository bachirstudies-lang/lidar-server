CREATE TABLE IF NOT EXISTS lidar_scans (
  id SERIAL PRIMARY KEY,
  device_id TEXT NOT NULL,
  scan_id BIGINT,
  ts TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB,
  points JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_device_ts ON lidar_scans(device_id, ts DESC);
