---
estimated_steps: 6
estimated_files: 1
skills_used: []
---

# T01: Capture and document bundle baseline analysis

Using the Turbopack build output (.next/static/chunks), analyze chunk sizes, identify contents of the largest chunks, and document the baseline. No external tooling needed — Turbopack doesn't support @next/bundle-analyzer, so we use direct file analysis.

Document:
1. Total JS chunk size
2. Top 10 chunks with identified contents
3. Key optimization targets with estimated savings
4. Duplicate three.js chunks (2x 1.3MB)

## Inputs

- `.next/static/chunks/`

## Expected Output

- `M009 S01 research artifact with bundle baseline`

## Verification

Baseline documented in GSD artifact
