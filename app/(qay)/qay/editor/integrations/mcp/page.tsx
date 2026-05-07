import { SiteIsolationNotice } from '@/qay/components/editor/SiteIsolationNotice';

export default function QayEditorIntegrationsMcpPage() {
  return (
    <SiteIsolationNotice
      title="MCP is disabled for isolated QAY sites"
      body="The upstream MCP server and token store are still global to the whole Ycode workspace. QAY blocks MCP inside the site editor so one client or developer cannot see or operate another site's MCP connection."
      href="/dashboard"
    />
  );
}
