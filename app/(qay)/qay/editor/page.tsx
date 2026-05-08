import { requireQayEditorSite } from '@/qay/lib/editor-access';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<{ site?: string }>;
};

export default async function QayEditorPage({ searchParams }: PageProps) {
  const { site } = await searchParams;
  await requireQayEditorSite(site);
  return null;
}
