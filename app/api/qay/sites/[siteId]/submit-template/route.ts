import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { scanProjectForTemplate } from '@/qay/lib/ai/template-scanner';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const user = await getQayAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { siteId } = await context.params;
    const admin = getQayAdmin() as any;

    // Verify ownership
    const { data: site } = await admin
      .from('qay_sites')
      .select('id, owner_id, name')
      .eq('id', siteId)
      .eq('owner_id', user.id)
      .maybeSingle();

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Scan the project
    const scanResult = await scanProjectForTemplate(siteId);

    // Get the site's pages
    const { data: pages } = await admin
      .from('pages')
      .select('id, name, slug, is_published')
      .filter('settings->>qay_site_id', 'eq', siteId)
      .is('deleted_at', null)
      .order('is_published', { ascending: true }) // false first
      .order('order', { ascending: true });

    const uniquePagesMap = new Map<string, any>();
    for (const page of pages || []) {
      const slug = page.slug || '/';
      if (!uniquePagesMap.has(slug) || page.is_published === false) {
        uniquePagesMap.set(slug, page);
      }
    }
    const pagesList = Array.from(uniquePagesMap.values());
    if (pagesList.length === 0) {
      return NextResponse.json({ error: 'This site has no editor pages to submit as a template.' }, { status: 400 });
    }

    const pageIds = pagesList.map((page: any) => page.id).filter(Boolean);
    const { data: layerRows } = pageIds.length > 0
      ? await admin
        .from('page_layers')
        .select('page_id, layers')
        .in('page_id', pageIds)
        .eq('is_published', false)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      : { data: [] };

    const layerMap = new Map<string, unknown>();
    for (const row of layerRows || []) {
      if (!layerMap.has(row.page_id)) {
        layerMap.set(row.page_id, row.layers || []);
      }
    }

    const layerToSearchText = (value: unknown): string => {
      if (!value) return '';
      if (typeof value === 'string') return value;
      if (Array.isArray(value)) return value.map(layerToSearchText).join(' ');
      if (typeof value !== 'object') return '';
      const record = value as Record<string, unknown>;
      return [
        record.name,
        record.text,
        record.content,
        record.classes,
        record.customName,
        record.settings,
        record.children,
      ].map(layerToSearchText).join(' ');
    };

    // Build a lightweight searchable HTML shell. Real submitted templates deep-clone
    // from source_site_id, so this is for matching/scanning rather than rendering.
    const templateHtml = pagesList
      .map((p: any) => {
        const text = layerToSearchText(layerMap.get(p.id) || []).replace(/[<>&]/g, ' ').slice(0, 4000);
        return `<div data-qay-page="${p.name}" data-qay-slug="${p.slug}"><section data-qm="template-page-summary">${text}</section></div>`;
      })
      .join('\n\n');

    // Determine status (auto-approve QAY admins)
    const adminEmails = (process.env.QAY_ADMIN_EMAILS || '').split(',').map(e => e.trim());
    const isQayAdmin = adminEmails.includes(user.email || '');
    const status = isQayAdmin ? 'active' : 'pending_review';

    // Insert into qay_ai_templates
    const { data: template, error: insertError } = await admin
      .from('qay_ai_templates')
      .insert({
        site_type: scanResult.category,
        theme: scanResult.theme,
        label: scanResult.suggestedName,
        html: templateHtml,
        pages: scanResult.pageSlugs.map((slug, i) => ({
          name: pagesList[i]?.name || slug,
          slug,
        })),
        features: {
          hasCms: scanResult.hasCms,
          hasCommerce: scanResult.hasEcommerce,
          hasAuth: scanResult.hasAuth,
          hasMultiPage: scanResult.pageSlugs.length > 1,
          pageCount: scanResult.pageSlugs.length,
        },
        feature_list: scanResult.features,
        has_auth: scanResult.hasAuth,
        has_ecommerce: scanResult.hasEcommerce,
        has_cms: scanResult.hasCms,
        cms_schema: scanResult.cmsSchema,
        page_count: scanResult.pageSlugs.length,
        page_slugs: scanResult.pageSlugs,
        scan_summary: scanResult.scanSummary,
        source_site_id: siteId,
        submitted_by: user.id,
        status,
        submitted_at: new Date().toISOString(),
        approved_at: isQayAdmin ? new Date().toISOString() : null,
        rank: isQayAdmin ? 80 : 30,
        is_active: isQayAdmin,
        is_approved: isQayAdmin,
        source: isQayAdmin ? 'qay-submitted-site' : 'community-submitted-site',
        industry: scanResult.category,
        color_mood: scanResult.theme,
        tags: scanResult.features,
      })
      .select('id, label, site_type, status')
      .single();

    if (insertError) {
      console.error('[QAY template-submissions] INSERT failed:', insertError);
      return NextResponse.json({ error: 'Failed to submit template: ' + insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      template: {
        id: template.id,
        name: template.label,
        category: template.site_type,
        status: template.status,
        message: isQayAdmin
          ? 'Template is live immediately.'
          : 'Template submitted for review. It will appear once approved.',
      },
      scan: scanResult,
    });
  } catch (error) {
    console.error('[QAY template-submissions] Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
