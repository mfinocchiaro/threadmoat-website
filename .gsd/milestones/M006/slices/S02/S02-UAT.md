# S02: Industry Penetration Heatmap — UAT

**Milestone:** M006
**Written:** 2026-04-03T06:36:56.873Z

# S02: Industry Penetration Heatmap — UAT

**Milestone:** M006
**Written:** 2026-04-01

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: Single chart enhancement with no backend, no API, no runtime state — build pass + code inspection confirms correctness. Visual verification in browser confirms rendering.

## Preconditions

- `npm run dev` running at localhost:3000
- Logged in as a dashboard subscriber (analyst or strategist tier)
- Navigate to the Industry Penetration heatmap page

## Smoke Test

Open the Industry Penetration heatmap. The value mode dropdown should show four options: "Startup Count", "Avg Score", "Avg Funding", and "Customer Count". Selecting "Customer Count" should re-render the heatmap with integer customer counts in each cell.

## Test Cases

### 1. Customer Count mode selection

1. Navigate to the Industry Penetration heatmap page
2. Locate the value mode dropdown (top of chart)
3. Click the dropdown and verify four options appear: Startup Count, Avg Score, Avg Funding, Customer Count
4. Select "Customer Count"
5. **Expected:** Heatmap cells show integer values representing known customer counts. Cells with no customers show 0. Color intensity scales with customer count (higher = darker/warmer).

### 2. Tooltip shows customer count for all modes

1. With any value mode selected (e.g., "Startup Count")
2. Hover over a populated cell
3. **Expected:** Tooltip includes a "Known Customers: N" line showing the customer count for that cell, regardless of which value mode is active.

### 3. Legend label updates correctly

1. Select "Customer Count" from the value mode dropdown
2. Look at the color scale legend below/beside the heatmap
3. **Expected:** Legend label reads "Known Customers" (not "Startups" or "Avg Score").

### 4. Color scale correctness

1. Select "Customer Count" mode
2. Identify a cell with a high customer count and a cell with a low customer count
3. **Expected:** High-count cells are visually darker/warmer than low-count cells. The gradient matches the legend range.

### 5. Mode switching preserves layout

1. Switch between all four value modes: Startup Count → Avg Score → Avg Funding → Customer Count → Startup Count
2. **Expected:** Each switch re-renders cell values and legend. No layout glitches, no blank cells, no console errors. Grid structure (rows/columns) remains identical across modes.

## Edge Cases

### Cells with zero known customers

1. Select "Customer Count" mode
2. Find a cell where a startup has no knownCustomers data (empty string or missing)
3. **Expected:** Cell displays "0". No NaN, no blank, no error.

### Single-company cell

1. Select "Customer Count" mode
2. Find a cell containing exactly one company
3. Hover to see tooltip
4. **Expected:** Customer count matches that company's known customer list. Tooltip is consistent with cell value.

## Failure Signals

- Dropdown does not show "Customer Count" option
- Cells show NaN, undefined, or blank when Customer Count mode is selected
- Tooltip missing "Known Customers" line
- Legend label does not change when switching to Customer Count mode
- Console errors when switching modes
- Build fails (`npx next build` exits non-zero)

## Not Proven By This UAT

- Accuracy of the underlying knownCustomers data in CSV source files
- Performance with very large datasets (>1000 companies)
- Accessibility of the heatmap (keyboard navigation, screen reader)

## Notes for Tester

The customer count is parsed from the `knownCustomers` string field in the CSV data via `parseKnownCustomers()`. If a cell shows unexpectedly low numbers, verify the source CSV has populated knownCustomers for companies in that industry/category intersection.
