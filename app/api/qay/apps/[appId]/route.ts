import { NextRequest, NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getQaySiteAccess } from '@/qay/lib/site-access';
import { deleteQaySiteAppSettings, getQaySiteAppSettings, saveQaySiteAppSettings } from '@/qay/lib/integration-scope';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const REQUIRED_APP_SETTINGS: Record<string, string[]> = {
  airtable: ['api_token'],
  webflow: ['api_token', 'site_live_url'],
  mailerlite: ['api_key'],
  mapbox: ['access_token'],
  'google-maps-embed': ['api_key'],
};

function validateAppSettings(appId: string, body: Record<string, unknown>) {
  const requiredFields = REQUIRED_APP_SETTINGS[appId] || [];
  for (const field of requiredFields) {
    if (typeof body[field] !== 'string' || !body[field].trim()) {
      return `${field.replace(/_/g, ' ')} is required`;
    }
  }

  if (appId === 'webflow') {
    try {
      const url = new URL(String(body.site_live_url || '').trim());
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return 'site live url must start with http:// or https://';
      }
    } catch {
      return 'site live url must be a valid URL';
    }
  }

  return null;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ appId: string }> },
) {
  try {
    const user = await getQayAuthUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const siteId = new URL(request.url).searchParams.get('site');
    if (!siteId) return NextResponse.json({ error: 'Site is required' }, { status: 400 });
    const access = await getQaySiteAccess(siteId);
    if (!access.allowed) return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    const { appId } = await context.params;
    const data = await getQaySiteAppSettings(siteId, appId);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to fetch app settings' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ appId: string }> },
) {
  try {
    const user = await getQayAuthUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const siteId = new URL(request.url).searchParams.get('site');
    if (!siteId) return NextResponse.json({ error: 'Site is required' }, { status: 400 });
    const access = await getQaySiteAccess(siteId);
    if (!access.allowed) return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    if (access.role !== 'owner') return NextResponse.json({ error: 'Only the site owner can update app settings' }, { status: 403 });
    const { appId } = await context.params;
    const body = await request.json().catch(() => ({}));
    const validationError = validateAppSettings(appId, body);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const data = await saveQaySiteAppSettings(siteId, appId, body);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to save app settings' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ appId: string }> },
) {
  try {
    const user = await getQayAuthUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const siteId = new URL(request.url).searchParams.get('site');
    if (!siteId) return NextResponse.json({ error: 'Site is required' }, { status: 400 });
    const access = await getQaySiteAccess(siteId);
    if (!access.allowed) return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    if (access.role !== 'owner') return NextResponse.json({ error: 'Only the site owner can delete app settings' }, { status: 403 });
    const { appId } = await context.params;
    await deleteQaySiteAppSettings(siteId, appId);
    return NextResponse.json({ data: { deleted: true, appId } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to delete app settings' }, { status: 500 });
  }
}
