import 'server-only';

import { randomBytes } from 'node:crypto';
import { getTemplate } from '@/lib/services/templateService';
import { getQayAdmin } from '@/qay/lib/supabase-admin';
import { getQaySiteBaseUrl } from '@/qay/lib/site-url';
import { getQayTemplateMirror, getReadyMirrorUrl, queueQayTemplateMirror } from '@/qay/lib/template-mirrors';

function slugifyBase(value: string) {
  const base = value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32)
    .replace(/-+$/g, '');

  return base || 'template';
}

function makeMirrorSlug(templateName: string) {
  return `template-${slugifyBase(templateName)}-${randomBytes(3).toString('hex')}`;
}

export function getTemplateSource(templateId: string, templateName?: string | null) {
  const text = `${templateId} ${templateName || ''}`.toLowerCase();
  return text.includes('qay') ? 'qay' : 'ycode';
}

async function createMirrorSite(input: {
  ownerId: string;
  templateName: string;
  previewImageUrl?: string | null;
}) {
  const supabase = getQayAdmin() as any;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const slug = makeMirrorSlug(input.templateName);
    const { data, error } = await supabase
      .from('qay_sites')
      .insert({
        owner_id: input.ownerId,
        name: `${input.templateName} Preview`,
        slug,
        publish_status: 'draft',
        plan: 'pro',
        thumbnail_url: input.previewImageUrl || null,
      })
      .select('id, slug, custom_domain, domain_verified, publish_status, live_url')
      .single();

    if (error?.code === '23505') continue;
    if (error) throw new Error(error.message);

    await supabase
      .from('qay_site_ycode_link')
      .insert({ qay_site_id: data.id })
      .select()
      .maybeSingle();

    return data as {
      id: string;
      slug: string;
      custom_domain: string | null;
      domain_verified: boolean | null;
      publish_status: string | null;
      live_url: string | null;
    };
  }

  throw new Error('Could not create a unique QAY template preview URL.');
}

async function publishMirrorSite(siteId: string) {
  const supabase = getQayAdmin() as any;
  const siteSettings = { qay_site_id: siteId };

  await supabase
    .from('pages')
    .update({ is_published: true, updated_at: new Date().toISOString() })
    .contains('settings', siteSettings)
    .eq('is_published', false);

  const { data: site, error } = await supabase
    .from('qay_sites')
    .update({
      publish_status: 'published',
      updated_at: new Date().toISOString(),
    })
    .eq('id', siteId)
    .select('id, slug, custom_domain, domain_verified, publish_status, live_url')
    .single();

  if (error) throw new Error(error.message);

  const liveUrl = getQaySiteBaseUrl({
    slug: site.slug,
    custom_domain: site.custom_domain,
    domain_verified: site.domain_verified,
  });

  if (liveUrl && liveUrl !== site.live_url) {
    await supabase
      .from('qay_sites')
      .update({ live_url: liveUrl, updated_at: new Date().toISOString() })
      .eq('id', siteId);
  }

  return liveUrl || site.live_url || `/${site.slug}`;
}

async function markMirror(input: {
  source: string;
  templateId: string;
  templateName: string;
  status: 'syncing' | 'ready' | 'failed';
  siteId?: string | null;
  previewUrl?: string | null;
  lastError?: string | null;
}) {
  const supabase = getQayAdmin() as any;
  const { error } = await supabase
    .from('qay_template_mirrors')
    .upsert(
      {
        source: input.source,
        source_template_id: input.templateId,
        source_template_name: input.templateName,
        qay_site_id: input.siteId || null,
        status: input.status,
        preview_url: input.previewUrl || null,
        last_error: input.lastError || null,
        synced_at: input.status === 'ready' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'source,source_template_id' }
    );

  if (error) throw new Error(error.message);
}

export async function ensureQayTemplateMirror(input: {
  templateId: string;
  ownerId: string;
  origin: string;
}) {
  const templateId = decodeURIComponent(input.templateId || '').trim();
  if (!templateId) throw new Error('templateId is required');

  const template = await getTemplate(templateId);
  if (!template) throw new Error('Template not found');

  const source = getTemplateSource(templateId, template.name);
  const existingMirror = await getQayTemplateMirror(templateId, source);
  const readyUrl = getReadyMirrorUrl(existingMirror);
  if (readyUrl) return { previewUrl: readyUrl, template, source, reused: true };

  const syncSecret = (process.env.QAY_TEMPLATE_MIRROR_SYNC_SECRET || process.env.QAY_WEBHOOK_SECRET || '').trim();
  if (!syncSecret) {
    throw new Error('QAY_TEMPLATE_MIRROR_SYNC_SECRET or QAY_WEBHOOK_SECRET is required to sync template previews.');
  }

  const queuedMirror = existingMirror || await queueQayTemplateMirror({
    sourceTemplateId: templateId,
    sourceTemplateName: template.name,
    source,
  });

  let siteId = queuedMirror?.qay_site_id || null;

  try {
    await markMirror({ source, templateId, templateName: template.name, status: 'syncing', siteId });

    if (!siteId) {
      const site = await createMirrorSite({
        ownerId: input.ownerId,
        templateName: template.name,
        previewImageUrl: template.preview,
      });
      siteId = site.id;
    }

    const applyResponse = await fetch(
      new URL(`/api/qay/templates/${encodeURIComponent(templateId)}/apply`, input.origin),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-qay-template-sync-secret': syncSecret,
        },
        body: JSON.stringify({ siteId }),
        cache: 'no-store',
      }
    );

    if (!applyResponse.ok) {
      const payload = await applyResponse.json().catch(() => null);
      throw new Error(payload?.error || `Template apply failed with status ${applyResponse.status}`);
    }

    const previewUrl = await publishMirrorSite(siteId);
    await markMirror({ source, templateId, templateName: template.name, status: 'ready', siteId, previewUrl });

    return { previewUrl, template, source, reused: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sync template preview';
    await markMirror({
      source,
      templateId,
      templateName: template.name,
      status: 'failed',
      siteId,
      lastError: message,
    }).catch((markError) => {
      console.error('[template mirror sync] Failed to mark failure:', markError);
    });
    throw error;
  }
}
