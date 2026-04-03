---
id: S03
parent: M008
milestone: M008
provides:
  - Cached CSV parsing for all routes using loadCompaniesFromCSV()
  - LLM cost tracking via Vercel function logs
requires:
  []
affects:
  - S04
key_files:
  - lib/load-companies-server.ts
  - app/api/ai/narrative/route.ts
key_decisions:
  - Module-level cache with mtime invalidation
  - AI SDK v6 uses inputTokens/outputTokens not promptTokens/completionTokens
  - PromiseLike requires .then(resolve, reject) not .catch()
patterns_established:
  - Module-level fs.stat mtime cache for serverless CSV parsing
  - PromiseLike fire-and-forget logging for AI SDK streaming results
observability_surfaces:
  - [ai/narrative] structured log line with token counts and duration
drill_down_paths:
  - .gsd/milestones/M008/slices/S03/tasks/T01-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-03T19:05:19.394Z
blocker_discovered: false
---

# S03: AI narrative caching & LLM cost tracking

**CSV parse cache with mtime invalidation eliminates redundant 1400-row parses; structured token usage logging enables LLM cost tracking**

## What Happened

Added module-level CSV parse cache to loadCompaniesFromCSV() using fs.stat mtime comparison for both the main CSV and heatmap enrichment sidecar. Repeated requests within the same serverless instance skip file I/O and parsing entirely. Cache invalidates naturally on deploy or data sync. Added fire-and-forget token usage logging to /api/ai/narrative that logs inputTokens, outputTokens, totalTokens, and durationMs per request in a structured format queryable in Vercel function logs.

## Verification

npm run build passed (exit 0, 21.3s, 104 routes). TypeScript clean.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `lib/load-companies-server.ts` — Added module-level CSV parse cache with mtime invalidation
- `app/api/ai/narrative/route.ts` — Added structured token usage logging after stream completion
