---
estimated_steps: 14
estimated_files: 2
skills_used: []
---

# T01: Create authenticated Lighthouse script with Puppeteer login

1. Install puppeteer as a dev dependency
2. Create `scripts/lighthouse-dashboard.mjs`:
   - Launch Puppeteer, navigate to login page
   - Fill email/password and submit (credentials from env: PERF_TEST_EMAIL, PERF_TEST_PASSWORD)
   - Wait for redirect to /dashboard
   - Extract all cookies from the authenticated page
   - For each target page:
     a. Launch Lighthouse programmatically with the cookies injected via `extraHeaders` or `--extra-headers` flag
     b. Or use Lighthouse's `puppeteer` integration to reuse the authenticated browser
   - Save JSON results to `.gsd/lighthouse/` with page-name and timestamp
   - Print a summary table of scores
3. Make the page list configurable at the top of the script
4. Add error handling for login failures, page load timeouts
5. Test with the dev server running

## Inputs

- `app/auth/login/page.tsx (login flow)`
- `auth.ts (session config)`

## Expected Output

- `scripts/lighthouse-dashboard.mjs`
- `.gsd/lighthouse/*.json`

## Verification

Script runs, authenticates, captures Lighthouse scores for at least 1 dashboard page. JSON report saved.
