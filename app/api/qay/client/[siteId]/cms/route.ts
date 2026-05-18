import { NextRequest, NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { updateClientCmsItem } from '@/qay/lib/client-content';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await getQayAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { siteId } = await context.params;
    const body = await request.json().catch(() => null);
    const collectionId = typeof body?.collectionId === 'string' ? body.collectionId : null;
    const itemId = typeof body?.itemId === 'string' ? body.itemId : null;
    const values = body?.values && typeof body.values === 'object' && !Array.isArray(body.values) ? body.values : null;

    if (!collectionId || !itemId || !values) {
      return NextResponse.json({ error: 'Collection item is required' }, { status: 400 });
    }

    const cms = await updateClientCmsItem(user.id, siteId, collectionId, itemId, values);

    if (!cms) {
      return NextResponse.json({ error: 'CMS item not found' }, { status: 404 });
    }

    return NextResponse.json({ data: cms });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update CMS item' },
      { status: 500 }
    );
  }
}
