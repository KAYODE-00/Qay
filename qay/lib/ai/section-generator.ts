import type { SiteDecision } from './decision-schema';
import { callWithFallbackDetailed } from './providers';

const SECTION_SYSTEM_PROMPT = `You generate ONE section for QAY.
Return only HTML for that one section. No markdown. No explanation.

Rules:
- Use semantic HTML and Tailwind classes only.
- Do not use scripts, onclick handlers, external JavaScript, or custom JS.
- Use CSS variables for the main palette: var(--qm-bg), var(--qm-surface), var(--qm-text), var(--qm-text-muted), var(--qm-accent), var(--qm-accent-text), var(--qm-border).
- Keep the look premium, modern, and suitable for a black/white Vercel-like baseline unless the prompt gives colors.
- If the prompt gives colors, respect those colors through the CSS variables.
- Use data-qm on editable text and image zones.
- Use QAY motion hooks tastefully: data-qay-animate, data-qay-hover, and data-qay-scroll where useful.
- If this is a nav section, include a mobile menu using data-qay-click="toggle", data-qay-target, and data-qay-class="hidden".
- If this is an accordion/FAQ, use data-qay-click toggles with unique ids.
- If this is ecommerce, include the needed data-qay-commerce hooks.
- Use relevant Unsplash image URLs with w, auto, and q params when images are useful.
- Do not add content that does not belong to the site type. No cart in restaurants or blogs unless explicitly requested.
Start directly with the opening section/nav/footer/main/article tag.`;

export async function generateMissingSection(
  slot: string,
  decision: SiteDecision,
  prompt: string,
  pageName: string
) {
  const colors = decision.brand.colors;
  const colorContext = colors.isUserSupplied
    ? `Use these requested/resolved colors: background ${colors.background}, primary ${colors.primary}, secondary ${colors.secondary}, accent ${colors.accent}.`
    : 'Use a refined black/white Vercel-like base with one tasteful accent that fits the site type.';

  const userMessage = `Generate one "${slot}" section.

Original user prompt:
${prompt}

Site type: ${decision.siteType}
Brand: ${decision.brand.name}
Tagline: ${decision.brand.tagline}
Page: ${pageName}
${colorContext}
Fonts: heading ${decision.brand.fonts.heading}, body ${decision.brand.fonts.body}

Required section behavior:
${describeSlot(slot, decision.siteType)}

Return only the HTML for this one section.`;

  const result = await callWithFallbackDetailed<string>(
    userMessage,
    SECTION_SYSTEM_PROMPT,
    (text) => {
      const cleaned = text.trim().replace(/^```html\n?/i, '').replace(/^```\n?/i, '').replace(/\n?```$/i, '').trim();
      if (!/^<(section|nav|footer|main|article|aside|div|form)\b/i.test(cleaned)) {
        throw new Error(`Generated ${slot} section was not importable HTML`);
      }
      if (/<script\b|\son[a-z]+\s*=/i.test(cleaned)) {
        throw new Error(`Generated ${slot} section used unsupported scripts or event handlers`);
      }
      return cleaned;
    }
  );

  return result.value || '';
}

function describeSlot(slot: string, siteType: string) {
  const normalized = slot.toLowerCase();
  if (normalized.includes('productdetail')) {
    return 'Build a product detail section with image gallery, product name, price, description, size/color selectors, quantity controls, Add to Cart, Buy Now, delivery info, returns snippet, and related product links. Use data-qay-commerce product hooks.';
  }
  if (normalized === 'cart') {
    return 'Build a cart section with editable line items, quantity controls, remove buttons, subtotal, promo code input, total, and checkout button. Use data-qay-commerce cart hooks.';
  }
  if (normalized === 'checkout') {
    return 'Build a checkout section with shipping form, payment placeholder, order summary, secure checkout badge, and a strong place order/checkout CTA. Use data-qay-commerce checkout-button.';
  }
  if (normalized === 'faq' || normalized === 'accordion') {
    return 'Build a polished accordion FAQ with at least four questions. Use QAY toggle hooks, unique ids, hidden panels, and no scripts.';
  }
  if (normalized === 'nav' || normalized === 'navbar') {
    return `Build a responsive navigation for a ${siteType} website. Use real route links, repeatable desktop and mobile menu structure, and QAY toggle hooks for mobile.`;
  }
  if (normalized === 'footer') {
    return `Build a footer for a ${siteType} website with brand, route links, contact/newsletter/social placeholders, and consistent brand tone.`;
  }
  return `Build the exact ${slot} section needed for a ${siteType} website. Make it specific to the prompt, modern, responsive, and visually distinct.`;
}
