# S03: Company Shortlist / Workspace — UAT

**Milestone:** M005
**Written:** 2026-04-01T22:23:08.499Z

## UAT: S03 — Company Shortlist / Workspace

### Preconditions
- App running locally (`npm run dev`) or deployed
- User logged in with dashboard access (any tier)
- At least one chart page loaded with company data visible

---

### TC-01: Add company to shortlist via hover card

1. Navigate to the Periodic Table chart (`/dashboard/periodic-table`)
2. Hover over any company cell to open the CompanyHoverCard
3. **Expected:** A star icon (outline, not filled) appears next to the company name
4. Click the star icon
5. **Expected:** Star fills with amber color (`text-amber-500`), company is added to shortlist
6. **Expected:** The hover card does NOT close (e.stopPropagation works)
7. Click the star icon again
8. **Expected:** Star returns to outline, company removed from shortlist

### TC-02: Shortlist badge appears in toolbar

1. Open any chart page
2. Click the star on a company hover card to add it to the shortlist
3. Look at the filter toolbar
4. **Expected:** A star icon with a badge showing "1" appears in the toolbar
5. Add two more companies
6. **Expected:** Badge updates to "3"

### TC-03: ShortlistPanel popover — view and manage

1. With 3+ companies shortlisted, click the shortlist badge/button in the toolbar
2. **Expected:** A popover panel opens showing all shortlisted companies
3. **Expected:** Each row shows company name, subsegment badge, and an X remove button
4. **Expected:** Panel is scrollable if many companies
5. Click the X button on one company
6. **Expected:** Company removed from list, badge count decrements
7. Click "Clear All" at the bottom of the panel
8. **Expected:** All companies removed, badge disappears, panel shows empty state
9. **Expected:** Empty state reads "Click the ★ on any company card to start building your shortlist"

### TC-04: Shortlist highlights on Bubble Chart

1. Shortlist 2-3 companies
2. Navigate to Bubble Chart (`/dashboard/bubbles`)
3. **Expected:** Shortlisted companies show an amber stroke ring (#f59e0b, ~2.5px) around their bubble
4. **Expected:** Non-shortlisted companies render normally without amber stroke

### TC-05: Shortlist highlights on Quadrant Chart

1. With companies still shortlisted, navigate to Quadrant Chart (`/dashboard/quadrant`)
2. **Expected:** Shortlisted company dots show amber stroke ring
3. **Expected:** Non-shortlisted dots render normally

### TC-06: Shortlist highlights on Periodic Table

1. Navigate to Periodic Table (`/dashboard/periodic-table`)
2. **Expected:** Shortlisted company cells show amber CSS outline + subtle glow
3. **Expected:** A small ★ indicator appears in the corner of shortlisted cells
4. **Expected:** Non-shortlisted cells render normally without outline or indicator

### TC-07: Shortlist highlights on Treemap Chart

1. Navigate to Treemap Chart (`/dashboard/treemap`)
2. **Expected:** Shortlisted company rectangles show amber stroke ring
3. **Expected:** Non-shortlisted rectangles render normally

### TC-08: Highlights on Tab Overview pages

1. Navigate to Market tab (`/dashboard/tab/market`)
2. **Expected:** Shortlisted companies highlighted on all chart previews (quadrant, bubble, periodic table) within the tab
3. Navigate to Financial tab (`/dashboard/tab/financial`)
4. **Expected:** Shortlisted companies highlighted on treemap preview

### TC-09: Persistence across page navigation

1. Shortlist 2 companies on the Periodic Table page
2. Navigate to Bubble Chart page
3. **Expected:** Same 2 companies are highlighted
4. Navigate to the ShortlistPanel via toolbar
5. **Expected:** Same 2 companies listed in panel

### TC-10: Persistence across browser refresh (localStorage)

1. Shortlist 3 companies
2. Hard refresh the browser (Cmd+Shift+R)
3. **Expected:** After page loads, shortlisted companies are still highlighted
4. Open ShortlistPanel
5. **Expected:** Same 3 companies present
6. **Expected:** No flash or momentary empty state during hydration (K001 pattern)

### TC-11: Stale ID handling

1. Shortlist a company
2. (Simulate: if the company ID is removed from the dataset in a future data refresh)
3. **Expected:** The stale ID is silently dropped from `shortlistedCompanies` resolution
4. **Expected:** The raw `ids` array may still contain the stale ID, but no error is thrown

### TC-12: Empty shortlist — no highlight artifacts

1. Clear the entire shortlist (Clear All)
2. Navigate through all chart pages
3. **Expected:** No amber highlights visible on any chart
4. **Expected:** No badge visible in toolbar
5. **Expected:** Toolbar star icon is present but without badge count

### TC-13: Star button hydration gate

1. Hard refresh any chart page
2. Immediately hover over a company before JS fully loads
3. **Expected:** Star toggle button does NOT appear until hydration completes (no flash of incorrect state)
