import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, LayoutTemplate } from 'lucide-react';
import { getTemplate } from '@/lib/services/templateService';
import { QayLogo } from '@/qay/components/QayLogo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const template = await getTemplate(id).catch(() => null);

  return {
    title: template ? `${template.name} template demo - QAY` : 'Template demo - QAY',
    robots: { index: false, follow: false },
  };
}

export default async function QayTemplateDemoPage({ params }: Props) {
  const { id } = await params;
  const template = await getTemplate(id);

  if (!template?.livePreviewUrl) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#050505] text-white">
      <header className="z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-[#050505]/92 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur md:px-6">
        <a href="/dashboard/templates" className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.08]">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Templates
        </a>
        <div className="min-w-0 text-center">
          <div className="mx-auto flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
            <QayLogo theme="light" imageClassName="h-5 w-auto" />
            QAY demo
          </div>
          <h1 className="mt-1 truncate text-sm font-semibold text-white md:text-base">{template.name}</h1>
        </div>
        <a href="/dashboard/templates" className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90">
          Use
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </header>
      <section className="relative min-h-0 flex-1">
        <iframe
          src={template.livePreviewUrl}
          title={`${template.name} template preview`}
          className="h-full min-h-[calc(100vh-65px)] w-full border-0 bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="pointer-events-none absolute left-4 top-4 hidden rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-medium text-white/75 backdrop-blur md:flex">
          <LayoutTemplate className="mr-2 size-3.5" aria-hidden="true" />
          Permanent template demo
        </div>
      </section>
    </main>
  );
}
