# S01: SEO & Marketing Foundation

**Goal:** Add SEO foundations: JSON-LD structured data on all public pages, MDX-powered blog engine at /[locale]/insights, public company directory with teaser pages, newsletter email capture via Resend, and expanded sitemap covering all new indexable URLs.
**Demo:** Google structured data test passes for JSON-LD on all public pages. Blog index renders with at least one sample post. Company directory shows paginated teaser list. Newsletter signup captures email to Resend.

## Must-Haves

- Google Rich Results Test passes for JSON-LD on homepage and pricing. Blog index renders with at least one sample post with i18n support. Company directory shows paginated teaser list with login gate for full profiles. Newsletter signup captures email to Resend. Sitemap includes all new public URLs.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: JSON-LD Structured Data on Public Pages** `est:30min`
  Add JSON-LD structured data to all public pages: Organization schema on homepage, Product + OfferCatalog on /pricing, Article schema prep for blog, WebSite with SearchAction on homepage. Create a shared lib/json-ld.ts utility for generating schema objects.
  - Files: `lib/json-ld.ts`, `app/[locale]/page.tsx`, `app/[locale]/pricing/page.tsx`, `app/[locale]/about/page.tsx`, `app/[locale]/report/page.tsx`
  - Verify: Build succeeds. JSON-LD script tags render in page source with valid schema.org markup.

- [x] **T02: MDX Blog Engine at /[locale]/insights** `est:90min`
  Install next-mdx-remote. Create blog infrastructure: content/insights/ directory for .mdx posts, lib/blog.ts for post loading/parsing with frontmatter (title, description, date, author, locale, slug). Build /[locale]/insights list page and /[locale]/insights/[slug] detail page with i18n support, OG images, and JSON-LD Article schema. Include one sample post about PLM startup landscape.
  - Files: `content/insights/`, `lib/blog.ts`, `app/[locale]/insights/page.tsx`, `app/[locale]/insights/[slug]/page.tsx`, `app/[locale]/insights/[slug]/opengraph-image.tsx`, `app/[locale]/insights/opengraph-image.tsx`
  - Verify: Blog index page renders at /insights. Sample post renders at /insights/[slug]. OG image generates. Build succeeds.

- [x] **T03: Public Company Directory with Teaser Pages** `est:75min`
  Create /[locale]/companies as a public paginated directory showing company name, category, location, and founding year — no sensitive scores or funding data. Each company links to /[locale]/companies/[id] teaser page showing basic info with a CTA to log in for the full profile. Server-side pagination (20 per page). Add OG images. Update company data loader to support public-safe field filtering.
  - Files: `app/[locale]/companies/page.tsx`, `app/[locale]/companies/[id]/page.tsx`, `app/[locale]/companies/opengraph-image.tsx`, `app/[locale]/companies/[id]/opengraph-image.tsx`, `lib/company-data.ts`
  - Verify: Directory page renders with paginated list. Teaser page shows basic info with login CTA. No sensitive data exposed. Build succeeds.

- [x] **T04: Newsletter Capture Component via Resend** `est:45min`
  Create a newsletter signup component (email input + submit) with Zod validation and Resend integration. Build /api/newsletter/subscribe endpoint that adds emails to a Resend audience or stores in Neon DB. Place the component on homepage (above footer) and blog index page. Include success/error toast feedback.
  - Files: `components/homepage/newsletter-signup.tsx`, `app/api/newsletter/subscribe/route.ts`, `app/[locale]/page.tsx`, `app/[locale]/insights/page.tsx`
  - Verify: Newsletter form renders on homepage and blog. Submitting a valid email calls the API and shows success toast. Invalid email shows validation error. Build succeeds.

- [x] **T05: Sitemap Expansion and SEO Verification** `est:30min`
  Update sitemap.ts to dynamically include: all blog post URLs (per locale), all company directory URLs (per locale), and the new /insights and /companies index pages. Add changeFrequency and priority values. Verify all JSON-LD, OG images, and sitemap entries are correct.
  - Files: `app/sitemap.ts`, `app/robots.ts`
  - Verify: Sitemap includes all new URLs with correct alternates. robots.txt allows crawling of new paths. Build succeeds with no errors.

## Files Likely Touched

- lib/json-ld.ts
- app/[locale]/page.tsx
- app/[locale]/pricing/page.tsx
- app/[locale]/about/page.tsx
- app/[locale]/report/page.tsx
- content/insights/
- lib/blog.ts
- app/[locale]/insights/page.tsx
- app/[locale]/insights/[slug]/page.tsx
- app/[locale]/insights/[slug]/opengraph-image.tsx
- app/[locale]/insights/opengraph-image.tsx
- app/[locale]/companies/page.tsx
- app/[locale]/companies/[id]/page.tsx
- app/[locale]/companies/opengraph-image.tsx
- app/[locale]/companies/[id]/opengraph-image.tsx
- lib/company-data.ts
- components/homepage/newsletter-signup.tsx
- app/api/newsletter/subscribe/route.ts
- app/sitemap.ts
- app/robots.ts
