---
estimated_steps: 3
estimated_files: 2
skills_used: []
---

# T01: Add module-level CSV cache and token usage logging to /api/ai/narrative

1. In lib/load-companies-server.ts, add a module-level cache: store the parsed Company[] array and the file mtime. On subsequent calls, check fs.stat mtime — if unchanged, return cached array. This avoids re-reading + re-parsing the 1401-row CSV on every AI request within the same serverless instance.

2. In app/api/ai/narrative/route.ts, after streamText completes, log token usage from the AI SDK response. The streamText result has a .usage promise that resolves to { promptTokens, completionTokens }. Log it as structured JSON for Vercel function log querying.

Format: [ai/narrative] user=<id> company=<id> promptTokens=<n> completionTokens=<n> totalTokens=<n> durationMs=<n>

## Inputs

- `lib/load-companies-server.ts (current loadCompaniesFromCSV)`
- `app/api/ai/narrative/route.ts (current route handler)`

## Expected Output

- `lib/load-companies-server.ts with module-level cache`
- `app/api/ai/narrative/route.ts with token usage logging`

## Verification

npm run build passes. Code review confirms cache logic and token logging.
