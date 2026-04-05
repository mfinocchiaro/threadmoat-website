# S03: Chart interpretive text and UX polish

**Goal:** Add interpretive text to 5 advanced charts, hide filters on settings page, add shortlist star to landscape-intro domain cards.
**Demo:** After this: 5 charts have explanation text, filters hidden on settings, landscape-intro cards show star

## Tasks
- [x] **T01: Added collapsible 'How to read this chart' explanations to 5 advanced charts and hid filters on settings page.** — 1. Add a brief explanatory paragraph to the page description on:
   - /dashboard/heatmap
   - /dashboard/parallel
   - /dashboard/box-plot
   - /dashboard/distribution
   - /dashboard/splom
2. Hide FilterToolbar on /dashboard/settings by checking pathname in sidebar-shell.tsx
3. Build and verify
  - Estimate: 20min
  - Files: app/dashboard/heatmap/page.tsx, app/dashboard/parallel/page.tsx, app/dashboard/box-plot/page.tsx, app/dashboard/distribution/page.tsx, app/dashboard/splom/page.tsx, components/dashboard/sidebar-shell.tsx
  - Verify: Build passes.
