---
estimated_steps: 8
estimated_files: 1
skills_used: []
---

# T02: Create POST /api/analytics/event route

1. Create `app/api/analytics/event/route.ts`
2. POST handler:
   - Call `auth()` — return 401 if no session
   - Parse body with zod: { event_type: string(max 50), route: string(max 255), metadata?: object }
   - Call `trackEvent(userId, event_type, route, metadata)`
   - Return 204 No Content (no body — minimal response)
3. Keep it fast: no unnecessary queries, no joins, just INSERT.
4. Add basic rate limiting awareness (but don't block — analytics is best-effort).

## Inputs

- `app/api/profile/route.ts (auth + zod pattern)`
- `lib/analytics.ts`

## Expected Output

- `app/api/analytics/event/route.ts`

## Verification

Build passes. Manual curl test pattern documented in plan.
