---
estimated_steps: 8
estimated_files: 2
skills_used: []
---

# T01: Build FilterOnboardingGuide and mount in FilterToolbar

Create a dismissable inline callout component that appears above the filter buttons in FilterToolbar. Uses localStorage for persistent dismissal. Auto-dismisses when the user applies their first filter (via activeFilterCount from useFilter).

The component must:
1. Read `filter-onboarding-dismissed` from localStorage in a useEffect (not during SSR) to avoid hydration mismatches
2. Render a compact Alert-style callout with an info icon, a one-liner about filters applying to all charts, and a dismiss X button
3. On dismiss click: set localStorage key and hide
4. On activeFilterCount going from 0 to >0: auto-dismiss and set localStorage key
5. When dismissed (either way), never render again

Mount the component inside FilterToolbar's main wrapper div, between the sticky container and the 'No filters active' row / active chips row. It should appear above both rows but inside the sticky container so it scrolls with the toolbar.

## Inputs

- `components/dashboard/filter-toolbar.tsx`
- `contexts/filter-context.tsx`
- `components/ui/alert.tsx`

## Expected Output

- `components/dashboard/filter-onboarding-guide.tsx`
- `components/dashboard/filter-toolbar.tsx`

## Verification

npm run build && grep -q 'filter-onboarding-dismissed' components/dashboard/filter-onboarding-guide.tsx && grep -q 'FilterOnboardingGuide' components/dashboard/filter-toolbar.tsx
