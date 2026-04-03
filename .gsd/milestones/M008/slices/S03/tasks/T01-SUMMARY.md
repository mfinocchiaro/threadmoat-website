---
id: T01
parent: S03
milestone: M008
key_files:
  - lib/load-companies-server.ts
  - app/api/ai/narrative/route.ts
key_decisions:
  - Module-level cache with fs.stat mtime comparison for invalidation
  - PromiseLike .then(resolve, reject) pattern instead of .catch() for AI SDK v6 usage
duration: 
verification_result: passed
completed_at: 2026-04-03T19:04:59.910Z
blocker_discovered: false
---

# T01: Added module-level CSV parse cache with mtime invalidation and structured LLM token usage logging

**Added module-level CSV parse cache with mtime invalidation and structured LLM token usage logging**

## What Happened

Two changes:\n\n1. **CSV cache** in load-companies-server.ts: module-level `_cachedCompanies` array + `_cachedMtimeMs`/`_cachedEnrichMtimeMs` timestamps. On each call, `fs.stat()` checks both CSV files' mtimes — if unchanged, returns cached array immediately without re-reading or re-parsing. Cache naturally invalidates on deploy (new serverless instance) or when files change.\n\n2. **Token usage logging** in /api/ai/narrative: after `streamText()`, fire-and-forget `result.usage.then()` logs structured line: `[ai/narrative] user=<id> company=<id> inputTokens=<n> outputTokens=<n> totalTokens=<n> durationMs=<n>`. Uses `.then(onFulfilled, onRejected)` since AI SDK v6 returns `PromiseLike` (no `.catch()`).\n\nDiscovered two AI SDK v6 API differences vs docs: usage fields are `inputTokens`/`outputTokens` (not `promptTokens`/`completionTokens`), and `result.usage` is `PromiseLike` not `Promise`.

## Verification

npm run build passed (exit 0, 21.3s, 104 routes). TypeScript compiled cleanly.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 21300ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `lib/load-companies-server.ts`
- `app/api/ai/narrative/route.ts`
