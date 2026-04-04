---
estimated_steps: 5
estimated_files: 1
skills_used: []
---

# T01: Create trackInteraction client helper

1. Create `lib/track-interaction.ts` (client-side helper)
2. Export `trackInteraction(eventType: string, metadata?: Record<string, unknown>)` that:
   - Calls `fetch('/api/analytics/event', { method: 'POST', body: JSON.stringify({ event_type: eventType, route: window.location.pathname, metadata }), keepalive: true, headers: { 'Content-Type': 'application/json' } })`
   - Fire-and-forget with `.catch(() => {})` 
   - No 'use client' directive needed — it uses browser APIs but is just a utility function imported by client components

## Inputs

- `hooks/use-page-view-tracker.ts (fetch pattern from S01)`

## Expected Output

- `lib/track-interaction.ts`

## Verification

Build passes.
