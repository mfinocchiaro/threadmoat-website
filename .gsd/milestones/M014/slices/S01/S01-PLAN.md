# S01: Playwright-based authenticated Lighthouse pipeline

**Goal:** Create a Node.js script that logs into the dashboard via Puppeteer, captures the session cookie, then runs Lighthouse against authenticated dashboard pages using the captured cookie.
**Demo:** After this: Script logs into dashboard, captures Lighthouse scores for a configurable list of pages

## Tasks
- [x] **T01: Built authenticated Lighthouse script that logs in via Puppeteer, captures cookies, and runs Lighthouse on 10 dashboard pages — all passing.** — 1. Install puppeteer as a dev dependency
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
  - Estimate: 30min
  - Files: scripts/lighthouse-dashboard.mjs, package.json
  - Verify: Script runs, authenticates, captures Lighthouse scores for at least 1 dashboard page. JSON report saved.
