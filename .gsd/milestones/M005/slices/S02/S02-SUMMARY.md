---
id: S02
parent: M005
milestone: M005
provides:
  - Streaming AI narrative endpoint at /api/ai/narrative accepting { companyId } and returning 4-section markdown analysis
  - useCompletion integration pattern in IntelligenceReportTab for AI Analysis button with stop/copy/error controls
requires:
  []
affects:
  - S04
key_files:
  - app/api/ai/narrative/route.ts
  - components/charts/report-generator.tsx
  - package.json
  - .gsd/KNOWLEDGE.md
key_decisions:
  - Used toTextStreamResponse() with streamProtocol:'text' — ai SDK v6 API pairing
  - Rate limit: 10 narrative generations per hour per user via Upstash Redis
  - Model: claude-sonnet-4-5 via @ai-sdk/anthropic v3 — balances quality and cost for investment analysis
  - Prompt structure: senior investment analyst persona producing exactly 4 sections (Impressions, Conclusions, Beware, Overlooked Opportunities)
patterns_established:
  - AI endpoint pattern: auth → rate-limit → validate → load data → build prompt → streamText → toTextStreamResponse
  - Client streaming pattern: useCompletion with streamProtocol:'text', isLoading for state, stop() for abort, onError for error parsing
observability_surfaces:
  - Console errors prefixed with [ai/narrative] including userId, companyId, and error type
  - HTTP status codes 400/401/404/429/500 with structured JSON error bodies
  - Rate limit response includes retryAfterMs for client retry logic
drill_down_paths:
  - .gsd/milestones/M005/slices/S02/tasks/T01-SUMMARY.md
  - .gsd/milestones/M005/slices/S02/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T22:04:51.180Z
blocker_discovered: false
---

# S02: AI Narrative Engine for Report Generator

**Streaming AI narrative endpoint and UI — select a company, click AI Analysis, get streaming Impressions/Conclusions/Beware/Overlooked Opportunities from Claude via Vercel AI SDK**

## What Happened

T01 installed `ai@6.0.142` and `@ai-sdk/anthropic@3.0.64`, then built the POST endpoint at `app/api/ai/narrative/route.ts`. The route authenticates via NextAuth, rate-limits to 10 req/hour/user via Upstash, validates the `companyId` input, loads all companies from CSV, builds a structured prompt with all 7 score dimensions (with justifications), financials, tags, and competitive positioning, then streams via `streamText()` with `anthropic('claude-sonnet-4-5')`. The system prompt establishes a senior investment analyst persona producing four markdown sections. Full error handling covers 400/401/404/429/500 with structured JSON bodies. `maxDuration=60` handles Vercel serverless timeout.

T02 installed `@ai-sdk/react` and integrated `useCompletion` into the existing `IntelligenceReportTab` component. Added a violet-styled "AI Analysis" button next to the existing "Generate Intelligence" button, disabled when no company is selected or streaming is active. The streaming display renders markdown sections split on `##` headings with an `AINarrativeSection` component. Controls include a Stop button during streaming, a Copy button after completion, and error display for rate-limit/auth/generation failures. The existing template report functionality is fully preserved.

Key SDK adaptation: ai SDK v6 uses `maxOutputTokens` (not `maxTokens`), `toTextStreamResponse()` (not `toDataStreamResponse`), and `@ai-sdk/react@3.0` exposes `isLoading: boolean` on `useCompletion` (not the `status` enum found in `useChat`). Client requires `streamProtocol: 'text'` to match the server's text stream format.

## Verification

All slice-level verification checks pass:
- `npm run build` — 0 type errors, all pages compiled successfully (15.6s)
- `test -f app/api/ai/narrative/route.ts` — file exists
- `grep -q 'streamText' app/api/ai/narrative/route.ts` — present
- `grep -q 'auth()' app/api/ai/narrative/route.ts` — present
- `grep -q 'rateLimit' app/api/ai/narrative/route.ts` — present
- `grep -q 'maxDuration' app/api/ai/narrative/route.ts` — present
- `grep -q 'useCompletion' components/charts/report-generator.tsx` — present
- `grep -q 'ai/narrative' components/charts/report-generator.tsx` — present
- `grep -q 'AI Analysis' components/charts/report-generator.tsx` — present
- `grep -q 'stop()' components/charts/report-generator.tsx` — present

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

SDK v6 API differs from plan assumptions: `maxOutputTokens` instead of `maxTokens`, `toTextStreamResponse()` instead of `toUIMessageStreamResponse()`, `isLoading` instead of `status` on `useCompletion`. Installed `@ai-sdk/react` with `--legacy-peer-deps` due to React 19.2.0 vs 19.2.1 peer dep mismatch. All deviations caught by TypeScript or runtime testing — no functional impact.

## Known Limitations

CSV is re-parsed on every narrative request (~3.5MB). Acceptable at current scale but would benefit from caching at 10x load. No end-to-end test with a real Anthropic API call — verified by build + structural checks only. ANTHROPIC_API_KEY must be set in production environment.

## Follow-ups

S04 (Custom Report Builder) will need to compose the AI narrative with chart selections and template reports into a single exportable document. Consider caching CSV parse result if narrative endpoint gets high usage.

## Files Created/Modified

- `app/api/ai/narrative/route.ts` — New streaming AI narrative POST endpoint — auth, rate-limit, CSV company lookup, structured prompt, streamText with Claude
- `components/charts/report-generator.tsx` — Added useCompletion hook, AI Analysis button, streaming display with AINarrativeSection, stop/copy/error controls
- `package.json` — Added ai@6.0.142, @ai-sdk/anthropic@3.0.64, @ai-sdk/react dependencies
- `package-lock.json` — Lock file updated for new AI SDK dependencies
- `.gsd/KNOWLEDGE.md` — Added K002 (useCompletion API) and K003 (AI SDK v6 renames)
- `.gsd/PROJECT.md` — Updated validated requirements, active requirements, and tech stack to reflect AI narrative engine
