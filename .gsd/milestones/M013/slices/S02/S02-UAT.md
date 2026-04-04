# S02: Investor comparison — side-by-side portfolio analysis — UAT

**Milestone:** M013
**Written:** 2026-04-04T08:02:40.533Z

## UAT: S02 — Investor Comparison

### Pre-conditions
- User logged in as admin

### Test 1: Search and select investors
1. Navigate to `/dashboard/investor-compare`
2. Type an investor name in the search box
3. **Expected:** Dropdown shows matching investors with company counts
4. Click an investor
5. **Expected:** Investor appears as colored badge, search clears

### Test 2: Side-by-side profiles
1. Select 2 investors
2. **Expected:** Two profile cards appear side by side with portfolio size, funding, avg score, sector badges, and stage bars

### Test 3: Three-way comparison
1. Select a third investor
2. **Expected:** Three columns, responsive layout

### Test 4: Portfolio overlap
1. With 2+ investors selected, scroll to overlap section
2. **Expected:** Shows shared companies with colored dots indicating which investors backed each

### Test 5: Remove investor
1. Click X on an investor badge
2. **Expected:** Investor removed, profiles and overlap update

### Failure signals
- Search returns no results
- Empty profile cards
- JS errors in console
