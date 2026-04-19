# M019: Monetization & Free Tier — Permanent Recon, Company Limits, Upgrade CTAs & Plan Transitions

## Vision
Convert ThreadMoat from a trial-expiry model to a permanent free tier with clear upgrade paths. Free users see top 50 companies, paid users see all 500+. Subscription expiry handles graceful tier fallback with expiry banners and re-engagement messaging.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | S01 | high | — | ✅ | New signup gets permanent Recon access. Dashboard shows 50 companies with 'Showing 50 of 500+' indicator. Upgrade CTA visible on gated content. No trial expiry countdown. |
| S02 | Plan Transitions — Tier Fallback, Expiry Banners & Pricing Messaging | medium | S01 | ✅ | Strategist user with expired subscription sees expiry warning 14 days before, then falls back to Analyst (if prior purchase) or Recon. Pricing page shows permanent free tier messaging. |
