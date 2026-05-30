/* global require, process, console, fetch */
/* eslint-disable no-empty */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

function readEnv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function buildQayIndexSlug(siteId) {
  return `__qay_index__${siteId}`;
}

function slugifyTemplatePage(value) {
  const slug = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'page';
}

function stripQayUnsafeTemplateStatements(sql) {
  return sql
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim().toLowerCase();
      if (!trimmed.startsWith('insert into ')) return true;
      return !(trimmed.startsWith('insert into locales ') || trimmed.startsWith('insert into translations '));
    })
    .join('\n');
}

async function loadExistingIds(client, table) {
  const result = await client.query(`select id from ${table} where deleted_at is null`);
  return new Set(result.rows.map((row) => row.id));
}

async function findImportedIds(client, table, before) {
  const result = await client.query(`select id from ${table} where deleted_at is null`);
  return result.rows.map((row) => row.id).filter((id) => !before.has(id));
}

async function restorePageIndex(client) {
  await client.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS pages_slug_is_published_folder_unique
    ON pages(
      slug,
      is_published,
      COALESCE(page_folder_id, '00000000-0000-0000-0000-000000000000'::uuid),
      COALESCE(error_page, 0),
      COALESCE(settings->>'qay_site_id', '__ycode_global__')
    )
    WHERE deleted_at IS NULL
  `);
}

async function restoreLayerStyleConstraint(client) {
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'layer_styles_name_is_published_unique'
      ) THEN
        ALTER TABLE layer_styles
        ADD CONSTRAINT layer_styles_name_is_published_unique
        UNIQUE (name, is_published);
      END IF;
    END $$;
  `);
}

async function resolveDuplicateLayerStyleNames(client, importedLayerStyleIds, siteId) {
  const styles = (
    await client.query(
      `
        select id, name, is_published, created_at
        from layer_styles
        where deleted_at is null
        order by created_at asc, id asc
      `
    )
  ).rows;

  const groups = new Map();
  for (const style of styles) {
    const key = `${style.name}\t${style.is_published ? 'published' : 'draft'}`;
    const current = groups.get(key) || [];
    current.push(style);
    groups.set(key, current);
  }

  for (const entries of groups.values()) {
    if (entries.length < 2) continue;

    const sorted = [...entries].sort((a, b) => {
      const aImported = importedLayerStyleIds.has(a.id);
      const bImported = importedLayerStyleIds.has(b.id);
      if (aImported !== bImported) return aImported ? 1 : -1;
      return `${a.created_at ?? ''}:${a.id}`.localeCompare(`${b.created_at ?? ''}:${b.id}`);
    });

    const keeper = sorted[0];
    const duplicates = sorted.slice(1);

    for (const duplicate of duplicates) {
      let baseName = duplicate.name;
      if (importedLayerStyleIds.has(duplicate.id)) {
        baseName = `${duplicate.name} (${siteId.slice(0, 6)})`;
      }

      let candidate = baseName;
      let counter = 2;
      while (
        styles.some(
          (style) =>
            style.id !== duplicate.id &&
            style.name === candidate &&
            style.is_published === duplicate.is_published
        )
      ) {
        candidate = `${baseName} ${counter++}`;
      }

      if (candidate === duplicate.name && duplicate.id !== keeper.id) {
        candidate = `${baseName} ${counter++}`;
      }

      await client.query(
        `update layer_styles set name = $1, updated_at = now() where id = $2 and is_published = $3`,
        [candidate, duplicate.id, duplicate.is_published]
      );

      duplicate.name = candidate;
    }
  }
}

async function normalizeImportedPageSlugs(client, siteId, importedPageIds) {
  const pages = (
    await client.query(
      `
        select id, name, slug, is_index, is_published, page_folder_id, error_page, created_at
        from pages
        where deleted_at is null
          and coalesce(settings->>'qay_site_id', '') = $1
        order by created_at asc, id asc
      `,
      [siteId]
    )
  ).rows;

  const seen = new Set();
  let homepageClaimed = false;

  for (const page of pages) {
    const isImported = importedPageIds.has(page.id);
    let nextIsIndex = page.is_index;
    let nextSlug = page.slug || '';

    const isRegularPage = page.error_page === null;
    const isRootPage = page.page_folder_id === null;

    if (isRegularPage && isRootPage && page.is_index) {
      if (!homepageClaimed) {
        nextSlug = buildQayIndexSlug(siteId);
        homepageClaimed = true;
      } else if (isImported) {
        nextIsIndex = false;
        nextSlug = slugifyTemplatePage(page.name || page.slug);
      }
    }

    if (isImported && isRegularPage && !nextIsIndex && nextSlug.trim() === '') {
      nextSlug = slugifyTemplatePage(page.name);
    }

    const keyBase = `${page.is_published}:${page.page_folder_id ?? 'root'}:${page.error_page ?? 0}`;
    let candidateSlug = nextSlug;
    let candidateKey = `${keyBase}:${candidateSlug}`;
    let counter = 2;

    while (seen.has(candidateKey)) {
      const baseSlug = slugifyTemplatePage(nextSlug || page.name || 'page');
      candidateSlug = `${baseSlug}-${counter++}`;
      candidateKey = `${keyBase}:${candidateSlug}`;
      nextIsIndex = false;
    }

    seen.add(candidateKey);

    if (candidateSlug !== page.slug || nextIsIndex !== page.is_index) {
      await client.query(
        `
          update pages
          set slug = $1, is_index = $2, updated_at = now()
          where id = $3 and is_published = $4
        `,
        [candidateSlug, nextIsIndex, page.id, page.is_published]
      );
    }
  }
}

async function resolveDuplicatePageSlots(client, importedPageIds, siteId) {
  const params = [];
  let where = `where deleted_at is null`;
  if (siteId) {
    params.push(siteId);
    where += ` and coalesce(settings->>'qay_site_id', '') = $1`;
  }

  const pages = (
    await client.query(
      `
        select id, name, slug, is_index, is_published, page_folder_id, error_page, created_at, deleted_at,
               settings->>'qay_site_id' as qay_site_id
        from pages
        ${where}
        order by created_at asc, id asc
      `,
      params
    )
  ).rows;

  const groups = new Map();
  for (const page of pages) {
    const key = [
      page.slug,
      page.is_published ? 'published' : 'draft',
      page.page_folder_id ?? 'root',
      page.error_page ?? 0,
      page.qay_site_id ?? '__ycode_global__',
    ].join('\t');
    const current = groups.get(key) || [];
    current.push(page);
    groups.set(key, current);
  }

  for (const entries of groups.values()) {
    if (entries.length < 2) continue;
    const sorted = [...entries].sort((a, b) => {
      const aImported = importedPageIds.has(a.id);
      const bImported = importedPageIds.has(b.id);
      if (aImported !== bImported) return aImported ? 1 : -1;
      return `${a.created_at ?? ''}:${a.id}`.localeCompare(`${b.created_at ?? ''}:${b.id}`);
    });

    const keeper = sorted[0];
    const duplicates = sorted.slice(1);

    for (const duplicate of duplicates) {
      if (!importedPageIds.has(duplicate.id)) continue;

      if (duplicate.error_page !== null) {
        await client.query(
          `update pages set deleted_at = now(), updated_at = now() where id = $1 and is_published = $2`,
          [duplicate.id, duplicate.is_published]
        );
        continue;
      }

      let baseSlug = slugifyTemplatePage(duplicate.name || duplicate.slug);
      if (!baseSlug || baseSlug === keeper.slug) {
        baseSlug = `${slugifyTemplatePage(duplicate.name || 'page')}-2`;
      }

      let candidate = baseSlug;
      let counter = 3;
      while (
        pages.some((page) =>
          page.id !== duplicate.id &&
          page.deleted_at === null &&
          page.slug === candidate &&
          page.is_published === duplicate.is_published &&
          (page.page_folder_id ?? null) === (duplicate.page_folder_id ?? null) &&
          (page.error_page ?? null) === (duplicate.error_page ?? null) &&
          (page.qay_site_id ?? null) === (duplicate.qay_site_id ?? null)
        )
      ) {
        candidate = `${baseSlug}-${counter++}`;
      }

      await client.query(
        `update pages set slug = $1, is_index = false, updated_at = now() where id = $2 and is_published = $3`,
        [candidate, duplicate.id, duplicate.is_published]
      );
    }
  }
}

async function main() {
  const templateId = process.argv[2];
  const siteId = process.argv[3];
  if (!templateId || !siteId) {
    throw new Error('Usage: node scripts/debug-qay-template-apply-direct.js <templateId> <siteId>');
  }

  const env = readEnv(path.join(process.cwd(), '.env'));
  const connectionUrl = String(env.SUPABASE_CONNECTION_URL || '').replace('[YOUR-PASSWORD]', env.SUPABASE_DB_PASSWORD || '');
  const templateApiUrl = process.env.TEMPLATE_API_URL || 'https://templates-virid.vercel.app';

  const response = await fetch(`${templateApiUrl}/api/templates/${templateId}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId: null }),
  });

  if (!response.ok) {
    throw new Error(`Template fetch failed: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();
  const importSql = stripQayUnsafeTemplateStatements(payload.sql.insert);

  const client = new Client({
    connectionString: connectionUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    const before = {
      pages: await loadExistingIds(client, 'pages'),
      page_folders: await loadExistingIds(client, 'page_folders'),
      layer_styles: await loadExistingIds(client, 'layer_styles'),
      assets: await loadExistingIds(client, 'assets'),
      asset_folders: await loadExistingIds(client, 'asset_folders'),
      collections: await loadExistingIds(client, 'collections'),
      fonts: await loadExistingIds(client, 'fonts'),
    };

    console.log('starting import');
    await client.query('BEGIN');
    await client.query('DROP INDEX IF EXISTS pages_slug_is_published_folder_unique');
    await client.query('ALTER TABLE layer_styles DROP CONSTRAINT IF EXISTS layer_styles_name_is_published_unique');
    await client.query(importSql);
    console.log('import executed inside transaction');

    const importedIds = {
      pages: await findImportedIds(client, 'pages', before.pages),
      pageFolders: await findImportedIds(client, 'page_folders', before.page_folders),
      layerStyles: await findImportedIds(client, 'layer_styles', before.layer_styles),
      assets: await findImportedIds(client, 'assets', before.assets),
      assetFolders: await findImportedIds(client, 'asset_folders', before.asset_folders),
      collections: await findImportedIds(client, 'collections', before.collections),
      fonts: await findImportedIds(client, 'fonts', before.fonts),
    };

    console.log('imported counts', Object.fromEntries(Object.entries(importedIds).map(([k, v]) => [k, v.length])));

    if (importedIds.pages.length > 0) {
      await client.query(
        `
          update pages
          set settings = coalesce(settings, '{}'::jsonb) || $1::jsonb,
              slug = case
                when error_page is null and page_folder_id is null and is_index
                  then $2
                else slug
              end
          where deleted_at is null
            and id = any($3::uuid[])
        `,
        [JSON.stringify({ qay_site_id: siteId }), buildQayIndexSlug(siteId), importedIds.pages]
      );

      const importedPageIds = new Set(importedIds.pages);
      await normalizeImportedPageSlugs(client, siteId, importedPageIds);
      await resolveDuplicatePageSlots(client, importedPageIds, siteId);
      await resolveDuplicatePageSlots(client, importedPageIds);
      await restorePageIndex(client);
      console.log('pages normalized');
    }

    if (importedIds.pageFolders.length > 0) {
      await client.query(
        `
          update page_folders
          set settings = coalesce(settings, '{}'::jsonb) || $1::jsonb
          where deleted_at is null and id = any($2::uuid[])
        `,
        [JSON.stringify({ qay_site_id: siteId }), importedIds.pageFolders]
      );
    }

    if (importedIds.layerStyles.length > 0) {
      await resolveDuplicateLayerStyleNames(client, new Set(importedIds.layerStyles), siteId);
      await restoreLayerStyleConstraint(client);
    }

    if (importedIds.collections.length > 0) {
      await client.query(
        `
          insert into qay_site_collections (site_id, collection_id)
          select $1, c.id
          from collections c
          where c.deleted_at is null and c.is_published = false and c.id = any($2::uuid[])
          on conflict do nothing
        `,
        [siteId, importedIds.collections]
      );
    }

    console.log('done');
    await client.query('ROLLBACK');
    console.log('rolled back debug transaction');
  } catch (error) {
    console.error('DEBUG TEMPLATE APPLY FAILED');
    console.error(error);
    try {
      await client.query('ROLLBACK');
    } catch {}
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
