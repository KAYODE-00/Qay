CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS qay_backgrounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  css TEXT NOT NULL,
  preview_css TEXT NOT NULL,
  tags TEXT[],
  is_dark BOOLEAN DEFAULT false,
  rank INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_qay_backgrounds_category
  ON qay_backgrounds(category, rank DESC);
