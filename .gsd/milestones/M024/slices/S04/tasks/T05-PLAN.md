---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T05: Manual testing: pin startups across dashboards

Test workflow: (1) Pin 5 startups across different dashboard pages, (2) Verify breadcrumb persists, (3) Click breadcrumb items to navigate, (4) Unpin from breadcrumb, (5) Reload page and verify state. Test on mobile.

## Inputs

- `components/dashboard/pin-button.tsx`
- `components/dashboard/pinned-breadcrumb.tsx`

## Expected Output

- `Manual test results documenting pin/breadcrumb behavior`

## Verification

All 5 pins persist across pages. Breadcrumb navigation works. Unpin from breadcrumb works. Mobile layout responsive. No console errors.
