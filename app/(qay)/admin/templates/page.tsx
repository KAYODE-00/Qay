import type { Metadata } from 'next';
import TemplatesAdminClient from './TemplatesAdminClient';

export const metadata: Metadata = {
  title: 'Templates — QAY Admin',
  description: 'Manage AI builder templates in QAY.',
};

export default function TemplatesAdminPage() {
  return <TemplatesAdminClient />;
}
