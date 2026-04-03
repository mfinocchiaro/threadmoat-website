# S04 — IP Dependency Analysis — Research

**Date:** 2026-04-01

## Summary

The IP Dependency Analysis view shows IP ownership, technology dependencies, and third-party platform risk for each startup. The data infrastructure is largely in place: the `heatmap_enrichment.csv` sidecar already provides `techIndependenceScore` (0–75 range, mean 54) and `ecosystemDependencies` (Dassault, Siemens, Autodesk, PTC). The main CSV has three additional columns not yet loaded into the `Company` type that are critical for this view: `Ecosystem SW/Platform Compatibility` (93% coverage — free-text describing platform integrations), `Graphics Kernel` (11% but high-signal for CAD companies — identifies proprietary vs. open-source kernel choices), and `Modeling Paradigms & Protocols` (100% coverage — Python-list of technology standards like B-rep, NURBS, Mesh, OPC-UA, MQTT).

The existing M006 heatmaps (S01–S03) establish a clear, consistent pattern: D3 SVG heatmap in a Card component, configurable X/Y axis selectors, fixed tooltip, shortlist highlighting via optional `shortlistedIds` prop. The page shell is `VizPageShell` wrapping `useThesisGatedData`. Admin-only pages are registered in `ADMIN_ITEMS` in the sidebar. This slice follows the same pattern exactly.

The main design decision is what goes on the axes. The natural X axis is a **dependency risk tier** (derived from `techIndependenceScore` buckets + dependency count), and the Y axis is configurable (ecosystem dependency vendor, deployment model, workflow segment, modeling paradigms). An alternative view mode could be a **platform dependency matrix** where X = major vendor (Dassault, Siemens, Autodesk, PTC, None) and Y = configurable grouping. Both modes are feasible in a single chart with a view toggle.

## Recommendation

Build a single `IPDependencyChart` component with two view modes:

1. **Risk Tier Heatmap** — X axis = IP Risk Tier (Very High Risk → Very Low Risk, computed from inverse of techIndependenceScore), Y axis = configurable (deployment model, workflow segment, investment thesis). Cell color intensity = average dependency count. This is the primary view.
2. **Vendor Dependency Matrix** — X axis = Major Ecosystem Vendor (Dassault, Siemens, Autodesk, PTC, Independent), Y axis = same configurable groupings. Cell value = count of startups with that vendor dependency.

Load three new columns from the main CSV: `ecosystemCompatibility` (from "Ecosystem SW/Platform Compatibility"), `graphicsKernel` (from "Graphics Kernel"), and `modelingParadigms` (from "Modeling Paradigms & Protocols"). These enrich tooltip details — the heatmap cells show summary metrics while tooltips reveal the specific platforms and protocols for each company.

No new libraries needed. D3 is already the standard, and the heatmap pattern is well-established.

## Implementation Landscape

### Key Files

- `lib/company-data.ts` — Add three new fields to the `Company` interface: `ecosystemCompatibility: string`, `graphicsKernel: string`, `modelingParadigms: string[]`
- `lib/load-companies-server.ts` — Load the three new CSV columns in `loadCompaniesFromCSV()`. `Ecosystem SW/Platform Compatibility` → `ecosystemCompatibility` (string), `Graphics Kernel` → `graphicsKernel` (clean with `cleanField()`), `Modeling Paradigms & Protocols` → `modelingParadigms` (parse with `parsePythonList()`)
- `components/charts/ip-dependency-chart.tsx` — **New file.** D3 heatmap following the pattern from `tech-independence-chart.tsx` and `market-momentum-heatmap.tsx`. Two view modes (risk tier, vendor matrix) controlled by a toggle. Configurable Y axis. Tooltip shows ecosystem compatibility text, graphics kernel, modeling paradigms, and dependency list.
- `app/dashboard/ip-dependency/page.tsx` — **New file.** Page component following the exact pattern of `app/dashboard/market-momentum/page.tsx`: `VizPageShell` → `useThesisGatedData` → `IPDependencyChart`.
- `components/dashboard/sidebar.tsx` — Add entry to `ADMIN_ITEMS` array and to `ADMIN_VIZ_HREFS` set.
- `lib/widget-registry.ts` — Add `ip-dependency` to `ADMIN_WIDGETS` array.

### Patterns to Follow

- **Heatmap chart structure**: Copy from `tech-independence-chart.tsx` — it uses the same `techIndependenceScore` data and D3 heatmap pattern. The IP dependency chart is conceptually an extension of tech independence with richer axes and an additional vendor matrix mode.
- **Y-axis configurability**: Use the `YAxisKey` union + `Y_AXES` array + `getYValues()` pattern from all M006 charts.
- **Shortlist highlighting**: Optional `shortlistedIds?: Set<string>` prop, amber border on cells containing shortlisted companies (K005).
- **Tooltip**: Fixed-position div with `position: fixed; visibility: hidden`, toggled on mouseover/mouseout. Show detailed per-company info including the new ecosystem compatibility text.
- **Data loading**: New CSV columns go through existing `cleanField()` and `parsePythonList()` helpers in `load-companies-server.ts`.
- **Admin registration**: Add to `ADMIN_ITEMS` in sidebar, `ADMIN_VIZ_HREFS` set, and `ADMIN_WIDGETS` in widget registry.

### Build Order

1. **Data layer first** — Add fields to `Company` interface and CSV loader. This unblocks everything. Verify with `npm run build` that the type changes compile.
2. **Chart component** — Build `ip-dependency-chart.tsx` with both view modes. The risk tier heatmap is the primary mode; vendor matrix is the secondary mode. Test with the dev server.
3. **Page + nav** — Wire up the page route, sidebar entry, and widget registry. Verify the page is accessible and renders data.

### Verification Approach

- `npm run build` passes with no type errors after each step
- Dev server at `localhost:3000/dashboard/ip-dependency` renders the heatmap with data
- Tooltip shows ecosystem compatibility details, graphics kernel, and modeling paradigms for individual companies
- View toggle switches between risk tier and vendor matrix modes
- Shortlist highlighting works (amber border on cells with shortlisted companies)
- Page appears in admin sidebar under the admin analytics section

## Constraints

- `Graphics Kernel` column has only 11% coverage (66/600 companies). Must handle gracefully — show "N/A" or "Unknown" in tooltips, don't use it as an axis dimension.
- `Graphics Kernel` contains mixed data — some rows have actual kernel info (Parasolid, OpenCascade, Proprietary), while ~30 rows have misplaced construction industry data. Clean by only treating values containing "Proprietary", "Parasolid", "OpenCascade", "OpenUSD", "Rhino", "WebGL", "ACIS", or "CGAL" as real kernel data; treat others as empty.
- `techIndependenceScore` range is 20–75 (not 0–100). Bucket labels must reflect the actual range.
- `ecosystemDependencies` from the enrichment file has only 4 values: Dassault, Siemens, Autodesk, PTC. Companies with no dependencies are mapped to "Independent" / "None".

## Common Pitfalls

- **D3 `.style()` null on HTML selections** — Use `''` or `'none'` instead of `null` for clearing styles (K004).
- **Mixed Graphics Kernel data** — The column contains both real kernel identifiers and misplaced construction industry categories. Filter on known kernel names to avoid polluting the display.
- **Python list parsing** — `Modeling Paradigms & Protocols` uses the `['value1', 'value2']` format. The existing `parsePythonList()` helper handles this correctly. Some rows have comma-concatenated values without brackets — the helper's fallback split handles those too.
