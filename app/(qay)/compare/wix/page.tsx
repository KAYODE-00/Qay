import type { Metadata } from 'next';
import { ComparisonPage } from '@/qay/components/ComparisonPage';

export const metadata: Metadata = {
  title: 'QAY vs Wix',
  description: 'Compare QAY and Wix for freelancers, agencies, AI site generation, client workflows, ecommerce, and custom site control.',
};

export default function CompareWixPage() {
  return (
    <ComparisonPage
      competitor="Wix"
      headline="QAY vs Wix"
      intro="Wix is broad and mature for small businesses. QAY is more focused on freelancers and agencies: polished AI-assisted site starts, professional client handoff, site isolation, feedback, admin visibility, and Medusa-ready ecommerce for builders who want tighter control."
      bestFor={[
        'Freelancers who want QAY-aware AI generation and ready-to-use sections instead of template-first builds.',
        'Client projects that need content access without giving clients the full builder.',
        'Teams preparing ecommerce sites around Medusa and QAY storefront hooks.',
        'Builders who want a leaner workspace for many separate projects.',
      ]}
      competitorBestFor={[
        'Non-technical business owners who want an all-in-one hosted product.',
        'Users who prefer a large built-in app marketplace and template library.',
        'Small sites that can stay inside Wix default workflows without deeper handoff or backend needs.',
      ]}
      rows={[
        { label: 'Builder style', qay: 'AI-assisted section assembly plus visual editing, with QAY-specific hooks for auth, commerce, analytics, feedback, and publishing.', competitor: 'Template and app-marketplace driven with a very broad hosted ecosystem.' },
        { label: 'Client handoff', qay: 'Client mode is intentionally scoped so clients can update approved content and see their site users.', competitor: 'Client collaboration is available, but the experience is tied to Wix account/workspace patterns.' },
        { label: 'Ecommerce', qay: 'Medusa-powered direction for custom commerce backends and QAY storefront binding.', competitor: 'Built-in ecommerce is mature, but more coupled to the platform.' },
        { label: 'Site control', qay: 'Good fit when you want generated layouts, business workflows, and client handoff to stay editable and organized.', competitor: 'Good fit when you want a packaged site platform with less custom workflow emphasis.' },
      ]}
    />
  );
}
