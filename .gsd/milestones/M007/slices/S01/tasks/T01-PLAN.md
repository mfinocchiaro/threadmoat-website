---
estimated_steps: 9
estimated_files: 7
skills_used: []
---

# T01: Fix theme colors in box-plot, correlation-matrix, distribution, financial-heatmap, landscape, map, marimekko charts

For each of the 7 chart files:
1. Read the file
2. Add getComputedStyle() block at top of useEffect to read --muted-foreground, --foreground, --border
3. Replace all hardcoded #94a3b8, #64748b, #cbd5e1, #e2e8f0 axis/label fills with axisColor/labelColor
4. Replace #1e293b, #334155, #1e1e2e stroke/border with borderColor
5. Replace tooltip background/border/color with CSS var() fallback pattern
6. Replace rgba(255,255,255,...) empty fills with neutral rgba or color-mix
7. Do NOT replace data-semantic colors (color scales, category colors)

Files: box-plot-chart.tsx (7), correlation-matrix-chart.tsx (14), distribution-chart.tsx (11), financial-heatmap-chart.tsx (4), landscape-chart.tsx (2), map-chart.tsx (11), marimekko-chart.tsx (12)

## Inputs

- `components/charts/patterns-chart.tsx as reference pattern`

## Expected Output

- `7 chart files updated with theme-aware colors`

## Verification

npm run build && grep -c '94a3b8\|64748b\|#1e293b\|#334155\|#1e1e2e\|#f1f5f9\|#cbd5e1\|slate-900\|slate-700' for each file shows 0 for axis/label/tooltip contexts
