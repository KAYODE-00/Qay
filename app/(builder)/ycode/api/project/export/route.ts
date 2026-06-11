import { noCache } from '@/lib/api-response';
import { exportProject, getExportFilename, packExport } from '@/lib/services/projectService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ExportBody = {
  projectName?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as ExportBody;
    const result = await exportProject();

    if (!result.success || !result.export) {
      return noCache({ error: result.error || 'Export failed' }, 500);
    }

    if (typeof body.projectName === 'string' && body.projectName.trim()) {
      result.export.manifest.projectName = body.projectName.trim();
    }

    const buffer = packExport(
      result.export,
      typeof body.password === 'string' && body.password ? body.password : undefined
    );
    const filename = getExportFilename(result.export.manifest);

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('[POST /ycode/api/project/export] Error:', error);
    return noCache({ error: error instanceof Error ? error.message : 'Export failed' }, 500);
  }
}
