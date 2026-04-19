# S01: Server-Side Company Filtering & Limit Banner — UAT

**Milestone:** M019
**Written:** 2026-04-19T13:59:09.191Z

## UAT: S01 — Server-Side Company Filtering & Limit Banner

### Test Cases

1. **Explorer user sees 50 companies**
   - Login as explorer-tier user
   - Navigate to dashboard
   - Verify company list shows exactly 50 companies
   - Verify CompanyLimitBanner shows "Showing top 50 of 500+ companies"
   - Verify upgrade CTA links to pricing page

2. **Analyst user sees 100 companies**
   - Login as analyst-tier user
   - Navigate to dashboard
   - Verify company list shows exactly 100 companies
   - Verify CompanyLimitBanner shows "Showing top 100 of 500+ companies"

3. **Strategist/Admin sees all companies**
   - Login as strategist or admin user
   - Navigate to dashboard
   - Verify full company list loads (500+)
   - Verify CompanyLimitBanner does NOT render

4. **API response metadata**
   - Fetch /api/companies as explorer user
   - Response includes `totalAvailable` field
   - Companies sorted by weightedScore descending

5. **No data leakage**
   - Explorer user cannot access companies beyond their top 50 via API manipulation
