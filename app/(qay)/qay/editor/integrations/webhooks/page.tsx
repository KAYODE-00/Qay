import { SiteIsolationNotice } from '@/qay/components/editor/SiteIsolationNotice';

export default function QayEditorIntegrationsWebhooksPage() {
  return (
    <SiteIsolationNotice
      title="Webhooks are blocked in QAY editor mode"
      body="Webhook configuration is still backed by workspace-level data upstream. QAY keeps it out of the isolated editor until webhook ownership is stored per site."
      href="/dashboard"
    />
  );
}
