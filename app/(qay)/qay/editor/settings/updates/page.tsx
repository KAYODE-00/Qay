import { SiteIsolationNotice } from '@/qay/components/editor/SiteIsolationNotice';

export default function QayEditorSettingsUpdatesPage() {
  return (
    <SiteIsolationNotice
      title="Upgrade your QAY plan"
      body="Choose a plan when you need more publishing capacity, custom domains, collaboration, and client handoff tools for this site."
      href="/pricing"
    />
  );
}
