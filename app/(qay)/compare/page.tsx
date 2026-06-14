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
      intro="QAY is built for freelancers and agencies who want polished AI-assisted site creation, visual editing, client handoff, ecommerce readiness, and multi-site operations without forcing every project into the same template lane."
      bestFor={[
        'Starting from polished section systems and turning them into editable client sites.',
        'Managing many client sites from one isolated dashboard.',
        'Combining AI, visual editing, demo links, custom domains, analytics, auth, and Medusa-ready ecommerce.',
        'Letting clients edit approved content without exposing the whole builder.',
      ]}
      competitorBestFor={[
        'Teams that already accept the limits of a mature hosted platform.',
        'Users who prefer browsing huge template marketplaces instead of shaping custom client workflows.',
        'One-off brochure sites where client handoff, ecommerce, and site operations do not matter.',
      ]}
      rows={[
        { label: 'AI output', qay: 'Uses QAY-aware section assembly and import rules so generated pages are more likely to be polished, editable, and useful.', competitor: 'Often produces a page draft, then leaves the user to force it into the builder pattern.' },
        { label: 'Client workflow', qay: 'Client mode, content editing, site users, forms, analytics, feedback, and project-specific access are first-class.', competitor: 'Often needs account sharing, extra roles, or external review tools.' },
        { label: 'Ecommerce', qay: 'Medusa-ready blocks, cart hooks, product cards, checkout hooks, and paid-plan commerce settings.', competitor: 'Many platforms lock ecommerce into their own stack or app ecosystem.' },
        { label: 'Control', qay: 'Keeps generated pages editable while preserving auth, commerce, analytics, publishing, feedback, and handoff workflows.', competitor: 'Can be polished, but usually pulls the project toward the platform’s default workflow.' },
      ]}
    />
  );
}
