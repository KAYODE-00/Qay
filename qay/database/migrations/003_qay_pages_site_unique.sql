-- Make Ycode page slug uniqueness QAY-site-aware.
-- Run after Ycode migrations and QAY core migrations.

DROP INDEX IF EXISTS pages_slug_is_published_folder_unique;

CREATE UNIQUE INDEX IF NOT EXISTS pages_slug_is_published_folder_unique
  ON pages(
    slug,
    is_published,
    COALESCE(page_folder_id, '00000000-0000-0000-0000-000000000000'::uuid),
    COALESCE(error_page, 0),
    COALESCE(settings->>'qay_site_id', '__ycode_global__')
  )
  WHERE deleted_at IS NULL;
