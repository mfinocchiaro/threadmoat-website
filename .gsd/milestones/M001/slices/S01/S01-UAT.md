## S01: Filter Toolbar Redesign — UAT

### UX-01: Compact sticky filter toolbar visible at top of dashboard content area
- [ ] Navigate to any dashboard chart page
- [ ] Verify toolbar is visible at top of content area (not sidebar)
- [ ] Scroll down — toolbar remains sticky at top
- [ ] Toolbar collapses to thin bar when no filters active

### UX-02: Filter toolbar shows active filters as pills/chips with remove buttons
- [ ] Click a filter category button (e.g., Category)
- [ ] Select a value from the popover
- [ ] Verify a pill/chip appears in the active filters row with an X button
- [ ] Click the X — filter is removed, chip disappears

### UX-03: Filter state persists across chart navigation
- [ ] Set a filter (e.g., select Factory Futures investment list)
- [ ] Navigate to a different chart page (e.g., /dashboard/quadrant to /dashboard/radar)
- [ ] Verify the filter chip is still visible and the chart shows filtered data
- [ ] Click Clear all — all filters removed across all pages

### UX-04: Filter toolbar applies to all visible charts simultaneously
- [ ] Navigate to a tab overview page (e.g., /dashboard/tab/market)
- [ ] Set a filter via the toolbar
- [ ] Verify all chart cards on the page update to reflect the filter
