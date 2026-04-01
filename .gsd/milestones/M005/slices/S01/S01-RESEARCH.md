# S01 — Filter Workflow Onboarding — Research

**Date:** 2026-04-01
**Depth:** Light

## Summary

This slice adds a brief tooltip or guide explaining the filter→chart workflow to first-time dashboard visitors. The codebase already has all the building blocks: an onboarding wizard (`onboarding-wizard.tsx`) with DB-backed dismissal via `/api/profile/onboarding`, Radix UI Tooltip/Popover/Dialog primitives from shadcn/ui, and `localStorage` patterns in `sidebar-shell.tsx`. The FilterToolbar is mounted inside `SidebarShell` as a sticky element above dashboard content.

The onboarding wizard shows *which charts to visit* per tier. This slice adds a complementary piece: explaining *how the filter toolbar works* — that selecting filters applies to all visible charts simultaneously. This is a small, self-contained UI addition with no backend changes needed.

## Recommendation

Build a dismissable callout/banner that appears inside or adjacent to the FilterToolbar on first visit. Use `localStorage` for dismissal persistence (key: `filter-onboarding-dismissed`), mirroring the sidebar-collapsed pattern already in the codebase. This is simpler and more appropriate than the DB-backed onboarding wizard pattern because:

1. The filter guide is a lightweight UX hint, not a critical onboarding flow
2. `localStorage` avoids an API round-trip and works for unauthenticated edge cases
3. The existing `localStorage` pattern in `sidebar-shell.tsx` is proven

The guide should be a compact inline callout (not a modal/dialog — those block interaction with the toolbar it's explaining). It should appear above or within the FilterToolbar, briefly explain the filter→chart workflow, and dismiss permanently on click.

## Implementation Landscape

### Key Files

- `components/dashboard/filter-toolbar.tsx` — Main FilterToolbar component where the onboarding callout will be added. The component has a clear two-row structure (active chips row + filter buttons row) that provides a natural insertion point.
- `components/dashboard/sidebar-shell.tsx` — Mounts `<FilterToolbar />` inside the scrollable content area. Shows `localStorage` pattern for persistent state.
- `components/dashboard/onboarding-wizard.tsx` — Existing onboarding pattern for reference (Dialog-based, DB-backed). NOT the pattern to follow for this slice — too heavy.
- `components/ui/alert.tsx` — `Alert`, `AlertTitle`, `AlertDescription` components available for the callout visual treatment.
- `components/ui/tooltip.tsx` — Radix Tooltip available if we need hover hints on specific filter buttons.
- `contexts/filter-context.tsx` — `useFilter` hook, `activeFilterCount` — useful for conditional display (e.g., hide guide once user has applied their first filter).

### Build Order

1. **Create the filter onboarding callout component** — A small `FilterOnboardingGuide` component that reads/writes `localStorage` for dismissal state. Renders a compact inline Alert with a dismiss button and a short message like "Use filters above to narrow all charts at once. Select categories, countries, or any criteria — every chart updates instantly."
2. **Mount it in FilterToolbar** — Insert above the filter buttons row, conditionally rendered when not dismissed.
3. **Auto-dismiss on first filter use** — Optional enhancement: listen to `activeFilterCount` and auto-dismiss the guide once the user applies their first filter (they've learned the workflow).

### Verification Approach

- `npm run build` passes with no type errors
- Visual check: new user (cleared localStorage) sees the callout on dashboard load
- Clicking dismiss hides the callout and it stays hidden on page reload
- Applying a filter auto-dismisses the callout
- Callout does not appear when `filter-onboarding-dismissed` is set in localStorage

## Constraints

- No external dependencies — use existing shadcn/ui components only
- The callout must not interfere with the sticky positioning of FilterToolbar (`sticky top-0 z-20`)
- Must work with SSR — `localStorage` reads must be guarded with `useEffect` / client-only state initialization (hydration mismatch otherwise)
