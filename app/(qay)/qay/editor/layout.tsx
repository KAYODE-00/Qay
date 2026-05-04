import YCodeLayoutClient from '@/app/(builder)/ycode/YCodeLayoutClient';

export const dynamic = 'force-dynamic';

export default function QayEditorLayout({ children }: { children: React.ReactNode }) {
  return <YCodeLayoutClient>{children}</YCodeLayoutClient>;
}
