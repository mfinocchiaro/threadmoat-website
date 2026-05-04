# S04 T05: Pinning Feature Manual Testing Checklist

## Environment Setup
- Dev server running: `npm run dev`
- Application accessible at: `http://localhost:3000`
- Browser DevTools open to inspect localStorage and network activity
- Test both Chrome/Safari (desktop) and mobile viewport

---

## Test Suite 1: Basic Pinning & Unpinning

### Test 1.1: Pin a startup from VC Dashboard
**Steps:**
1. Navigate to `/dashboard`
2. Select "VC Investor" from scenario selector
3. Verify "Thesis Matches" KPI card shows companies
4. Click on "Thesis Matches" to drill down to matches list
5. Locate first company in the matches list
6. Click the Pin icon button next to the company name
7. **Expected:** 
   - Pin icon changes from outlined (PinOff) to filled (Pin)
   - Breadcrumb bar appears at top with amber background
   - Breadcrumb shows the pinned company name
   - Tooltip shows "Unpin [Company Name]"

### Test 1.2: Verify Breadcrumb Persistence
**Steps:**
1. From the VC matches list, pin a second company by clicking its pin button
2. **Expected:**
   - Second company appears in breadcrumb bar
   - Breadcrumb shows "Company A > Company B"
   - Chevron separators between items
   - Pin icons next to both in the list change to filled state

### Test 1.3: Unpin via Breadcrumb
**Steps:**
1. In the breadcrumb bar, click the X button next to the first pinned company
2. **Expected:**
   - That company is removed from breadcrumb
   - Only second company remains in breadcrumb
   - In the list below, that company's pin icon returns to outlined state
   - Breadcrumb does NOT disappear (contains second company)

### Test 1.4: Clear All Pins
**Steps:**
1. Click the "Clear" button in the breadcrumb bar
2. **Expected:**
   - All companies removed from breadcrumb
   - Breadcrumb bar disappears completely (no layout shift)
   - All pin icons in lists return to outlined state

---

## Test Suite 2: Cross-Dashboard Pinning

### Test 2.1: Pin from Multiple Dashboards
**Steps:**
1. Navigate to `/dashboard`
2. Pin 1 company from VC Investor scenario (verify in breadcrumb)
3. Switch to "OEM Enterprise" scenario
4. Pin 1 company from OEM threats section (drill down first)
5. **Expected:**
   - Breadcrumb now shows 2 companies from different dashboards
   - Switching between scenarios preserves pins in breadcrumb
   - Both companies remain pinned

### Test 2.2: Pin from Company Profile
**Steps:**
1. From breadcrumb, click on a pinned company to navigate to its profile at `/dashboard/company/[id]`
2. Verify company name and details load
3. Verify Pin button is present in the header (size="md" variant="outline")
4. Verify pin button shows filled state (company is already pinned)
5. Click the pin button to unpin
6. **Expected:**
   - Pin button changes to outlined state
   - Breadcrumb still shows company (breadcrumb and button state can differ if user unpins from profile)
   - Actually, if user unpins from profile, breadcrumb should update immediately

---

## Test Suite 3: Persistence & localStorage

### Test 3.1: localStorage Verification
**Steps:**
1. Pin 3 companies across different dashboards
2. Open DevTools → Application → localStorage
3. Find key `pinned-startups`
4. **Expected:**
   - Value is a JSON array: `[{id: "...", name: "..."}, {id: "...", name: "..."}, {id: "...", name: "..."}]`
   - Array length = 3
   - Each object has `id` and `name` fields

### Test 3.2: Persistence After Page Reload
**Steps:**
1. Pin 3 companies
2. Verify breadcrumb shows all 3
3. Refresh the page (Cmd+R or F5)
4. **Expected:**
   - Breadcrumb appears immediately with same 3 companies
   - No hydration mismatch errors in console
   - Pin icons in lists show correct state (filled for pinned, outlined for others)

### Test 3.3: Persistence After Navigation
**Steps:**
1. Pin 2 companies
2. Verify breadcrumb shows both
3. Click on a pinned company breadcrumb link
4. Verify company profile loads
5. Use browser back button to return to dashboard
6. **Expected:**
   - Breadcrumb still shows same 2 companies
   - No pins lost during navigation

### Test 3.4: Max Pins Enforcement
**Steps:**
1. Clear all pins
2. Manually set localStorage to have 10 pinned companies (or pin 10 via UI)
3. Try to pin an 11th company
4. **Expected:**
   - 11th pin fails silently
   - Still shows only 10 in breadcrumb
   - No error message appears (graceful degradation)
   - Toast or inline hint might appear (check implementation)

---

## Test Suite 4: UI/UX & Responsiveness

### Test 4.1: Breadcrumb Styling (Desktop)
**Steps:**
1. Pin 3 companies
2. Verify breadcrumb appearance
3. **Expected:**
   - Background: amber-50 (light) or dark:amber-950/20 (dark mode)
   - Sticky position at top (z-10)
   - Padding: 2rem horizontal, 1rem vertical
   - Gap between items: 0.5rem (ChevronRight separator)
   - Each item is a clickable Link with hover state
   - X button appears on hover for each item
   - "Clear" button on right side

### Test 4.2: Breadcrumb Responsive (Mobile)
**Steps:**
1. Pin 4-5 companies
2. Resize browser to mobile width (375px)
3. **Expected:**
   - Breadcrumb has `overflow-x-auto` to scroll horizontally
   - Items stack if needed (may have `flex-wrap`)
   - All items remain accessible
   - Clear button still visible
   - No text truncation of company names (unless name is very long)

### Test 4.3: Pin Button Sizing
**Steps:**
1. Navigate to different sections where pin buttons appear
2. Check sizes in:
   - Drill-down lists (size="sm", h-8 w-8)
   - Company profile header (size="md", h-9 w-9)
3. **Expected:**
   - All buttons aligned properly with text
   - Icon sizes match button size (4px for sm, 5px for md)
   - Tooltip appears on hover with correct text

### Test 4.4: Dark Mode
**Steps:**
1. Toggle dark mode (theme switcher)
2. Verify breadcrumb styling in dark mode
3. Verify pin button colors in dark mode
4. **Expected:**
   - Breadcrumb background: dark:bg-amber-950/20
   - Icon colors: primary when pinned, muted when unpinned
   - All text readable in both modes

---

## Test Suite 5: Accessibility & Edge Cases

### Test 5.1: Keyboard Navigation
**Steps:**
1. Pin a company
2. Tab through breadcrumb items
3. **Expected:**
   - All interactive elements (links, buttons) are focusable
   - Focus indicator visible
   - Enter key navigates or activates

### Test 5.2: Tooltip Accessibility
**Steps:**
1. Hover over a pin button
2. Verify tooltip appears
3. Tab away from button
4. **Expected:**
   - Tooltip shows helpful text: "Pin [name] for comparison" or "Unpin [name]"
   - Tooltip has appropriate aria-label or accessible name
   - No tooltip on focus (unless explicitly designed for accessibility)

### Test 5.3: Empty State
**Steps:**
1. Clear all pins
2. Navigate to dashboard
3. **Expected:**
   - Breadcrumb does NOT render (returns null)
   - No empty space where breadcrumb would be (no layout shift)
   - All dashboard content renders normally

### Test 5.4: Very Long Company Names
**Steps:**
1. Manually pin a startup with a very long name (if one exists in data)
2. Verify breadcrumb layout
3. **Expected:**
   - Name truncates gracefully with ellipsis (if needed)
   - Or layout reflows to accommodate (flex-wrap)
   - Breadcrumb remains usable

---

## Test Suite 6: Integration Tests

### Test 6.1: Pin Button in All Dashboard Types
**Verify pin button exists in:**
- [ ] VC Dashboard: matches list drill-down
- [ ] VC Dashboard: burn warnings section
- [ ] OEM Dashboard: drill-down list
- [ ] OEM Dashboard: threat radar section
- [ ] OEM Dashboard: acquisition shortlist section
- [ ] ISV Dashboard: drill-down list
- [ ] Startup Dashboard: competitors list
- [ ] Company Profile: page header

**For each location:**
1. Pin a company
2. Verify breadcrumb updates
3. Verify icon changes to filled state
4. Verify correct tooltip text

### Test 6.2: Navigation via Breadcrumb
**Steps:**
1. Pin 3 companies from different pages
2. For each breadcrumb link:
   - Click the company name link
   - **Expected:** Navigates to `/dashboard/company/[id]` with correct company data loaded
   - Back button returns to previous page with breadcrumb intact

---

## Test Suite 7: Console & Performance

### Test 7.1: No Console Errors
**Steps:**
1. Run through all tests above
2. Check DevTools Console
3. **Expected:**
   - No red errors related to pinning
   - No hydration mismatch warnings
   - No localStorage errors
   - No React warnings about missing keys

### Test 7.2: Performance
**Steps:**
1. Open DevTools → Performance tab
2. Pin a company and record performance
3. **Expected:**
   - Breadcrumb renders without layout thrashing
   - No long tasks (> 50ms)
   - Context updates are batched

---

## Results Summary

| Test Suite | Status | Notes |
|-----------|--------|-------|
| 1. Basic Pinning | ☐ PASS / ☐ FAIL | |
| 2. Cross-Dashboard | ☐ PASS / ☐ FAIL | |
| 3. Persistence | ☐ PASS / ☐ FAIL | |
| 4. UI/UX & Responsive | ☐ PASS / ☐ FAIL | |
| 5. Accessibility | ☐ PASS / ☐ FAIL | |
| 6. Integration | ☐ PASS / ☐ FAIL | |
| 7. Console & Performance | ☐ PASS / ☐ FAIL | |

**Overall Status:** ☐ PASS / ☐ FAIL

**Blockers Found:** (none/list here)

**Notes & Observations:**

---

## Sign-off

Tested by: ____________
Date: ____________
Approved for production: ☐ YES / ☐ NO

