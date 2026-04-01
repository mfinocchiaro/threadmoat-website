# S01: Filter Workflow Onboarding

**Goal:** New dashboard visitors see a brief inline callout explaining that the filter toolbar applies to all charts simultaneously. The callout dismisses permanently on click or auto-dismisses after the user applies their first filter.
**Demo:** After this: New user sees a brief tooltip or guide explaining the filter→chart workflow on first visit.

## Tasks
- [x] **T01: Created dismissable inline onboarding callout that teaches new users about the filter→chart workflow, with localStorage persistence and auto-dismiss on first filter use** — Create a dismissable inline callout component that appears above the filter buttons in FilterToolbar. Uses localStorage for persistent dismissal. Auto-dismisses when the user applies their first filter (via activeFilterCount from useFilter).

The component must:
1. Read `filter-onboarding-dismissed` from localStorage in a useEffect (not during SSR) to avoid hydration mismatches
2. Render a compact Alert-style callout with an info icon, a one-liner about filters applying to all charts, and a dismiss X button
3. On dismiss click: set localStorage key and hide
4. On activeFilterCount going from 0 to >0: auto-dismiss and set localStorage key
5. When dismissed (either way), never render again

Mount the component inside FilterToolbar's main wrapper div, between the sticky container and the 'No filters active' row / active chips row. It should appear above both rows but inside the sticky container so it scrolls with the toolbar.
  - Estimate: 30m
  - Files: components/dashboard/filter-onboarding-guide.tsx, components/dashboard/filter-toolbar.tsx
  - Verify: npm run build && grep -q 'filter-onboarding-dismissed' components/dashboard/filter-onboarding-guide.tsx && grep -q 'FilterOnboardingGuide' components/dashboard/filter-toolbar.tsx
