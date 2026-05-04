import { requireQayEditorSite } from '@/qay/lib/editor-access';

export const dynamic = 'force-dynamic';

export default async function QayEditorPage() {
  await requireQayEditorSite();
  return null;
}
