# S01: Co-investment heatmap — which investors frequently co-invest — UAT

**Milestone:** M013
**Written:** 2026-04-04T07:59:21.707Z

## UAT: S01 — Co-Investment Heatmap

### Pre-conditions
- User logged in as admin
- Dashboard sidebar visible

### Test 1: Page loads with heatmap
1. Navigate to `/dashboard/co-investment`
2. **Expected:** Heatmap renders with colored cells, summary cards show non-zero counts

### Test 2: Minimum threshold filter
1. Change min shared companies from 2 to 3
2. **Expected:** Heatmap cells reduce (fewer pairs meet threshold), summary cards update

### Test 3: Cell hover tooltip
1. Hover over a colored cell
2. **Expected:** Tooltip shows "Investor A × Investor B: N shared companies"

### Test 4: Cell click drill-down
1. Click on a colored cell
2. **Expected:** Dialog opens showing shared companies with name and funding

### Test 5: Sidebar entry
1. Check sidebar admin section
2. **Expected:** "Co-Investment" entry with GitCompare icon, navigates to /dashboard/co-investment

### Failure signals
- Empty heatmap with no cells
- JS errors in console
- Missing sidebar entry
