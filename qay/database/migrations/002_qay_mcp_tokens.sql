CREATE TABLE IF NOT EXISTS qay_site_mcp_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES qay_sites(id) ON DELETE CASCADE,
  token_id UUID UNIQUE NOT NULL REFERENCES mcp_tokens(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qay_site_mcp_tokens_site
  ON qay_site_mcp_tokens(site_id);

CREATE INDEX IF NOT EXISTS idx_qay_site_mcp_tokens_token
  ON qay_site_mcp_tokens(token_id);

ALTER TABLE qay_site_mcp_tokens ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'qay_site_mcp_tokens'
      AND policyname = 'QAY owners manage site MCP tokens'
  ) THEN
    CREATE POLICY "QAY owners manage site MCP tokens"
      ON qay_site_mcp_tokens
      FOR ALL
      USING (
        EXISTS (
          SELECT 1
          FROM qay_sites
          WHERE qay_sites.id = qay_site_mcp_tokens.site_id
            AND qay_sites.owner_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'qay_site_mcp_tokens'
      AND policyname = 'QAY site members read MCP tokens'
  ) THEN
    CREATE POLICY "QAY site members read MCP tokens"
      ON qay_site_mcp_tokens
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM qay_site_members
          WHERE qay_site_members.site_id = qay_site_mcp_tokens.site_id
            AND qay_site_members.user_id = auth.uid()
        )
      );
  END IF;
END $$;
