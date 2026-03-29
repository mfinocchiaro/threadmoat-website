# T03: 06-filter-toolbar-redesign 03

**Slice:** S01 — **Milestone:** M001

## Description

Remove VizFilterBar from all 45 dashboard page and content files, completing the migration to the shared FilterToolbar.

Purpose: With FilterProvider at layout level (Plan 01) and FilterToolbar in sidebar-shell (Plan 02), the per-page VizFilterBar is now redundant. Removing it from all 45 files eliminates the inline filter panel, reduces per-page bundle size, and ensures all filtering goes through the shared toolbar (UX-04). This is a mechanical bulk refactor but MUST be done carefully to avoid breaking any page.

Output: All 45 files cleaned of VizFilterBar imports and renders. Build passes.

## Must-Haves

- [ ] "No dashboard page renders VizFilterBar inline anymore"
- [ ] "All chart pages still receive filtered data via useFilter context"
- [ ] "Scenario dashboards no longer render VizFilterBar"
- [ ] "The build passes after removing all VizFilterBar usages"

## Files

- `app/dashboard/bar-chart/page.tsx`
- `app/dashboard/box-plot/page.tsx`
- `app/dashboard/bubbles/page.tsx`
- `app/dashboard/candlestick/content.tsx`
- `app/dashboard/chord/page.tsx`
- `app/dashboard/correlation/content.tsx`
- `app/dashboard/customers/page.tsx`
- `app/dashboard/distribution/page.tsx`
- `app/dashboard/explore/page.tsx`
- `app/dashboard/financial-heatmap/page.tsx`
- `app/dashboard/heatmap/page.tsx`
- `app/dashboard/investor-network/page.tsx`
- `app/dashboard/investor-stats/page.tsx`
- `app/dashboard/investor-views/content.tsx`
- `app/dashboard/landscape/page.tsx`
- `app/dashboard/landscape-intro/page.tsx`
- `app/dashboard/map/page.tsx`
- `app/dashboard/marimekko/page.tsx`
- `app/dashboard/maturity-matrix/content.tsx`
- `app/dashboard/metros/page.tsx`
- `app/dashboard/network/page.tsx`
- `app/dashboard/parallel/page.tsx`
- `app/dashboard/patterns/page.tsx`
- `app/dashboard/periodic-table/page.tsx`
- `app/dashboard/quadrant/page.tsx`
- `app/dashboard/radar/page.tsx`
- `app/dashboard/reports/content.tsx`
- `app/dashboard/sankey/page.tsx`
- `app/dashboard/slope/page.tsx`
- `app/dashboard/spiral/page.tsx`
- `app/dashboard/splom/page.tsx`
- `app/dashboard/sunburst/page.tsx`
- `app/dashboard/swot/content.tsx`
- `app/dashboard/tab/advanced/page.tsx`
- `app/dashboard/tab/financial/page.tsx`
- `app/dashboard/tab/geographic/page.tsx`
- `app/dashboard/tab/market/page.tsx`
- `app/dashboard/tab/network/page.tsx`
- `app/dashboard/timeline/page.tsx`
- `app/dashboard/treemap/page.tsx`
- `app/dashboard/wordcloud/page.tsx`
- `components/dashboards/startup-dashboard.tsx`
- `components/dashboards/vc-dashboard.tsx`
- `components/dashboards/oem-dashboard.tsx`
- `components/dashboards/isv-dashboard.tsx`
