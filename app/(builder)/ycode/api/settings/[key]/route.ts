import { NextRequest, NextResponse } from 'next/server';
import { getSettingByKey, setSetting } from '@/lib/repositories/settingsRepository';
import { clearAllCache } from '@/lib/services/cacheService';
import { getQaySiteIdFromRequest } from '@/qay/lib/page-access';
import { getQaySiteSetting, isQaySiteScopedSettingKey, setQaySiteSettings } from '@/qay/lib/site-settings';

/**
 * GET /ycode/api/settings/[key]
 *
 * Get a setting value by key
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const siteId = getQaySiteIdFromRequest(request);
    const value = siteId && isQaySiteScopedSettingKey(key)
      ? await getQaySiteSetting(siteId, key)
      : await getSettingByKey(key);

    if (value === null) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: value });
  } catch (error) {
    console.error('[API] Error fetching setting:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch setting' },
      { status: 500 }
    );
  }
}

/**
 * PUT /ycode/api/settings/[key]
 *
 * Update a setting value
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const body = await request.json();
    const { value } = body;
    const siteId = getQaySiteIdFromRequest(request);

    if (value === undefined) {
      return NextResponse.json(
        { error: 'Missing value in request body' },
        { status: 400 }
      );
    }

    if (siteId && isQaySiteScopedSettingKey(key)) {
      await setQaySiteSettings(siteId, { [key]: value });
    } else {
      await setSetting(key, value);
    }

    await clearAllCache();

    return NextResponse.json({
      data: { key, value },
      message: 'Setting updated successfully',
    });
  } catch (error) {
    console.error('[API] Error updating setting:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update setting' },
      { status: 500 }
    );
  }
}
