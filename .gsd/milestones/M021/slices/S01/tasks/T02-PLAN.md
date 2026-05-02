---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T02: Invalidate sessions on password reset

After successful password reset, update a session version counter or token generation timestamp so existing JWTs are rejected on next validation

## Inputs

- `auth.ts JWT callback`
- `resetPassword action`

## Expected Output

- `Session invalidation mechanism after password reset`
- `Existing JWTs rejected after reset`

## Verification

Reset password → existing session returns 401 on next API call
