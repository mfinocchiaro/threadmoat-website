---
estimated_steps: 11
estimated_files: 2
skills_used: []
---

# T01: Create analytics_events table migration and DB helper

1. Create `scripts/011_analytics_events.sql` with CREATE TABLE:
   - id: uuid DEFAULT gen_random_uuid() PRIMARY KEY
   - user_id: uuid NOT NULL REFERENCES users(id)
   - event_type: varchar(50) NOT NULL (e.g. 'page_view', 'interaction')
   - route: varchar(255) NOT NULL
   - metadata: jsonb DEFAULT '{}'
   - created_at: timestamptz DEFAULT now()
   - INDEX on (user_id, created_at)
   - INDEX on (event_type, created_at)
2. Create `lib/analytics.ts` with a `trackEvent(userId, eventType, route, metadata?)` server function that inserts into the table using `sql` from `@/lib/db`.
3. Verify the SQL is valid syntax.

## Inputs

- `scripts/000_initial_schema.sql (naming convention)`
- `lib/db.ts (sql import pattern)`

## Expected Output

- `scripts/011_analytics_events.sql`
- `lib/analytics.ts`

## Verification

Check SQL syntax is valid. TypeScript compiles (`npx tsc --noEmit lib/analytics.ts` or build).
