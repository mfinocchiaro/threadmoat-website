# S05: Funding & Valuation Data Integration

**Goal:** Add funding metadata fields (valuationConfidence, financialConfidence, reportedValuation, reportedValuationYear) to the Company type and CSV loader.
**Demo:** After this: Verified funding amounts, reported valuations, and structured funding fields (Latest Round Amount, Funding Confidence, Source Tier) flow from the agentic pipeline into the website's CSV data and dashboard charts.

## Tasks
- [x] **T01: Added valuationConfidence, financialConfidence, reportedValuation, reportedValuationYear to Company type and CSV loader.** — Add valuationConfidence, financialConfidence, reportedValuation, reportedValuationYear to Company interface and wire from CSV columns in load-companies-server.ts.
  - Estimate: 2min
  - Files: lib/company-data.ts, lib/load-companies-server.ts
  - Verify: npm run build
