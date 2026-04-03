# S01: Market Momentum Heatmap — Research

**Date:** 2026-04-01

## Summary

The "Market Momentum Heatmap" slice aims to build a heatmap visualizing customer acquisition velocity and growth signals across the 600-startup dataset. An existing `GrowthMomentumChart` (at `/dashboard/growth-momentum`) already renders a heatmap of `growthMomentumTier` × industry/thesis/workflow groups with D3. However, that chart focuses on tier distribution — counting how many companies fall into each tier per group. S01 needs a **different** heatmap: one that quantifies *market momentum intensity* using numeric growth signals (customer signal score, growth metrics, momentum multiplier, funding velocity) rather than just categorical tier counts.

The CSV contains several momentum-related fields not currently loaded into the `Company` type: `Momentum Multiplier` (range 1.0–2.73), `Momentum Cap` (1.0–2.0), `AI Intensity Score` (-1 to 14), and `Revenue Confidence Score` (all 1.0 — not useful). The already-loaded fields `customerSignalScore` (2–8), `growthMetrics` (1–4.9), `growthMomentumTier` (5 categorical tiers), `totalFunding`, `fundingYear`, `headcount`, and `estimatedRevenue` provide the primary data surface. Adding `momentumMultiplier` to the Company type unlocks a composite momentum score.

The recommended approach is to create a new `MarketMomentumHeatmap` chart component that plots a composite momentum score across two configurable axes (e.g., industry × workflow segment, or lifecycle phase × investment thesis). The composite score combines growth metrics, customer signal score, and momentum multiplier into a single cell intensity value, with tooltips showing the individual components.

## Recommendation

**Extend the existing data pipeline with 1-2 new fields, then build a new chart component following the `GrowthMomentumChart` structural pattern.**

1. Add `momentumMultiplier` and `momentumCap` to the `Company` interface and `loadCompaniesFromCSV()` — these are the only CSV fields worth adding (Revenue Confidence is constant at 1.0, AI Intensity is tangential to momentum).
2. Create `components/charts/market-momentum-heatmap.tsx` as a new D3 SVG heatmap — NOT modifying the existing `growth-momentum-chart.tsx`. The existing chart is in production, admin-gated, and does a different job (tier count distribution). This new chart computes a composite momentum *intensity* per cell.
3. Create `app/dashboard/market-momentum/page.tsx` following the standard page pattern (VizPageShell → Inner → useThesisGatedData → chart).
4. Register the route in sidebar nav (`ADMIN_ITEMS`) and tier gating.
5. Composite momentum score formula: `(growthMetrics / 5) * 0.4 + (customerSignalScore / 8) * 0.3 + (momentumMultiplier / 2.73) * 0.3` — all normalized to 0–1, weighted toward growth metrics as the primary signal.

## Implementation Landscape

### Key Files

- `lib/company-data.ts` — Add `momentumMultiplier: number` and `momentumCap: number` to `Company` interface.
- `lib/load-companies-server.ts` — Add `parseNum(row['Momentum Multiplier'])` and `parseNum(row['Momentum Cap'])` to the mapping block (lines ~150-220, adjacent to existing `scoreFinancial` and `customerSignalScore` loads).
- `components/charts/growth-momentum-chart.tsx` — **Reference only** (330 lines). This is the structural template for the new chart: D3 SVG heatmap with `scaleBand` axes, `scaleSequential` color, tooltip div, axis selector dropdown, Card wrapper. Copy the pattern, don't modify.
- `components/charts/industry-penetration-chart.tsx` — **Reference only** (378 lines). Another heatmap with similar structure, includes value mode selector (count/avgScore/avgFunding).
- `components/charts/market-momentum-heatmap.tsx` — **New file.** D3 heatmap with rows = configurable grouping (industry served, investment thesis, workflow segment), columns = momentum tier or lifecycle phase, cell intensity = composite momentum score.
- `app/dashboard/market-momentum/page.tsx` — **New file.** Standard viz page: `VizPageShell` → `MarketMomentumInner` with `useThesisGatedData`.
- `components/dashboard/sidebar.tsx` — Add entry to `ADMIN_ITEMS` array (line ~144-157) and `ADMIN_VIZ_HREFS` set (line ~162-175). Use `TrendingUp` or `Flame` icon variant.
- `lib/tiers.ts` — No change needed if keeping admin-only. If elevating to Strategist tier, add to `STRATEGIST_ONLY_PATHS`.

### Build Order

1. **Data model first** — Add `momentumMultiplier` and `momentumCap` to Company type + CSV loader. This unblocks chart development and is a 5-minute change.
2. **Chart component** — Build `market-momentum-heatmap.tsx`. This is the bulk of the work (~300-400 lines). Follow the `growth-momentum-chart.tsx` pattern exactly: `useRef` for SVG/container/tooltip, `useMemo` for cell computation, `useEffect` for D3 rendering, `Card` wrapper with axis selectors.
3. **Page + nav** — Wire up the page, sidebar entry, and tier gating. Trivial once the chart exists.

### Verification Approach

- `npx next build` — TypeScript compilation confirms no type errors in new fields, chart component, and page.
- Dev server (`npm run dev`) + navigate to `/dashboard/market-momentum` — visual confirmation that the heatmap renders with data, tooltips work, axis selectors toggle groups, shortlist highlighting applies.
- Verify sidebar shows the new entry for admin users.

## Constraints

- All new fields must come from `data/Startups-Grid Full DB View.csv` — no new CSV files or external data sources.
- Chart must follow the existing D3 SVG pattern (not Recharts) to stay consistent with the other heatmap charts.
- Theme-aware colors via CSS custom properties (`--muted-foreground`, `--border`, `--foreground`) — same as `growth-momentum-chart.tsx`.
- Shortlist highlighting support via optional `shortlistedIds?: Set<string>` prop (per K005).
- D3 `.style()` on HTML elements does not accept null (per K004) — use `''` or `'none'` for clear values.

## Common Pitfalls

- **Confusing this chart with the existing growth-momentum chart** — They're different views. The existing chart counts companies per tier × group. This new chart computes average momentum *intensity* per cell. Don't refactor the existing chart; build alongside it.
- **Zero-division in composite score** — Some companies have `momentumMultiplier = 0` or `growthMetrics = 0`. Guard all normalization with `|| 0` and handle cells where all contributing companies have zero scores.
- **Sparse heatmap** — With 5 momentum tiers and potentially 15+ industry groups, many cells may be empty. Use the empty-cell pattern from `growth-momentum-chart.tsx` (muted fill, thin stroke, no text).
- **SVG overflow** — Long Y-axis labels (industry names like "Aerospace & Defense") need `margin.left = 200` matching the existing charts.
