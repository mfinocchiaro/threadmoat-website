# S03: Lazy-load chart components on tab overview pages

**Goal:** Convert static chart imports on 5 tab overview pages to next/dynamic with loading skeletons
**Demo:** After this: Tab overview pages load faster — charts below the fold are lazy-loaded with skeleton placeholders

## Tasks
- [x] **T01: Converted 18 chart imports across 5 tab overview pages from static to next/dynamic with skeleton loading placeholders** — For each of these 5 pages, convert chart component imports to next/dynamic with a loading skeleton:
- app/dashboard/tab/financial/page.tsx (4 charts)
- app/dashboard/tab/advanced/page.tsx (7 charts)
- app/dashboard/tab/market/page.tsx (3 charts)
- app/dashboard/tab/network/page.tsx (3 charts)
- app/dashboard/tab/geographic/page.tsx (1 chart)

Pattern for each:
```tsx
import dynamic from 'next/dynamic'
const BarChart = dynamic(() => import('@/components/charts/bar-chart').then(m => m.BarChart), {
  loading: () => <div className="h-[400px] w-full animate-pulse rounded-xl bg-muted/30" />,
  ssr: false,
})
```

Keep non-chart imports (Card, Badge, etc.) as static imports.
All chart components export named exports so use .then(m => m.ComponentName).
  - Estimate: 20min
  - Files: app/dashboard/tab/financial/page.tsx, app/dashboard/tab/advanced/page.tsx, app/dashboard/tab/market/page.tsx, app/dashboard/tab/network/page.tsx, app/dashboard/tab/geographic/page.tsx
  - Verify: npm run build passes. All 5 tab pages have zero static chart component imports.
