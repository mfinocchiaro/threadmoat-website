---
estimated_steps: 21
estimated_files: 3
skills_used: []
---

# T03: Wire up IP Dependency page route, sidebar entry, and widget registry

Create the page component and register the new view in the admin navigation. This completes the slice by making the chart accessible.

## Steps

1. Create `app/dashboard/ip-dependency/page.tsx` following the exact pattern of `app/dashboard/market-momentum/page.tsx`:
   - Import `VizPageShell`, `useThesisGatedData`, `IPDependencyChart`, `Skeleton`
   - Inner component uses `useThesisGatedData()` to get `filtered`, `isLoading`, `shortlistedIds`
   - Render heading 'IP Dependency Analysis' with description about IP ownership and technology dependencies
   - Loading state: `<Skeleton className="h-[600px] rounded-xl" />`
   - Data state: `<IPDependencyChart data={filtered} shortlistedIds={shortlistedIds} className="min-h-[500px]" />`
   - Wrap in `VizPageShell`

2. Open `components/dashboard/sidebar.tsx`:
   - Add entry to `ADMIN_ITEMS` array: `{ href: '/dashboard/ip-dependency', icon: Shield, label: 'IP Dependency' }` — Shield icon is already imported (used by tech-independence). If not, import it from lucide-react.
   - Add `'/dashboard/ip-dependency'` to the `ADMIN_VIZ_HREFS` Set

3. Open `lib/widget-registry.ts`:
   - Add to `ADMIN_WIDGETS` array: `{ id: 'ip-dependency', label: 'IP Dependency Analysis', scenarios: [], adminOnly: true }`

4. Verify with `npm run build` that the page compiles and all imports resolve.

## Must-Haves

- [ ] Page component at `app/dashboard/ip-dependency/page.tsx` renders IPDependencyChart
- [ ] Sidebar entry visible in admin items
- [ ] `ADMIN_VIZ_HREFS` includes the new route
- [ ] Widget registry includes ip-dependency
- [ ] `npm run build` passes

## Inputs

- ``components/charts/ip-dependency-chart.tsx` — chart component to import`
- ``components/dashboard/sidebar.tsx` — sidebar with ADMIN_ITEMS and ADMIN_VIZ_HREFS to extend`
- ``lib/widget-registry.ts` — widget registry with ADMIN_WIDGETS to extend`
- ``app/dashboard/market-momentum/page.tsx` — reference page pattern to follow`

## Expected Output

- ``app/dashboard/ip-dependency/page.tsx` — page component wiring chart to route`
- ``components/dashboard/sidebar.tsx` — updated with ip-dependency entry in ADMIN_ITEMS and ADMIN_VIZ_HREFS`
- ``lib/widget-registry.ts` — updated with ip-dependency in ADMIN_WIDGETS`

## Verification

npm run build && grep -q 'ip-dependency' components/dashboard/sidebar.tsx && grep -q 'ip-dependency' lib/widget-registry.ts
