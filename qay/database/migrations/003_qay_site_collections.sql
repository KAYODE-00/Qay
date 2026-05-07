CREATE TABLE IF NOT EXISTS qay_site_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES qay_sites(id) ON DELETE CASCADE,
  -- Ycode collections use a composite primary key (id, is_published),
  -- so collection_id cannot reference collections(id) directly.
  collection_id UUID UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qay_site_collections_site
  ON qay_site_collections(site_id);

CREATE INDEX IF NOT EXISTS idx_qay_site_collections_collection
  ON qay_site_collections(collection_id);

ALTER TABLE qay_site_collections ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'qay_site_collections'
      AND policyname = 'QAY owners manage site collections'
  ) THEN
    CREATE POLICY "QAY owners manage site collections"
      ON qay_site_collections
      FOR ALL
      USING (
        EXISTS (
          SELECT 1
          FROM qay_sites
          WHERE qay_sites.id = qay_site_collections.site_id
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
      AND tablename = 'qay_site_collections'
      AND policyname = 'QAY site members read site collections'
  ) THEN
    CREATE POLICY "QAY site members read site collections"
      ON qay_site_collections
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM qay_site_members
          WHERE qay_site_members.site_id = qay_site_collections.site_id
            AND qay_site_members.user_id = auth.uid()
        )
      );
  END IF;
END $$;
