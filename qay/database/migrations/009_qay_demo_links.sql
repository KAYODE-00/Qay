-- QAY demo links
-- Share draft/preview links without counting visits in analytics.

CREATE TABLE IF NOT EXISTS qay_demo_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES qay_sites(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qay_demo_links_site_active
  ON qay_demo_links(site_id, expires_at DESC)
  WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_qay_demo_links_token
  ON qay_demo_links(token);

ALTER TABLE qay_demo_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners manage own demo links" ON qay_demo_links;
CREATE POLICY "Owners manage own demo links"
  ON qay_demo_links FOR ALL USING (auth.uid() = owner_id);
