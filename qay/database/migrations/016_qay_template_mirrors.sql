CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS qay_template_mirrors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'ycode',
  source_template_id TEXT NOT NULL,
  source_template_name TEXT,
  qay_site_id UUID,
  status TEXT NOT NULL DEFAULT 'pending',
  preview_url TEXT,
  last_error TEXT,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source, source_template_id)
);

CREATE INDEX IF NOT EXISTS idx_qay_template_mirrors_lookup
  ON qay_template_mirrors(source, source_template_id);

CREATE INDEX IF NOT EXISTS idx_qay_template_mirrors_status
  ON qay_template_mirrors(status, updated_at DESC);

ALTER TABLE qay_template_mirrors ENABLE ROW LEVEL SECURITY;

-- Admin/server writes are handled through service-role routes.
