# S01: Market Momentum Heatmap

**Goal:** Deliver a Market Momentum Heatmap that visualizes composite momentum intensity (growth metrics, customer signal score, momentum multiplier) across configurable grouping axes, accessible from the dashboard sidebar.
**Demo:** After this: Heatmap showing company momentum based on customer acquisition velocity and growth signals.

## Tasks
- [x] **T01: Added momentumMultiplier/momentumCap to Company data model and built MarketMomentumHeatmap D3 chart with composite scoring, YlOrRd palette, tooltips, and shortlist highlighting** — ## Description

Extend the Company interface with `momentumMultiplier` and `momentumCap` fields, load them from CSV, then build the full D3 SVG heatmap chart component.

## Steps

1. Add `momentumMultiplier: number` and `momentumCap: number` to the `Company` interface in `lib/company-data.ts` (after the existing `customerSignalScore` field around line 64).

2. In `lib/load-companies-server.ts`, add `momentumMultiplier: parseNum(row['Momentum Multiplier'])` and `momentumCap: parseNum(row['Momentum Cap'])` to the company mapping object (in the main CSV mapping block, around lines 205-210, near the existing `scoreFinancial` and `customerSignalScore` loads). These fields come from the main CSV (`Startups-Grid Full DB View.csv`), NOT the enrichment sidecar.

3. Create `components/charts/market-momentum-heatmap.tsx` following the structural pattern of `components/charts/growth-momentum-chart.tsx` (233 lines). The new chart:
   - Interface: `MarketMomentumHeatmapProps { data: Company[]; className?: string; shortlistedIds?: Set<string> }`
   - Y-axis selector: same `YAxisKey` pattern — `industriesServed`, `investmentTheses`, `workflowSegment`
   - X-axis: `growthMomentumTier` categories using `TIER_ORDER` = `['Accelerating', 'High Growth', 'Steady', 'Early/Pre-revenue', 'Stalled', 'Unknown']`
   - Cell data computation via `useMemo`: for each (tier × yGroup) cell, compute average composite momentum score across companies in that cell
   - Composite score formula: `(growthMetrics / 5) * 0.4 + (customerSignalScore / 8) * 0.3 + ((momentumMultiplier || 1) / 2.73) * 0.3` — all normalized 0–1, defaults to avoid zero-division
   - Color scale: `d3.scaleSequential(d3.interpolateYlOrRd).domain([0, 1])` (warm palette — yellow-orange-red for intensity, distinct from the existing YlGn used by growth-momentum)
   - D3 rendering in `useEffect`: SVG with `scaleBand` axes, colored rect cells, text labels for score values, shortlist highlight stroke (#f59e0b, 2.5px per D003/K005)
   - Tooltip div (absolute positioned, visibility toggled) showing: tier × group name, company count, avg composite score, component breakdown (growth metrics avg, customer signal avg, momentum multiplier avg), shortlisted company names if any
   - Empty cells: muted fill with thin stroke (same pattern as growth-momentum-chart.tsx)
   - Theme-aware: read CSS custom properties `--muted-foreground`, `--border`, `--foreground` via `getComputedStyle`
   - Axis labels: X-axis rotated at bottom, Y-axis left with `margin.left = 200` for long industry names
   - Card wrapper with axis selector dropdown in header

**Key constraints:**
- Do NOT modify `growth-momentum-chart.tsx` — this is a new chart alongside it
- Use `d3.interpolateYlOrRd` (not YlGn) to visually distinguish from the existing growth momentum chart
- Guard against zero `momentumMultiplier` with `|| 1` (range is 1.0–2.73, but some may parse as 0)
- Per K004: D3 `.style()` on HTML elements does not accept null — use `''` for clear values
- Per K005: `shortlistedIds` is optional prop, guard all highlight logic with `shortlistedIds?.has(id)`

## Must-Haves

- [ ] `momentumMultiplier` and `momentumCap` in Company interface
- [ ] CSV loading for both new fields via `parseNum()`
- [ ] Complete MarketMomentumHeatmap component with D3 SVG rendering
- [ ] Composite score computation with zero-division guards
- [ ] Y-axis selector dropdown (3 options)
- [ ] Tooltip with component breakdown
- [ ] Shortlist highlighting support
- [ ] Empty cell rendering
- [ ] Theme-aware colors via CSS custom properties

## Verification

- `grep -q 'momentumMultiplier' lib/company-data.ts && grep -q 'momentumCap' lib/company-data.ts` — fields in interface
- `grep -q "Momentum Multiplier" lib/load-companies-server.ts` — CSV loading wired
- `test -f components/charts/market-momentum-heatmap.tsx` — chart file exists
- `grep -q 'shortlistedIds' components/charts/market-momentum-heatmap.tsx` — shortlist prop present
- `npx next build 2>&1 | tail -5` — build succeeds (may warn about unused page but no type errors)
  - Estimate: 2h
  - Files: lib/company-data.ts, lib/load-companies-server.ts, components/charts/market-momentum-heatmap.tsx, components/charts/growth-momentum-chart.tsx
  - Verify: grep -q 'momentumMultiplier' lib/company-data.ts && grep -q 'Momentum Multiplier' lib/load-companies-server.ts && test -f components/charts/market-momentum-heatmap.tsx && npx next build 2>&1 | tail -5
- [x] **T02: Created /dashboard/market-momentum page with VizPageShell wrapper and added sidebar navigation entry — build passes clean** — ## Description

Create the dashboard page at `/dashboard/market-momentum`, add the sidebar navigation entry, and verify the complete feature works end-to-end via build.

## Steps

1. Create `app/dashboard/market-momentum/page.tsx` following the exact pattern from `app/dashboard/growth-momentum/page.tsx`:
   - `"use client"` directive
   - Import `VizPageShell` from `@/components/dashboard/viz-page-shell`
   - Import `useThesisGatedData` from `@/hooks/use-thesis-gated-data`
   - Import `MarketMomentumHeatmap` from `@/components/charts/market-momentum-heatmap`
   - Import `Skeleton` from `@/components/ui/skeleton`
   - Inner component `MarketMomentumInner` that calls `useThesisGatedData()` to get `{ filtered, isLoading, shortlistedIds }`
   - Title: "Market Momentum" with description about composite momentum intensity
   - Loading skeleton `h-[600px]`
   - Pass `data={filtered}`, `shortlistedIds={shortlistedIds}`, `className="min-h-[500px]"`
   - Default export wraps inner in `<VizPageShell>`

2. In `components/dashboard/sidebar.tsx`:
   - Add entry to `ADMIN_ITEMS` array (after the growth-momentum entry, around line 149): `{ href: "/dashboard/market-momentum", icon: TrendingUp, label: "Market Momentum" }`
   - Note: `TrendingUp` is already imported. Using same icon as other trending items is fine.
   - Add `"/dashboard/market-momentum"` to `ADMIN_VIZ_HREFS` set (around line 169)

3. Run `npx next build` and verify zero errors.

## Must-Haves

- [ ] Page file at `app/dashboard/market-momentum/page.tsx` with VizPageShell wrapper
- [ ] Uses `useThesisGatedData` for filtered data and shortlist IDs
- [ ] Sidebar entry in ADMIN_ITEMS with TrendingUp icon
- [ ] Sidebar entry in ADMIN_VIZ_HREFS
- [ ] `npx next build` passes

## Verification

- `test -f app/dashboard/market-momentum/page.tsx` — page exists
- `grep -q 'market-momentum' components/dashboard/sidebar.tsx` — sidebar wired
- `grep -q 'MarketMomentumHeatmap' app/dashboard/market-momentum/page.tsx` — chart imported
- `npx next build 2>&1 | tail -5` — clean build with zero errors
  - Estimate: 30m
  - Files: app/dashboard/market-momentum/page.tsx, components/dashboard/sidebar.tsx
  - Verify: test -f app/dashboard/market-momentum/page.tsx && grep -q 'market-momentum' components/dashboard/sidebar.tsx && npx next build 2>&1 | tail -5
