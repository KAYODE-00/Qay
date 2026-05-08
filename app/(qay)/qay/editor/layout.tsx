import YCodeLayoutShell from '@/components/editor/YCodeLayoutShell';

export const dynamic = 'force-dynamic';

export default function QayEditorLayout({ children }: { children: React.ReactNode }) {
  return <YCodeLayoutShell>{children}</YCodeLayoutShell>;
}
