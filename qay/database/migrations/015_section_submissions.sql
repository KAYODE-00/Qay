CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS qay_section_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_type TEXT NOT NULL,
  section_type TEXT NOT NULL,
  array_index INTEGER NOT NULL,
  label TEXT NOT NULL,
  manifest_line TEXT NOT NULL,
  nav_link_style TEXT CHECK (nav_link_style IN ('routes', 'anchors', 'none') OR nav_link_style IS NULL),
  html TEXT NOT NULL,
  preview_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_qay_section_designs_slot
  ON qay_section_designs(site_type, section_type, array_index);

CREATE INDEX IF NOT EXISTS idx_qay_section_designs_lookup
  ON qay_section_designs(site_type, section_type, is_active, array_index);

ALTER TABLE qay_section_designs ENABLE ROW LEVEL SECURITY;

-- Admin writes are handled through server routes with the service role.
