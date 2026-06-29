import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { QayLogo } from '@/qay/components/QayLogo';
import { ensureQayTemplateMirror } from '@/qay/lib/template-mirror-sync';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: Promise<{ id?: string[] }>;
};

function getTemplateId(parts: string[] | undefined) {
  const rawId = (parts || [])[0]?.trim() || '';
  if (!rawId) return '';

  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
}

function getSlugPath(parts: string[] | undefined) {
  return (parts || [])
    .slice(1)
    .map((part) => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    })
    .filter(Boolean)
    .join('/');
}

function appendPreviewSlug(previewUrl: string, slugPath: string) {
  if (!slugPath) return previewUrl;
  const normalizedBase = previewUrl.replace(/\/$/, '');
  const normalizedSlug = slugPath.replace(/^\/+/, '');
  return `${normalizedBase}/${normalizedSlug}`;
}

async function getOrigin() {
  const headerStore = await headers();
  const host = headerStore.get('x-forwarded-host') || headerStore.get('host') || '';
  const proto = headerStore.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  return host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002');
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Template preview - QAY',
    robots: { index: false, follow: false },
  };
}

export default async function QayTemplateLivePage({ params }: Props) {
  const { id } = await params;
  const templateId = getTemplateId(id);
  const slugPath = getSlugPath(id);
  const ownerId = (process.env.QAY_TEMPLATE_MIRROR_OWNER_ID || process.env.QAY_ADMIN_USER_ID || '').trim();
  let previewUrl: string | null = null;

  if (templateId) {
    try {
      const result = await ensureQayTemplateMirror({
        templateId,
        ownerId,
        origin: await getOrigin(),
      });
      previewUrl = result.previewUrl;
    } catch (error) {
      console.error('[template live preview] Failed to prepare mirror:', error);
    }
  }

  if (previewUrl) {
    redirect(appendPreviewSlug(previewUrl, slugPath));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 py-16 text-white">
      <section className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 text-center shadow-2xl shadow-black/40 md:p-12">
        <QayLogo theme="light" imageClassName="mx-auto h-9 w-auto" />
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
          Template preview
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal md:text-4xl">Preview is not ready yet</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/60">
          This template needs to be prepared as a QAY-hosted live preview. Please try again shortly.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/templates" className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90">
            Browse templates
          </Link>
          <Link href="/" className="rounded-md border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Back to QAY
          </Link>
        </div>
      </section>
    </main>
  );
}
