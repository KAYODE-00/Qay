-- QAY Localisation Isolation
-- Gives locales/translations an owning QAY site so languages do not bleed across sites.

ALTER TABLE locales
  ADD COLUMN IF NOT EXISTS qay_site_id UUID REFERENCES qay_sites(id) ON DELETE CASCADE;

ALTER TABLE translations
  ADD COLUMN IF NOT EXISTS qay_site_id UUID REFERENCES qay_sites(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_locales_qay_site
  ON locales(qay_site_id, is_published)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_translations_qay_site
  ON translations(qay_site_id, locale_id, is_published)
  WHERE deleted_at IS NULL;

ALTER TABLE locales
  DROP CONSTRAINT IF EXISTS locales_code_is_published_unique;

CREATE UNIQUE INDEX IF NOT EXISTS locales_qay_site_code_published_unique
  ON locales(
    COALESCE(qay_site_id, '00000000-0000-0000-0000-000000000000'::uuid),
    code,
    is_published
  )
  WHERE deleted_at IS NULL;
