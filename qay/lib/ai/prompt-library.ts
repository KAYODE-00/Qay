export type QayPromptTemplateId =
  | 'ecommerce-premium'
  | 'blog-publication'
  | 'restaurant-reservation'
  | 'saas-product'
  | 'portfolio-creative'
  | 'auth-portal'
  | 'cms-publication';

export type QayPromptTemplate = {
  id: QayPromptTemplateId;
  title: string;
  category: string;
  description: string;
  exampleBusiness: string;
  prompt: string;
};

export const qayPromptTemplates: QayPromptTemplate[] = [
  {
    id: 'ecommerce-premium',
    title: 'Premium Ecommerce Store',
    category: 'Commerce',
    description: 'Multi-page shop with cart, checkout, product detail, strong product copy, and QAY commerce hooks.',
    exampleBusiness: 'Baddo World, Maison Scent, Volt Mobile',
    prompt: `Build a premium, fully responsive ecommerce website for [BRAND_NAME], a [PRODUCT_CATEGORY] brand.

Brand and audience:
- Brand name: [BRAND_NAME]
- Product category: [PRODUCT_CATEGORY]
- Audience: [AUDIENCE]
- Tone: [TONE]
- Preferred colors: [COLORS]

Pages and routing:
- Generate a multi-page site.
- Pages must include Homepage, Shop, Product, Cart, Checkout, About, and Contact.
- The navbar and footer must be consistent across all pages.
- Every nav link must point to an existing page slug.

Design direction:
- Choose an appropriate premium design style for the product category.
- Use the requested colors intentionally for backgrounds, surfaces, text, buttons, borders, badges, and hover states.
- Never put dark text on a dark background or light text on a light background.
- Use real Unsplash product imagery that fits the product category.
- Use smooth QAY motion attributes on hero, cards, section intros, and product media.

Commerce wiring:
- Include QAY ecommerce hooks for product grid, product cards, product image, title, description, price, add to cart, remove from cart, cart button, cart drawer, cart items, cart count, checkout button, cart close, and cart cancel.
- Product cards must use realistic product names, descriptions, prices, product handles, and product IDs for [PRODUCT_CATEGORY].
- Cart and checkout pages must look like real commerce pages and be editable.

Copy:
- Rewrite every visible text for [BRAND_NAME].
- Do not use placeholder copy, lorem ipsum, or unrelated product words.`,
  },
  {
    id: 'blog-publication',
    title: 'Premium Blog / Publication',
    category: 'Content',
    description: 'Publication prompt with home, blog, article, categories, authors, about, contact, and policies.',
    exampleBusiness: 'Metric, Founder Notes, Dev Ledger',
    prompt: `Build a modern premium blog website called [BRAND_NAME].

Brand and audience:
- Brand name: [BRAND_NAME]
- Topic or niche: [NICHE]
- Audience: [AUDIENCE]
- Tone: [TONE]
- Preferred colors: [COLORS]

Pages and routing:
- Generate a multi-page site.
- Pages must include Homepage, Blog, Article, Categories, Authors, About, Contact, Privacy Policy, Terms of Service, and 404.
- The navbar and footer must be identical across pages and every nav link must point to a page that exists.

Design direction:
- Clean, minimal, editorial, trustworthy, and premium.
- Use typography, cards, spacing, soft shadows, image rhythm, and subtle gradients that fit [NICHE].
- Use the prompt colors consistently and safely with readable contrast.
- Use real Unsplash images that match the article topics.

Content and CMS readiness:
- Write real article titles, summaries, author names, categories, tags, reading times, table of contents, pull quotes, code blocks when relevant, comments, related articles, and previous/next article navigation.
- Make article cards structured like CMS-ready content.
- If CMS is requested, include CMS-ready article, author, category, and tag concepts in the visible UI.

Interactions:
- Include search UI, category filters, tags, sorting controls, newsletter signup, smooth hover effects, and QAY animation attributes.
- Do not use scripts or inline event handlers.`,
  },
  {
    id: 'restaurant-reservation',
    title: 'Restaurant With Menu and Booking',
    category: 'Hospitality',
    description: 'Restaurant site with real menu copy, location, hours, reservation CTA, and no ecommerce cart.',
    exampleBusiness: 'Orun Table, Ember Bistro',
    prompt: `Build a premium restaurant website for [BRAND_NAME], a [CUISINE] restaurant.

Brand and audience:
- Brand name: [BRAND_NAME]
- Cuisine: [CUISINE]
- Location: [LOCATION]
- Tone: [TONE]
- Preferred colors: [COLORS]

Pages and routing:
- Generate a multi-page restaurant site unless I explicitly say one page.
- Pages should include Homepage, Menu, Reservations, About, Gallery, and Contact.
- The navbar and footer must be consistent across pages.
- Do not include ecommerce carts, product grids, checkout, or product detail pages.

Design direction:
- Use food, dining room, chef, and venue imagery from Unsplash.
- Use a palette that fits the cuisine and mood.
- Use menu sections with dish names, descriptions, and prices.
- Include hours, address, reservation CTA, private dining or event booking when useful.

Interactions:
- Use QAY toggle hooks for mobile menus or reservation modal.
- Use QAY motion attributes for hero, menu cards, gallery, and story sections.`,
  },
  {
    id: 'saas-product',
    title: 'SaaS Product Website',
    category: 'SaaS',
    description: 'SaaS pages with pricing, login/signup, dashboard-like sections, integrations, and FAQ.',
    exampleBusiness: 'Flowboard, MetricOps',
    prompt: `Build a premium SaaS website for [BRAND_NAME], a [PRODUCT_DESCRIPTION] product.

Brand and audience:
- Brand name: [BRAND_NAME]
- Product: [PRODUCT_DESCRIPTION]
- Audience: [AUDIENCE]
- Tone: [TONE]
- Preferred colors: [COLORS]

Pages and routing:
- Generate a multi-page SaaS site.
- Pages must include Homepage, Features, Pricing, Login, Sign up, About, Contact, and FAQ if useful.
- The navbar and footer must be consistent across all pages.

Design direction:
- Use dashboard-style previews, integration strips, feature grids, security/trust blocks, pricing cards, FAQ, and strong CTA sections.
- Use the requested colors carefully for app surfaces, buttons, active states, and accents.

Auth wiring:
- Login and signup pages must include QAY auth form hooks when auth/account flow is requested.
- Include signin and signup fields with proper input names and success/error message hooks.

Copy:
- Write specific product copy for [PRODUCT_DESCRIPTION], not generic productivity filler.`,
  },
  {
    id: 'portfolio-creative',
    title: 'Creative Portfolio',
    category: 'Portfolio',
    description: 'Portfolio with work grid, case-study language, about, contact, and visual craft.',
    exampleBusiness: 'Mira Okafor, Northline Studio',
    prompt: `Build a premium portfolio website for [BRAND_NAME], a [ROLE_OR_DISCIPLINE].

Brand and audience:
- Name: [BRAND_NAME]
- Discipline: [ROLE_OR_DISCIPLINE]
- Audience: [AUDIENCE]
- Tone: [TONE]
- Preferred colors: [COLORS]

Pages and routing:
- Generate a multi-page portfolio.
- Pages should include Homepage, Work, About, and Contact.
- The homepage navbar and footer must be reused across all pages.

Design direction:
- Choose an editorial, case-study-driven layout with strong project imagery.
- Use real project names, roles, outcomes, industries, tools, and dates.
- Use tasteful animations and hover effects on work cards and media.

Copy:
- Rewrite every visible text for [BRAND_NAME] and [ROLE_OR_DISCIPLINE].
- Avoid generic creative phrases unless they fit the specific work.`,
  },
  {
    id: 'auth-portal',
    title: 'Auth / Membership Portal',
    category: 'Auth',
    description: 'Prompt for portals, courses, communities, dashboards, and member-only flows.',
    exampleBusiness: 'QAY Academy, Client Hub',
    prompt: `Build a premium auth-protected website for [BRAND_NAME], a [PORTAL_TYPE].

Brand and audience:
- Brand name: [BRAND_NAME]
- Portal type: [PORTAL_TYPE]
- Audience: [AUDIENCE]
- Tone: [TONE]
- Preferred colors: [COLORS]

Pages and routing:
- Generate a multi-page site.
- Pages must include Homepage, Login, Sign up, Forgot Password, Reset Password, Dashboard, Account, and Contact.
- The navbar and footer must be consistent across public pages.

Auth wiring:
- Use QAY auth hooks for signin, signup, forgot-password, reset-password, and logout.
- Forms must use correct input names: email, password, name or fullName.
- Include data-qay-site-auth-error and data-qay-site-auth-success elements.

Design direction:
- Make the public site trustworthy and the dashboard useful, not decorative.
- Include account access copy, private area language, member benefits, and security/trust details.`,
  },
  {
    id: 'cms-publication',
    title: 'CMS-Ready Content Site',
    category: 'CMS',
    description: 'CMS-ready site structure for blogs, directories, resources, authors, categories, and listings.',
    exampleBusiness: 'Local Guide, Course Library',
    prompt: `Build a CMS-ready website for [BRAND_NAME], focused on [CONTENT_TYPE].

Brand and audience:
- Brand name: [BRAND_NAME]
- Content type: [CONTENT_TYPE]
- Audience: [AUDIENCE]
- Tone: [TONE]
- Preferred colors: [COLORS]

Pages and routing:
- Generate a multi-page site.
- Pages should include Homepage, Listings or Blog, Detail page, Categories, Authors or Contributors, About, Contact, Privacy, and Terms.
- The navbar and footer must be consistent across pages.

CMS readiness:
- Design cards and detail pages as if they are bound to CMS collections.
- Include realistic fields in the UI: title, slug, author, category, tags, date, summary, image, reading time or listing metadata.
- Include filters, search, sorting, and category navigation when useful.

Design direction:
- Use the colors from the prompt consistently and safely.
- Use real Unsplash images that fit [CONTENT_TYPE].
- Use QAY animations and hover states without scripts.`,
  },
];

const templateById = new Map(qayPromptTemplates.map((template) => [template.id, template]));

export function getQayPromptTemplate(id: string | undefined | null) {
  if (!id) return null;
  return templateById.get(id as QayPromptTemplateId) || null;
}

export function buildQayPromptFromTemplate(templateId: string, userDetails: string) {
  const template = getQayPromptTemplate(templateId);
  if (!template) return userDetails.trim();

  const details = userDetails.trim();
  return `${template.prompt}

User-provided details to apply:
${details || 'Use the template placeholders intelligently and choose fitting realistic details.'}`;
}

export function enhancePromptForQay(prompt: string) {
  const p = prompt.toLowerCase();
  const wantsCommerce = /\b(ecommerce|e-commerce|shop|store|cart|checkout|product|sell|commerce)\b/.test(p);
  const wantsAuth = /\b(auth|login|sign in|signin|signup|sign up|register|membership|member|portal|dashboard|account|protected)\b/.test(p);
  const wantsCms = /\b(cms|blog|article|articles|author|authors|category|categories|post|posts|directory|listing|listings|collection|collections)\b/.test(p);
  const onePage = /\b(single page|single-page|one page|one-page|landing page only)\b/.test(p);

  return `${prompt.trim()}

QAY builder instructions:
- Respect the user's requested colors. If the user gave one or more colors, plan how each color is used across background, surface, text, accent, buttons, borders, badges, and hover states. Keep contrast readable.
- Use the same navbar and footer design across all generated pages.
- ${onePage ? 'This is a single-page site: use one Homepage and make navigation behave like section/anchor routing.' : 'If this request naturally needs multiple pages, generate sibling data-qay-page wrappers and make every navbar/footer route point to an existing page.'}
- If a requested section exists in the QAY section library, use the matching section. If QAY does not have a section that fits a specific prompt requirement, generate only that missing section and keep it import-ready.
${wantsCommerce ? '- Commerce was requested: include QAY commerce hooks, product grids/cards, add-to-cart, cart drawer/items/count, checkout button, and cart/checkout pages when multi-page.' : '- Do not include cart, checkout, product grids, or commerce hooks unless the user request is commerce/storefront.'}
${wantsAuth ? '- Auth was requested: include dedicated auth pages and QAY auth form hooks for signin, signup, forgot password, reset password, and logout where useful.' : '- Do not include auth forms or portal/dashboard pages unless the user request mentions auth, membership, account, or portal.'}
${wantsCms ? '- CMS/content was requested: structure cards/detail pages like CMS-bound content with realistic fields, categories, tags, filters, search, and detail-page routing.' : '- Do not add CMS/editorial listing structures unless the user asks for content, blog, directory, listings, or CMS.'}
- Replace every visible text with copy specific to the user request. No placeholder copy. No unrelated product words.`;
}
