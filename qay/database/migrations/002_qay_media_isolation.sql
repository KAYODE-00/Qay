-- QAY media isolation links.
-- Run after Ycode migrations and 001_qay_core.sql.

CREATE TABLE IF NOT EXISTS qay_site_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qay_site_id UUID NOT NULL REFERENCES qay_sites(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(qay_site_id, asset_id)
);

CREATE INDEX IF NOT EXISTS idx_qay_site_assets_site
  ON qay_site_assets(qay_site_id);

CREATE INDEX IF NOT EXISTS idx_qay_site_assets_asset
  ON qay_site_assets(asset_id);

ALTER TABLE qay_site_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site owners manage site assets"
  ON qay_site_assets FOR ALL USING (
    EXISTS (
      SELECT 1 FROM qay_sites
      WHERE id = qay_site_assets.qay_site_id
        AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Site members read site assets"
  ON qay_site_assets FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM qay_site_members
      WHERE site_id = qay_site_assets.qay_site_id
        AND user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS qay_site_asset_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qay_site_id UUID NOT NULL REFERENCES qay_sites(id) ON DELETE CASCADE,
  asset_folder_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(qay_site_id, asset_folder_id)
);

CREATE INDEX IF NOT EXISTS idx_qay_site_asset_folders_site
  ON qay_site_asset_folders(qay_site_id);

CREATE INDEX IF NOT EXISTS idx_qay_site_asset_folders_folder
  ON qay_site_asset_folders(asset_folder_id);

ALTER TABLE qay_site_asset_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site owners manage site asset folders"
  ON qay_site_asset_folders FOR ALL USING (
    EXISTS (
      SELECT 1 FROM qay_sites
      WHERE id = qay_site_asset_folders.qay_site_id
        AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Site members read site asset folders"
  ON qay_site_asset_folders FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM qay_site_members
      WHERE site_id = qay_site_asset_folders.qay_site_id
        AND user_id = auth.uid()
    )
  );
