import { SiteIsolationNotice } from '@/qay/components/editor/SiteIsolationNotice';

export default function QayEditorSettingsEmailPage() {
  return (
    <SiteIsolationNotice
      title="Email settings are not available here yet"
      body="This section will be added in a future update."
      href="/dashboard"
    />
  );
}
