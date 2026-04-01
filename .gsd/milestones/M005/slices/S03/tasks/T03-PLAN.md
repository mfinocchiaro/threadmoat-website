---
estimated_steps: 33
estimated_files: 4
skills_used: []
---

# T03: Thread shortlistedIds to 4 key charts and render visual highlight treatment

## Description

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

## Inputs

- ``hooks/use-thesis-gated-data.ts` — returns shortlistedIds Set<string> (modified in T01)`
- ``components/charts/bubble-chart.tsx` — existing D3 bubble chart to add highlight to`
- ``components/charts/quadrant-chart.tsx` — existing D3 quadrant chart to add highlight to`
- ``components/charts/periodic-table.tsx` — existing D3 periodic table to add highlight to`
- ``components/charts/treemap-chart.tsx` — existing D3 treemap to add highlight to`

## Expected Output

- ``components/charts/bubble-chart.tsx` — modified with shortlistedIds prop and highlight rendering`
- ``components/charts/quadrant-chart.tsx` — modified with shortlistedIds prop and highlight rendering`
- ``components/charts/periodic-table.tsx` — modified with shortlistedIds prop and highlight rendering`
- ``components/charts/treemap-chart.tsx` — modified with shortlistedIds prop and highlight rendering`

## Verification

npm run build && grep -c 'shortlistedIds' components/charts/bubble-chart.tsx components/charts/quadrant-chart.tsx components/charts/periodic-table.tsx components/charts/treemap-chart.tsx | grep -v ':0$' | wc -l | grep -q '4'
