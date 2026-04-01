---
estimated_steps: 35
estimated_files: 3
skills_used: []
---

# T02: Add shortlist toggle button to CompanyHoverCard and build shortlist panel in filter toolbar

## Description

Add the user-facing interaction layer: a shortlist toggle button inside `CompanyHoverCard` (enabling shortlist-add on periodic table and landscape chart), and a collapsible shortlist panel accessible from the filter toolbar with badge count, company list with remove buttons, and a clear-all action.

## Steps

1. Update `components/ui/company-hover-card.tsx`:
   - Import `useShortlist` from `@/contexts/shortlist-context`
   - Add a `Star` icon button (from lucide-react) in the header row next to the company name
   - When `has(company.id)` is true: filled star icon with amber color (`text-amber-500`), tooltip "Remove from shortlist"
   - When false: outline star icon, tooltip "Add to shortlist"
   - `onClick` calls `toggle(company.id)` with `e.stopPropagation()` to prevent closing the hover card
   - Use the `hydrated` flag from useShortlist — only show the button after hydration to avoid flash

2. Create `components/dashboard/shortlist-panel.tsx`:
   - Collapsible panel component that shows the current shortlist
   - Uses `useShortlist()` to get `shortlistedCompanies`, `remove`, `clear`, `count`
   - Renders as a dropdown/popover anchored to a toolbar trigger button
   - Each company row shows: company name, subsegment badge, remove button (X icon)
   - Footer has a "Clear All" button (only enabled when count > 0)
   - Empty state: "Click the ★ on any company card to start building your shortlist"
   - Panel should be scrollable if many companies (max-h with overflow-y-auto)

3. Update `components/dashboard/filter-toolbar.tsx`:
   - Import `ShortlistPanel` trigger component
   - Add a shortlist button in the toolbar (after the filter categories area, before search): a `Star` icon + badge count showing number of shortlisted companies
   - Badge only visible when count > 0
   - Click opens the ShortlistPanel popover

## Must-Haves

- [ ] CompanyHoverCard has a star toggle button that adds/removes companies from shortlist
- [ ] ShortlistPanel shows all shortlisted companies with remove buttons and Clear All
- [ ] Filter toolbar has a shortlist badge/button that opens the panel
- [ ] Star button state reflects current shortlist membership (filled=in, outline=out)
- [ ] e.stopPropagation() on star click prevents hover card dismissal
- [ ] npm run build passes

## Verification

- `npm run build` passes with zero type errors
- `grep -q 'useShortlist' components/ui/company-hover-card.tsx` confirms toggle integration
- `grep -q 'ShortlistPanel\|shortlist-panel' components/dashboard/filter-toolbar.tsx` confirms toolbar integration
- `test -f components/dashboard/shortlist-panel.tsx` confirms panel file created

## Inputs

- ``contexts/shortlist-context.tsx` — useShortlist hook (created in T01)`
- ``components/ui/company-hover-card.tsx` — existing hover card to add toggle button to`
- ``components/dashboard/filter-toolbar.tsx` — existing toolbar to add shortlist trigger to`

## Expected Output

- ``components/ui/company-hover-card.tsx` — modified with shortlist star toggle button`
- ``components/dashboard/shortlist-panel.tsx` — new collapsible shortlist panel component`
- ``components/dashboard/filter-toolbar.tsx` — modified with shortlist badge/trigger button`

## Verification

npm run build && grep -q 'useShortlist' components/ui/company-hover-card.tsx && test -f components/dashboard/shortlist-panel.tsx && grep -q 'shortlist' components/dashboard/filter-toolbar.tsx
