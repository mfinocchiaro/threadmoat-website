---
estimated_steps: 45
estimated_files: 2
skills_used: []
---

# T02: Build dual-mode IP Dependency heatmap chart component with D3

Create the `IPDependencyChart` component following the established M006 heatmap pattern (copy structure from `tech-independence-chart.tsx`). The chart has two view modes controlled by a toggle, configurable Y-axis, and rich tooltips.

## Steps

1. Create `components/charts/ip-dependency-chart.tsx`. Start by copying the structural pattern from `components/charts/tech-independence-chart.tsx` — same imports, same Card wrapper, same SVG + tooltip refs, same Y-axis selector UI.

2. Define the component props:
   ```tsx
   interface IPDependencyChartProps {
     data: Company[]
     className?: string
     shortlistedIds?: Set<string>
   }
   ```

3. Add a `ViewMode` type: `'risk-tier' | 'vendor-matrix'` with state and a toggle button in the toolbar.

4. Define Y-axis options (same pattern as other M006 charts):
   ```tsx
   type YAxisKey = 'deploymentModel' | 'investmentTheses' | 'workflowSegment'
   ```
   With the same `Y_AXES` array and `getYValues()` function from `tech-independence-chart.tsx`.

5. **Risk Tier mode** (primary):
   - X axis: IP Risk Tier — bucket `techIndependenceScore` inversely into risk tiers:
     - 'Very High Risk' (score < 35), 'High Risk' (35–44), 'Medium Risk' (45–54), 'Low Risk' (55–64), 'Very Low Risk' (65+)
   - Cell color intensity: based on average dependency count (ecosystemDependencies.length) in the cell
   - Cell text: startup count
   - Use `d3.interpolateOrRd` (orange-red) color scale for risk theming

6. **Vendor Dependency Matrix mode**:
   - X axis: Major Ecosystem Vendor — 'Dassault', 'Siemens', 'Autodesk', 'PTC', 'Independent'
   - A company appears in a vendor column if `ecosystemDependencies` includes that vendor. Companies with empty ecosystemDependencies go in 'Independent'.
   - Cell color intensity: startup count
   - Use `d3.interpolateBlues` for vendor mode

7. **Tooltip** (both modes): Fixed-position div, toggled on mouseover. Show:
   - Cell coordinates (tier/vendor × Y group)
   - Startup count
   - Mode-specific metric (avg dependency count for risk tier, or count for vendor)
   - For cells with ≤ 8 companies: list company names with their `ecosystemCompatibility` text (truncated to 80 chars), `graphicsKernel` (if non-empty), and first 3 `modelingParadigms`
   - Shortlisted companies highlighted with ★ amber

8. **Shortlist highlighting**: Amber border (2.5px #f59e0b) on cells containing shortlisted companies. Use `shortlistedIds?.has(id)` guard (K005). Use `''` not `null` for clearing styles (K004).

9. **Layout**: Same margin/cellSize/legend pattern as tech-independence-chart. Legend gradient matches the active color scale. Bottom toolbar shows dimension counts.

## Must-Haves

- [ ] Risk Tier Heatmap mode renders with correct X-axis buckets (inverse of techIndependenceScore)
- [ ] Vendor Dependency Matrix mode renders with correct vendor columns
- [ ] View mode toggle switches between modes
- [ ] Y-axis selector works across all 3 options
- [ ] Tooltip shows ecosystem compatibility, graphics kernel, modeling paradigms
- [ ] Shortlist highlighting with amber border (K005 pattern)
- [ ] D3 .style() uses '' not null on HTML selections (K004)
- [ ] Component exports named `IPDependencyChart`

## Inputs

- ``lib/company-data.ts` — Company interface with ecosystemCompatibility, graphicsKernel, modelingParadigms fields`
- ``components/charts/tech-independence-chart.tsx` — reference D3 heatmap pattern to follow`

## Expected Output

- ``components/charts/ip-dependency-chart.tsx` — dual-mode D3 heatmap chart component`

## Verification

npm run build
