# S01: Bundle analysis tooling & baseline capture

**Goal:** Capture baseline bundle analysis of the current build and document findings
**Demo:** After this: Bundle analysis output showing chunk sizes, largest dependencies identified

## Tasks
- [x] **T01: Captured bundle baseline: 8.9MB total JS across 147 chunks, three.js duplicated at 2x1.3MB, Zod 912KB, globe 468KB** — Using the Turbopack build output (.next/static/chunks), analyze chunk sizes, identify contents of the largest chunks, and document the baseline. No external tooling needed — Turbopack doesn't support @next/bundle-analyzer, so we use direct file analysis.

Document:
1. Total JS chunk size
2. Top 10 chunks with identified contents
3. Key optimization targets with estimated savings
4. Duplicate three.js chunks (2x 1.3MB)
  - Estimate: 10min
  - Verify: Baseline documented in GSD artifact
