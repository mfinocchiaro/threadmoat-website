# S03: AI narrative caching & LLM cost tracking

**Goal:** Cache parsed CSV company data in the /api/ai/narrative route to avoid re-parsing on every request. Add token usage logging from the AI SDK response.
**Demo:** After this: Second narrative request for same data is faster (cached CSV parse). Console/log shows token usage per request.

## Tasks
- [x] **T01: Added module-level CSV parse cache with mtime invalidation and structured LLM token usage logging** — 1. In lib/load-companies-server.ts, add a module-level cache: store the parsed Company[] array and the file mtime. On subsequent calls, check fs.stat mtime — if unchanged, return cached array. This avoids re-reading + re-parsing the 1401-row CSV on every AI request within the same serverless instance.

2. In app/api/ai/narrative/route.ts, after streamText completes, log token usage from the AI SDK response. The streamText result has a .usage promise that resolves to { promptTokens, completionTokens }. Log it as structured JSON for Vercel function log querying.

Format: [ai/narrative] user=<id> company=<id> promptTokens=<n> completionTokens=<n> totalTokens=<n> durationMs=<n>
  - Estimate: 20min
  - Files: lib/load-companies-server.ts, app/api/ai/narrative/route.ts
  - Verify: npm run build passes. Code review confirms cache logic and token logging.
