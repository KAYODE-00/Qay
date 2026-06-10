import type { Metadata } from 'next';
import { ComparisonPage } from '@/qay/components/ComparisonPage';

export const metadata: Metadata = {
  title: 'QAY vs other website builders',
  description: 'Compare QAY with common website builders for AI import, visual editing, ecommerce prep, client handoff, and publishing.',
};

export default function ComparePage() {
  return (
    <ComparisonPage
      competitor="Other builders"
      headline="QAY vs other website builders"
      intro="QAY is built for people who want an AI-assisted builder, import-ready HTML flow, client handoff, and published site management without turning every project into the same locked template."
      bestFor={[
        'Generating and importing editable Tailwind HTML sites.',
        'Managing many client sites from one isolated dashboard.',
        'Combining AI, visual editing, demo links, custom domains, analytics, auth, and Medusa-ready ecommerce.',
        'Letting clients edit approved content without exposing the whole builder.',
      ]}
      competitorBestFor={[
        'Teams already standardized on a mature hosted platform.',
        'Users who prefer large template marketplaces over custom imports.',
        'Projects that only need a simple brochure page with no client handoff.',
      ]}
      rows={[
        { label: 'AI import', qay: 'Designed around import-ready HTML, QAY hooks, multi-page imports, and editable layer conversion.', competitor: 'Often limited to template editing, AI page drafts, or code export that is not naturally editable.' },
        { label: 'Client workflow', qay: 'Client mode, content editing, site users, forms, analytics, and project-specific access.', competitor: 'Usually requires account sharing, role setup, or external review tools.' },
        { label: 'Ecommerce', qay: 'Medusa-ready blocks, cart hooks, product cards, checkout hooks, and paid-plan commerce settings.', competitor: 'Varies widely; many platforms lock ecommerce into their own stack.' },
        { label: 'Control', qay: 'Keeps generated/imported pages editable while preserving QAY-specific auth, commerce, analytics, and publishing hooks.', competitor: 'Can be polished, but often harder to customize outside the platform pattern.' },
      ]}
    />
  );
}
