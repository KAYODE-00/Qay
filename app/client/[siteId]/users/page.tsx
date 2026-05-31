import { notFound } from 'next/navigation';
import { requireClient } from '@/qay/lib/auth-guard';
import { getClientSiteContent } from '@/qay/lib/client-content';
import { ClientSidebar } from '@/qay/components/client/ClientSidebar';
import { ClientSiteUsers } from '@/qay/components/client/ClientSiteUsers';

type PageProps = {
  params: Promise<{ siteId: string }>;
};

export default async function ClientSiteUsersPage({ params }: PageProps) {
  const user = await requireClient();
  const { siteId } = await params;
  const content = await getClientSiteContent(user.id, siteId);

  if (!content) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <ClientSidebar siteId={siteId} siteName={content.site.name} />

        <section className="flex-1 px-6 py-8 lg:px-10">
          <ClientSiteUsers siteId={siteId} />
        </section>
      </div>
    </main>
  );
}
