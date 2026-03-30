---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T02: Fix root cause and harden error handling

Apply the fix for the diagnosed root cause. Harden error handling in the sign-up flow: improve error messages, add defensive checks for DB/email/coupon failures. Ensure the registerUser action never throws an unhandled error to the client.

## Inputs

- `T01 root cause diagnosis`

## Expected Output

- `Fixed auth.ts`
- `Hardened error handling`

## Verification

npm run build passes. Sign-up form submits without error. Server action returns structured success/error responses.
