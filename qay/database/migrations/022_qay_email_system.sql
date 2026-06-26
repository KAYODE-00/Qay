CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS qay_email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sent_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  body_html TEXT,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  recipients JSONB NOT NULL DEFAULT '[]',
  provider TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qay_email_logs_created
  ON qay_email_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_qay_email_logs_sent_by
  ON qay_email_logs(sent_by, created_at DESC);

ALTER TABLE qay_email_logs ENABLE ROW LEVEL SECURITY;

-- Admin reads/writes are handled through server routes with the service role.
