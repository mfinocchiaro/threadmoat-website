# S02: Upgrade CTAs for Expired Explorer & Analyst→Strategist

**Goal:** Enhance upgrade CTAs: mention $4,999 credit for analyst→strategist upgrades in PaywallBlock, ensure expired explorer flow is clear.
**Demo:** After this: Expired explorer sees a clear upgrade CTA. Analyst user on a Strategist-only page sees Strategist upgrade nudge.

## Tasks
- [x] **T01: Added $4,999 credit mention to analyst→strategist upgrade CTAs in PaywallBlock.** — Update the PaywallBlock strategist nudge for analyst users to mention the $4,999 upgrade credit. Verify the expired explorer flow already works correctly. Add the analyst tier to the PaywallBlock so it shows Analyst-specific charts they CAN access.
  - Estimate: 20min
  - Files: components/dashboard/free-user-guard.tsx
  - Verify: npm run build passes. Analyst paywall mentions $4,999 credit.
