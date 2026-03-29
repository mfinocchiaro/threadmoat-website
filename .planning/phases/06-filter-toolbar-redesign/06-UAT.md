---
status: testing
phase: 06-filter-toolbar-redesign
source: 06-01-SUMMARY.md, 06-02-SUMMARY.md, 06-03-SUMMARY.md
started: 2026-03-26T14:30:00Z
updated: 2026-03-26T14:30:00Z
---

## Current Test

number: 1
name: FilterToolbar Visible on Dashboard
expected: |
  Navigate to any dashboard chart page (e.g., /dashboard/market-size). A compact sticky toolbar should be visible at the top of the content area (below the topbar, above the chart). It should show category filter buttons (e.g., Category, Operating Model, List, Funding Range, Ocean Strategy) and an inline search input.
awaiting: user response

## Tests

### 1. FilterToolbar Visible on Dashboard
expected: Navigate to any dashboard chart page. A compact sticky toolbar is visible at the top of the content area with category filter buttons and an inline search input.
result: [pending]

### 2. Category Dropdown Popover
expected: Click any category button (e.g., "Category") in the toolbar. A popover opens showing selectable pill-toggle values for that filter category. Selecting a value applies the filter.
result: [pending]

### 3. Active Filter Chips
expected: After selecting one or more filters, active filter chips appear in the toolbar showing the filter type and value (e.g., "List: Shortlist"). Each chip should have an X button to remove that specific filter.
result: [pending]

### 4. Clear All Filters
expected: With multiple filters active, a "Clear All" button is visible. Clicking it removes all active filters and the toolbar collapses to its minimal "No filters active" state.
result: [pending]

### 5. Filter State Persists Across Navigation
expected: Apply one or more filters on any chart page. Navigate to a different dashboard chart page using the sidebar. The same filters remain active — no reset on navigation.
result: [pending]

### 6. Chart Updates When Filters Change
expected: On any chart page, apply a filter (e.g., select a specific Category). The chart content updates immediately to reflect only the filtered companies.
result: [pending]

### 7. Old VizFilterBar Removed
expected: No chart page shows the old large filter overlay/dialog. The only filter UI is the compact toolbar at the top.
result: [pending]

## Summary

total: 7
passed: 0
issues: 0
pending: 7
skipped: 0
blocked: 0

## Gaps

[none yet]
