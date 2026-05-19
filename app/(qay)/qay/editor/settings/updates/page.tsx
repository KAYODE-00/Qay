import { SiteIsolationNotice } from '@/qay/components/editor/SiteIsolationNotice';

export default function QayEditorSettingsUpdatesPage() {
  return (
    <SiteIsolationNotice
      title="Workspace updates are not shown inside isolated editors"
      body="Version and update controls belong to the shared QAY installation, not to an individual QAY site. QAY keeps them out of the site editor to avoid mixing global system state with a specific client workspace."
      href="/dashboard"
    />
  );
}
