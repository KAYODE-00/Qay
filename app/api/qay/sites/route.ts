import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { allowRuntimeQaySchemaChanges, isMissingQaySchemaError, qaySchemaPublicMessage, qaySchemaSetupMessage, reloadQaySchemaCache, runQayCoreMigration } from '@/qay/lib/schema';
import { withResolvedQayLiveUrl } from '@/qay/lib/site-url';
import { ensureQayDraftHomePage } from '@/qay/lib/site-page-repair';
import { ensureQayDraftErrorPages } from '@/qay/lib/site-error-pages';

function slugifyBase(value: string) {
  const base = value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 18)
    .replace(/-+$/g, '');

  return base || 'site';
}

function randomSlugToken() {
  return randomBytes(3).toString('hex');
}

function makeSiteSlug(name: string) {
  return `${slugifyBase(name)}-${randomSlugToken()}`;
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
    const skipDefaultPages = body?.skipDefaultPages === true;

    if (!name) {
      return NextResponse.json({ error: 'Site name is required' }, { status: 400 });
    }

    const supabase = getQayAdmin() as any;
    const insertSite = (slug: string) => supabase
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

    const createSiteWithUniqueSlug = async () => {
      let lastDuplicate: any = null;

      for (let attempt = 0; attempt < 8; attempt += 1) {
        const result = await recoverQaySchemaCache(() => insertSite(makeSiteSlug(name)));

        if (result.error?.code === '23505') {
          lastDuplicate = result.error;
          continue;
        }

        return result;
      }

      return {
        data: null,
        error: lastDuplicate ?? new Error('Unable to create a unique site URL'),
      };
    };

    let { data, error } = await createSiteWithUniqueSlug();

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

      const retry = await createSiteWithUniqueSlug();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      const isDuplicate = error.code === '23505';
      return NextResponse.json(
        { error: isDuplicate ? 'Could not create a unique site URL. Please try again.' : error.message },
        { status: isDuplicate ? 409 : 500 }
      );
    }

    await supabase
      .from('qay_site_ycode_link')
      .insert({ qay_site_id: data.id })
      .select()
      .maybeSingle();

    if (!skipDefaultPages) {
      await ensureQayDraftHomePage(data.id);
      await ensureQayDraftErrorPages(data.id);
    }

    return NextResponse.json({ data: withResolvedQayLiveUrl(data) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create QAY site' },
      { status: 500 }
    );
  }
}
