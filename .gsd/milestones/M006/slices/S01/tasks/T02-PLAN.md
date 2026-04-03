---
estimated_steps: 30
estimated_files: 2
skills_used: []
---

# T02: Wire dashboard page, sidebar entry, and verify full integration

## Description

Create the dashboard page at `/dashboard/market-momentum`, add the sidebar navigation entry, and verify the complete feature works end-to-end via build.

## Steps

1. Create `app/dashboard/market-momentum/page.tsx` following the exact pattern from `app/dashboard/growth-momentum/page.tsx`:
   - `"use client"` directive
   - Import `VizPageShell` from `@/components/dashboard/viz-page-shell`
   - Import `useThesisGatedData` from `@/hooks/use-thesis-gated-data`
   - Import `MarketMomentumHeatmap` from `@/components/charts/market-momentum-heatmap`
   - Import `Skeleton` from `@/components/ui/skeleton`
   - Inner component `MarketMomentumInner` that calls `useThesisGatedData()` to get `{ filtered, isLoading, shortlistedIds }`
   - Title: "Market Momentum" with description about composite momentum intensity
   - Loading skeleton `h-[600px]`
   - Pass `data={filtered}`, `shortlistedIds={shortlistedIds}`, `className="min-h-[500px]"`
   - Default export wraps inner in `<VizPageShell>`

2. In `components/dashboard/sidebar.tsx`:
   - Add entry to `ADMIN_ITEMS` array (after the growth-momentum entry, around line 149): `{ href: "/dashboard/market-momentum", icon: TrendingUp, label: "Market Momentum" }`
   - Note: `TrendingUp` is already imported. Using same icon as other trending items is fine.
   - Add `"/dashboard/market-momentum"` to `ADMIN_VIZ_HREFS` set (around line 169)

3. Run `npx next build` and verify zero errors.

## Must-Haves

- [ ] Page file at `app/dashboard/market-momentum/page.tsx` with VizPageShell wrapper
- [ ] Uses `useThesisGatedData` for filtered data and shortlist IDs
- [ ] Sidebar entry in ADMIN_ITEMS with TrendingUp icon
- [ ] Sidebar entry in ADMIN_VIZ_HREFS
- [ ] `npx next build` passes

## Verification

- `test -f app/dashboard/market-momentum/page.tsx` — page exists
- `grep -q 'market-momentum' components/dashboard/sidebar.tsx` — sidebar wired
- `grep -q 'MarketMomentumHeatmap' app/dashboard/market-momentum/page.tsx` — chart imported
- `npx next build 2>&1 | tail -5` — clean build with zero errors

## Inputs

- ``components/charts/market-momentum-heatmap.tsx` — chart component from T01`
- ``components/dashboard/sidebar.tsx` — existing sidebar to extend`
- ``app/dashboard/growth-momentum/page.tsx` — structural reference for page pattern`

## Expected Output

- ``app/dashboard/market-momentum/page.tsx` — new dashboard page wiring chart into VizPageShell`
- ``components/dashboard/sidebar.tsx` — updated with market-momentum nav entry in ADMIN_ITEMS and ADMIN_VIZ_HREFS`

## Verification

test -f app/dashboard/market-momentum/page.tsx && grep -q 'market-momentum' components/dashboard/sidebar.tsx && npx next build 2>&1 | tail -5
