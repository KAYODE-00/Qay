CREATE TABLE IF NOT EXISTS qay_site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES qay_sites(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT 'null'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(site_id, key)
);

CREATE INDEX IF NOT EXISTS idx_qay_site_settings_site
  ON qay_site_settings(site_id);

CREATE INDEX IF NOT EXISTS idx_qay_site_settings_site_key
  ON qay_site_settings(site_id, key);

ALTER TABLE qay_site_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'qay_site_settings'
      AND policyname = 'QAY site owners manage site settings'
  ) THEN
    CREATE POLICY "QAY site owners manage site settings"
      ON qay_site_settings
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM qay_sites
          WHERE qay_sites.id = qay_site_settings.site_id
            AND qay_sites.owner_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM qay_sites
          WHERE qay_sites.id = qay_site_settings.site_id
            AND qay_sites.owner_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'qay_site_settings'
      AND policyname = 'QAY site members read site settings'
  ) THEN
    CREATE POLICY "QAY site members read site settings"
      ON qay_site_settings
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM qay_site_members
          WHERE qay_site_members.site_id = qay_site_settings.site_id
            AND qay_site_members.user_id = auth.uid()
        )
        OR EXISTS (
          SELECT 1 FROM qay_sites
          WHERE qay_sites.id = qay_site_settings.site_id
            AND qay_sites.owner_id = auth.uid()
        )
      );
  END IF;
END $$;
