# Phase 1 Context — OAuth + Technical Spikes

**Milestone:** M027 — Search Indexing & Analytics  
**Phase:** 1 (OAuth + Technical Spikes)  
**Duration:** 5-7 days (OAuth submission Day 1, approval happens in parallel over 4-6 weeks)

## Goal

Establish Google Search Console OAuth2 integration, validate critical technical assumptions, and submit OAuth verification to Google. This is the critical path gate — approval required before production rollout.

## Why This Phase Matters

- **OAuth verification is async**: Submit on Day 1, approval takes 4-6 weeks. All other phases (Sync, Dashboard, Striking Distance) build in parallel.
- **Technical validation de-risks later phases**: PT timezone bucketing, 50K rows/day cap, Vercel Cron reliability must be confirmed empirically before building schema/sync logic.
- **Test mode refresh tokens expire in 7 days**: Cannot use test tokens in production. Must get approval before shipping.

## Requirements Covered (FOUND-01, SPIKE-01 through SPIKE-04, INTEG-03)

| ID | Requirement | Task | Priority |
|----|-------------|------|----------|
| FOUND-01 | Google Search Console OAuth2 flow with offline refresh tokens | P1-T01 | Critical |
| SPIKE-01 | Submit OAuth verification to Google | P1-T04 | Critical (Day 1) |
| SPIKE-02 | Validate PT timezone bucketing empirically | P1-T02 | Critical |
| SPIKE-03 | Test 50K rows/day cap on sandbox property | P1-T03 | High |
| SPIKE-04 | Confirm Vercel Cron reliability under 50K-100K row loads | P1-T03 | High |
| INTEG-03 | Vercel Cron + Google OAuth2 library setup | P1-T01 | Critical |

## Phase Dependencies

**Depends on:** None (Phase 1 is critical path start)

**Blocks:** Phase 2 (Sync Engine + Schema) — awaiting OAuth approval confirmation + PT timezone validation

## Critical Path

```
Day 1: T04 (OAuth submission) — MUST COMPLETE
       T01 (OAuth client setup) — IN PARALLEL
       T02 (PT timezone test) — IN PARALLEL  
Days 2-3: T03 (Cron reliability test)
Days 3-5: Awaiting Google approval (parallel with T01-T03 refinement)
```

**Go-no-go gate:** Day 5 or earlier — all spikes complete, OAuth submitted, team confident in timeline + technical assumptions.

---

## Phase Success Criteria

1. ✅ OAuth scope: `webmasters.readonly`, offline access, AES-256-GCM refresh token encryption
2. ✅ OAuth verification submitted to Google (screenshot evidence + metadata in .gsd/)
3. ✅ Empirical confirmation: GSC `date` field is Pacific Time (not UTC)
4. ✅ API cap behavior documented: 50K rows/day returns empty page
5. ✅ Vercel Cron execution reliability confirmed (7-day test window with <300s execution)
6. ✅ Team aware: "Expect Google approval in 4-6 weeks before v1 rollout"

---

## Known Unknowns (De-risked by This Phase)

- Does GSC API truly respect 1,200 QPM limit, or are there undocumented overages?
- How late does GSC data lag — 2 days, 3 days, 5+ days anomalies?
- Can Vercel Cron reliably execute sequential API calls for 50K+ rows in <300s?
- Is PT timezone assumption correct, or is GSC using some hybrid UTC+offset?

---

## Output Artifacts

- `.gsd/milestones/M027/Phase_1/P1-T01-PLAN.md` — Google OAuth2 setup
- `.gsd/milestones/M027/Phase_1/P1-T02-PLAN.md` — PT timezone validation
- `.gsd/milestones/M027/Phase_1/P1-T03-PLAN.md` — 50K cap + Cron reliability testing
- `.gsd/milestones/M027/Phase_1/P1-T04-PLAN.md` — OAuth verification submission
- `.gsd/milestones/M027/Phase_1/SUMMARY.md` — Phase completion report

---

**Phase Status:** Ready to Execute  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05
