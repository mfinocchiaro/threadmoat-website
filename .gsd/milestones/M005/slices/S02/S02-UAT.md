# S02: AI Narrative Engine for Report Generator — UAT

**Milestone:** M005
**Written:** 2026-04-01T22:04:51.180Z

# S02: AI Narrative Engine for Report Generator — UAT

**Milestone:** M005
**Written:** 2026-04-01

## UAT Type

- UAT mode: mixed (artifact-driven build verification + live-runtime streaming test)
- Why this mode is sufficient: Build verification confirms type safety and structural correctness. Live runtime test confirms the streaming pipeline works end-to-end with a real Anthropic API call.

## Preconditions

- App running locally (`npm run dev`) or deployed to Vercel
- `ANTHROPIC_API_KEY` set in environment
- User signed in with a valid session
- At least one company exists in the CSV data

## Smoke Test

Sign in → navigate to Report Generator → select any company → click "AI Analysis" button → streaming text appears with section headings (Impressions, Conclusions, Beware, Overlooked Opportunities).

## Test Cases

### 1. Successful AI narrative generation

1. Sign in to the dashboard
2. Navigate to the Report Generator tab (Intelligence Report)
3. Select a company from the company selector
4. Click the violet "AI Analysis" button (with Sparkles icon)
5. **Expected:** Button shows loading state. Streaming text begins appearing in a distinct card section below with "AI Analysis" header. Four markdown sections render with proper headings: Impressions, Conclusions, Beware, Overlooked Opportunities.

### 2. Stop mid-stream

1. Follow steps 1-4 from Test 1
2. While text is streaming, click the "Stop" button
3. **Expected:** Streaming stops immediately. Partial text remains displayed. Copy button appears.

### 3. Copy completed narrative

1. Complete a full AI narrative generation (let it finish streaming)
2. Click the "Copy" button
3. Paste into a text editor
4. **Expected:** Full narrative text including all four sections is in clipboard.

### 4. Template report still works

1. Select a company
2. Click "Generate Intelligence" (the original button, not AI Analysis)
3. **Expected:** Template report generates as before — no interference from AI Analysis feature.

### 5. No company selected

1. Ensure no company is selected in the company selector
2. Observe the AI Analysis button
3. **Expected:** Button is disabled and cannot be clicked.

## Edge Cases

### Rate limit exceeded

1. Generate 10 AI narratives within one hour (or temporarily lower the rate limit for testing)
2. Attempt an 11th generation
3. **Expected:** Error message displays "Rate limit exceeded, try again later" — not a generic error.

### Unauthenticated user

1. Sign out or open the report page in an incognito window without signing in
2. Attempt to call `/api/ai/narrative` directly via curl or browser
3. **Expected:** 401 response with `{ "error": "Unauthorized" }`.

### Invalid company ID

1. Call `/api/ai/narrative` with `{ "companyId": "nonexistent-id-123" }`
2. **Expected:** 404 response with `{ "error": "Company not found: nonexistent-id-123" }`.

### Missing ANTHROPIC_API_KEY

1. Temporarily unset `ANTHROPIC_API_KEY` from the environment
2. Attempt to generate an AI narrative
3. **Expected:** 500 response with `{ "error": "AI generation failed" }`. Console shows `[ai/narrative] ANTHROPIC_API_KEY is not configured`.

### Company with minimal data

1. If available, select a company with many empty/null fields in the CSV
2. Click AI Analysis
3. **Expected:** Narrative generates successfully using available data. Prompt handles N/A values gracefully. No crash or empty response.

## Failure Signals

- AI Analysis button click produces no visible response (check `streamProtocol: 'text'` match)
- Streaming text appears but has no section headings (prompt formatting issue)
- Console errors with `[ai/narrative]` prefix in server logs
- Build fails with type errors in `report-generator.tsx` or `route.ts`
- Rate limit not enforced (check Upstash Redis connection)

## Not Proven By This UAT

- Cost optimization at scale (Anthropic token costs under heavy concurrent usage)
- CSV caching performance under load
- Integration with the Custom Report Builder (S04) for composite PDF generation
- Quality/accuracy of the AI-generated investment analysis content

## Notes for Tester

- The AI Analysis button is violet/purple to visually distinguish it from the existing blue "Generate Intelligence" button.
- Streaming may take 5-15 seconds for a full narrative depending on Anthropic API latency.
- The narrative quality depends on the richness of the company's CSV data — companies with more filled fields produce better analysis.
- Rate limit is 10/hour/user — reset by waiting or clearing the Redis key.
