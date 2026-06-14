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
      intro="Framer is excellent for design-led marketing pages. QAY is stronger when the job also needs AI-assisted page creation, client handoff, isolated projects, ecommerce preparation, feedback, admin workflows, and backend-aware site operations."
      bestFor={[
        'Starting with QAY-aware section assembly and turning generated pages into editable sites.',
        'Shipping multiple client sites with isolated users, settings, domains, and analytics.',
        'Building commerce-ready storefronts prepared for Medusa.',
        'Combining visual editing with QAY auth, forms, demo links, and client mode.',
      ]}
      competitorBestFor={[
        'Highly polished visual marketing pages.',
        'Designers who already prefer Framer’s canvas and publishing model.',
        'Animation-heavy landing pages that do not need QAY client workflow, ecommerce, feedback, or admin operations.',
      ]}
      rows={[
        { label: 'Design workflow', qay: 'AI-assisted section assembly first, then editable visual builder and client-safe handoff.', competitor: 'Design-canvas first with strong publishing and interaction polish.' },
        { label: 'Multi-site operations', qay: 'Built around dashboard sites, clients, demo links, domains, analytics, feedback, and settings per site.', competitor: 'Great for individual published sites, less focused on agency-style operations.' },
        { label: 'Generated output', qay: 'QAY uses site-type-aware sections so a law firm, hotel, shop, SaaS, and portfolio do not all start from the same look.', competitor: 'Strong visual canvas, but AI/site operations are not the main center of gravity.' },
        { label: 'Commerce direction', qay: 'Medusa-ready hooks and storefront blocks are part of the QAY builder direction.', competitor: 'Commerce typically depends on integrations or external patterns.' },
      ]}
    />
  );
}
