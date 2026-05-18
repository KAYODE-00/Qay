import { NextRequest, NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { getClientSiteContent, updateClientPageContent } from '@/qay/lib/client-content';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

function toClientContentPayload(content: Awaited<ReturnType<typeof getClientSiteContent>>) {
  if (!content) return null;

  return {
    site: content.site,
    pages: content.pages,
    selectedPage: content.selectedPage,
    editableFields: content.editableFields,
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await getQayAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { siteId } = await context.params;
    const pageId = request.nextUrl.searchParams.get('pageId');
    const content = await getClientSiteContent(user.id, siteId, pageId);

    if (!content) {
      return NextResponse.json({ error: 'Site content not found' }, { status: 404 });
    }

    return NextResponse.json({ data: toClientContentPayload(content) });
  } catch (error) {
    console.error('[QAY client content GET]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch client content' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await getQayAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { siteId } = await context.params;
    const body = await request.json().catch(() => null);
    const pageId = typeof body?.pageId === 'string' ? body.pageId : null;
    const fields = Array.isArray(body?.fields) ? body.fields : [];

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    const content = await updateClientPageContent(user.id, siteId, pageId, fields);

    if (!content) {
      return NextResponse.json({ error: 'Site content not found' }, { status: 404 });
    }

    return NextResponse.json({ data: toClientContentPayload(content) });
  } catch (error) {
    console.error('[QAY client content PATCH]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update client content' },
      { status: 500 }
    );
  }
}
