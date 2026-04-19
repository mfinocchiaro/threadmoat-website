---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T02: Admin funnel visualization page

Add funnel chart to /dashboard/admin showing conversion stages: visit → signup → onboarding completed → first chart view → upgrade. Query analytics_events and subscriptions tables to compute stage counts. Render as a simple horizontal funnel with conversion rates between stages.

## Inputs

- `app/dashboard/admin/page.tsx (existing)`
- `analytics_events table schema`

## Expected Output

- `app/dashboard/admin/funnel-chart.tsx`
- `app/api/admin/funnel/route.ts`
- `app/dashboard/admin/page.tsx (modified)`

## Verification

Admin dashboard shows funnel visualization with real data from analytics_events.
