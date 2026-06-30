export type QayPromptTemplateId = string;

export type QayPromptTemplate = {
  id: QayPromptTemplateId;
  title: string;
  category: string;
  description: string;
  exampleBusiness: string;
  prompt: string;
};

const coreQayPromptTemplates: QayPromptTemplate[] = [
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

type PromptCategorySeed = {
  siteType: string;
  category: string;
  examples: string;
  niche: string;
  pages: string;
  visual: string;
  mustInclude: string;
  avoid: string;
};

const categorySeeds: PromptCategorySeed[] = [
  {
    siteType: 'real-estate',
    category: 'Real Estate',
    examples: 'Ryte, Estate North, BlueKey Realty',
    niche: 'property sales, luxury homes, rentals, agents, and qualified buyer inquiries',
    pages: 'Homepage, Listings, Property Detail, Agents, About, and Contact',
    visual: 'premium property photography, blue/black or refined neutral palettes, map/search cards, listing filters, agent proof, mortgage/trust details',
    mustInclude: 'property cards with price, location, beds, baths, size, featured listing badges, inquiry CTA, agent cards, and no blog/article pages unless asked',
    avoid: 'blog archive structures, article cards, product carts, restaurant menus, and generic agency copy',
  },
  {
    siteType: 'ecommerce',
    category: 'Ecommerce',
    examples: 'Baddo World, Volt Mobile, Maison Scent',
    niche: 'online sales, products, collections, cart, checkout, product detail, trust, shipping, and returns',
    pages: 'Homepage, Shop, Product, Cart, Checkout, About, and Contact',
    visual: 'product-first grids, bold buy buttons, editorial product imagery, collection rails, offer badges, and premium checkout surfaces',
    mustInclude: 'QAY commerce hooks, add-to-cart buttons, cart drawer, cart count, product IDs, product handles, checkout page, and realistic prices',
    avoid: 'menus for restaurants, blog-only layouts, service-agency copy, and unrelated product words',
  },
  {
    siteType: 'restaurant',
    category: 'Restaurant',
    examples: 'Orun Table, Ember Bistro, Lagos Hearth',
    niche: 'dining, menu, reservations, cuisine, chef story, hours, location, and hospitality',
    pages: 'Homepage, Menu, Reservations, About, Gallery, and Contact',
    visual: 'full food/venue imagery, warm or dramatic palettes, menu categories, chef story, booking CTA, and location/hours blocks',
    mustInclude: 'dish names, dish descriptions, prices, reservation CTA, hours, address, phone/email, and food/venue photos',
    avoid: 'ecommerce cart, product detail, checkout, SaaS dashboards, and generic feature cards',
  },
  {
    siteType: 'saas',
    category: 'SaaS',
    examples: 'Flowboard, MetricOps, LaunchGrid',
    niche: 'software, dashboard workflows, teams, analytics, integrations, automation, pricing, and onboarding',
    pages: 'Homepage, Features, Pricing, Login, Sign up, About, Contact, and FAQ',
    visual: 'dashboard-preview heroes, quiet premium surfaces, integration strips, feature grids, metrics, pricing cards, and security sections',
    mustInclude: 'specific workflows, integrations, analytics, pricing tiers, FAQ, CTAs, and auth hooks if account flow is requested',
    avoid: 'real estate listings, restaurant menus, physical product carts unless commerce is requested',
  },
  {
    siteType: 'portfolio',
    category: 'Portfolio',
    examples: 'Mira Okafor, Northline Studio, Dev by Kay',
    niche: 'creative work, case studies, project outcomes, process, roles, tools, and contact',
    pages: 'Homepage, Work, About, and Contact',
    visual: 'editorial project grids, varied case-study cards, strong imagery, large name hero, process details, and social/contact links',
    mustInclude: 'project names, client industries, role, year, outcome, tools, about/process copy, and hire CTA',
    avoid: 'pricing plans, carts, restaurant menus, and generic "creative solutions" filler',
  },
  {
    siteType: 'agency',
    category: 'Agency',
    examples: 'Northline Studio, Frame & Signal, Lagos Brand Co.',
    niche: 'services, case studies, process, team, clients, strategy, design, marketing, and contact',
    pages: 'Homepage, Services, Work or Case Studies, About, and Contact',
    visual: 'asymmetric hero, bento work grid, team/process sections, client proof, precise borders, premium whitespace, and strong CTAs',
    mustInclude: 'service names, process steps, case-study proof, client logos/text, team or founder section, and request-a-quote CTA',
    avoid: 'SaaS dashboards unless productized service, product cart, and blog-only layouts',
  },
  {
    siteType: 'blog',
    category: 'Blog',
    examples: 'Metric, Founder Notes, Dev Ledger',
    niche: 'articles, authors, categories, tags, newsletter, reading experience, and editorial trust',
    pages: 'Homepage, Blog, Article, Categories, Authors, About, Contact, Privacy, Terms, and 404',
    visual: 'Linear/Medium/Notion style editorial spacing, clean article cards, reading layout, author profiles, search, filters, and newsletter CTA',
    mustInclude: 'article cards, author names, dates, categories, reading time, article page blocks, related articles, comments, and social sharing',
    avoid: 'real estate property listings unless explicitly a property publication, carts, checkout, and generic service copy',
  },
  {
    siteType: 'law',
    category: 'Law',
    examples: 'Sterling Counsel, Adeyemi Legal, Northbar Law',
    niche: 'practice areas, attorneys, consultations, legal trust, results, and contact',
    pages: 'Homepage, Practice Areas, Attorneys, About, and Contact',
    visual: 'authoritative navy/black/gold or clean legal palette, sharp typography, attorney cards, results metrics, and consultation CTAs',
    mustInclude: 'practice areas, attorney names/specializations, jurisdiction-aware copy, consultation form, and trust metrics',
    avoid: 'casual slang, ecommerce carts, restaurant menus, and risky legal promises',
  },
  {
    siteType: 'medical',
    category: 'Medical',
    examples: 'ClearCare Clinic, Nova Dental, Wellpath Health',
    niche: 'healthcare, services, practitioners, appointments, patient trust, and location',
    pages: 'Homepage, Services, Team, About, Appointments, and Contact',
    visual: 'calm clinical palette, practitioner imagery, service cards, appointment CTA, patient trust, and accessible forms',
    mustInclude: 'treatments/services, practitioner profiles, appointment CTA, hours, location, insurance/trust notes, and no exaggerated claims',
    avoid: 'commerce checkout, legal copy, restaurant menu, and dark unreadable surfaces',
  },
  {
    siteType: 'hotel',
    category: 'Hotel',
    examples: 'Kairo Suites, Blue Palm Resort, The Meridian Lodge',
    niche: 'rooms, amenities, bookings, hospitality, gallery, location, and guest experience',
    pages: 'Homepage, Rooms, Amenities, Gallery, About, Booking, and Contact',
    visual: 'large hospitality imagery, room cards, availability CTA, amenity icons, calm luxury palette, and guest reviews',
    mustInclude: 'room types, rates or booking CTA, amenities, location, check-in details, and gallery',
    avoid: 'ecommerce product grids, blog article pages, and SaaS language',
  },
  {
    siteType: 'education',
    category: 'Education',
    examples: 'SkillForge Academy, Lagos Code School, BrightPath Tutors',
    niche: 'courses, curriculum, instructors, outcomes, enrollment, students, and learning trust',
    pages: 'Homepage, Courses, Instructors, Pricing or Enrollment, About, FAQ, and Contact',
    visual: 'clear course cards, instructor profiles, student outcomes, bright confident palette, progress/process sections, and enrollment CTA',
    mustInclude: 'course names, modules, outcomes, instructors, duration, certification/enrollment copy, and FAQ',
    avoid: 'property listings, carts unless selling courses, and generic school slogans',
  },
  {
    siteType: 'event',
    category: 'Event',
    examples: 'Future Lagos Summit, Neon Nights, The Founder Dinner',
    niche: 'event details, date, venue, agenda, speakers, tickets, RSVP, and sponsors',
    pages: 'Homepage, Schedule, Speakers, Venue, Tickets or RSVP, and Contact',
    visual: 'dramatic hero, date blocks, agenda timeline, speaker cards, venue imagery, sponsor strip, and urgent ticket CTA',
    mustInclude: 'event date, venue, agenda sessions, speaker/performer names, ticket/RSVP CTA, and map/location details',
    avoid: 'generic agency pages, product checkout unless ticketing requested, and restaurant menu sections',
  },
  {
    siteType: 'beauty',
    category: 'Beauty',
    examples: 'Luma Salon, Blush Room, Aura Spa',
    niche: 'salon/spa services, treatments, bookings, stylists, beauty results, and trust',
    pages: 'Homepage, Services, Gallery, Team, Booking, About, and Contact',
    visual: 'soft premium imagery, service menu cards, treatment packages, stylist/team profiles, before/after gallery, and booking CTA',
    mustInclude: 'service names, prices or packages, booking CTA, team/stylist names, location, and hours',
    avoid: 'restaurant dishes, product carts unless selling products, and corporate SaaS copy',
  },
  {
    siteType: 'fitness',
    category: 'Fitness',
    examples: 'Forge Gym, Pulse Studio, TrainHaus',
    niche: 'training, classes, schedules, trainers, memberships, fitness outcomes, and bookings',
    pages: 'Homepage, Classes, Schedule, Trainers, Pricing, About, and Contact',
    visual: 'high-energy imagery, class cards, trainer profiles, timetable rows, membership pricing, and strong CTA buttons',
    mustInclude: 'class names, schedule, trainers, membership plans, trial CTA, and location',
    avoid: 'food menu, property listing, and blog-only structure',
  },
  {
    siteType: 'church',
    category: 'Church',
    examples: 'Grace House, New Light Chapel, City Worship',
    niche: 'worship, service times, sermons, ministries, community, events, and giving',
    pages: 'Homepage, About, Ministries, Events, Sermons or Schedule, Contact, and Give if requested',
    visual: 'warm community imagery, service-time cards, ministry blocks, event schedule, sermon CTA, and welcoming copy',
    mustInclude: 'service times, location, ministries, community invitation, pastor/team section, and contact',
    avoid: 'ecommerce cart unless donations/store requested, legal copy, and generic corporate language',
  },
  {
    siteType: 'nonprofit',
    category: 'Nonprofit',
    examples: 'HopeBridge, Clean Water Lagos, Future Girls Fund',
    niche: 'mission, impact, donations, volunteers, programs, stories, and trust',
    pages: 'Homepage, Mission, Programs, Impact, Volunteer, Donate if requested, and Contact',
    visual: 'human-centered imagery, impact metrics, program cards, donation/volunteer CTA, warm trustworthy palette, and story sections',
    mustInclude: 'mission statement, impact stats, program names, volunteer CTA, donation CTA if requested, and contact',
    avoid: 'sales-heavy product grids, property listings, and vague charity filler',
  },
  {
    siteType: 'construction',
    category: 'Construction',
    examples: 'IronBuild, CedarWorks, MetroBuild Contractors',
    niche: 'construction, projects, services, estimates, team, safety, and credibility',
    pages: 'Homepage, Services, Projects, About, Team, and Contact',
    visual: 'project imagery, service cards, safety/trust stats, process timeline, estimate CTA, and strong industrial palette',
    mustInclude: 'services, project examples, estimate CTA, licenses/safety proof, team or supervisor section, and contact',
    avoid: 'restaurant menus, blog archive layout, and SaaS dashboard copy',
  },
  {
    siteType: 'tech-startup',
    category: 'Tech Startup',
    examples: 'APIForge, NeonStack, CloudPulse',
    niche: 'startup product, traction, features, API/dev tools, integrations, pricing, and launch',
    pages: 'Homepage, Product, Features, Pricing, Docs or Resources, About, and Contact',
    visual: 'dark/clean tech palette, product diagrams, code/API surfaces, feature grids, metrics, waitlist or trial CTA',
    mustInclude: 'specific product value, integrations, technical features, traction metrics, pricing/waitlist, and developer-friendly copy',
    avoid: 'real estate listings, restaurant menus, and generic agency service copy',
  },
  {
    siteType: 'photography',
    category: 'Photography',
    examples: 'Ayo Frames, Studio North, Golden Hour Co.',
    niche: 'photo portfolio, sessions, galleries, bookings, packages, and visual storytelling',
    pages: 'Homepage, Portfolio, Sessions, About, Pricing, and Contact',
    visual: 'large image-led layouts, gallery walls, session cards, package pricing, photographer story, and booking CTA',
    mustInclude: 'gallery categories, session types, packages, booking CTA, photographer bio, and contact',
    avoid: 'blog-heavy structure unless requested, ecommerce cart, and stock office imagery',
  },
  {
    siteType: 'music',
    category: 'Music',
    examples: 'Nova Beats, DJ Kairo, The Blue Room Band',
    niche: 'artist/band identity, releases, tour dates, music videos, booking, and fan connection',
    pages: 'Homepage, Music, Tour, Videos or Gallery, About, Booking, and Contact',
    visual: 'dramatic stage imagery, release cards, tour schedule, press/booking CTA, social links, and high-contrast palette',
    mustInclude: 'latest release, tour dates, booking CTA, media/gallery, artist story, and streaming/social links',
    avoid: 'property cards, restaurant menu, and generic corporate copy',
  },
];

const promptVariants = [
  {
    suffix: 'complete-site',
    title: 'Complete Multi-page Site',
    angle: 'Build a complete multi-page website that feels polished, premium, and ready for a real customer.',
  },
  {
    suffix: 'bold-conversion',
    title: 'Bold Conversion Landing + Pages',
    angle: 'Build a high-converting website with a strong hero, proof sections, clear CTAs, and supporting pages.',
  },
  {
    suffix: 'minimal-premium',
    title: 'Minimal Premium Brand Site',
    angle: 'Build a refined, minimal, editorial website with generous spacing, modern typography, and subtle motion.',
  },
];

const categoryPromptTemplates: QayPromptTemplate[] = categorySeeds.flatMap((seed) => (
  promptVariants.map((variant) => ({
    id: `${seed.siteType}-${variant.suffix}`,
    title: `${seed.category} - ${variant.title}`,
    category: seed.category,
    description: `${seed.category} prompt for ${seed.niche}.`,
    exampleBusiness: seed.examples,
    prompt: `${variant.angle}

Site type:
- This is a ${seed.category} website. Detect it as "${seed.siteType}".
- Use sections, images, copy, CTAs, and page routing that belong to ${seed.niche}.

Brand and audience:
- Brand name: [BRAND_NAME]
- Audience: [AUDIENCE]
- Tone: [TONE]
- Preferred colors: [COLORS]
- Location if relevant: [LOCATION]

Pages and routing:
- Generate a multi-page site unless I explicitly request one page.
- Pages should include ${seed.pages}.
- The exact same navbar and footer design from the homepage must be reused on every page.
- Every navigation link must point to an existing generated page slug.

Design direction:
- ${seed.visual}.
- Use the prompt colors intentionally across background, surfaces, readable text, accent buttons, borders, badges, and hover states.
- If the background is dark, text must be light. If the background is light, text must be dark.
- Use real Unsplash images that fit the website type.
- Use QAY animation attributes for hero, cards, section intros, media, and scroll-reveal moments.

Must include:
- ${seed.mustInclude}.

Avoid:
- ${seed.avoid}.

Copy:
- Rewrite every visible text for [BRAND_NAME].
- No placeholder copy, no lorem ipsum, and no unrelated industry words.`
  }))
));

export const qayPromptTemplates: QayPromptTemplate[] = [
  ...coreQayPromptTemplates,
  ...categoryPromptTemplates,
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
- Utility pages are owned by QAY. Do not generate normal content pages for 404, 500, or other error pages. If the user asks for utility pages, use QAY utility-page intent and only adapt the visual colors/copy safely.
${wantsCommerce ? '- Commerce was requested: include QAY commerce hooks, product grids/cards, add-to-cart, cart drawer/items/count, checkout button, and cart/checkout pages when multi-page.' : '- Do not include cart, checkout, product grids, or commerce hooks unless the user request is commerce/storefront.'}
${wantsAuth ? '- Auth was requested: QAY will enable site auth settings. Use QAY auth form hooks for signin, signup, forgot password, reset password, and logout where useful. Keep auth logic intact; for auth pages, mainly adapt colors, typography, and copy without inventing scripts.' : '- Do not include auth forms or portal/dashboard pages unless the user request mentions auth, membership, account, or portal.'}
${wantsCms ? '- CMS/content was requested: structure cards/detail pages like CMS-bound content with realistic fields, categories, tags, filters, search, and detail-page routing.' : '- Do not add CMS/editorial listing structures unless the user asks for content, blog, directory, listings, or CMS.'}
- Replace every visible text with copy specific to the user request. No placeholder copy. No unrelated product words.`;
}
