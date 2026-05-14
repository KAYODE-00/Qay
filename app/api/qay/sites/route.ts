import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { allowRuntimeQaySchemaChanges, isMissingQaySchemaError, qaySchemaPublicMessage, qaySchemaSetupMessage, reloadQaySchemaCache, runQayCoreMigration } from '@/qay/lib/schema';
import { withResolvedQayLiveUrl } from '@/qay/lib/site-url';
import { DEFAULT_ERROR_PAGES } from '@/lib/page-utils';
import { createPage } from '@/lib/repositories/pageRepository';
import { upsertDraftLayers } from '@/lib/repositories/pageLayersRepository';
import { ensureQayDraftHomePage } from '@/qay/lib/site-page-repair';

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

async function recoverQaySchemaCache(
  run: () => Promise<{ data: any; error: any }>
): Promise<{ data: any; error: any }> {
  const first = await run();
  if (!first.error || !isMissingQaySchemaError(first.error)) {
    return first;
  }

  await reloadQaySchemaCache();
  return run();
}

async function seedDefaultSiteErrorPages(siteId: string) {
  const supabase = getQayAdmin() as any;
  const { data: existingPages, error: existingPagesError } = await supabase
    .from('pages')
    .select('error_page, settings')
    .eq('is_published', false)
    .is('deleted_at', null)
    .not('error_page', 'is', null);

  if (existingPagesError) {
    throw new Error(existingPagesError.message);
  }

  const existingCodes = new Set(
    ((existingPages || []) as Array<{ error_page: number | null; settings: Record<string, unknown> | null }>)
      .filter((page) => page.settings?.qay_site_id === siteId && page.error_page !== null)
      .map((page) => page.error_page as number)
  );

  for (const [index, config] of DEFAULT_ERROR_PAGES.entries()) {
    if (existingCodes.has(config.code)) {
      continue;
    }

    const page = await createPage({
      name: config.name,
      slug: '',
      is_published: false,
      page_folder_id: null,
      order: 1000 + index,
      depth: 0,
      is_index: false,
      is_dynamic: false,
      error_page: config.code,
      settings: {
        ...(config.settings || {}),
        qay_site_id: siteId,
      } as any,
    });

    const layers = JSON.parse(config.layers) as unknown[];
    await upsertDraftLayers(page.id, layers as any[]);
  }
}

export async function GET() {
  try {
    const user = await getQayAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const supabase = getQayAdmin() as any;
    const selectSites = () => supabase
      .from('qay_sites')
      .select('*')
      .eq('owner_id', user.id)
      .order('updated_at', { ascending: false });

    let { data, error } = await recoverQaySchemaCache(selectSites);

    if (error && isMissingQaySchemaError(error)) {
      if (!allowRuntimeQaySchemaChanges()) {
        console.error('QAY sites unavailable:', qaySchemaSetupMessage());
        return NextResponse.json({ error: qaySchemaPublicMessage() }, { status: 503 });
      }

      const migration = await runQayCoreMigration();
      if (!migration.success) {
        console.error('QAY sites migration failed:', qaySchemaSetupMessage(migration.error));
        return NextResponse.json({ error: qaySchemaPublicMessage() }, { status: 503 });
      }

      const retry = await recoverQaySchemaCache(selectSites);
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: (data ?? []).map((site: any) => withResolvedQayLiveUrl(site)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load QAY sites' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getQayAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const requestedSlug = typeof body?.slug === 'string' ? body.slug : name;
    const slug = slugify(requestedSlug);

    if (!name) {
      return NextResponse.json({ error: 'Site name is required' }, { status: 400 });
    }

    if (!slug) {
      return NextResponse.json({ error: 'Site slug is required' }, { status: 400 });
    }

    const supabase = getQayAdmin() as any;
    const insertSite = () => supabase
      .from('qay_sites')
      .insert({
        owner_id: user.id,
        name,
        slug,
        publish_status: 'draft',
        plan: 'free',
      })
      .select()
      .single();

    let { data, error } = await recoverQaySchemaCache(insertSite);

    if (error && isMissingQaySchemaError(error)) {
      if (!allowRuntimeQaySchemaChanges()) {
        console.error('QAY site creation unavailable:', qaySchemaSetupMessage());
        return NextResponse.json({ error: qaySchemaPublicMessage() }, { status: 503 });
      }

      const migration = await runQayCoreMigration();
      if (!migration.success) {
        console.error('QAY site creation migration failed:', qaySchemaSetupMessage(migration.error));
        return NextResponse.json({ error: qaySchemaPublicMessage() }, { status: 503 });
      }

      const retry = await recoverQaySchemaCache(insertSite);
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      const isDuplicate = error.code === '23505';
      return NextResponse.json(
        { error: isDuplicate ? 'That slug or domain is already in use' : error.message },
        { status: isDuplicate ? 409 : 500 }
      );
    }

    await supabase
      .from('qay_site_ycode_link')
      .insert({ qay_site_id: data.id })
      .select()
      .maybeSingle();

    await ensureQayDraftHomePage(data.id);
    await seedDefaultSiteErrorPages(data.id);

    return NextResponse.json({ data: withResolvedQayLiveUrl(data) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create QAY site' },
      { status: 500 }
    );
  }
}
