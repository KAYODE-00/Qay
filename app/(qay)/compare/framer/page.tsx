import type { Metadata } from 'next';
import { ComparisonPage } from '@/qay/components/ComparisonPage';

export const metadata: Metadata = {
  title: 'QAY vs Framer',
  description: 'Compare QAY and Framer for AI-generated sites, imports, visual editing, client workflows, and ecommerce preparation.',
};

export default function CompareFramerPage() {
  return (
    <ComparisonPage
      competitor="Framer"
      headline="QAY vs Framer"
      intro="Framer is excellent for design-led marketing pages. QAY is aimed at builders who want AI import, editable site generation, client handoff, site isolation, ecommerce preparation, and backend-aware workflows in one workspace."
      bestFor={[
        'Importing AI-generated HTML and turning it into editable pages.',
        'Shipping multiple client sites with isolated users, settings, domains, and analytics.',
        'Building commerce-ready storefronts prepared for Medusa.',
        'Combining visual editing with QAY auth, forms, demo links, and client mode.',
      ]}
      competitorBestFor={[
        'Highly polished visual marketing pages.',
        'Designers who already prefer Framer’s canvas and publishing model.',
        'Animation-heavy landing pages that do not need QAY-specific import or client workflows.',
      ]}
      rows={[
        { label: 'Design workflow', qay: 'AI/import first, then editable visual builder and client-safe handoff.', competitor: 'Design-canvas first with strong publishing and interaction polish.' },
        { label: 'Multi-site operations', qay: 'Built around dashboard sites, clients, demo links, domains, analytics, and settings per site.', competitor: 'Great for individual published sites, less focused on QAY-style client operations.' },
        { label: 'Code import', qay: 'QAY gives the AI a compatibility contract and imports multi-page HTML into editable layers.', competitor: 'Not mainly positioned around importing arbitrary AI HTML into editable builder layers.' },
        { label: 'Commerce direction', qay: 'Medusa-ready hooks and storefront blocks are part of the QAY builder direction.', competitor: 'Commerce typically depends on integrations or external patterns.' },
      ]}
    />
  );
}
