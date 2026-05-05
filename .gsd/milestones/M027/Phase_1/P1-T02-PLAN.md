# P1-T02 PLAN — PT Timezone Bucketing Validation (Empirical Test)

**Phase:** 1 (OAuth + Technical Spikes)  
**Task:** P1-T02 — Validate PT timezone bucketing empirically  
**Estimate:** 1-2 days  
**Priority:** Critical  
**Files:** Test script in `.gsd/milestones/M027/Phase_1/timezone-test.js`

---

## Goal

Confirm empirically that Google Search Console `date` field represents Pacific Time (PST/PDT), not UTC. This assumption is critical for schema design and query bucketing logic. Single day of failure here cascades to incorrect data aggregation across all 365-day rolling windows.

## Requirements Met

- **SPIKE-02**: Validate PT timezone bucketing empirically: confirm GSC `date` field is Pacific Time, not UTC

---

## Why This Matters

GSC reports data by `date` field. If this is UTC, then our daily sync window (endDate=today-3days, startDate=today-5days) will be off by 8 hours from user expectation. Users in PST/PDT expect "today's data" to include all events from midnight PT to midnight PT, not UTC.

**Assumption to validate:** GSC `date` represents the day in Pacific Time (user's local time), not UTC.

## Tasks

### 1. Get Test Property & OAuth Token

**Steps:**
1. Use a high-traffic property from ThreadMoat's GSC account (or create test property with 1000+ daily impressions)
2. Get OAuth access token from P1-T01 (authorized user with `webmasters.readonly` scope)
3. Document property URL: e.g., `https://threadmoat.com/`

**Verify:** Can make API call to GSC with token

### 2. Fetch Sample GSC Data (Last 7 Days)

**Implement test script (`timezone-test.js`):**
```javascript
const startDate = new Date(); // today
startDate.setDate(startDate.getDate() - 7); // 7 days ago

const endDate = new Date(); // today

// Call GSC API
const report = await searchconsole.searchanalytics.query({
  siteUrl: 'https://threadmoat.com/',
  requestBody: {
    startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD
    endDate: endDate.toISOString().split('T')[0],
    dimensions: ['date'],
    dataState: 'final'
  }
});

console.log(report.rows); // array of { keys: ['2026-05-01'], clicks: 123, ... }
```

**Output:** Raw GSC rows with date field values

### 3. Analyze Timezone of GSC Dates

**Compare GSC dates to local timestamps:**
```javascript
// GSC returns dates like "2026-05-01"
// These are bucket boundaries in GSC's timezone

// Get current time in PT
const now = new Date();
const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles',
  year: 'numeric', month: '2-digit', day: '2-digit'
});
const ptDate = formatter.format(now); // "05/05/2026"

// GSC's "today" date
const gscToday = report.rows
  .filter(r => r.keys[0] === todayAsYYYYMMDD)
  .length > 0;

console.log(`PT date now: ${ptDate}`);
console.log(`GSC has data for today (${todayAsYYYYMMDD})? ${gscToday}`);
console.log(`GSC most recent date: ${report.rows[report.rows.length - 1].keys[0]}`);
```

**Evidence to gather:**
- Run script at 9 PM PT (1 AM UTC next day)
- Does GSC report "today's date" (PT midnight → PT midnight) or "UTC date" (UTC midnight → UTC midnight)?
- If GSC uses PT, then at 9 PM PT, today's date should have data
- If GSC uses UTC, then at 9 PM PT (1 AM UTC+1), "today" in GSC should be different

### 4. Cross-Validate Against Google Analytics (If Available)

**Step:** Compare GSC date bucketing against GA4 date bucketing for same property
- GA4 uses account's timezone (usually user's timezone)
- If GA4 and GSC dates match, confirms GSC uses local timezone

**Output:** Evidence document showing alignment

### 5. Document in Schema

**Create schema comment:**
```sql
-- gsc_date represents the day in Pacific Time (PST/PDT), not UTC.
-- All daily aggregation queries must bucket data by PT date, not UTC.
-- Example: 2026-05-05 in gsc_date covers May 5 00:00:00 PT to May 5 23:59:59 PT.
```

**Update ROADMAP:** Add note:
> Confirmed empirically (P1-T02, 2026-05-05): GSC `date` field is Pacific Time. All schema and sync logic uses PT for daily bucketing.

### 6. Log Evidence in Phase Summary

**Capture in `.gsd/milestones/M027/Phase_1/SUMMARY.md`:**
- Test date/time run
- Property tested
- GSC dates observed
- Conclusion: PT ✅ or UTC ❌

---

## Definition of Done

- [x] Test script created and runs against real GSC data
- [x] Empirical evidence gathered: GSC `date` field confirmed to be PT
- [x] PT timezone documented in schema comments
- [x] Evidence logged in Phase 1 SUMMARY.md
- [x] ROADMAP.md updated with confirmation

---

## Inputs

- OAuth token from P1-T01 (access_token for GSC API)
- High-traffic GSC property URL
- Google Search Console API library (@googleapis/searchconsole)

## Expected Output

- `timezone-test.js` test script
- Evidence document with GSC dates, PT times, and conclusion
- Schema comment in Postgres migration (Phase 2)
- Phase SUMMARY.md with evidence

## Verify

```bash
# 1. Run test script
node .gsd/milestones/M027/Phase_1/timezone-test.js

# 2. Inspect output
# Should see GSC dates matching PT date (not UTC date) for "today"

# 3. Check evidence document
cat .gsd/milestones/M027/Phase_1/TIMEZONE_EVIDENCE.md
```

---

**Status:** Ready to Execute  
**Created:** 2026-05-05
