-- Template submissions + deep clone metadata.
-- Compatible with 025_template_metadata.sql: keep features as JSONB.

ALTER TABLE qay_ai_templates
  ADD COLUMN IF NOT EXISTS source_site_id UUID REFERENCES qay_sites(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS feature_list TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS has_auth BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_ecommerce BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_cms BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS cms_schema JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS page_count INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS page_slugs TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS scan_summary TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'qay_ai_templates_status_check'
  ) THEN
    ALTER TABLE qay_ai_templates
      ADD CONSTRAINT qay_ai_templates_status_check
      CHECK (status IN ('pending_review', 'active', 'rejected'));
  END IF;
END $$;

UPDATE qay_ai_templates
SET
  has_auth = COALESCE((features->>'hasAuth')::boolean, false),
  has_ecommerce = COALESCE((features->>'hasCommerce')::boolean, false),
  has_cms = COALESCE((features->>'hasCms')::boolean, false),
  page_count = GREATEST(
    COALESCE((features->>'pageCount')::integer, page_count, 1),
    CASE WHEN jsonb_typeof(pages) = 'array' THEN jsonb_array_length(pages) ELSE 1 END
  ),
  page_slugs = CASE
    WHEN jsonb_typeof(pages) = 'array' THEN ARRAY(
      SELECT COALESCE(NULLIF(item->>'slug', ''), '/')
      FROM jsonb_array_elements(pages) AS item
    )
    ELSE page_slugs
  END,
  feature_list = ARRAY(
    SELECT x FROM unnest(ARRAY[
      CASE WHEN COALESCE((features->>'hasCommerce')::boolean, false) THEN 'ecommerce' ELSE NULL END,
      CASE WHEN COALESCE((features->>'hasCms')::boolean, false) THEN 'cms' ELSE NULL END,
      CASE WHEN COALESCE((features->>'hasAuth')::boolean, false) THEN 'auth-protected' ELSE NULL END,
      CASE WHEN COALESCE((features->>'hasMultiPage')::boolean, false) THEN 'multi-page' ELSE NULL END
    ]) x WHERE x IS NOT NULL
  )
WHERE feature_list = '{}' OR page_slugs = '{}';

CREATE TABLE IF NOT EXISTS qay_template_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES qay_ai_templates(id) ON DELETE SET NULL,
  cloned_site_id UUID REFERENCES qay_sites(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qay_template_usage_template
  ON qay_template_usage(template_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_qay_template_usage_user
  ON qay_template_usage(user_id, created_at DESC);
