# S03: Company Shortlist / Workspace — Research

**Date:** 2026-04-01

## Summary

S03 adds a cross-chart company shortlist: users click companies on any chart to add them to a persistent shortlist, shortlisted companies are visually highlighted across all charts, and the shortlist feeds into the report builder (S04 downstream).

The codebase has a clean provider-based architecture (`PlanProvider > ScenarioProvider > CompanyDataProvider > FilterProvider`) where a new `ShortlistContext` slots naturally. All 41 chart pages consume data via the `useThesisGatedData` hook, and chart components uniformly accept `data: Company[]`. Many D3-based charts already have `.on("click")` handlers for internal selection (periodic table, splom, spiral timeline, map, etc.), so adding shortlist interaction is a matter of layering a context-based toggle alongside existing click behaviors.

The primary design question is **how to trigger shortlist-add without conflicting with existing chart click handlers** (which open detail modals, hover cards, or drill-downs). The recommended approach is a dedicated "Add to Shortlist" button inside the existing `CompanyHoverCard` and detail dialogs, rather than hijacking the click itself. For charts that don't have a click-to-detail pattern (most D3 charts just have tooltips), a separate approach is needed — either a modifier-click or a small "+" icon overlay on hover.

## Recommendation

**Build a `ShortlistContext` + `useShortlist` hook** that:
1. Stores an array of company IDs (`string[]`) in React state
2. Persists to `localStorage` using the K001 SSR-safe pattern (default empty, hydrate in useEffect)
3. Exposes `add(id)`, `remove(id)`, `toggle(id)`, `has(id)`, `clear()`, `shortlistedCompanies` (resolved `Company[]`)
4. Sits between `CompanyDataProvider` and `FilterProvider` in the provider hierarchy so it has access to company data for resolving IDs to full `Company` objects

**For chart highlighting**, add an optional `shortlistedIds?: Set<string>` prop to chart components. Charts that receive this prop render shortlisted companies with a distinct visual treatment (e.g., bright border/ring, higher opacity, or a star marker). This is opt-in per chart — start with 3-4 key charts (bubble, quadrant, periodic table, landscape) and expand.

**For the shortlist panel**, add a collapsible sidebar panel or a floating drawer accessible from the topbar/filter-toolbar area. This panel shows the current shortlist with remove buttons and a "Clear All" action.

**For S04 integration**, the `useShortlist` hook returns `shortlistedCompanies` which the report builder can consume directly — replacing or augmenting its current per-report company search.

## Implementation Landscape

### Key Files

- `contexts/filter-context.tsx` — Existing context pattern to replicate. FilterProvider sits at the same level where ShortlistProvider will go.
- `contexts/company-data-context.tsx` — Provides `useCompanyData()` which ShortlistContext needs to resolve IDs → Company objects.
- `components/dashboard/layout-client.tsx` — Provider hierarchy: `PlanProvider > ScenarioProvider > CompanyDataProvider > FilterProvider > LayoutInner`. ShortlistProvider goes between CompanyDataProvider and FilterProvider.
- `hooks/use-thesis-gated-data.ts` — The data pipeline hook used by all 41 chart pages. Will need to expose `shortlistedIds` from context so chart pages can pass it through.
- `components/charts/bubble-chart.tsx` — Representative D3 chart. Accepts `data: Company[]`, renders SVG circles. Highlighting = adding stroke/fill treatment when `company.id` is in shortlist set.
- `components/charts/periodic-table.tsx` — Already has click→CompanyHoverCard pattern (line 223, 511-515). Natural place to add "Add to Shortlist" button.
- `components/charts/report-generator.tsx` — S04 downstream consumer. `ScenarioReportTab` already has a company multi-select pattern (chips, search, add/remove). Shortlist integration will pre-populate this.
- `components/ui/company-hover-card.tsx` — Shared hover/detail card used by periodic table and landscape chart. Adding a shortlist toggle button here gets shortlist-add capability on any chart that uses it.
- `components/dashboard/filter-toolbar.tsx` — The toolbar below the topbar. Natural location for a shortlist indicator/badge/panel toggle.
- `components/dashboard/sidebar-shell.tsx` — Layout wrapper. If shortlist panel is a sidebar drawer, it plugs in here.
- `components/dashboard/filter-onboarding-guide.tsx` — Reference implementation of K001 SSR-safe localStorage pattern.

### Build Order

1. **ShortlistContext + useShortlist hook** — Foundation. No UI yet, just the state management with localStorage persistence. This unblocks everything else.
2. **Shortlist panel UI** — A collapsible panel/drawer showing shortlisted companies with remove/clear. Accessible from the filter toolbar area (badge count + click to expand).
3. **CompanyHoverCard shortlist button** — Add a toggle button to the shared hover card. This gives shortlist-add capability to periodic table and landscape chart immediately.
4. **Chart highlighting** — Add `shortlistedIds` prop to 3-4 key chart components (bubble, quadrant, periodic table, treemap) with visual distinction (stroke ring or opacity boost).
5. **Integration test** — Verify cross-chart highlighting works: add company on one chart, see highlight on another.

### Verification Approach

- **Unit:** ShortlistContext add/remove/toggle/has/clear work correctly. localStorage roundtrip persists across page reload.
- **Build:** `npm run build` passes with no type errors.
- **Visual:** Navigate to bubble chart, add companies to shortlist via hover card on periodic table, switch to quadrant chart — shortlisted companies appear highlighted.
- **Report integration:** Shortlisted companies are accessible in report generator context (visible in shortlist panel, can be consumed by S04).
- **SSR safety:** No hydration mismatch warnings in console. Shortlist state loads after hydration per K001 pattern.

## Constraints

- **SSR/hydration safety** — Must follow K001 pattern: default to empty shortlist, hydrate from localStorage in useEffect, gate rendering on `hydrated` flag.
- **41 chart pages** — Cannot modify all 41 pages in this slice. The highlighting prop must be opt-in. Start with 3-4 charts; remaining charts can adopt the pattern incrementally.
- **Existing click handlers** — Many charts already use click for modals/detail views. Shortlist-add cannot hijack the primary click action. Must use a secondary interaction (button in hover card/dialog, or modifier-click).
- **Company ID stability** — Company IDs come from the data API. localStorage stores IDs. If IDs change between data loads, stale shortlist entries should be silently dropped when resolving.
- **Name masking** — `useThesisGatedData` returns masked company data for Analyst tier. Shortlist must work with real IDs but display masked names when appropriate.

## Common Pitfalls

- **Hydration mismatch** — Reading localStorage during render causes SSR/client divergence. Use K001 pattern (default empty, hydrate in useEffect).
- **Stale IDs in localStorage** — If company data changes, localStorage may reference IDs that no longer exist. Resolve silently by filtering against current company data set.
- **D3 re-render conflicts** — D3 charts use `useEffect` with `svg.selectAll("*").remove()` pattern. Adding highlight state means the D3 effect must include shortlist IDs in its dependency array, or use a CSS class approach that survives D3 redraws.
- **Provider ordering** — ShortlistProvider needs `useCompanyData()` to resolve IDs → Company objects. It must be a child of `CompanyDataProvider`. Placing it wrong causes "must be used within" errors.

## Open Risks

- **Performance with many charts open** — If shortlist changes trigger re-renders across all charts, there could be lag. Mitigation: shortlist set is stable by reference (useMemo), charts only re-render if their data or the set reference changes.
- **D3 highlight integration complexity** — Each D3 chart has its own rendering logic. The highlight treatment needs to be applied per-chart in the D3 render effect. This is mechanical but per-chart work. Scope to 3-4 charts in this slice, remainder in follow-up.
