# S01: Lightweight page view tracking via API route + DB — UAT

**Milestone:** M012
**Written:** 2026-04-04T07:38:42.296Z

## UAT: S01 — Lightweight Page View Tracking

### Pre-conditions
- User is logged into the dashboard
- `analytics_events` table exists in Neon

### Test 1: Page view logged on navigation
1. Log into the dashboard
2. Navigate to `/dashboard/heatmap`
3. Navigate to `/dashboard/bubbles`
4. Query: `SELECT route, created_at FROM analytics_events ORDER BY created_at DESC LIMIT 5`
5. **Expected:** Two rows with routes `/dashboard/heatmap` and `/dashboard/bubbles`

### Test 2: No duplicate on same page
1. Stay on `/dashboard/bubbles` (don't navigate)
2. Wait 5 seconds
3. Query analytics_events
4. **Expected:** No additional row for `/dashboard/bubbles`

### Test 3: API rejects unauthenticated requests
1. `curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/analytics/event -H "Content-Type: application/json" -d '{"event_type":"page_view","route":"/dashboard/test"}'`
2. **Expected:** 401

### Test 4: No Lighthouse regression
1. Run Lighthouse on `/dashboard` after login
2. **Expected:** Performance score ≥ 80 (baseline: 81)

### Failure signals
- Missing rows in analytics_events after navigation
- 500 errors in server console on POST /api/analytics/event
- Lighthouse performance drop > 5 points
