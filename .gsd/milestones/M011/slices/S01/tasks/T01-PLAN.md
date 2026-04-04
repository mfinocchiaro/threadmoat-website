---
estimated_steps: 9
estimated_files: 2
skills_used: []
---

# T01: Add responsive sidebar with Sheet on mobile and hamburger toggle

1. In sidebar-shell.tsx:
   - Hide the desktop <Sidebar> on screens < md (768px) via `hidden md:block`
   - Add a hamburger menu button (Menu icon) in the top bar area, visible only on mobile (`md:hidden`)
   - When hamburger is clicked, open a shadcn <Sheet> from the left containing the same <Sidebar> component
   - Sheet closes on navigation (link click) and on outside click

2. In topbar.tsx:
   - Accept an optional `onMenuClick` prop and a `showMenu` boolean
   - Render a Menu icon button on the left when `showMenu` is true

3. Ensure the desktop layout is completely unchanged — `md:` breakpoint gates all mobile behavior.

## Inputs

- `components/dashboard/sidebar-shell.tsx`
- `components/dashboard/topbar.tsx`
- `components/dashboard/sidebar.tsx`
- `components/ui/sheet.tsx`

## Expected Output

- `components/dashboard/sidebar-shell.tsx with mobile Sheet`
- `components/dashboard/topbar.tsx with optional hamburger`

## Verification

npm run build passes. Browser at 375px shows hamburger, sheet opens with sidebar. Desktop at 1280px unchanged.
