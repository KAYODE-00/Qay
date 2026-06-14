import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { QayLogo } from '@/qay/components/QayLogo';
import { SectionWorkbench } from '@/qay/components/admin/SectionWorkbench';
import { getQayAuthUser } from '@/qay/lib/auth-guard';
import { hasQayAdminAccess } from '@/qay/lib/admin-access';
import { assembleSiteFromSections } from '@/qay/lib/ai/section-assembler';
import { SECTION_ORDER, SITE_TYPE_KEYWORDS } from '@/qay/lib/section-library/types';
import type { SectionType, SiteType } from '@/qay/lib/section-library/types';

export const metadata: Metadata = {
  title: 'QAY Section Test',
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SectionTestPage({ searchParams }: PageProps) {
  const user = await getQayAuthUser();
  if (!user) redirect('/login?next=/admin/sections');
  if (!(await hasQayAdminAccess(user))) redirect('/dashboard');

  const params = searchParams ? await searchParams : {};
  const prompt = first(params.prompt) || 'A premium law firm for business litigation';
  const assembly = await assembleSiteFromSections(prompt);
  const siteTypes = Object.keys(SITE_TYPE_KEYWORDS) as SiteType[];
  const sectionTypes = Array.from(new Set(Object.values(SECTION_ORDER).flat())) as SectionType[];

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-border pb-8">
          <QayLogo imageClassName="h-10 w-auto" />
          <p className="mt-6 text-sm uppercase tracking-[0.24em] text-muted-foreground">Admin only</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">Section assembly test</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            Submit a prompt, preview the exact section-library HTML before it reaches the importer, and save new
            reusable sections into QAY.
          </p>
        </header>

        <SectionWorkbench
          initialPrompt={prompt}
          assembly={assembly}
          siteTypes={siteTypes}
          sectionTypes={sectionTypes}
        />
      </div>
    </main>
  );
}
