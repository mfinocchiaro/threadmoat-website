# S02: Chart container overflow fixes for mobile

**Goal:** Add overflow-hidden and responsive padding to chart containers, fix common mobile overflow patterns
**Demo:** After this: Chart pages render without horizontal scroll at 375px viewport

## Tasks
- [x] **T01: Responsive padding (px-3 sm:px-6), overflow-x-hidden on scroll area, max-w-full on content container** — 1. In sidebar-shell.tsx, change content container from `px-6` to `px-3 sm:px-6` for tighter padding on mobile.
2. Add `overflow-x-hidden` to the content scroll area to prevent horizontal scroll from chart overflow.
3. In filter-toolbar.tsx, ensure the filter bar wraps on narrow screens (flex-wrap).
4. Add `max-w-full overflow-hidden` to the chart-card or page wrapper patterns commonly used across chart pages.
  - Estimate: 10min
  - Files: components/dashboard/sidebar-shell.tsx, components/dashboard/filter-toolbar.tsx
  - Verify: npm run build passes.
