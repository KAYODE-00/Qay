import { notFound } from 'next/navigation';
import { requireClient } from '@/qay/lib/auth-guard';
import { getClientSiteContent } from '@/qay/lib/client-content';
import { ClientSidebar } from '@/qay/components/client/ClientSidebar';
import { ClientContentEditor } from '@/qay/components/client/ClientContentEditor';

type PageProps = {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ pageId?: string }>;
};

export default async function ClientSiteEditorPage({ params, searchParams }: PageProps) {
  const user = await requireClient();
  const { siteId } = await params;
  const { pageId } = await searchParams;
  const content = await getClientSiteContent(user.id, siteId, pageId);

  if (!content) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <ClientSidebar siteId={siteId} siteName={content.site.name} />

        <div className="flex-1">
          <ClientContentEditor
            siteId={siteId}
            initialPages={content.pages}
            initialPageId={content.selectedPage?.id ?? null}
            initialFields={content.editableFields}
          />
        </div>
      </div>
    </main>
  );
}
