import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { allowRuntimeQaySchemaChanges, isMissingQaySchemaError, qaySchemaPublicMessage, qaySchemaSetupMessage, runQayCoreMigration } from '@/qay/lib/schema';
import { withResolvedQayLiveUrl } from '@/qay/lib/site-url';

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

export async function GET() {
  try {
    const user = await getQayAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const supabase = getQayAdmin() as any;
    let { data, error } = await supabase
      .from('qay_sites')
      .select('*')
      .eq('owner_id', user.id)
      .order('updated_at', { ascending: false });

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

      const retry = await supabase
        .from('qay_sites')
        .select('*')
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false });

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

    let { data, error } = await insertSite();

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

      const retry = await insertSite();
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

    return NextResponse.json({ data: withResolvedQayLiveUrl(data) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create QAY site' },
      { status: 500 }
    );
  }
}
