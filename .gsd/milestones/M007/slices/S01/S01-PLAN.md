# S01: Theme-aware colors for D3 SVG charts (batch 1: 13 charts)

**Goal:** Apply the established getPropertyValue pattern to 13 D3 SVG chart components
**Demo:** After this: 13 D3 charts have legible axes and tooltips on both light and dark themes

## Tasks
- [x] **T01: Replace hardcoded slate hex colors with CSS custom property lookups in 7 D3/chart files for theme-aware rendering** — For each of the 7 chart files:
1. Read the file
2. Add getComputedStyle() block at top of useEffect to read --muted-foreground, --foreground, --border
3. Replace all hardcoded #94a3b8, #64748b, #cbd5e1, #e2e8f0 axis/label fills with axisColor/labelColor
4. Replace #1e293b, #334155, #1e1e2e stroke/border with borderColor
5. Replace tooltip background/border/color with CSS var() fallback pattern
6. Replace rgba(255,255,255,...) empty fills with neutral rgba or color-mix
7. Do NOT replace data-semantic colors (color scales, category colors)

Files: box-plot-chart.tsx (7), correlation-matrix-chart.tsx (14), distribution-chart.tsx (11), financial-heatmap-chart.tsx (4), landscape-chart.tsx (2), map-chart.tsx (11), marimekko-chart.tsx (12)
  - Estimate: 30min
  - Files: components/charts/box-plot-chart.tsx, components/charts/correlation-matrix-chart.tsx, components/charts/distribution-chart.tsx, components/charts/financial-heatmap-chart.tsx, components/charts/landscape-chart.tsx, components/charts/map-chart.tsx, components/charts/marimekko-chart.tsx
  - Verify: npm run build && grep -c '94a3b8\|64748b\|#1e293b\|#334155\|#1e1e2e\|#f1f5f9\|#cbd5e1\|slate-900\|slate-700' for each file shows 0 for axis/label/tooltip contexts
- [x] **T02: Replace hardcoded slate hex colors with CSS custom property lookups in 6 D3 chart files for theme-aware rendering** — Same pattern as T01 for the remaining 6 D3 SVG charts.

Files: parallel-coords-chart.tsx (8), radar-chart.tsx (3), sankey-chart.tsx (3), slope-chart.tsx (11), spiral-timeline-chart.tsx (8), splom-chart.tsx (5)
  - Estimate: 20min
  - Files: components/charts/parallel-coords-chart.tsx, components/charts/radar-chart.tsx, components/charts/sankey-chart.tsx, components/charts/slope-chart.tsx, components/charts/spiral-timeline-chart.tsx, components/charts/splom-chart.tsx
  - Verify: npm run build passes. grep audit clean for all 6 files.
