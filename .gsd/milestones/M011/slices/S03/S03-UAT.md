# S03: Mobile visual verification across page types — UAT

**Milestone:** M011
**Written:** 2026-04-04T05:03:55.596Z

## UAT: Mobile visual verification\n\n### Requires: Authenticated browser session at 375px viewport\n\n### Test 1: Sidebar on mobile\n- [ ] At 375px: no sidebar visible, hamburger icon in top bar\n- [ ] Click hamburger: Sheet opens from left with full sidebar\n- [ ] Click nav item: Sheet closes, page navigates\n\n### Test 2: Chart pages\n- [ ] /dashboard/bubbles: no horizontal overflow\n- [ ] /dashboard/periodic-table: grid fits in viewport\n- [ ] /dashboard/tab/financial: all charts render\n- [ ] /dashboard/reports: report generator usable\n\n### Test 3: Filter toolbar\n- [ ] Filter chips wrap correctly on narrow screen\n- [ ] Popover dropdowns don't overflow viewport
