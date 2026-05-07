import { requireQayEditorSite } from '@/qay/lib/editor-access';
import { getQaySiteAccess } from '@/qay/lib/site-access';
import { QayApiKeysPage } from '@/qay/components/editor/QayApiKeysPage';

type PageProps = {
  searchParams: Promise<{ site?: string }>;
};

export const dynamic = 'force-dynamic';

export default async function QayEditorIntegrationsApiPage({ searchParams }: PageProps) {
  const { site } = await searchParams;
  const siteId = await requireQayEditorSite(site);
  const access = await getQaySiteAccess(siteId);

  return <QayApiKeysPage siteId={siteId} canManage={access.role === 'owner'} />;
}
