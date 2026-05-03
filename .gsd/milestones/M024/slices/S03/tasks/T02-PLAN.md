---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T02: Add wizard state to user preferences

Extend user profile schema to track 'wizardCompletedAt' timestamp. Add API endpoint to mark wizard as dismissed. Update preferences context to expose wizard state.

## Inputs

- None specified.

## Expected Output

- `Updated schema, API, and context files`

## Verification

User profile has wizardCompletedAt field. API call correctly updates field. Preferences context exposes wizard state.
