---
id: T02
parent: S01
milestone: M018
key_files:
  - app/dashboard/company/[id]/page.tsx
key_decisions:
  - Company matching by both id and name (case-insensitive) for flexible URL patterns
  - Profile-aware narrative uses PROFILE_NARRATIVE_MAP with 5 profiles (vc_investor, oem_enterprise, startup_founder, isv_platform, default) that reorder justification sections
  - Used shadcn Tabs component for consistent UI with rest of dashboard
duration: 
verification_result: passed
completed_at: 2026-04-11T21:26:10.929Z
blocker_discovered: false
---

# T02: Built company profile page with hero card, 4 tabbed sections, profile-aware AI narrative ordering, and not-found fallback.

**Built company profile page with hero card, 4 tabbed sections, profile-aware AI narrative ordering, and not-found fallback.**

## What Happened

Created app/dashboard/company/[id]/page.tsx as a client component. Matches companies by both id and name (case-insensitive) from the CompanyData context. Hero card shows name, size badge, subcategory, country, category tags, and formatted valuation. Four tabs using shadcn Tabs: Overview (weighted score, lifecycle, funding round, strengths, weaknesses), Financials (valuation metrics and notes), Investors (badge list with empty-state), and AI Narrative (justification sections prioritized by PROFILE_NARRATIVE_MAP based on dashboard-profile-type from localStorage). Loading state shows skeleton placeholders. Not-found state shows centered message.

## Verification

Build passes. /dashboard/company/physna loads with all 4 tabs populated. /dashboard/company/nonexistent shows not-found state. AI narrative tab reorders justifications based on profile type.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | pass | 45000ms |
| 2 | `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/dashboard/company/physna` | 0 | pass — 200 for valid company | 800ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `app/dashboard/company/[id]/page.tsx`
