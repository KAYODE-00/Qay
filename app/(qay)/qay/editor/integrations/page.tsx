import Link from 'next/link';
import { requireQayEditorSite } from '@/qay/lib/editor-access';

type PageProps = {
  searchParams: Promise<{ site?: string }>;
};

export const dynamic = 'force-dynamic';

export default async function QayEditorIntegrationsPage({ searchParams }: PageProps) {
  const { site } = await searchParams;
  const siteId = await requireQayEditorSite(site);

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <header className="pb-8 pt-8">
          <h1 className="text-xl font-semibold">Integrations</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Site-scoped integrations live here. Each QAY site keeps its own isolated connection state.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href={`/qay/editor/integrations/mcp?site=${encodeURIComponent(siteId)}`}
            className="rounded-lg border bg-secondary/10 p-5 transition-colors hover:bg-secondary/20"
          >
            <div className="text-base font-medium">MCP</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Create site-scoped MCP URLs for Claude, Cursor, and other assistants.
            </p>
          </Link>

          <Link
            href={`/qay/editor/integrations/api?site=${encodeURIComponent(siteId)}`}
            className="rounded-lg border bg-secondary/10 p-5 transition-colors hover:bg-secondary/20"
          >
            <div className="text-base font-medium">API keys</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Generate keys that exist only for this site.
            </p>
          </Link>

          <Link
            href={`/qay/editor/integrations/webhooks?site=${encodeURIComponent(siteId)}`}
            className="rounded-lg border bg-secondary/10 p-5 transition-colors hover:bg-secondary/20"
          >
            <div className="text-base font-medium">Webhooks</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Send site-specific events without leaking workspace-level hooks.
            </p>
          </Link>

          <Link
            href={`/qay/editor/integrations/apps?site=${encodeURIComponent(siteId)}`}
            className="rounded-lg border bg-secondary/10 p-5 transition-colors hover:bg-secondary/20"
          >
            <div className="text-base font-medium">Apps</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Save app configuration per site instead of globally.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
