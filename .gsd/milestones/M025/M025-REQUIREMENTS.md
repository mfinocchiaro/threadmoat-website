# M025 Requirements

**Milestone:** M025 — Enhanced AEO/SEO  
**Status:** ACTIVE  
**Created:** 2026-05-04

---

## Requirements Summary

M025 delivers 5 core requirements across 3 slices:

### Social Sharing & OG Images

- [ ] **AEO-01**: All public pages emit `og:image` and `twitter:image` meta tags
  - **Delivered by:** S01 (OG Images for All Pages)
  - **Priority:** Critical
  - **Why:** Without og:image, social cards are blank (Twitter, Discord, LinkedIn), reducing click-through on shared links

- [ ] **AEO-02**: OG images are branded (ThreadMoat logo, amber/dark theme, page title)
  - **Delivered by:** S01
  - **Priority:** High
  - **Why:** Generic or missing images harm brand impression and CTR on social platforms

### Structured Data & SEO

- [ ] **AEO-03**: All entity-rich pages (insights, report, companies, landscape) emit JSON-LD schema
  - **Delivered by:** S02 (Schema Coverage — Missing Pages)
  - **Priority:** Critical
  - **Why:** Structured data helps search engines understand content type; missing schema on key pages limits rich snippet eligibility

- [ ] **AEO-04**: All JSON-LD schemas validate against schema.org without errors
  - **Delivered by:** S02
  - **Priority:** High
  - **Why:** Malformed schema can confuse search engines; valid schema improves crawl signal clarity

### Content Depth & Authority

- [ ] **AEO-05**: Blog grows from 5 → 10 posts with high-intent industrial AI keywords
  - **Delivered by:** S03 (Content Expansion — 5 New Blog Posts)
  - **Priority:** High
  - **Why:** Thin content depth (5 posts) signals weak topical authority; 10+ posts improves crawl frequency and internal link density

---

## Requirements Traceability

| ID | Requirement | Slice | Priority | Status |
|----|-------------|-------|----------|--------|
| AEO-01 | og:image + twitter:image on all pages | S01 | Critical | ⬜ |
| AEO-02 | Branded OG image design | S01 | High | ⬜ |
| AEO-03 | JSON-LD on insights/report/companies/landscape | S02 | Critical | ⬜ |
| AEO-04 | Schema validation (no errors) | S02 | High | ⬜ |
| AEO-05 | Blog grows to 10 posts (5 new) | S03 | High | ⬜ |

**Coverage:** 5/5 requirements planned

---

## Dependency & Integration Map

```
AEO-01 (OG Images)
  ├─ Requires: lib/metadata.ts enhancement
  ├─ Affects: All public pages (generateMetadata)
  └─ No external deps

AEO-02 (Branded Design)
  ├─ Depends on: AEO-01 (needs ImageResponse handler)
  └─ Design: ThreadMoat brand guidelines (amber, dark theme)

AEO-03 (JSON-LD Coverage)
  ├─ Requires: lib/json-ld.tsx helpers exist
  ├─ Affects: 4 pages (insights, report, companies, landscape)
  └─ No external deps

AEO-04 (Schema Validation)
  ├─ Depends on: AEO-03 (schemas must exist)
  └─ Tool: schema.org validator (free online)

AEO-05 (Blog Content)
  ├─ Requires: Content directory structure in place
  ├─ Affects: /insights listing page
  └─ No external deps
```

---

## Success Criteria by Requirement

### AEO-01: og:image + twitter:image on all pages

**Definition of Done:**
- Every public page includes `<meta property="og:image" content="...">` and `<meta name="twitter:image" content="...">`
- Image URLs are valid (no 404s, not placeholder)
- All 8 page types covered: home, about, pricing, report, insights listing, insights blog post, companies, landscape

**Validation method:**
- Use Twitter Card validator on each page URL
- Inspect `<head>` in browser DevTools to confirm tags present
- Test on Discord/LinkedIn to confirm card renders

---

### AEO-02: Branded OG image design

**Definition of Done:**
- OG images follow ThreadMoat brand (amber #D97706 or similar, dark mode compatible)
- Images include: ThreadMoat logo (top right), page title (center), optional company count or tagline (bottom)
- Images are 1200x630px (standard social size)
- No placeholder or generic images

**Validation method:**
- Visual inspection on social platforms
- Brand consistency check against existing site colors

---

### AEO-03: JSON-LD on insights/report/companies/landscape

**Definition of Done:**
- `app/[locale]/insights/page.tsx` emits `CollectionPage` schema
- `app/[locale]/report/page.tsx` emits `Product` schema (reuse existing `productJsonLd()`)
- `app/[locale]/companies/page.tsx` emits `DirectoryItemList` schema
- `app/landscape/page.tsx` emits `Dataset` schema
- Each `<script type="application/ld+json">` is present in page source

**Validation method:**
- Browser DevTools → Inspect `<script type="application/ld+json">` in `<head>`
- Verify all 4 pages have schema blocks

---

### AEO-04: Schema validation (no errors)

**Definition of Done:**
- All JSON-LD schemas validate without errors in https://validator.schema.org/
- Schema properties match schema.org spec (no typos, correct field names)

**Validation method:**
- Copy each `<script type="application/ld+json">` block and paste into schema.org validator
- Confirm "Validation successful" (0 errors)

---

### AEO-05: Blog grows to 10 posts (5 new)

**Definition of Done:**
- 5 new MDX blog posts created and published
- `/insights` listing page shows 10 posts (5 existing + 5 new)
- Each new post: 1,200–1,800 words, `locale: "en"`, proper frontmatter, FAQ section (4–6 questions)
- Each new post links to 2–3 related market pages

**Validation method:**
- `npm run build` succeeds, no MISSING_MESSAGE errors
- `/insights` page displays all 10 posts
- Click through each new post to verify rendering and links

---

## Requirement Outcomes (PENDING)

All 5 M025 requirements are:
- ⬜ **To be validated** — Will be built and tested in working system
- ⬜ **To be integrated** — Cross-slice integration verified during execution
- ⬜ **To be production-ready** — Verified before milestone closure

---

## Notes

- All requirements are independent; no blockers or dependencies between slices
- M025 is AEO/SEO focused; performance optimization deferred to M026
- Blog content can be written in parallel with S01/S02 implementation

---

**Created by:** Claude Code  
**Date:** 2026-05-04  
**Status:** Ready for S01-S03 execution  
**Next action:** Autonomous execution via `/gsd:autonomous M025`
