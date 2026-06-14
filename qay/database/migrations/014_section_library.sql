CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS qm_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_type TEXT NOT NULL,
  theme_id TEXT NOT NULL,
  label TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  css_variables JSONB NOT NULL,
  google_fonts TEXT[],
  is_dark BOOLEAN DEFAULT false,
  rank INTEGER DEFAULT 0,
  UNIQUE(site_type, theme_id)
);

CREATE TABLE IF NOT EXISTS qm_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_type TEXT NOT NULL,
  section_type TEXT NOT NULL,
  theme_id TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  html TEXT NOT NULL,
  preview_description TEXT,
  rank INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qm_sections_lookup
  ON qm_sections(site_type, section_type, theme_id, rank DESC);

CREATE INDEX IF NOT EXISTS idx_qm_themes_lookup
  ON qm_themes(site_type, rank DESC);
