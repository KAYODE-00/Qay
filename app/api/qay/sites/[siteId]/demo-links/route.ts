import { NextResponse } from 'next/server';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { createQayDemoLink, getDemoLinkUrl } from '@/qay/lib/demo-links';

type RouteContext = {
  params: Promise<{ siteId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const user = await getQayAuthUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { siteId } = await context.params;
    const demoLink = await createQayDemoLink(siteId, user);

    return NextResponse.json({
      data: {
        ...demoLink,
        url: getDemoLinkUrl(request, demoLink.token),
      },
    });
  } catch (error) {
    const code = typeof error === 'object' && error && 'code' in error ? String((error as any).code) : undefined;
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unable to create demo link',
        code,
      },
      { status: code === 'DEMO_LINK_LIMIT_REACHED' ? 403 : 500 }
    );
  }
}
