# S04: Startup Pinning & Breadcrumb Trail

**Goal:** Allow users to pin startup names for reference while exploring; shows pinned startups as breadcrumb trail
**Demo:** Hover over startup name → 'Pin' button appears. Click to add to pinned list. Pinned list appears as persistent breadcrumb bar at top. Click breadcrumb to jump to that startup's profile.

## Must-Haves

- Pin/unpin buttons visible on all startup references in dashboards. Pinned list persists across pages. Max 10 pins shown in breadcrumb. Breadcrumb styled distinctly from filters.

## Proof Level

- This slice proves: Manual testing: pin 5 startups across different pages, verify persistence and navigation

## Integration Closure

New 'pinned-startups' context created. Breadcrumb bar rendered above dashboard content. Pins stored in localStorage (free users) or DB (paid users).

## Verification

- Track: 'startup.pinned', 'startup.unpinned', 'breadcrumb.navigated_to' with startup ID

## Tasks

- [ ] **T01: Create PinnedStartupsContext** `est:2h`
  New context managing pinned startups list. Exports: pinnedStartups[], addPin(startupId), removePin(startupId), clearAllPins(). Handle max 10 pins. Integrate with user preferences/DB for persistence.
  - Files: `contexts/pinned-startups-context.tsx`
  - Verify: Context correctly adds/removes pins. Max 10 limit enforced. Pins persist across page reloads. API calls work for DB persistence.

- [ ] **T02: Create PinButton component and integrate into startup cards** `est:2h`
  New PinButton component with pin/unpin visual states. Add to all startup name displays: dashboard cards, drill-down lists, company profile headers. Show 'Pin for comparison' tooltip on hover.
  - Files: `components/dashboard/pin-button.tsx`, `components/dashboards/*.tsx`
  - Verify: Pin buttons appear on all startup references. Click toggles pin state. Visual feedback (icon change) shows pin state. No duplicate code across files.

- [ ] **T03: Create PinnedBreadcrumb component** `est:1.5h`
  Breadcrumb bar showing up to 10 pinned startups. Render above dashboard content. Each breadcrumb item is clickable → navigates to company profile. Include 'Clear all' button. Style with distinct color (e.g., subtle background).
  - Files: `components/dashboard/pinned-breadcrumb.tsx`
  - Verify: Breadcrumb displays all pinned startups. Clicking breadcrumb navigates to profile. Max 10 displayed. Clear all works. Style distinct from filters.

- [ ] **T04: Integrate breadcrumb into dashboard layout** `est:1h`
  Add PinnedBreadcrumb to dashboard layout (above filter bar). Show only when pins exist. Ensure responsive layout on mobile (breadcrumb scrolls horizontally if needed).
  - Files: `app/dashboard/layout.tsx`
  - Verify: Breadcrumb renders in correct position. Responsive on mobile. No layout shift when pins added/removed.

- [ ] **T05: Manual testing: pin startups across dashboards** `est:1.5h`
  Test workflow: (1) Pin 5 startups across different dashboard pages, (2) Verify breadcrumb persists, (3) Click breadcrumb items to navigate, (4) Unpin from breadcrumb, (5) Reload page and verify state. Test on mobile.
  - Verify: All 5 pins persist across pages. Breadcrumb navigation works. Unpin from breadcrumb works. Mobile layout responsive. No console errors.

## Files Likely Touched

- contexts/pinned-startups-context.tsx
- components/dashboard/pin-button.tsx
- components/dashboards/*.tsx
- components/dashboard/pinned-breadcrumb.tsx
- app/dashboard/layout.tsx
