# M020: Growth Platform — SEO, Admin, Conversion & Analysis Expansion

## Vision
Transform ThreadMoat from a closed dashboard into a growth engine: indexable public content for organic acquisition, admin tooling for operational control, conversion mechanics to monetize traffic, and new analysis views to deepen product value.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | S01 | medium | — | ✅ | Google structured data test passes for JSON-LD on all public pages. Blog index renders with at least one sample post. Company directory shows paginated teaser list. Newsletter signup captures email to Resend. |
| S02 | Admin Dashboard & Operational Tooling | low | S01 | ✅ | Admin user navigates to /dashboard/admin, sees user list with tier/trial/last-login, manages coupons via UI, triggers CRM export, and receives signup notification email. |
| S03 | Conversion Optimization & Funnel Visibility | medium | S02 | ✅ | Admin sees funnel visualization (visit → signup → onboarding → first chart → upgrade). Trial users see countdown in sidebar. Upgrade CTAs fire one-click Stripe checkout. Demo request form sends email. |
| S04 | New Analysis Views | medium | S01 | ✅ | Funding trend chart renders time-series from existing API. Acquirer fit scoring ranks startups for OEM users. Market concentration shows HHI by category. Deal flow pipeline persists user evaluation state. |
