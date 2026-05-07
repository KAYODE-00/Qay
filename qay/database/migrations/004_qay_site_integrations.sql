CREATE TABLE IF NOT EXISTS qay_site_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES qay_sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qay_site_api_keys_site
  ON qay_site_api_keys(site_id);

ALTER TABLE qay_site_api_keys ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS qay_site_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES qay_sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT,
  events JSONB NOT NULL DEFAULT '[]'::jsonb,
  filters JSONB,
  enabled BOOLEAN NOT NULL DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  failure_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qay_site_webhooks_site
  ON qay_site_webhooks(site_id);

ALTER TABLE qay_site_webhooks ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS qay_site_app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES qay_sites(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT 'null'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(site_id, app_id, key)
);

CREATE INDEX IF NOT EXISTS idx_qay_site_app_settings_site
  ON qay_site_app_settings(site_id);

CREATE INDEX IF NOT EXISTS idx_qay_site_app_settings_site_app
  ON qay_site_app_settings(site_id, app_id);

ALTER TABLE qay_site_app_settings ENABLE ROW LEVEL SECURITY;
