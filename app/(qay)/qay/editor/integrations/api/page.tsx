import { SiteIsolationNotice } from '@/qay/components/editor/SiteIsolationNotice';

export default function QayEditorIntegrationsApiPage() {
  return (
    <SiteIsolationNotice
      title="API settings are unavailable in QAY editor mode"
      body="These API controls still point at project-wide configuration. Blocking them here keeps isolated sites from inheriting or exposing another site's access surface."
      href="/dashboard"
    />
  );
}
