# S02 E2E Test Plan: Filter Hierarchy & Reactivity

## Overview
Manual testing protocol to verify that filter hierarchy (sidebar vs top) works correctly and that filters visibly affect graph data across all 4 dashboards.

## Setup
- Start the dev server: `npm run dev`
- Navigate to `/dashboard` (Startup Intelligence)
- Open browser console to check for any errors

## Test Scenarios

### Test 1: Top Filters Refine Sidebar Selection
**Goal:** Verify that top filters narrow down sidebar hypothesis

#### Steps:
1. In sidebar, select "founder" scenario (already defaulted)
2. In top filter bar, select: Industries = "CAD" (click Industries dropdown → select CAD)
3. Observe the filtered list count changes
4. Add another industry filter: "CAM"
5. Verify the intersection works: should show companies in BOTH CAD AND CAM
6. Add a top filter: Country = "US"
7. Observe that charts (landscape, quadrant, etc.) update with the intersection

**Expected Result:**
- Charts show only companies that match ALL selected filters
- Result count decreases as more filters are added
- Filter chips display active filters at the top

---

### Test 2: Collapsible Filter Bar Persistence
**Goal:** Verify filter bar collapse/expand state persists

#### Steps:
1. Click the collapse button ("Collapse" text in the filter bar)
2. Observe filter bar collapses to icon + badge showing active count
3. Refresh the page
4. Verify collapsed state is preserved
5. Click to expand
6. Verify it returns to full toolbar
7. Refresh again
8. Verify expanded state is preserved

**Expected Result:**
- localStorage correctly saves and restores collapse state
- No hydration mismatch errors in console

---

### Test 3: Filter Reactivity Across All 4 Dashboards
**Goal:** Verify filters work correctly across startup, VC, OEM, and ISV dashboards

#### Test 3a: Startup Dashboard (Moat Swimmer)
1. Navigate to `/dashboard`
2. Verify "Moat Swimmer" scenario is selected
3. Apply filters: Industries = "CAD", Countries = "US"
4. Verify landscape chart shows filtered companies
5. Verify periodic table updates
6. Verify quadrant chart updates
7. Check KPI counts (Competitors Found) matches filtered data

#### Test 3b: VC Dashboard (Thesis Writer)
1. Click "Thesis Writer" in sidebar
2. Configure a thesis (e.g., focus on founders, set score weights)
3. Apply top filters: Funding Round = "Series A"
4. Verify deal flow chart updates
5. Verify portfolio visualization shows filtered results
6. Verify KPI metrics update

#### Test 3c: OEM Dashboard (White Space Filler)
1. Click "White Space" in sidebar
2. Configure White Space hypothesis
3. Apply filters: Deployment Model = "Cloud"
4. Verify software landscape shows gap analysis with filtered companies
5. Verify replacement target list narrows
6. Check industry penetration chart updates

#### Test 3d: ISV Dashboard (Acquisition Radar)
1. Click "Acq. Radar" in sidebar
2. Configure acquisition hypothesis
3. Apply filters: Category = "AI Manufacturing"
4. Verify acquisition target visualization updates
5. Verify partnership opportunity list narrows
6. Check metrics reflect filtered selection

**Expected Result:**
- All 4 dashboards apply filters to their charts
- Filters visibly narrow result sets
- No console errors or crashes
- Charts re-render when filters change

---

### Test 4: Search Filter Works
**Goal:** Verify inline search in filter bar works

#### Steps:
1. In filter bar, type "autodesk" in the search box
2. Verify dropdown appears with matching companies
3. Click a company name in the dropdown
4. Verify it navigates to company profile AND search field clears
5. Go back to dashboard
6. Type partial search: "sol" (should match "Solidworks", "Solutionix", etc.)
7. Verify results appear
8. Clear search (click X button)
9. Verify all filters reset and results expand

**Expected Result:**
- Search matches company names and tags
- Dropdown shows max 10 results
- Clicking a result navigates correctly
- Clearing search resets filter

---

### Test 5: Clear All Filters
**Goal:** Verify "clear all" functionality

#### Steps:
1. Apply multiple filters: Industries, Countries, Lifecycle, Funding Round
2. Verify filter chips display all selections
3. Click "Clear All" button (if visible in chip row)
4. Alternatively, manually remove each filter by clicking X on chips
5. Verify all filters clear and results expand
6. Verify charts revert to showing all companies

**Expected Result:**
- All filter state clears
- Charts show full dataset
- No filters remain active

---

### Test 6: Ocean Strategy Filter
**Goal:** Verify Red/Blue Ocean filter works

#### Steps:
1. Click "Ocean" button in filter bar
2. Select "Red Ocean" option
3. Verify landscape chart highlights red ocean companies
4. Verify count badge updates
5. Switch to "Blue Ocean"
6. Verify charts update to show only blue ocean companies
7. Select "All" to clear filter
8. Verify full dataset shows again

**Expected Result:**
- Ocean strategy correctly filters by disruption score
- Charts update to show correct subset
- Badge color changes (red/blue)

---

### Test 7: Funding Range Filter
**Goal:** Verify funding range slider works correctly

#### Steps:
1. Click "Funding" button in filter bar
2. Adjust the slider to range [500M, 2B]
3. Verify chart updates to show only companies in that range
4. Drag slider to different position: [100M, 500M]
5. Verify results update
6. Click "Clear" to reset range
7. Verify filter deactivates and results expand

**Expected Result:**
- Slider correctly constrains to range
- Charts update in real-time as slider moves
- Clear button properly resets to [0,0]
- No negative or inverted ranges possible

---

### Test 8: Browser Back/Forward Navigation
**Goal:** Verify filter state persists during navigation

#### Steps:
1. Apply filters on Startup dashboard: Industries = "CAD"
2. Navigate to a company profile: click on a company in the results
3. Verify company profile page loads
4. Click browser back button
5. Verify you return to Startup dashboard
6. Verify filters are still applied: Industries still shows "CAD"
7. Verify charts still show filtered results

**Expected Result:**
- Filter state preserved across navigation
- No loss of filter selections
- Charts remember the context

---

## Known Issues / Edge Cases

- **Empty results:** If filters result in zero companies, UI should show empty state message
- **Mobile responsiveness:** Filter bar should collapse on mobile; test on iPhone/Android viewport
- **Accessibility:** Verify keyboard navigation works (Tab through filters, Space/Enter to toggle)

---

## Sign-Off Checklist

- [ ] Test 1: Top filters refine sidebar selection ✓
- [ ] Test 2: Collapsible filter bar persistence ✓
- [ ] Test 3a: Startup dashboard reactivity ✓
- [ ] Test 3b: VC dashboard reactivity ✓
- [ ] Test 3c: OEM dashboard reactivity ✓
- [ ] Test 3d: ISV dashboard reactivity ✓
- [ ] Test 4: Search filter ✓
- [ ] Test 5: Clear all filters ✓
- [ ] Test 6: Ocean strategy filter ✓
- [ ] Test 7: Funding range filter ✓
- [ ] Test 8: Browser navigation ✓
- [ ] No console errors ✓
- [ ] No regressions in other features ✓

**Tester:** _____________________
**Date:** _____________________
**Notes:** _____________________

