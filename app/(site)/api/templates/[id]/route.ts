import { NextRequest } from 'next/server';
import { noCache } from '@/lib/api-response';
import { getTemplate } from '@/lib/services/templateService';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { hasQayAdminAccess } from '@/qay/lib/admin-access';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/templates/:id
 *
 * Get details for a specific template.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const user = await getQayAuthUser();
    const isAdmin = await hasQayAdminAccess(user);

    if (!isAdmin) {
      return noCache({ error: 'Template not found' }, 404);
    }

    const template = await getTemplate(id);

    if (!template) {
      return noCache({ error: 'Template not found' }, 404);
    }

    return noCache({ template });
  } catch (error) {
    console.error(`[GET /api/templates/${id}] Error:`, error);

    return noCache(
      { error: 'Failed to fetch template' },
      500
    );
  }
}
