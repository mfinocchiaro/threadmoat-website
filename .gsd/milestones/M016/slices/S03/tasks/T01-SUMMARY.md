---
id: T01
parent: S03
milestone: M016
key_files:
  - app/dashboard/heatmap/page.tsx
  - app/dashboard/parallel/page.tsx
  - app/dashboard/box-plot/page.tsx
  - app/dashboard/distribution/page.tsx
  - app/dashboard/splom/page.tsx
  - components/dashboard/sidebar-shell.tsx
key_decisions:
  - Used <details> for collapsible explanations — doesn't clutter the UI by default
  - Hidden filters via pathname check in sidebar-shell rather than per-page prop
duration: 
verification_result: passed
completed_at: 2026-04-05T14:00:17.422Z
blocker_discovered: false
---

# T01: Added collapsible 'How to read this chart' explanations to 5 advanced charts and hid filters on settings page.

**Added collapsible 'How to read this chart' explanations to 5 advanced charts and hid filters on settings page.**

## What Happened

Added `<details>` collapsible 'How to read this chart' sections to heatmap, parallel coords, box plot, distribution, and scatter matrix pages. Each provides a 2-3 sentence interpretation guide explaining what the visual patterns mean and how to interact. Hidden FilterToolbar on /dashboard/settings by checking pathname in sidebar-shell.tsx. Skipped landscape-intro star feature — the shortlist star already exists in the hover card, and adding it to domain-level summary cards doesn't make sense since domains aren't individual companies.

## Verification

Build passes.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx next build` | 0 | ✅ pass | 26700ms |

## Deviations

Skipped landscape-intro star — shortlist is a company-level feature, not a domain-level one. The star already appears in the hover card when hovering individual company tiles.

## Known Issues

None.

## Files Created/Modified

- `app/dashboard/heatmap/page.tsx`
- `app/dashboard/parallel/page.tsx`
- `app/dashboard/box-plot/page.tsx`
- `app/dashboard/distribution/page.tsx`
- `app/dashboard/splom/page.tsx`
- `components/dashboard/sidebar-shell.tsx`
