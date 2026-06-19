import { noCache } from '@/lib/api-response';
import { listTemplatesWithCategories } from '@/lib/services/templateService';
import { getQayAuthUser } from '@/qay/lib/auth-guard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/templates
 *
 * List all available templates and categories from the template service.
 */
export async function GET() {
  try {
    await getQayAuthUser();

    const { templates, categories } = await listTemplatesWithCategories();

    return noCache({
      templates,
      categories,
      count: templates.length,
    });
  } catch (error) {
    console.error('[GET /api/templates] Error:', error);

    return noCache(
      { error: 'Failed to fetch templates' },
      500
    );
  }
}
