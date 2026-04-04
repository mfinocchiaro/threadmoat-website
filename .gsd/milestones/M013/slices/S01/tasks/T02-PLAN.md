---
estimated_steps: 11
estimated_files: 2
skills_used: []
---

# T02: Create page route, sidebar entry, and verify

1. Create `app/dashboard/co-investment/page.tsx`:
   - Use VizPageShell wrapper
   - Use useThesisGatedData() for company data
   - Render CoInvestmentHeatmap component
   - Add title and description
2. Add sidebar entry in `components/dashboard/sidebar.tsx`:
   - Add to ADMIN_ITEMS or appropriate section
   - Icon: Grid3X3 or similar from lucide-react
   - Label: 'Co-Investment'
3. Add route to ADMIN_VIZ_HREFS
4. Build and verify in browser

## Inputs

- `app/dashboard/investor-stats/page.tsx (page pattern)`
- `components/dashboard/sidebar.tsx`

## Expected Output

- `app/dashboard/co-investment/page.tsx`
- `components/dashboard/sidebar.tsx (modified)`

## Verification

npx next build passes. Navigate to /dashboard/co-investment in browser and verify heatmap renders with real data.
