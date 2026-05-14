import { NextRequest, NextResponse } from 'next/server';
import { setDefaultLocale } from '@/lib/repositories/localeRepository';
import { canAccessQaySite } from '@/qay/lib/site-access';
import { getQaySiteIdFromRequest } from '@/qay/lib/page-access';

/**
 * POST /ycode/api/locales/[id]/default
 * Set a locale as the default
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const qaySiteId = getQaySiteIdFromRequest(request);
    if (qaySiteId && !(await canAccessQaySite(qaySiteId))) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const locale = await setDefaultLocale(id, qaySiteId);
    
    return NextResponse.json({ data: locale });
  } catch (error) {
    console.error('Error setting default locale:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to set default locale' },
      { status: 500 }
    );
  }
}
