import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ id?: string[] }>;
};

export default async function LegacyTemplateDemoRedirect({ params }: Props) {
  const { id } = await params;
  const templateId = (id || []).join('/');
  redirect(`/templates/live/${encodeURIComponent(templateId)}`);
}
