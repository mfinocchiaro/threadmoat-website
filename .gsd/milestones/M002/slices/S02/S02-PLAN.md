# S02: Deprecated Code Cleanup

**Goal:** Delete viz-filter-bar.tsx and clean up explore/page.tsx's standalone FilterProvider.
**Demo:** After this: viz-filter-bar.tsx deleted, explore page works, build passes with zero deprecated filter references.

## Tasks
- [x] **T01: Deleted deprecated viz-filter-bar.tsx and removed explore page's redundant FilterProvider.** — Delete components/viz-filter-bar.tsx. Verify no imports reference it. Check explore/page.tsx — if it uses its own FilterProvider, assess whether it can use the layout-level one or needs to keep its standalone provider (explore is a public-facing page within the dashboard route). Clean up any orphaned references. Build and verify.
  - Estimate: 15min
  - Files: components/viz-filter-bar.tsx, app/dashboard/explore/page.tsx
  - Verify: npm run build passes. grep -r VizFilterBar returns 0 results. grep -r viz-filter-bar returns 0 results.
