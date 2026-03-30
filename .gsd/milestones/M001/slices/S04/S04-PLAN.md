# S04: CSV Data Refresh — swap corrected dataset

**Goal:** Swap dashboard valuation source to Best Available Valuation from the agentic pipeline.
**Demo:** After this: Dashboard charts render with fact-checked CSV data from the corrected dataset.

## Tasks
- [x] **T01: Swapped valuation source from Estimated Market Value to Best Available Valuation across both CSV loaders.** — Change estimatedMarketValue source from 'Estimated Market Value' to 'Best Available Valuation' in both load-companies-server.ts and funding API route.
  - Estimate: 2min
  - Files: lib/load-companies-server.ts, app/api/funding/route.ts
  - Verify: npm run build
