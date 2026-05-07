import { SiteIsolationNotice } from '@/qay/components/editor/SiteIsolationNotice';

export default function QayEditorSettingsRedirectsPage() {
  return (
    <SiteIsolationNotice
      title="Redirect settings are temporarily blocked"
      body="Redirect management is still backed by global project data upstream. QAY blocks this screen in the isolated editor until redirects can be stored and applied per site."
      href="/dashboard"
    />
  );
}
