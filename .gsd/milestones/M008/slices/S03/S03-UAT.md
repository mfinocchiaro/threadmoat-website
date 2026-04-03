# S03: AI narrative caching & LLM cost tracking — UAT

**Milestone:** M008
**Written:** 2026-04-03T19:05:19.394Z

## UAT: AI narrative caching & LLM cost tracking\n\n### Test 1: Build passes\n- [ ] `npm run build` exits 0\n\n### Test 2: CSV cache works\n- [ ] First AI narrative request parses CSV normally\n- [ ] Second request within same instance returns cached data (no file re-read)\n\n### Test 3: Token usage logged\n- [ ] After AI narrative generation, Vercel function logs show `[ai/narrative] user=... inputTokens=... outputTokens=... totalTokens=... durationMs=...`
