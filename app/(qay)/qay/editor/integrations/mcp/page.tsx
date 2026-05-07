import { requireQayEditorSite } from '@/qay/lib/editor-access';
import { getQaySiteAccess } from '@/qay/lib/site-access';
import { QayMcpPage } from '@/qay/components/editor/QayMcpPage';

type PageProps = {
  searchParams: Promise<{ site?: string }>;
};

export const dynamic = 'force-dynamic';

export default async function QayEditorIntegrationsMcpPage({ searchParams }: PageProps) {
  const { site } = await searchParams;
  const siteId = await requireQayEditorSite(site);
  const access = await getQaySiteAccess(siteId);

  return <QayMcpPage siteId={siteId} canManage={access.role === 'owner'} />;
}
