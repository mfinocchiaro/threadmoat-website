# M025: Enhanced AEO/SEO

**Status:** PLANNED  
**Milestone ID:** M025  
**Title:** Enhanced AEO/SEO — OG Images, Schema Coverage, Content Velocity  

---

## Vision

Close critical AEO/SEO gaps that prevent effective social sharing and search crawl signals. All 15 market pages have content (body + 8 FAQs + schema), but are missing social images and comprehensive structured data. Add 5 new blog posts to deepen content footprint and increase internal link depth.

**Target outcome:** Every public page shows a branded social card when shared; every entity-rich page emits JSON-LD; blog grows from 5 → 10 posts for stronger crawl signals.

---

## Success Criteria

1. ✅ All public pages have `og:image` and `twitter:image` populated and rendering
2. ✅ `<script type="application/ld+json">` present on insights listing, report page, companies page, landscape page
3. ✅ Blog post count grows from 5 → 10 (5 new posts published)
4. ✅ `npm run build` succeeds with 0 errors and 0 TypeScript errors

---

## Slices

| Slice | Title | Goal | Status |
|-------|-------|------|--------|
| S01 | OG Images for All Pages | Dynamic og:image generation via next/og ImageResponse | Not started |
| S02 | Schema Coverage — Missing Pages | Wire missing JSON-LD on 4 key pages | Not started |
| S03 | Content Expansion — 5 New Blog Posts | Grow blog to 10 posts with high-intent AI/industrial queries | Not started |

---

## Slice Details

### S01: OG Images for All Pages

**Goal:** Every public page shows a branded og:image when shared on social media or passed to AI indexing services.

**Approach:** 
- Create dynamic `app/api/og/route.tsx` with `next/og` ImageResponse handler
- Accept `?title=X&type=Y` query params, render branded card (ThreadMoat amber/dark theme, title, logo)
- Update all page `generateMetadata()` to reference this route for `openGraph.images`
- Add fallback to root layout for pages without metadata override

**Files to modify:**
- `app/api/og/route.tsx` — NEW
- `lib/metadata.ts` — Add ogImageUrl parameter to buildOpenGraph()
- `app/layout.tsx` — Add fallback OG image
- `app/[locale]/page.tsx` — Pass og image URL
- `app/[locale]/about/page.tsx` — Pass og image URL
- `app/[locale]/pricing/page.tsx` — Pass og image URL
- `app/[locale]/report/page.tsx` — Pass og image URL
- `app/[locale]/insights/page.tsx` — Pass og image URL
- `app/[locale]/insights/market/[topic]/page.tsx` — Pass og image URL (15 market pages)

**Success criteria:**
- Every page has `og:image` in `<head>`
- Social card debugger shows branded image
- Twitter card renders correctly on share

---

### S02: Schema Coverage — Missing Pages

**Goal:** Wire JSON-LD structured data to all entity-rich public pages so search engines understand page content and purpose.

**Missing schema by page:**
- `app/[locale]/insights/page.tsx` → CollectionPage (blog listing)
- `app/[locale]/report/page.tsx` → Product schema (reuse existing `productJsonLd()`)
- `app/[locale]/companies/page.tsx` → `directoryItemListJsonLd()` (already defined)
- `app/landscape/page.tsx` → `datasetJsonLd()` (already defined)

**Files to modify:**
- `lib/json-ld.tsx` — Add `collectionPageJsonLd()` helper if missing
- `app/[locale]/insights/page.tsx` — Wire CollectionPage schema
- `app/[locale]/report/page.tsx` — Wire `productJsonLd()`
- `app/[locale]/companies/page.tsx` — Wire `directoryItemListJsonLd()`
- `app/landscape/page.tsx` — Wire `datasetJsonLd()`

**Success criteria:**
- `<script type="application/ld+json">` present on all 4 pages in browser DevTools
- Schema validates without errors (schema.org validator)

---

### S03: Content Expansion — 5 New Blog Posts

**Goal:** Grow blog from 5 → 10 posts targeting high-intent industrial AI search queries. Deepen internal link graph and improve crawl frequency signals.

**5 new MDX posts** (each 1,200–1,800 words, `locale: "en"`, proper frontmatter, 2–3 internal links, 4–6 FAQ questions):

1. `industrial-ai-roi-manufacturing.mdx` — "Measuring ROI on Industrial AI: What Metrics Actually Matter"
2. `plm-digital-thread-explained.mdx` — "The Digital Thread Explained: How Data Flows from Design to Production"
3. `digital-twin-vs-simulation.mdx` — "Digital Twin vs. Simulation: Key Differences for Engineering Teams"
4. `iot-edge-computing-manufacturing.mdx` — "Edge Computing in Manufacturing: Why Processing Data at the Source Matters"
5. `ai-quality-control-vision.mdx` — "Computer Vision for Quality Control: How Industrial AI is Replacing Manual Inspection"

**Files to create:**
- `content/blog/[locale]/industrial-ai-roi-manufacturing.mdx`
- `content/blog/[locale]/plm-digital-thread-explained.mdx`
- `content/blog/[locale]/digital-twin-vs-simulation.mdx`
- `content/blog/[locale]/iot-edge-computing-manufacturing.mdx`
- `content/blog/[locale]/ai-quality-control-vision.mdx`

**Success criteria:**
- All 5 posts render without MISSING_MESSAGE build errors
- `/insights` listing shows 10 posts
- Each post has internal links to 2–3 related market pages
- Each post has FAQ section (4–6 questions)

---

## Timeline

- **Planned:** 2026-05-04
- **Estimated duration:** 2–3 days (S01 + S02 parallel, S03 content creation)
- **Target completion:** 2026-05-07

---

## Dependencies

- None — all slices are independent
- No external blockers

---

## Files Modified Summary

- **New files:** 6 (api/og route + 5 blog posts)
- **Updated files:** ~9 (metadata, insights/report/companies/landscape pages, json-ld helpers)
- **Estimated LOC:** ~1,500 (mostly content)

---

## Archive Notes

This roadmap captures the M025 plan at definition. For execution details, see individual slice PLAN.md files in `.gsd/milestones/M025/slices/`.

**Status:** Ready for autonomous execution  
**Next action:** Run `/gsd:autonomous M025` to begin S01-S03 execution
