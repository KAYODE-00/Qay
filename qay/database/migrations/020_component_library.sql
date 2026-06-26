CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS qay_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  html TEXT NOT NULL,
  preview_image_url TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT true,
  is_builtin BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  uses_count INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE qay_components ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone reads approved public components" ON qay_components;
CREATE POLICY "Anyone reads approved public components"
  ON qay_components FOR SELECT
  USING (
    (is_approved = true AND is_public = true)
    OR auth.uid() = submitted_by
  );

DROP POLICY IF EXISTS "Users submit components" ON qay_components;
CREATE POLICY "Users submit components"
  ON qay_components FOR INSERT
  WITH CHECK (auth.uid() = submitted_by);

CREATE INDEX IF NOT EXISTS idx_qay_components_category
  ON qay_components(category, is_approved, rank DESC);
