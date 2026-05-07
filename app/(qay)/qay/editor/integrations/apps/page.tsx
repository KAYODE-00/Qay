import { SiteIsolationNotice } from '@/qay/components/editor/SiteIsolationNotice';

export default function QayEditorIntegrationsAppsPage() {
  return (
    <SiteIsolationNotice
      title="Apps are unavailable for isolated QAY sites"
      body="App connections in the upstream builder are shared at the project level. QAY blocks this screen inside the isolated editor until app credentials can be stored and resolved per site."
      href="/dashboard"
    />
  );
}
