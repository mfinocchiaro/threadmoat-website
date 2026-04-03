# S03: Target Customer Profile Heatmap — UAT

**Milestone:** M006
**Written:** 2026-04-03T06:50:04.519Z

# S03: Target Customer Profile Heatmap — UAT

**Milestone:** M006
**Written:** 2026-04-01

## UAT Type

- UAT mode: live-runtime
- Why this mode is sufficient: The heatmap is a client-side D3 visualization rendered from CSV data — requires a running dev server to verify interactive behavior, axis switching, tooltips, and data correctness.

## Preconditions

- Dev server running (`npm run dev` or `npx next dev`)
- Logged in as an admin/strategist user with dashboard access
- At least some startup data loaded (CSV pipeline populated)

## Smoke Test

Navigate to `/dashboard/customer-profile`. The page should render a heatmap with colored cells, three dropdown selectors (X-axis, Y-axis, Value Mode), a color legend, and a hotspot insight bar below the chart.

## Test Cases

### 1. Default View Renders Correctly

1. Navigate to `/dashboard/customer-profile`
2. Verify default X-axis is "Buyer Persona", Y-axis is "Industries Served", Value Mode is "Startup Count"
3. Verify heatmap cells are colored on a gradient scale
4. Verify Y-axis labels appear on the left, X-axis labels appear at the top
5. **Expected:** A filled heatmap with buyer personas across the top, industries down the side, cells colored by startup count

### 2. X-Axis Dimension Switching

1. From default view, change X-axis dropdown to "Company Size"
2. Verify heatmap re-renders with company size categories across the top (e.g., "Startup", "Growth", "Enterprise", "Unknown")
3. Change X-axis to "Geography"
4. Verify geographic regions appear (North America, DACH, Western Europe, UK & Ireland, Nordics, Israel, Asia-Pacific, Other)
5. Change X-axis to "Deployment Model"
6. Verify deployment model values appear across the top
7. **Expected:** Each X-axis switch re-renders the heatmap with appropriate column labels and recalculated cell values

### 3. Y-Axis Grouping Switching

1. Set X-axis to "Buyer Persona"
2. Change Y-axis to "Investment Thesis"
3. Verify row labels change to investment thesis categories
4. Change Y-axis to "Workflow Segment"
5. Verify row labels change to workflow segments
6. Change Y-axis to "Manufacturing Type"
7. Verify row labels change to manufacturing type categories
8. **Expected:** Each Y-axis switch changes the row groupings while preserving the selected X-axis dimension

### 4. Value Mode Switching

1. Note cell colors in "Startup Count" mode
2. Switch Value Mode to "Avg. Weighted Score"
3. Verify cell colors change (different distribution)
4. Switch to "Avg. Funding ($M)"
5. Verify cell colors change again
6. Switch to "Customer Count"
7. Verify cell colors change
8. **Expected:** Each value mode produces a different color distribution reflecting the underlying metric

### 5. Tooltip Interaction

1. Hover over a colored cell
2. Verify tooltip appears showing: X-group × Y-group label, count, avg score, avg funding, customer count
3. If any companies in the cell are shortlisted, verify amber ★ indicator with company names
4. For cells with ≤5 companies, verify individual company names listed
5. Move mouse away from cell
6. **Expected:** Tooltip follows cursor, disappears on mouseout, shows accurate breakdown

### 6. Hotspot Insight Bar

1. Look below the heatmap for the "Hotspots" section
2. Verify it lists the top 3 cells with count ≥ 5
3. Verify "White Spaces" section shows cells with count 0 or 1
4. **Expected:** Hotspot bar surfaces the densest and emptiest cells as quick insights

### 7. Shortlist Highlighting

1. Add 2-3 companies to the shortlist from another chart page
2. Navigate to `/dashboard/customer-profile`
3. Verify cells containing shortlisted companies have an amber/yellow border
4. Hover over a highlighted cell
5. Verify tooltip shows shortlisted company names with ★ indicator
6. **Expected:** Shortlisted companies are visually distinguishable via amber cell borders and tooltip callouts

### 8. Sidebar Navigation

1. Open the sidebar
2. Verify "Customer Profile" entry appears with UserCircle icon, after Market Momentum
3. Click it
4. **Expected:** Navigates to `/dashboard/customer-profile`

## Edge Cases

### Empty Data State

1. Apply thesis filters that exclude all companies
2. **Expected:** Heatmap renders with no colored cells or shows an empty state gracefully (no crash)

### All Unknown Values

1. Switch X-axis to "Deployment Model" (many companies may lack this field)
2. Verify "Unknown" column appears and aggregates correctly
3. **Expected:** Missing data maps to "Unknown" bucket without errors

### Geography Region Collapsing

1. Switch X-axis to "Geography"
2. Verify ~8 region columns appear (not 43 individual countries)
3. Verify countries with flag emojis (e.g., "United States 🇺🇸") are correctly mapped
4. **Expected:** All countries collapse into their expected geographic regions

## Failure Signals

- Page crashes or shows white screen on load
- Dropdown selectors don't change the heatmap
- Cells show NaN or undefined text
- Tooltip doesn't appear or shows wrong data
- Build fails (`npx next build` exits non-zero)
- Customer Profile not visible in sidebar

## Not Proven By This UAT

- Performance under very large datasets (1000+ companies)
- Accessibility (keyboard navigation of heatmap cells, screen reader support)
- Print/PDF rendering of the heatmap
- Mobile responsiveness of the dual-axis selector layout

## Notes for Tester

- The "Manufacturing Type" Y-axis parses Python-style list strings (`['Type1', 'Type2']`), so some values may look unusual if source data has inconsistent formatting.
- Geographic region mapping is hardcoded to 8 regions — countries not explicitly mapped fall to "Other". Check if any important countries are missing from the mapping.
- The color legend gradient uses a unique SVG ID — if both Industry Penetration and Customer Profile pages are somehow rendered simultaneously (e.g., in a report), verify no gradient collision.
