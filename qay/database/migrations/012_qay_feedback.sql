CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS qay_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  message TEXT NOT NULL,
  source_path TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qay_feedback_created
  ON qay_feedback(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_qay_feedback_status
  ON qay_feedback(status, created_at DESC);

ALTER TABLE qay_feedback ENABLE ROW LEVEL SECURITY;

-- Public submissions are handled through the server API with the service role.
