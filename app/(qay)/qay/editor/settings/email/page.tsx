import { SiteIsolationNotice } from '@/qay/components/editor/SiteIsolationNotice';

export default function QayEditorSettingsEmailPage() {
  return (
    <SiteIsolationNotice
      title="Email settings are unavailable in QAY editor mode"
      body="The upstream email settings screen reads workspace-wide configuration. QAY blocks it here to prevent shared credentials or sender settings from bleeding across isolated sites."
      href="/dashboard"
    />
  );
}
