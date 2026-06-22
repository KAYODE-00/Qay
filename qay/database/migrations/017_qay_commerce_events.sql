CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS qay_commerce_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'medusa',
  event_key TEXT NOT NULL,
  event_name TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  received_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ,
  UNIQUE(source, event_key)
);

CREATE INDEX IF NOT EXISTS idx_qay_commerce_events_name
  ON qay_commerce_events(source, event_name, received_at DESC);

CREATE INDEX IF NOT EXISTS idx_qay_commerce_events_status
  ON qay_commerce_events(status, received_at DESC);

ALTER TABLE qay_commerce_events ENABLE ROW LEVEL SECURITY;

-- Server routes write with the service role.
