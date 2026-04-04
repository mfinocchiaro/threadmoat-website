# S02: Chart interaction event tracking — UAT

**Milestone:** M012
**Written:** 2026-04-04T07:42:49.448Z

## UAT: S02 — Chart Interaction Event Tracking

### Pre-conditions
- User is logged into the dashboard
- `analytics_events` table exists with data flowing from S01

### Test 1: Shortlist toggle tracking
1. Navigate to any chart page (e.g. `/dashboard/bubbles`)
2. Click a company to add to shortlist
3. Click the same company to remove from shortlist
4. Query: `SELECT event_type, metadata FROM analytics_events WHERE event_type = 'shortlist_toggle' ORDER BY created_at DESC LIMIT 5`
5. **Expected:** Two rows — one with `{\"action\":\"add\", \"companyId\":\"...\"}` and one with `{\"action\":\"remove\", \"companyId\":\"...\"}`

### Test 2: Filter change tracking
1. Open the filter toolbar
2. Select an industry filter
3. Wait 1 second (debounce)
4. Query: `SELECT event_type, metadata FROM analytics_events WHERE event_type = 'filter_change' ORDER BY created_at DESC LIMIT 5`
5. **Expected:** Row with `{\"activeFilterCount\":1, \"previousCount\":0}`

### Test 3: AI narrative generation tracking
1. Open the report generator
2. Select a company
3. Click Generate AI Analysis
4. Query: `SELECT event_type, metadata FROM analytics_events WHERE event_type = 'narrative_generate' ORDER BY created_at DESC LIMIT 5`
5. **Expected:** Row with `{\"companyId\":\"...\"}`

### Test 4: Report export tracking
1. In report builder, select companies and click Generate
2. Click Export PDF
3. Query: `SELECT event_type, metadata FROM analytics_events WHERE event_type IN ('report_generate', 'report_export_pdf') ORDER BY created_at DESC LIMIT 5`
4. **Expected:** Two rows with company count metadata

### Failure signals
- Missing rows for any event type after user interaction
- 500 errors in browser console on `/api/analytics/event` calls
- Build errors or TypeScript type failures
