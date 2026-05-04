import { requireQayEditorSite } from '@/qay/lib/editor-access';

type PageProps = {
  searchParams: Promise<{ site?: string }>;
};

export const dynamic = 'force-dynamic';

export default async function QayEditorLayersPage({ searchParams }: PageProps) {
  const { site } = await searchParams;
  await requireQayEditorSite(site);
  return null;
}
