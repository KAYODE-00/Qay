import { requireQayEditorSite } from '@/qay/lib/editor-access';
import { getQaySiteAccess } from '@/qay/lib/site-access';
import { QayAppsPage } from '@/qay/components/editor/QayAppsPage';

type PageProps = {
  searchParams: Promise<{ site?: string }>;
};

export const dynamic = 'force-dynamic';

export default async function QayEditorIntegrationsAppsPage({ searchParams }: PageProps) {
  const { site } = await searchParams;
  const siteId = await requireQayEditorSite(site);
  const access = await getQaySiteAccess(siteId);

  return <QayAppsPage siteId={siteId} canManage={access.role === 'owner'} />;
}
