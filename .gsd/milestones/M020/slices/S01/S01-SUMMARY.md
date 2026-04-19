---
id: S01
parent: M020
milestone: M020
provides:
  - ["JSON-LD structured data utility (lib/json-ld.tsx)", "Blog engine (lib/blog.ts + content/insights/)", "Public company directory pages", "Newsletter subscriber infrastructure", "Expanded sitemap with dynamic URLs"]
requires:
  []
affects:
  []
key_files:
  - ["lib/json-ld.tsx", "lib/blog.ts", "content/insights/plm-startup-landscape-2026.mdx", "app/[locale]/insights/page.tsx", "app/[locale]/insights/[slug]/page.tsx", "app/[locale]/companies/page.tsx", "app/[locale]/companies/[id]/page.tsx", "components/homepage/newsletter-signup.tsx", "app/api/newsletter/subscribe/route.ts", "app/sitemap.ts"]
key_decisions:
  - ["Server-side company data loading (no public API) to prevent scraping", "Store newsletter subscribers in Neon DB rather than Resend audience", "Blog posts as filesystem MDX with gray-matter frontmatter", "Used @plugin directive for Tailwind v4 typography", "Static params for English locale only to avoid massive build times"]
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-19T15:13:04.052Z
blocker_discovered: false
---

# S01: SEO & Marketing Foundation

**Shipped JSON-LD structured data, MDX blog engine, public company directory, newsletter capture, and expanded sitemap**

## What Happened

Five tasks completed across 4 commits:

T01 — Created lib/json-ld.tsx with Organization, WebSite, Product (AggregateOffer with 4 tiers), and Article schema generators. Wired JSON-LD script tags into all 4 existing public pages.

T02 — Installed next-mdx-remote, gray-matter, @tailwindcss/typography. Built blog engine with lib/blog.ts for filesystem-based MDX post loading. Created /[locale]/insights index with post cards and /[locale]/insights/[slug] detail with MDXRemote RSC rendering, prose typography, and Article JSON-LD. OG images for both. Sample post about PLM startup landscape.

T03 — Built /[locale]/companies as a paginated public directory (20/page, alphabetical) showing only public-safe fields (name, location, founded, discipline, categories, industries). Individual teaser pages at /[locale]/companies/[id] gate competitive scoring and funding behind login CTA. OG images for both. No public API endpoint — data loaded server-side from CSV to prevent scraping.

T04 — Created /api/newsletter/subscribe with Zod validation, IP rate limiting (5/hour), and auto-creating newsletter_subscribers table in Neon DB. Built NewsletterSignup client component with loading state and toast feedback. Placed on homepage and blog index.

T05 — Expanded sitemap.ts from 4 static pages to dynamic generation including all blog posts and all company pages with i18n alternates for 6 locales.

## Verification

TypeScript compilation passes with zero errors. Full next build succeeds. All new routes appear in build output: /[locale]/insights, /[locale]/insights/[slug], /[locale]/companies, /[locale]/companies/[id], /api/newsletter/subscribe, plus OG images for all new pages. Sitemap generates with company and blog URLs.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

None.
