# S01: Responsive sidebar — Sheet on mobile with hamburger toggle

**Goal:** Add mobile sidebar using shadcn Sheet component, hide desktop sidebar on small screens, add hamburger toggle
**Demo:** After this: Dashboard sidebar collapses to a Sheet/Drawer on mobile with a hamburger button in the top bar

## Tasks
- [x] **T01: Added responsive sidebar — desktop hidden below md, Sheet opens from left on mobile via hamburger in TopBar** — 1. In sidebar-shell.tsx:
   - Hide the desktop <Sidebar> on screens < md (768px) via `hidden md:block`
   - Add a hamburger menu button (Menu icon) in the top bar area, visible only on mobile (`md:hidden`)
   - When hamburger is clicked, open a shadcn <Sheet> from the left containing the same <Sidebar> component
   - Sheet closes on navigation (link click) and on outside click

2. In topbar.tsx:
   - Accept an optional `onMenuClick` prop and a `showMenu` boolean
   - Render a Menu icon button on the left when `showMenu` is true

3. Ensure the desktop layout is completely unchanged — `md:` breakpoint gates all mobile behavior.
  - Estimate: 20min
  - Files: components/dashboard/sidebar-shell.tsx, components/dashboard/topbar.tsx
  - Verify: npm run build passes. Browser at 375px shows hamburger, sheet opens with sidebar. Desktop at 1280px unchanged.
