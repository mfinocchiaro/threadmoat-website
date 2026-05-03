# M023: AEO Issues 1-4: Language Routing, Stats, Schema, Translations

**Vision:** Fix 4 remaining AEO blockers: complete hardcoded string translations, fix German/French/Spanish insights pages showing "No posts yet", standardize 599 vs 600+ stats display, verify and add missing JSON-LD schema markup for better AI search indexing.

## Slices

- [ ] **S01: Complete translation migration (Issue #3)** `risk:Low — straightforward text replacement in one JSX file` `depends:[]`
  > After this: Navigate to /de/about, /fr/about, etc. and verify "Data as of Q1 2026" displays in correct language instead of English

- [ ] **S02: Fix multilingual blog routing (Issue #1)** `risk:Medium — blog fallback logic exists but /de/insights still shows empty state; may require cache clear or deployment` `depends:[S01]`
  > After this: Navigate to /de/insights, /fr/insights, /es/insights and verify English blog posts appear instead of "No posts yet"

- [ ] **S03: Standardize startup stats display (Issue #2)** `risk:Low — update constant and optionally document the 599 threshold` `depends:[]`
  > After this: Search for STARTUPS_DISPLAY in codebase and verify it's used consistently across all stat displays

- [ ] **S04: Verify and add missing JSON-LD schema markup (Issue #4)** `risk:Low — schema additions don't break rendering; FAQPage already present, need Organization/Article/BreadcrumbList audit` `depends:[S03]`
  > After this: Inspect source of /insights/market/plm-software and /insights/[slug] pages; verify 4+ schema blocks (FAQPage, BreadcrumbList, Organization, Article/NewsArticle)

## Boundary Map

Not provided.
