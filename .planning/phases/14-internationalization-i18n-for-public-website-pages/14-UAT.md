---
status: complete
phase: 14-internationalization-i18n-for-public-website-pages
source: [14-02-SUMMARY.md, 14-03-SUMMARY.md]
started: 2026-03-22T10:00:00Z
updated: 2026-03-22T10:15:00Z
---

## Current Test

[testing complete]

## Tests

### 1. English Home Page at Root URL
expected: Visit http://localhost:3000 — English home page renders without redirect to /en. URL stays as /. All content displays in English. No 404 or error.
result: pass

### 2. Language Switcher Globe Dropdown
expected: Globe icon visible in header next to ThemeToggle on all pages. Clicking it shows dropdown with: English (with checkmark), Francais, Espanol, Italiano, Deutsch.
result: pass

### 3. Switch to French
expected: Click "Francais" in dropdown — URL changes to /fr, all visible text on home page is French. Brand names (ThreadMoat, Digital Thread) remain English.
result: pass

### 4. French Pricing Page
expected: Visit /fr/pricing — pricing tiers, features, FAQ all display in French. Tier names and feature descriptions are translated. Brand names preserved.
result: pass

### 5. Spanish About Page
expected: Visit /es/about — about page content displays in Spanish. Bio, contact section in Spanish.
result: pass

### 6. German Report Page
expected: Visit /de/report — report page content displays in German. TOC entries, highlights in German.
result: pass

### 7. Cookie Persistence
expected: After switching to French (/fr), hard refresh the page — stays French. Close tab, reopen /fr — still French. NEXT_LOCALE cookie persists selection.
result: pass

### 8. Dashboard Route Isolation
expected: Visit /dashboard — redirects to /auth/login (if not authenticated) WITHOUT locale prefix. No /en/dashboard or /fr/dashboard. Auth flow unaffected by i18n.
result: pass

### 9. Internal Link Navigation
expected: While on a French page (/fr), click navigation links (Services, About, etc.) — they navigate to /fr/pricing, /fr/about etc. Links stay within the selected locale.
result: pass

### 10. Translation Quality Spot Check
expected: On French pricing page, translations read as professional B2B content — not machine-translated gibberish. Industry terms (market intelligence, competitive analysis) use proper French business terminology.
result: pass

## Summary

total: 10
passed: 10
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

[none]
