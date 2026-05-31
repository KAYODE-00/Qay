-- QAY per-site visitor auth
-- Isolated from QAY builder auth. Visitors are scoped to a single site_id.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS qay_site_auth_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES qay_sites(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  password_hash TEXT,
  full_name TEXT,
  provider TEXT NOT NULL DEFAULT 'password',
  external_user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_sign_in_at TIMESTAMPTZ,
  UNIQUE(site_id, email),
  UNIQUE(site_id, provider, external_user_id)
);

CREATE INDEX IF NOT EXISTS idx_qay_site_auth_users_site
  ON qay_site_auth_users(site_id, created_at DESC);

CREATE TABLE IF NOT EXISTS qay_site_auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES qay_sites(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES qay_site_auth_users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '30 days',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qay_site_auth_sessions_site_user
  ON qay_site_auth_sessions(site_id, user_id);

CREATE INDEX IF NOT EXISTS idx_qay_site_auth_sessions_expires
  ON qay_site_auth_sessions(expires_at);

CREATE TABLE IF NOT EXISTS qay_site_auth_password_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES qay_sites(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES qay_site_auth_users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '1 hour',
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qay_site_auth_password_resets_site_user
  ON qay_site_auth_password_resets(site_id, user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_qay_site_auth_password_resets_expires
  ON qay_site_auth_password_resets(expires_at);

ALTER TABLE qay_site_auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE qay_site_auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE qay_site_auth_password_resets ENABLE ROW LEVEL SECURITY;

-- No public RLS policies. All reads/writes happen server-side through QAY service role.
