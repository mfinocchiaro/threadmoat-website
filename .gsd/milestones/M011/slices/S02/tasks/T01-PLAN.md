---
estimated_steps: 4
estimated_files: 2
skills_used: []
---

# T01: Responsive padding and overflow fixes in dashboard shell

1. In sidebar-shell.tsx, change content container from `px-6` to `px-3 sm:px-6` for tighter padding on mobile.
2. Add `overflow-x-hidden` to the content scroll area to prevent horizontal scroll from chart overflow.
3. In filter-toolbar.tsx, ensure the filter bar wraps on narrow screens (flex-wrap).
4. Add `max-w-full overflow-hidden` to the chart-card or page wrapper patterns commonly used across chart pages.

## Inputs

- `components/dashboard/sidebar-shell.tsx`
- `components/dashboard/filter-toolbar.tsx`

## Expected Output

- `Responsive padding and overflow fixes applied`

## Verification

npm run build passes.
