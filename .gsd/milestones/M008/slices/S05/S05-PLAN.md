# S05: Build warnings cleanup

**Goal:** Resolve the turbopack root warning so npm run build produces zero warnings
**Demo:** After this: npm run build produces zero warnings

## Tasks
- [x] **T01: Fixed turbopack root warning by setting absolute __dirname path in next.config.mjs** — The warning says: 'Next.js inferred your workspace root... We detected multiple lockfiles'. The fix is to set turbopack.root in next.config.ts (or .mjs/.js) to point to the project directory explicitly. Check next.config for existing turbopack config and add the root setting.
  - Estimate: 10min
  - Files: next.config.ts
  - Verify: npm run build produces zero warning lines
