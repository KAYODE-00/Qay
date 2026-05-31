import { NextRequest } from 'next/server';
import { noCache } from '@/lib/api-response';
import { applyTemplate } from '@/lib/services/templateService';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { hasQayAdminAccess } from '@/qay/lib/admin-access';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * POST /api/templates/:id/apply
 *
 * Apply a template to the current database.
 * This will clear existing content and replace it with template content.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Get tenant ID from header (for cloud multi-tenant)
  const tenantId = request.headers.get('x-tenant-id') || undefined;

  try {
    const user = await getQayAuthUser();
    const isAdmin = await hasQayAdminAccess(user);

    if (!isAdmin) {
      return noCache({ error: 'Only admins can apply original templates.' }, 403);
    }

    const result = await applyTemplate(id, tenantId);

    if (!result.success) {
      console.error(`[POST /api/templates/${id}/apply] Failed:`, result.error);
      return noCache({ error: result.error }, 500);
    }

    return noCache({
      success: true,
      message: `Template "${result.templateName}" applied successfully`,
      templateName: result.templateName,
    });
  } catch (error) {
    console.error(`[POST /api/templates/${id}/apply] Error:`, error);

    return noCache(
      { error: error instanceof Error ? error.message : 'Failed to apply template' },
      500
    );
  }
}
