# M021: QA Sweep — Auth, Payments, Tier Enforcement & Security Hardening

## Vision
Systematic audit and fix of integration issues across authentication, Stripe payments, tier enforcement, and admin operations. Protect the 20 milestones of shipped features against edge-case failures before driving new traffic.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Auth Flow Hardening | medium | — | ⬜ | Password reset invalidates sessions. Account deletion signs out immediately. Unverified login shows resend-verification prompt instead of generic error. |
| S02 | Payment & Webhook Safety | high | S01 | ⬜ | Webhook returns 400 when userId missing. invoice.payment_succeeded updates subscription status. |
| S03 | Admin & Operational Hardening | low | S01 | ⬜ | isAdmin imported from single location. CRM export logs who triggered it. All admin emails use consistent wrapper. |
