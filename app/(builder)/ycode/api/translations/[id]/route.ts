import { NextRequest, NextResponse } from 'next/server';
import { getTranslationById, updateTranslation, deleteTranslation } from '@/lib/repositories/translationRepository';
import { canAccessQaySite } from '@/qay/lib/site-access';
import { getQaySiteIdFromRequest } from '@/qay/lib/page-access';

/**
 * GET /ycode/api/translations/[id]
 * Get a single translation by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const qaySiteId = getQaySiteIdFromRequest(request);
    if (qaySiteId && !(await canAccessQaySite(qaySiteId))) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const translation = await getTranslationById(id, false, qaySiteId);

    if (!translation) {
      return NextResponse.json({ error: 'Translation not found' }, { status: 404 });
    }

    return NextResponse.json({ data: translation });
  } catch (error) {
    console.error('Error fetching translation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch translation' },
      { status: 500 }
    );
  }
}

/**
 * PUT /ycode/api/translations/[id]
 * Update a translation
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const qaySiteId = getQaySiteIdFromRequest(request);
    const { content_value, is_completed } = body;

    if (qaySiteId && !(await canAccessQaySite(qaySiteId))) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const updates: any = {};
    if (content_value !== undefined) updates.content_value = content_value;
    if (is_completed !== undefined) updates.is_completed = is_completed;

    const translation = await updateTranslation(id, updates, qaySiteId);

    return NextResponse.json({ data: translation });
  } catch (error) {
    console.error('Error updating translation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update translation' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /ycode/api/translations/[id]
 * Delete a translation (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const qaySiteId = getQaySiteIdFromRequest(request);
    if (qaySiteId && !(await canAccessQaySite(qaySiteId))) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    await deleteTranslation(id, qaySiteId);

    return NextResponse.json({ message: 'Translation deleted successfully' });
  } catch (error) {
    console.error('Error deleting translation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete translation' },
      { status: 500 }
    );
  }
}
