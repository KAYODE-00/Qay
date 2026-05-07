import { requireQayEditorSite } from '@/qay/lib/editor-access';
import { getQaySiteAccess } from '@/qay/lib/site-access';
import { QayWebhooksPage } from '@/qay/components/editor/QayWebhooksPage';

type PageProps = {
  searchParams: Promise<{ site?: string }>;
};

export const dynamic = 'force-dynamic';

export default async function QayEditorIntegrationsWebhooksPage({ searchParams }: PageProps) {
  const { site } = await searchParams;
  const siteId = await requireQayEditorSite(site);
  const access = await getQaySiteAccess(siteId);

  return <QayWebhooksPage siteId={siteId} canManage={access.role === 'owner'} />;
}
