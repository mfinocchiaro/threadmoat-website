---
estimated_steps: 16
estimated_files: 5
skills_used: []
---

# T01: Convert 5 tab overview pages to dynamic chart imports with skeletons

For each of these 5 pages, convert chart component imports to next/dynamic with a loading skeleton:
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

## Inputs

- `app/dashboard/tab/*/page.tsx`

## Expected Output

- `5 tab pages with dynamic chart imports`

## Verification

npm run build passes. All 5 tab pages have zero static chart component imports.
