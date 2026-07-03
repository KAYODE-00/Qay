-- Add rich metadata columns to qay_ai_templates for template-cloning AI builder
-- Safe: all ADD COLUMN IF NOT EXISTS, no drops

ALTER TABLE qay_ai_templates
  ADD COLUMN IF NOT EXISTS tags          TEXT[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS industry      TEXT    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS color_mood    TEXT    NOT NULL DEFAULT 'light',
  ADD COLUMN IF NOT EXISTS features      JSONB   NOT NULL DEFAULT '{"hasCms":false,"hasCommerce":false,"hasAuth":false,"hasMultiPage":false,"pageCount":1}',
  ADD COLUMN IF NOT EXISTS zones         JSONB   NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS pages_meta    JSONB   NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS cms_hints     JSONB,
  ADD COLUMN IF NOT EXISTS source        TEXT    NOT NULL DEFAULT 'qay',
  ADD COLUMN IF NOT EXISTS submitted_by  UUID    REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_approved   BOOLEAN NOT NULL DEFAULT false;

-- GIN index for tag-based matching
CREATE INDEX IF NOT EXISTS idx_qay_ai_templates_tags
  ON qay_ai_templates USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_qay_ai_templates_industry
  ON qay_ai_templates(industry, is_active, is_approved, rank DESC);

-- Approve all existing QAY-seeded templates
UPDATE qay_ai_templates
  SET is_approved = true, source = 'qay'
  WHERE source = 'qay' OR source = '';
