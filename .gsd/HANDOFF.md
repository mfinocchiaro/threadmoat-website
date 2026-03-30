# ThreadMoat Website — Session Handoff (2026-03-29)

## Where We Are

**Milestone M001** (v1.1 UX & Data Polish) is active. Slices S01, S02, S03, S06 are done. S04 and S05 are open.

## What Changed This Session (Uncommitted)

```
M  app/api/funding/route.ts                        Cloud Model bug fix + headcount field
M  app/dashboard/financial-heatmap/page.tsx         Updated description
M  components/charts/financial-heatmap-chart.tsx     Complete rewrite → HTML table, clean currency
M  app/dashboard/network/page.tsx                   Pass accessTier to ecosystem graph
M  components/charts/network-graph-toggle.tsx        Accept + pass accessTier prop
M  components/charts/network-graph.tsx               Company name labels, improved search
```

### Financial Heatmap Changes

1. **Cloud Model "No Data" bug** — Airtable exports `"['Cloud', 'Desktop']"` but parser didn't strip brackets/quotes. Fixed with `.replace(/[\[\]'"]/g, '')`. All 600 companies now classify correctly.
2. **Layout** — 20-col SVG → 14-col HTML table. Sticky company names, full text in every cell, hover detail panel, colored group bands (WHO → RAW INPUTS → EFFICIENCY → BURN → VALUATION → CONFIDENCE).
3. **Currency formatting** — `$350M` not `$350.0M`, `9x` not `9.0x`. Decimals preserved when meaningful (`$18.2M`).
4. **Headcount field** added to funding API from Airtable.

### Ecosystem Network Graph Changes

1. **Company name labels** — now shown for Strategist and Admin tiers (`canSeeCompanyNames()`). Explorer/Analyst see names via hover tooltip only (scraping protection preserved).
2. **Search zoom+center** — searching a startup zooms in and centers it at 1.8x scale with gold highlight ring.
3. **Neighbor emphasis** — search highlights the matched node + all directly connected neighbors. Connected links turn gold, everything else dims. Previous behavior dimmed ALL nodes which lost context.
4. **Connected links highlighted** — links touching the matched node get gold color, full opacity, 3px width. Non-connected links dim to near-invisible.
5. **Filter stability** — search effect re-runs when `graphData.links` changes (i.e., when filters change), so zoom stays on the selected startup and only the surrounding network updates.

### ARR Multiple (FYI — not a bug)

6 discrete buckets (3x, 4x, 5x, 7x, 9x, 12x) — 86% get 7x or 9x. Bucketed Airtable formula, not a website issue.

## Next Steps

- [ ] Visual verification of both views
- [ ] Commit all changes
- **S04** — CSV Data Refresh (planned, no tasks yet)
- **S05** — Funding & Valuation Integration (depends on S04)
