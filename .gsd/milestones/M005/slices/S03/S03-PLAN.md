# S03: Company Shortlist / Workspace

**Goal:** Users can click companies across any chart to add them to a persistent shortlist. Shortlisted companies are visually highlighted across key charts and the shortlist is accessible from the toolbar for review, removal, and downstream use in the report builder.
**Demo:** After this: User clicks companies across any chart to add them to a shortlist. Shortlisted companies are highlighted across all charts and available in the report builder.

## Tasks
- [x] **T01: Created ShortlistContext with persistent localStorage-backed shortlist, wired ShortlistProvider into dashboard layout, and extended useThesisGatedData to expose shortlistedIds Set** — ## Description

Build the `ShortlistContext` and `useShortlist` hook that manages a persistent company shortlist with localStorage. Wire the `ShortlistProvider` into the dashboard provider hierarchy between `CompanyDataProvider` and `FilterProvider` in `layout-client.tsx`. The hook exposes `add(id)`, `remove(id)`, `toggle(id)`, `has(id)`, `clear()`, `count`, and `shortlistedCompanies` (resolved `Company[]`). Also extend `useThesisGatedData` to return a `shortlistedIds: Set<string>` so downstream charts can access it without importing the shortlist context directly.

## Steps

1. Create `contexts/shortlist-context.tsx` with:
   - `ShortlistProvider` component that uses `useCompanyData()` to resolve IDs
   - K001 SSR-safe localStorage pattern: state defaults to empty array, `useEffect` hydrates from localStorage key `threadmoat-shortlist`, `hydrated` boolean gates resolved company output
   - `useShortlist()` hook returning `{ add, remove, toggle, has, clear, count, ids, shortlistedCompanies, hydrated }`
   - `ids` is the raw `string[]` of company IDs; `shortlistedCompanies` resolves against current company data, silently dropping stale IDs
   - Memoize the `Set<string>` of IDs so reference-equality checks work for chart re-render optimization

2. Update `components/dashboard/layout-client.tsx`:
   - Import `ShortlistProvider` from `@/contexts/shortlist-context`
   - Insert `<ShortlistProvider>` between `<CompanyDataProvider>` and `<FilterProvider>` in the JSX tree
   - Provider hierarchy becomes: `PlanProvider > ScenarioProvider > CompanyDataProvider > ShortlistProvider > FilterProvider > LayoutInner`

3. Update `hooks/use-thesis-gated-data.ts`:
   - Import `useShortlist` from `@/contexts/shortlist-context`
   - Add `const { ids: shortlistIds } = useShortlist()` 
   - Compute `shortlistedIds: Set<string>` via `useMemo(() => new Set(shortlistIds), [shortlistIds])`
   - Return `shortlistedIds` from the hook so chart pages can pass it to chart components

## Must-Haves

- [ ] ShortlistContext created with add/remove/toggle/has/clear/count/ids/shortlistedCompanies/hydrated
- [ ] K001 SSR-safe localStorage pattern (default empty, hydrate in useEffect, hydrated flag)
- [ ] ShortlistProvider wired between CompanyDataProvider and FilterProvider in layout-client.tsx
- [ ] useThesisGatedData returns shortlistedIds Set<string>
- [ ] Stale IDs silently dropped when resolving shortlistedCompanies
- [ ] npm run build passes

## Verification

- `npm run build` passes with zero type errors
- `grep -q 'ShortlistProvider' components/dashboard/layout-client.tsx` confirms wiring
- `grep -q 'shortlistedIds' hooks/use-thesis-gated-data.ts` confirms hook extension
- `grep -q 'threadmoat-shortlist' contexts/shortlist-context.tsx` confirms localStorage key
  - Estimate: 45m
  - Files: contexts/shortlist-context.tsx, components/dashboard/layout-client.tsx, hooks/use-thesis-gated-data.ts
  - Verify: npm run build && grep -q 'ShortlistProvider' components/dashboard/layout-client.tsx && grep -q 'shortlistedIds' hooks/use-thesis-gated-data.ts
- [ ] **T02: Add shortlist toggle button to CompanyHoverCard and build shortlist panel in filter toolbar** — ## Description

Add the user-facing interaction layer: a shortlist toggle button inside `CompanyHoverCard` (enabling shortlist-add on periodic table and landscape chart), and a collapsible shortlist panel accessible from the filter toolbar with badge count, company list with remove buttons, and a clear-all action.

## Steps

1. Update `components/ui/company-hover-card.tsx`:
   - Import `useShortlist` from `@/contexts/shortlist-context`
   - Add a `Star` icon button (from lucide-react) in the header row next to the company name
   - When `has(company.id)` is true: filled star icon with amber color (`text-amber-500`), tooltip "Remove from shortlist"
   - When false: outline star icon, tooltip "Add to shortlist"
   - `onClick` calls `toggle(company.id)` with `e.stopPropagation()` to prevent closing the hover card
   - Use the `hydrated` flag from useShortlist — only show the button after hydration to avoid flash

2. Create `components/dashboard/shortlist-panel.tsx`:
   - Collapsible panel component that shows the current shortlist
   - Uses `useShortlist()` to get `shortlistedCompanies`, `remove`, `clear`, `count`
   - Renders as a dropdown/popover anchored to a toolbar trigger button
   - Each company row shows: company name, subsegment badge, remove button (X icon)
   - Footer has a "Clear All" button (only enabled when count > 0)
   - Empty state: "Click the ★ on any company card to start building your shortlist"
   - Panel should be scrollable if many companies (max-h with overflow-y-auto)

3. Update `components/dashboard/filter-toolbar.tsx`:
   - Import `ShortlistPanel` trigger component
   - Add a shortlist button in the toolbar (after the filter categories area, before search): a `Star` icon + badge count showing number of shortlisted companies
   - Badge only visible when count > 0
   - Click opens the ShortlistPanel popover

## Must-Haves

- [ ] CompanyHoverCard has a star toggle button that adds/removes companies from shortlist
- [ ] ShortlistPanel shows all shortlisted companies with remove buttons and Clear All
- [ ] Filter toolbar has a shortlist badge/button that opens the panel
- [ ] Star button state reflects current shortlist membership (filled=in, outline=out)
- [ ] e.stopPropagation() on star click prevents hover card dismissal
- [ ] npm run build passes

## Verification

- `npm run build` passes with zero type errors
- `grep -q 'useShortlist' components/ui/company-hover-card.tsx` confirms toggle integration
- `grep -q 'ShortlistPanel\|shortlist-panel' components/dashboard/filter-toolbar.tsx` confirms toolbar integration
- `test -f components/dashboard/shortlist-panel.tsx` confirms panel file created
  - Estimate: 1h
  - Files: components/ui/company-hover-card.tsx, components/dashboard/shortlist-panel.tsx, components/dashboard/filter-toolbar.tsx
  - Verify: npm run build && grep -q 'useShortlist' components/ui/company-hover-card.tsx && test -f components/dashboard/shortlist-panel.tsx && grep -q 'shortlist' components/dashboard/filter-toolbar.tsx
- [ ] **T03: Thread shortlistedIds to 4 key charts and render visual highlight treatment** — ## Description

Add an optional `shortlistedIds?: Set<string>` prop to 4 key chart components (bubble, quadrant, periodic table, treemap) and render a visual highlight treatment (bright stroke ring or elevated opacity) for shortlisted companies. Update the chart page wrappers to pass `shortlistedIds` from `useThesisGatedData()` through to the chart components.

## Steps

1. Update `components/charts/bubble-chart.tsx`:
   - Add `shortlistedIds?: Set<string>` to `BubbleChartProps`
   - In the D3 render effect, after drawing circles, add a conditional stroke treatment: if `shortlistedIds?.has(company.id)`, apply a 2px amber/gold stroke ring (`#f59e0b`) and slightly higher opacity
   - Add `shortlistedIds` to the useEffect dependency array (use a stringified version or the set size + content hash to avoid over-rendering)

2. Update `components/charts/quadrant-chart.tsx`:
   - Add `shortlistedIds?: Set<string>` to props
   - Similar D3 highlight treatment: amber stroke ring on shortlisted company dots
   - Thread through dependency array

3. Update `components/charts/periodic-table.tsx`:
   - Add `shortlistedIds?: Set<string>` to `PeriodicTableProps`
   - In the D3 cell rendering, add a CSS class or inline style for shortlisted cells: amber border + subtle glow/shadow
   - The periodic table already renders cells with `<rect>` elements — add conditional stroke
   - Also show a small star indicator (★) in the cell corner for shortlisted companies

4. Update `components/charts/treemap-chart.tsx`:
   - Add `shortlistedIds?: Set<string>` to props
   - D3 treemap renders `<rect>` elements — add amber stroke treatment for shortlisted companies

5. Update the 4 chart page files that use these components to pass `shortlistedIds` from `useThesisGatedData()`:
   - Find the page files that render BubbleChart, QuadrantChart, PeriodicTable, TreemapChart
   - Destructure `shortlistedIds` from `useThesisGatedData()` and pass as prop

## Must-Haves

- [ ] All 4 charts accept optional shortlistedIds prop
- [ ] Shortlisted companies show a visible highlight (amber stroke ring) on each chart
- [ ] Chart pages pass shortlistedIds from useThesisGatedData to chart components
- [ ] D3 useEffect dependency arrays include shortlist state
- [ ] Charts without shortlistedIds prop continue to render normally (backwards compatible)
- [ ] npm run build passes

## Verification

- `npm run build` passes with zero type errors
- `grep -rn 'shortlistedIds' components/charts/bubble-chart.tsx components/charts/quadrant-chart.tsx components/charts/periodic-table.tsx components/charts/treemap-chart.tsx` returns matches in all 4 files
- `grep -rn 'shortlistedIds' app/` returns matches in chart page files confirming prop threading
  - Estimate: 1h15m
  - Files: components/charts/bubble-chart.tsx, components/charts/quadrant-chart.tsx, components/charts/periodic-table.tsx, components/charts/treemap-chart.tsx
  - Verify: npm run build && grep -c 'shortlistedIds' components/charts/bubble-chart.tsx components/charts/quadrant-chart.tsx components/charts/periodic-table.tsx components/charts/treemap-chart.tsx | grep -v ':0$' | wc -l | grep -q '4'
