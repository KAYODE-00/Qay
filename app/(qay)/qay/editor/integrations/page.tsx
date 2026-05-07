import { SiteIsolationNotice } from '@/qay/components/editor/SiteIsolationNotice';

export default function QayEditorIntegrationsPage() {
  return (
    <SiteIsolationNotice
      title="Integrations are blocked in QAY editor mode"
      body="The upstream integrations screens still operate on workspace-wide data. QAY keeps this section closed here so one site cannot see or reuse another site's tokens, apps, or webhook setup."
      href="/dashboard"
    />
  );
}
