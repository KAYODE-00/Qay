import { requireQayEditorSite } from '@/qay/lib/editor-access';
import { redirect } from 'next/navigation';

export default async function QayEditorSettingsGeneralPage() {
  const siteId = await requireQayEditorSite();
  redirect(`/dashboard/sites/${siteId}/settings`);
}
