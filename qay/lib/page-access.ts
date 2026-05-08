import { NextRequest } from 'next/server';
import type { Page } from '@/types';
import { getQayAdmin } from './supabase-admin';
import { canAccessQaySite } from './site-access';

export function getQaySiteIdFromRequest(request: NextRequest): string | null {
  const { searchParams } = new URL(request.url);
  return searchParams.get('site');
}

export function getPageQaySiteId(page: Pick<Page, 'settings'> | null): string | null {
  const settings = page?.settings as Record<string, unknown> | null;
  return typeof settings?.qay_site_id === 'string' ? settings.qay_site_id : null;
}

export function getRecordQaySiteId(record: { settings?: unknown } | null): string | null {
  const settings = record?.settings as Record<string, unknown> | null;
  return typeof settings?.qay_site_id === 'string' ? settings.qay_site_id : null;
}

export async function canUsePageInQaySite(siteId: string, page: Pick<Page, 'settings' | 'error_page'> | null): Promise<boolean> {
  if (!(await canAccessQaySite(siteId))) {
    return false;
  }

  if (!page) {
    return false;
  }

  if (page.error_page !== null) {
    return true;
  }

  return getPageQaySiteId(page) === siteId;
}

export async function canUsePageIdInQaySite(siteId: string, pageId: string, isPublished = false): Promise<boolean> {
  if (!(await canAccessQaySite(siteId))) {
    return false;
  }

  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('pages')
    .select('settings, error_page')
    .eq('id', pageId)
    .eq('is_published', isPublished)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return false;
  }

  if (data.error_page !== null) {
    return true;
  }

  return getPageQaySiteId(data) === siteId;
}

export async function canUseFolderInQaySite(siteId: string, folder: { settings?: unknown } | null): Promise<boolean> {
  if (!(await canAccessQaySite(siteId))) {
    return false;
  }

  return getRecordQaySiteId(folder) === siteId;
}
