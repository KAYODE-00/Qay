import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ id?: string[] }>;
};

export default async function LegacyTemplateDemoRedirect({ params }: Props) {
  const { id } = await params;
  const [templateId, ...slugParts] = id || [];
  const slugPath = slugParts.map(encodeURIComponent).join('/');
  redirect(`/templates/live/${encodeURIComponent(templateId || '')}${slugPath ? `/${slugPath}` : ''}`);
}
