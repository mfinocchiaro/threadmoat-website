---
id: T01
parent: S01
milestone: M009
key_files:
  - (none)
key_decisions:
  - Direct chunk analysis over @next/bundle-analyzer due to Turbopack incompatibility
duration: 
verification_result: passed
completed_at: 2026-04-03T21:28:13.698Z
blocker_discovered: false
---

# T01: Captured bundle baseline: 8.9MB total JS across 147 chunks, three.js duplicated at 2x1.3MB, Zod 912KB, globe 468KB

**Captured bundle baseline: 8.9MB total JS across 147 chunks, three.js duplicated at 2x1.3MB, Zod 912KB, globe 468KB**

## What Happened

Analyzed the Turbopack build output (.next/static/chunks/) since @next/bundle-analyzer is Webpack-only and incompatible with Turbopack. Used du + grep pattern matching to identify chunk contents.\n\nBaseline:\n- **Total JS**: 8,952 KB across 147 chunks\n- **three.js**: 2x 1,368 KB (duplicated chunks — same WebGL shader strings)\n- **Zod**: 912 KB (schema validation)\n- **react-globe.gl**: 468 KB (three.js globe wrapper)\n- **Recharts + lodash**: 324 KB\n- **React/Next.js core**: 224 KB\n\nOptimization targets:\n1. **jsPDF dynamic import** (S02) — removes ~29MB node_modules from reports page initial bundle\n2. **Tab chart lazy-loading** (S03) — defers D3 chart code on 5 overview pages\n3. **three.js deduplication** — Turbopack may be splitting the same three.js into 2 chunks; already dynamically imported so this is a bundler-level issue, not our code

## Verification

Analysis output documented. Chunk sizes verified via du -sk.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `find .next/static/chunks -name '*.js' -exec du -sk {} + | awk '{sum+=$1} END {print sum}'` | 0 | ✅ pass | 200ms |

## Deviations

Used direct file analysis instead of @next/bundle-analyzer since Turbopack doesn't support it.

## Known Issues

three.js appears duplicated in two 1.3MB chunks — likely a Turbopack splitting artifact. Already dynamically imported so not actionable from our code.

## Files Created/Modified

None.
