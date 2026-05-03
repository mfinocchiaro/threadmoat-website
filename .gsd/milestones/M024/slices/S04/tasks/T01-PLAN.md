---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Create PinnedStartupsContext

New context managing pinned startups list. Exports: pinnedStartups[], addPin(startupId), removePin(startupId), clearAllPins(). Handle max 10 pins. Integrate with user preferences/DB for persistence.

## Inputs

- None specified.

## Expected Output

- `contexts/pinned-startups-context.tsx`

## Verification

Context correctly adds/removes pins. Max 10 limit enforced. Pins persist across page reloads. API calls work for DB persistence.
