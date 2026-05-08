import { requireQayEditorSite } from '@/qay/lib/editor-access';
import { redirect } from 'next/navigation';

type PageProps = {
  searchParams: Promise<{ site?: string }>;
};

export default async function QayEditorSettingsPage({ searchParams }: PageProps) {
  const { site } = await searchParams;
  const siteId = await requireQayEditorSite(site);
  redirect(`/qay/editor/settings/general?site=${siteId}`);
}
