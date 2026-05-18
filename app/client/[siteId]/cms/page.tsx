import { notFound } from 'next/navigation';
import { requireClient } from '@/qay/lib/auth-guard';
import { getClientSiteCms } from '@/qay/lib/client-content';
import { ClientSidebar } from '@/qay/components/client/ClientSidebar';
import { ClientCmsEditor } from '@/qay/components/client/ClientCmsEditor';

type PageProps = {
  params: Promise<{ siteId: string }>;
};

export default async function ClientSiteCmsPage({ params }: PageProps) {
  const user = await requireClient();
  const { siteId } = await params;
  const cms = await getClientSiteCms(user.id, siteId);

  if (!cms) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <ClientSidebar siteId={siteId} siteName={cms.site.name} />

        <section className="flex-1 px-5 py-6 lg:px-8">
          <div className="mb-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Client CMS</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">Content collections</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Review the collections connected to this site. These are filtered to this site only.
            </p>
          </div>

          <ClientCmsEditor siteId={siteId} initialCollections={cms.collections} />
        </section>
      </div>
    </main>
  );
}
