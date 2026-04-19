---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T02: Market concentration HHI + deal flow pipeline

Create /dashboard/market-concentration page showing Herfindahl-Hirschman Index by category (revenue concentration). Create /dashboard/deal-flow page with kanban-style pipeline (Screening, Evaluating, Shortlisted, Passed) using localStorage for persistence, backed by a context provider. Add all 4 new pages to sidebar admin section.

## Inputs

- `app/api/companies/route.ts (existing)`
- `contexts/shortlist-context.tsx (pattern reference)`

## Expected Output

- `app/dashboard/market-concentration/page.tsx`
- `app/dashboard/deal-flow/page.tsx`
- `contexts/deal-flow-context.tsx`
- `components/dashboard/sidebar.tsx (modified)`

## Verification

HHI chart renders per-category concentration. Deal flow pipeline persists evaluation state across page reloads.
