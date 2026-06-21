import { getQayAdmin } from './supabase-admin';

export type QayTemplateMirror = {
  id: string;
  source: string;
  source_template_id: string;
  source_template_name: string | null;
  qay_site_id: string | null;
  status: 'pending' | 'syncing' | 'ready' | 'failed' | string;
  preview_url: string | null;
  last_error: string | null;
  synced_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export async function getQayTemplateMirror(sourceTemplateId: string, source = 'ycode') {
  if (!sourceTemplateId.trim()) return null;

  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_template_mirrors')
    .select('*')
    .eq('source', source)
    .eq('source_template_id', sourceTemplateId)
    .maybeSingle();

  if (error) {
    console.warn('[qay-template-mirrors] lookup failed', error);
    return null;
  }

  return data as QayTemplateMirror | null;
}

export async function queueQayTemplateMirror(input: {
  sourceTemplateId: string;
  sourceTemplateName?: string | null;
  source?: string;
}) {
  const sourceTemplateId = input.sourceTemplateId.trim();
  if (!sourceTemplateId) return null;

  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_template_mirrors')
    .upsert(
      {
        source: input.source || 'ycode',
        source_template_id: sourceTemplateId,
        source_template_name: input.sourceTemplateName || null,
        status: 'pending',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'source,source_template_id' }
    )
    .select('*')
    .single();

  if (error) {
    console.warn('[qay-template-mirrors] queue failed', error);
    return null;
  }

  return data as QayTemplateMirror;
}

export function getReadyMirrorUrl(mirror: QayTemplateMirror | null) {
  if (mirror?.status !== 'ready') return null;
  return mirror.preview_url || null;
}
