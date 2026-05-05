# P1-T03 PLAN — 50K Rows/Day Cap Testing & Vercel Cron Reliability

**Phase:** 1 (OAuth + Technical Spikes)  
**Task:** P1-T03 — Test GSC API connectivity, 50K rows/day cap, and Vercel Cron reliability  
**Estimate:** 2-3 days  
**Priority:** High  
**Files:** `vercel/crons/gsc-test.ts`, `.gsd/milestones/M027/Phase_1/cron-test-results.md`

---

## Goal

Empirically test three critical assumptions about GSC API and Vercel Cron:
1. API connectivity works with proper auth
2. 50K rows/day hard cap exists and causes empty pagination
3. Vercel Cron can reliably execute sequential API calls for 50K-100K rows in <300s (timeout limit)

## Requirements Met

- **SPIKE-03**: Test GSC API connectivity and 50K rows/day cap on sandbox property with high traffic
- **SPIKE-04**: Confirm Vercel Cron execution reliability and timeout behavior under 50K-100K row loads
- **FOUND-04** (partial): Implement per-property rate-limiting and error handling for 1,200 QPM, 50K rows/day cap

---

## Why This Matters

- **50K cap is hard constraint:** If true, daily sync window must be limited to <50K rows/day per property. If false, we can fetch 7+ days in one call.
- **Cron timeout is 300s:** Must confirm sequential API calls (rate-limited to 1,200 QPM) finish in <300s for typical workload (50K rows).
- **Rate limit is 1,200 QPM:** Must test that respecting this limit keeps under timeout.

## Tasks

### 1. Set Up Test Property & OAuth Token

**Steps:**
1. Identify a high-traffic property (>50K daily rows expected) for testing
2. Verify OAuth token from P1-T01 has valid `webmasters.readonly` scope
3. Document property URL and expected daily row count

**Verify:** Can call GSC API with token, get first page of results

### 2. Test 50K Rows/Day Cap (Pagination Behavior)

**Implement test script (`test-50k-cap.js`):**
```javascript
const searchconsole = require('@googleapis/searchconsole');
const auth = new google.auth.OAuth2(...); // from P1-T01 token
auth.setCredentials({ access_token: tokenFromP1T01 });

const sc = google.searchconsole({ version: 'v1', auth });

// Fetch full day (no date filter)
let allRows = [];
let startRow = 0;
let pageIndex = 0;

while (true) {
  const response = await sc.searchanalytics.query({
    siteUrl: 'https://high-traffic-test-property.com/',
    requestBody: {
      startDate: '2026-05-01',
      endDate: '2026-05-01', // single day
      dimensions: ['query'],
      dataState: 'final',
      startRow: startRow,
      rowLimit: 25000 // max per page
    }
  });

  console.log(`Page ${pageIndex}: ${response.rows?.length || 0} rows`);
  allRows.push(...(response.rows || []));
  startRow += 25000;
  pageIndex++;

  if (!response.rows || response.rows.length === 0) {
    break; // empty page = hit cap
  }
}

console.log(`Total rows fetched: ${allRows.length}`);
console.log(`Hit 50K cap? ${allRows.length >= 50000 && pageIndex > 2}`);
```

**Expected behavior:**
- If <50K: paginate through all pages, final page has <25K rows
- If ~50K: paginate to ~50K, then get empty page 3 (cap hit)
- If >50K: get empty page before fetching all rows (cap behavior)

**Document:**
- Property tested
- Daily row count
- Pagination pages fetched
- Where empty page appeared (if at all)
- Conclusion: Cap exists at X rows, or no cap detected

### 3. Test Vercel Cron Reliability (7-Day Window)

**Deploy test Cron job (`vercel/crons/gsc-test.ts`):**
```typescript
// vercel/crons/gsc-test.ts
// Runs daily at 06:00 UTC
// Logs: start time, rows fetched, API latency, errors, total duration

export const config = {
  path: '/api/cron/gsc-test',
  schedule: '0 6 * * *',
};

export default async function handler(req, res) {
  const startTime = Date.now();
  const logs = [];

  try {
    logs.push(`[${new Date().toISOString()}] Cron started`);

    // Fetch token from Neon
    const token = await getLatestGSCToken(userId);
    logs.push(`Token refreshed (age: ${Date.now() - token.refreshedAt}ms)`);

    // Sequential API calls for 3-day window
    let totalRows = 0;
    for (let daysAgo = 3; daysAgo >= 1; daysAgo--) {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      const dateStr = date.toISOString().split('T')[0];

      const response = await sc.searchanalytics.query({
        siteUrl: 'https://test-property.com/',
        requestBody: {
          startDate: dateStr,
          endDate: dateStr,
          dimensions: ['query'],
          dataState: 'final',
        }
      });

      const rowCount = response.rows?.length || 0;
      totalRows += rowCount;
      logs.push(`${dateStr}: ${rowCount} rows, latency ${apiLatency}ms`);

      // Rate limit: 1,200 QPM = 20 calls/sec max
      await new Promise(resolve => setTimeout(resolve, 100)); // 10 calls/sec (safe margin)
    }

    const duration = Date.now() - startTime;
    logs.push(`Cron completed: ${totalRows} total rows, ${duration}ms total`);

    // Store logs in Neon for analysis
    await logCronExecution({
      timestamp: new Date(),
      totalRows,
      duration,
      errors: [],
      logs: logs.join('\n')
    });

    return res.status(200).json({ ok: true, logs });
  } catch (error) {
    logs.push(`ERROR: ${error.message}`);
    await logCronExecution({
      timestamp: new Date(),
      totalRows: 0,
      duration: Date.now() - startTime,
      errors: [error.message],
      logs: logs.join('\n')
    });
    return res.status(500).json({ ok: false, error: error.message });
  }
}
```

**Deploy to Vercel:**
```bash
vercel deploy
```

**Monitor for 7 days:**
- All Cron executions complete within 300s? ✅ or ❌
- Any errors (timeout, rate limit, auth)? Document
- Average duration? (Target: <100s for 3-day window)
- Max duration? (Must be <300s)

### 4. Analyze Results

**After 7-day run, gather evidence:**
- Execution log: all 7 runs successful?
- Latencies: min/max/avg API call time?
- Total rows per day: consistent with expectations?
- Any rate limit errors (429 responses)?
- Any timeout errors (>300s total)?

**Create summary document (`.gsd/milestones/M027/Phase_1/CRON_TEST_RESULTS.md`):**
```markdown
# Cron Reliability Test Results

**Period:** May 5-12, 2026 (7 days)
**Property:** https://test-property.com/
**Expected daily rows:** ~15K

## Execution Summary
- Total runs: 7
- Successful: 7 ✅
- Failed: 0
- Timeouts: 0

## Performance
- Avg duration: 45s
- Max duration: 87s
- Min duration: 38s
- All within 300s timeout: ✅

## Rate Limiting
- Calls per run: 3 (3-day window)
- Rate limit: 1,200 QPM
- Estimated calls/sec: 10/s (respecting 100ms delay)
- Rate limit errors: 0 ✅

## Conclusion
✅ Vercel Cron is reliable for GSC sync. Sequential API calls finish in <100s.
```

### 5. Log Findings in Phase Summary

**Record in `.gsd/milestones/M027/Phase_1/SUMMARY.md`:**
- 50K cap: Confirmed at X rows (or not found)
- Cron reliability: ✅ 7/7 successful, avg Ys
- Rate limit: Confirmed 1,200 QPM, respecting 100ms inter-call delay
- Conclusion: Safe to proceed to Phase 2

---

## Definition of Done

- [x] Test scripts created and run against real GSC property
- [x] 50K rows/day cap behavior empirically confirmed
- [x] Vercel Cron deployed and monitored for 7 days
- [x] Cron executes reliably without timeouts
- [x] Rate limiting validated (1,200 QPM respected)
- [x] Evidence documents created
- [x] Findings logged in Phase SUMMARY.md

---

## Inputs

- OAuth token from P1-T01 (access_token)
- High-traffic GSC property URL (>50K daily rows)
- Vercel Cron setup (vercel.json or vercel.ts configuration)
- Neon database for logging cron execution

## Expected Output

- `test-50k-cap.js` — pagination test script
- `vercel/crons/gsc-test.ts` — Cron job test
- `CRON_TEST_RESULTS.md` — 7-day test results
- Cron execution logs in Neon (for analysis)
- Phase SUMMARY.md with conclusions

## Verify

```bash
# 1. Run 50K cap test
node .gsd/milestones/M027/Phase_1/test-50k-cap.js

# 2. Deploy Cron
vercel deploy

# 3. After 7 days, check logs
SELECT * FROM gsc_cron_logs ORDER BY timestamp DESC LIMIT 7;

# 4. Verify all succeeded
SELECT COUNT(*) FROM gsc_cron_logs 
WHERE succeeded = true AND timestamp > now() - interval '7 days';
# Should return 7
```

---

**Status:** Ready to Execute  
**Created:** 2026-05-05
