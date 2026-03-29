# Phase 6: Filter Toolbar Redesign - Research

**Researched:** 2026-03-25
**Domain:** React filter UI architecture, sticky toolbar patterns, shared state in Next.js App Router
**Confidence:** HIGH

## Summary

The current filter system (`VizFilterBar`) is a 565-line inline component that renders directly inside every chart page. It displays as a large bordered panel with collapsible sections, occupying significant vertical space. There are 16 distinct filter types (search, investment lists, industries, countries, subsegments, lifecycle, funding round, deployment model, operating model, category tags, differentiation tags, investment theses, ocean strategy, size category, ecosystem flags, and funding range). The `VizFilterBar` is imported and rendered in **38+ individual page files** across the dashboard, each passing `companies` as a prop.

Filter state is already managed via React Context (`FilterProvider` in `contexts/filter-context.tsx`), which provides `filters`, `setFilters`, and `filterCompany`. However, each chart page creates its own `FilterProvider` via `VizPageShell`, meaning **filter state does NOT persist across page navigation** -- each page gets a fresh provider with default filters. This is the core architectural issue that UX-03 must solve.

**Primary recommendation:** Lift `FilterProvider` to the dashboard layout level (already done in `dashboard-client.tsx` for scenario dashboards, but NOT for individual `/dashboard/*` chart pages which use `VizPageShell`). Replace the current inline `VizFilterBar` with a compact sticky toolbar rendered once in the layout's content area, above the scrollable chart content. Remove all 38+ per-page `VizFilterBar` imports.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| UX-01 | Compact sticky filter toolbar visible at top of dashboard content area | Toolbar replaces the 565-line inline VizFilterBar; rendered in sidebar-shell.tsx content area with `sticky top-0 z-30` |
| UX-02 | Filter toolbar shows active filters as pills/chips with remove buttons | Reuse existing PillFilter pattern from viz-filter-bar.tsx; show only active filters as removable chips |
| UX-03 | Filter state persists across chart navigation within the dashboard | Lift FilterProvider from VizPageShell (per-page) to DashboardLayoutClient (layout-level); remove per-page FilterProvider |
| UX-04 | Filter toolbar applies to all visible charts simultaneously | Already works via useFilter() hook + filterCompany() -- charts that call useThesisGatedData already filter via context |
</phase_requirements>

## Standard Stack

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React Context | N/A | Filter state management | Already used via FilterProvider -- no need to change state management |
| shadcn/ui Badge | N/A | Pill/chip display for active filters | Already imported in viz-filter-bar.tsx |
| shadcn/ui Popover | N/A | Compact dropdown for filter selection | Allows filter categories to be accessed via dropdown instead of inline expansion |
| Tailwind CSS | existing | Sticky positioning, transitions, responsive layout | `sticky top-0 z-30` for toolbar, `transition-all` for collapse animation |
| lucide-react | existing | Filter icons (SlidersHorizontal, X, ChevronDown) | Already used throughout the dashboard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui DropdownMenu | existing | Filter category picker dropdown | For selecting which filter category to add values from |
| shadcn/ui ScrollArea | existing | Horizontal scroll for many active filter chips | When user has many active filters that overflow toolbar width |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| React Context (current) | URL search params (nuqs) | URL params would enable shareable filter states, but adds complexity and is not required for UX-01 through UX-04 |
| Popover for filter selection | Command palette (cmdk) | Over-engineered for filter selection; Popover is simpler and sufficient |

## Architecture Patterns

### Current Architecture (Problem)

```
app/dashboard/layout.tsx (server component)
  -> DashboardLayoutClient
       -> PlanProvider
       -> ScenarioProvider
           -> SidebarShell (sidebar + topbar + content area)
                -> children (page content)

app/dashboard/bar-chart/page.tsx (client component)
  -> VizPageShell
       -> FilterProvider  <-- NEW per-page provider (filter state resets on navigation!)
       -> ThesisProvider
           -> BarChartInner
                -> VizFilterBar (565-line inline panel)
                -> BarChart (filtered data)
```

### Target Architecture (Solution)

```
app/dashboard/layout.tsx (server component)
  -> DashboardLayoutClient
       -> PlanProvider
       -> ScenarioProvider
       -> FilterProvider  <-- LIFTED to layout level (persists across navigation)
           -> SidebarShell
                -> TopBar
                -> DisclaimerBanner
                -> FilterToolbar  <-- NEW compact sticky toolbar (rendered ONCE)
                -> <scrollable content area>
                     -> children (page content)

app/dashboard/bar-chart/page.tsx
  -> VizPageShell  <-- Still provides ThesisProvider, but NO FilterProvider
       -> ThesisProvider
           -> BarChartInner
                -> BarChart (filtered via shared context)
                (NO VizFilterBar -- removed from every page)
```

### Recommended Project Structure
```
components/
  dashboard/
    filter-toolbar.tsx       # NEW: Compact sticky toolbar component (~200 lines)
    filter-toolbar-popover.tsx # NEW: Popover for selecting filter values (~150 lines)
    sidebar-shell.tsx        # MODIFIED: Render FilterToolbar in content area
  viz-filter-bar.tsx         # DEPRECATED: Keep temporarily, remove after migration
contexts/
  filter-context.tsx         # MODIFIED: Add activeFilterCount computed value
```

### Pattern 1: Sticky Toolbar with Collapse
**What:** A thin toolbar that sticks to the top of the scrollable content area. Shows active filter chips when filters are set. Collapses to a single-line trigger when no filters active.
**When to use:** Dashboard content area, above all chart content.
**Example:**
```typescript
// Sticky toolbar in the content scroll area
<div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b">
  {activeCount > 0 ? (
    <div className="flex items-center gap-2 px-4 py-2">
      <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 flex flex-wrap gap-1.5 min-h-[28px]">
        {/* Active filter chips */}
        {filters.investmentLists.map(v => (
          <Badge key={v} variant="secondary" className="gap-1 pr-1">
            {v}
            <button onClick={() => removeFilter("investmentLists", v)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {/* ... other active filters ... */}
      </div>
      <Button variant="ghost" size="sm" onClick={clearAll}>
        Clear all
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-2 px-4 py-1.5">
      <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">No filters active</span>
    </div>
  )}
  {/* Filter category dropdowns */}
  <div className="flex items-center gap-1 px-4 pb-2">
    <FilterDropdown label="Category" ... />
    <FilterDropdown label="Geography" ... />
    <FilterDropdown label="Funding" ... />
    {/* etc. */}
  </div>
</div>
```

### Pattern 2: Filter Dropdown Popover
**What:** Each filter category opens a Popover with pill-toggle selections, reusing the existing PillFilter component pattern.
**When to use:** Compact way to access filter values without taking up vertical space.
**Example:**
```typescript
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" size="sm" className="h-7 text-xs">
      Category
      {filters.categoryTags.length > 0 && (
        <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
          {filters.categoryTags.length}
        </Badge>
      )}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-80 p-3" align="start">
    <PillFilter
      label="Category"
      items={options.categoryTags}
      active={filters.categoryTags}
      onToggle={(v) => toggle("categoryTags", v)}
      onClear={() => clearFilter("categoryTags")}
      compact
    />
  </PopoverContent>
</Popover>
```

### Anti-Patterns to Avoid
- **DO NOT put FilterProvider inside VizPageShell:** This is the current bug -- it resets filters on every navigation. The provider MUST be at layout level.
- **DO NOT render VizFilterBar on each page:** The whole point is ONE toolbar rendered once in the layout.
- **DO NOT use a dialog/overlay:** The current design blocks content. Popovers are inline and don't block scrolling.
- **DO NOT try to persist filter state via URL params:** Adds unnecessary complexity for this phase. Context at layout level is sufficient.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Popover positioning | Custom dropdown with absolute positioning | shadcn/ui Popover (Radix) | Edge cases with viewport boundaries, focus management |
| Horizontal chip overflow | Custom scroll handler | CSS `flex-wrap` with `max-h` and `overflow-y-auto` | Native CSS handles this cleanly |
| Sticky positioning in scroll container | JavaScript scroll listener | CSS `sticky` with `top-0` | Native CSS sticky is reliable in all modern browsers |
| Backdrop blur for toolbar | Custom backdrop filter | Tailwind `bg-background/95 backdrop-blur-sm` | One-liner utility class |

**Key insight:** The entire redesign is about restructuring WHERE components render, not building new complex UI primitives. The existing PillFilter, Badge, and filter context logic can be largely reused.

## Common Pitfalls

### Pitfall 1: FilterProvider Duplication
**What goes wrong:** If VizPageShell still wraps children in FilterProvider, the page-level provider shadows the layout-level provider. Charts inside VizPageShell would use a separate, empty filter state.
**Why it happens:** VizPageShell currently creates `<FilterProvider>` around every page.
**How to avoid:** Remove FilterProvider from VizPageShell. Only keep ThesisProvider there.
**Warning signs:** Changing filters in toolbar has no effect on charts. Navigating to a chart page shows "0 active filters" even though toolbar shows active.

### Pitfall 2: Companies Prop Dependency
**What goes wrong:** The current VizFilterBar requires `companies: Company[]` prop to compute available filter options (what values exist for each filter type). The layout-level toolbar won't have access to companies data.
**Why it happens:** Filter options are dynamically computed from the dataset (e.g., which countries exist, which investment lists exist).
**How to avoid:** Either (a) load companies once at the layout level and pass down via context, or (b) compute available filter options once and store in a separate context/provider, or (c) have the toolbar use a static/cached set of filter options loaded from the CSV data at build time.
**Warning signs:** Toolbar shows empty dropdowns or "no options available."

**Recommended approach for companies data:** The `useThesisGatedData` hook already loads companies via `loadCompanyData()`. Add a `CompanyDataProvider` at the layout level that loads companies once, or add companies to the existing FilterProvider. The toolbar can then access companies via context instead of props.

### Pitfall 3: Z-Index Conflicts
**What goes wrong:** Sticky toolbar sits below Popover overlays or above the sidebar.
**Why it happens:** Multiple z-index layers: sidebar, topbar, disclaimer banner, popovers, tooltips.
**How to avoid:** Use consistent z-index scale: sidebar=40, topbar=30, toolbar=20, popovers=50 (Radix default).
**Warning signs:** Toolbar clips content or popovers appear behind toolbar.

### Pitfall 4: Search Input in Toolbar
**What goes wrong:** Putting the search input in the compact toolbar makes it too tall or awkward on mobile.
**Why it happens:** Search box with icon + clear button needs ~36px height minimum.
**How to avoid:** Include search as one of the filter category buttons that opens a small popover/input, or dedicate a small segment of the toolbar to an inline search.
**Warning signs:** Toolbar height exceeds 60px, starts feeling like the old VizFilterBar.

### Pitfall 5: Dashboard Scenario Pages vs Chart Pages
**What goes wrong:** The 4 scenario dashboards (startup, vc, oem, isv) in `dashboard-client.tsx` ALSO render VizFilterBar and have their OWN FilterProvider. These need to be updated too.
**Why it happens:** `DashboardClient` wraps in `<FilterProvider>` and each scenario dashboard imports VizFilterBar.
**How to avoid:** Remove FilterProvider from DashboardClient too (it's now at layout level). Remove VizFilterBar from all 4 scenario dashboards.
**Warning signs:** Double-rendering of filter UI on the main dashboard page.

## Code Examples

### Current Filter State Shape (from filter-context.tsx)
```typescript
interface FilterState {
  search: string
  investmentLists: string[]
  industries: string[]
  countries: string[]
  subsegments: string[]
  lifecycle: string[]
  fundingRound: string[]
  deploymentModel: string[]
  operatingModel: string[]
  categoryTags: string[]
  differentiationTags: string[]
  investmentTheses: string[]
  metrics: string
  oceanStrategy: "all" | "red" | "blue"
  sizeCategory: string[]
  ecosystemFlags: string[]
  fundingRange: [number, number]
}
```

### Files That Import VizFilterBar (38+ files to update)
All individual chart pages under `app/dashboard/*/page.tsx` and `app/dashboard/*/content.tsx`, plus tab overview pages under `app/dashboard/tab/*/page.tsx`, plus the 4 scenario dashboards in `components/dashboards/*-dashboard.tsx`.

Each follows the same pattern:
```typescript
import { VizFilterBar } from "@/components/viz-filter-bar"
// ...
<VizFilterBar companies={companies} />
```

### Key Integration Points
1. **sidebar-shell.tsx line 69:** `<div className="flex-1 overflow-y-auto">` -- this is the scroll container where the sticky toolbar should go (inside this div, before `{children}`)
2. **viz-page-shell.tsx line 19:** `<FilterProvider>` -- must be REMOVED
3. **dashboard-client.tsx line 120:** `<FilterProvider>` -- must be REMOVED (moved to layout-client.tsx)
4. **layout-client.tsx:** FilterProvider should be added here, wrapping everything inside PlanProvider/ScenarioProvider

### Companies Data Loading Pattern
```typescript
// Current: each page loads independently via useThesisGatedData
const { companies, filtered, isLoading } = useThesisGatedData()
// companies = thesis-gated + masked data (for filter option computation)
// filtered = companies filtered by current FilterState
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Large inline filter panel | Compact sticky toolbar + dropdown popovers | 2024-2025 B2B SaaS trend | Less visual noise, filters always accessible |
| Per-page filter state | Layout-level shared filter state | Standard React pattern | Filters persist across navigation |
| Show all filter options inline | Show active filters as chips, browse options via popover | Material Design / Ant Design pattern | Dramatically reduces vertical space |

## Open Questions

1. **Company data loading for toolbar**
   - What we know: VizFilterBar currently receives `companies` as a prop to compute available filter options. The toolbar at layout level won't receive this prop.
   - What's unclear: Should we create a shared CompanyDataProvider, or should the toolbar load companies independently, or should available filter options be pre-computed and cached?
   - Recommendation: Create a `CompanyDataProvider` at layout level that loads companies once and shares via context. The toolbar and all chart pages consume from this single source. This also eliminates the redundant `loadCompanyData()` calls happening in `useThesisGatedData()` on every page mount.

2. **Funding range slider in toolbar**
   - What we know: The current VizFilterBar has a dual-handle slider for funding range. This is harder to fit in a compact toolbar.
   - What's unclear: Should it open in a popover, or be omitted from the toolbar and only accessible via an "advanced" dropdown?
   - Recommendation: Place it inside a "Funding" popover alongside Funding Round pills. Slider works fine inside a popover.

3. **Filter toolbar on mobile**
   - What we know: Dashboard is B2B desktop-focused. Mobile is explicitly out of scope per REQUIREMENTS.md.
   - What's unclear: Should toolbar be hidden on mobile or simplified?
   - Recommendation: Use `flex-wrap` to allow natural wrapping. No mobile-specific layout needed.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual browser testing (no automated test framework detected) |
| Config file | none |
| Quick run command | `npm run dev` + manual verification |
| Full suite command | `npm run build` (type checking + compilation) |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| UX-01 | Sticky toolbar visible at top of dashboard content | manual | Visual inspection in browser | N/A |
| UX-02 | Active filters shown as removable pills | manual | Click filter, verify pill appears with X button | N/A |
| UX-03 | Filters persist across chart navigation | manual | Set filter on /dashboard/bar-chart, navigate to /dashboard/quadrant, verify filter still active | N/A |
| UX-04 | Filters apply to all visible charts | manual | Set filter on tab overview page (e.g., /dashboard/tab/market), verify all chart cards update | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (catches type errors from refactoring 38+ files)
- **Per wave merge:** Manual browser testing of all 4 requirements
- **Phase gate:** Full build + manual walkthrough of filter persistence across 3+ page navigations

### Wave 0 Gaps
- None -- no automated test infrastructure to set up. Build command (`npm run build`) validates TypeScript compilation which is critical given the 38+ file refactor.

## Sources

### Primary (HIGH confidence)
- Direct code inspection of `components/viz-filter-bar.tsx` (565 lines) -- full filter UI implementation
- Direct code inspection of `contexts/filter-context.tsx` (206 lines) -- FilterState shape, FilterProvider, filterCompany logic
- Direct code inspection of `components/dashboard/viz-page-shell.tsx` -- per-page FilterProvider wrapping
- Direct code inspection of `components/dashboard/sidebar-shell.tsx` -- content area layout structure
- Direct code inspection of `components/dashboard/layout-client.tsx` -- layout-level provider hierarchy
- Direct code inspection of `hooks/use-thesis-gated-data.ts` -- data loading + filtering pipeline
- Grep of `VizFilterBar` across codebase -- 38+ import sites identified

### Secondary (MEDIUM confidence)
- shadcn/ui Popover component -- assumed API compatibility based on existing Popover usage in project

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already in the project, no new dependencies needed
- Architecture: HIGH -- direct code inspection reveals exact provider hierarchy and the root cause of filter state reset
- Pitfalls: HIGH -- identified through code analysis (FilterProvider duplication, companies prop dependency, z-index layering)

**Research date:** 2026-03-25
**Valid until:** 2026-04-25 (stable -- no external dependencies changing)