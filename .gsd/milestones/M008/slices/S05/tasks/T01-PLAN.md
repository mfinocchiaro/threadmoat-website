---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Fix turbopack root warning in next.config

The warning says: 'Next.js inferred your workspace root... We detected multiple lockfiles'. The fix is to set turbopack.root in next.config.ts (or .mjs/.js) to point to the project directory explicitly. Check next.config for existing turbopack config and add the root setting.

## Inputs

- `next.config.ts`

## Expected Output

- `next.config.ts with turbopack.root configured`

## Verification

npm run build produces zero warning lines
