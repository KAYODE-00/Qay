CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS qay_ai_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_type TEXT NOT NULL,
  theme TEXT NOT NULL,
  label TEXT NOT NULL,
  html TEXT NOT NULL,
  pages JSONB NOT NULL DEFAULT '[]',
  preview_image_url TEXT,
  css_vars JSONB NOT NULL DEFAULT '{}',
  default_fonts JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  rank INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qay_ai_templates_type
  ON qay_ai_templates(site_type, theme, rank DESC);
