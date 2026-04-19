---
estimated_steps: 7
estimated_files: 4
skills_used: []
---

# T04: Remove trial expiry UI and update FreeUserGuard for permanent free tier

Remove all trial countdown and expiry UI from FreeUserGuard. Update PaywallBlock messaging from 'trial' to 'free plan'. Clean up isExpiredTrial and daysRemaining prop threading from dashboard layout and context.

Steps:
1. In components/dashboard/free-user-guard.tsx: remove TrialExpiryBanner component, ExpiredTrialBanner component, and the expired trial degraded-access logic (map-only fallback). Remove isExpiredTrial and daysRemaining props. Update PaywallBlock text: 'Your Recon Trial Has Ended' → remove, 'Your 30-day Explorer window' → remove, general language should reference 'free Recon plan' not 'trial'.
2. In app/dashboard/layout.tsx: stop passing isExpiredTrial and daysRemaining to DashboardLayoutClient.
3. In components/dashboard/layout-client.tsx: remove isExpiredTrial and daysRemaining from props and from PlanContext.
4. In contexts/plan-context.tsx: remove isExpiredTrial and daysRemaining if present.
5. Search for any remaining references to 'trial' in dashboard components and update messaging.

## Inputs

- `components/dashboard/free-user-guard.tsx`
- `app/dashboard/layout.tsx`
- `components/dashboard/layout-client.tsx`
- `contexts/plan-context.tsx`

## Expected Output

- `components/dashboard/free-user-guard.tsx`
- `app/dashboard/layout.tsx`
- `components/dashboard/layout-client.tsx`
- `contexts/plan-context.tsx`

## Verification

npm run build passes with zero errors. grep -r 'isExpiredTrial' components/ app/ contexts/ returns zero matches. grep -r 'TrialExpiryBanner\|ExpiredTrialBanner' components/ returns zero matches. grep -r 'daysRemaining' components/dashboard/ app/dashboard/layout.tsx returns zero matches.
