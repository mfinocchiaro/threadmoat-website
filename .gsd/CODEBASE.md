# Codebase Map

Generated: 2026-04-23T20:56:00Z | Files: 453 | Described: 0/453
<!-- gsd:codebase-meta {"generatedAt":"2026-04-23T20:56:00Z","fingerprint":"8739682f10565f0b81d7056a03f7ee7639fd52bc","fileCount":453,"truncated":false} -->

### (root)/
- `.gitignore`
- `.mcp.json`
- `.npmrc`
- `auth.ts`
- `components.json`
- `next.config.mjs`
- `package-lock.json`
- `package.json`
- `postcss.config.mjs`
- `proxy.ts`
- `ThreadMoat Website - Project Reference.md`
- `tsconfig.json`
- `vercel.json`

### .github/workflows/
- `.github/workflows/sync-airtable.yml`

### app/
- `app/apple-icon.tsx`
- `app/globals.css`
- `app/icon.tsx`
- `app/layout.tsx`
- `app/robots.ts`
- `app/sitemap.ts`

### app/[locale]/
- `app/[locale]/layout.tsx`
- `app/[locale]/opengraph-image.tsx`
- `app/[locale]/page.tsx`

### app/[locale]/about/
- `app/[locale]/about/opengraph-image.tsx`
- `app/[locale]/about/page.tsx`

### app/[locale]/companies/
- `app/[locale]/companies/opengraph-image.tsx`
- `app/[locale]/companies/page.tsx`

### app/[locale]/companies/[id]/
- `app/[locale]/companies/[id]/opengraph-image.tsx`
- `app/[locale]/companies/[id]/page.tsx`

### app/[locale]/demo/
- `app/[locale]/demo/page.tsx`

### app/[locale]/insights/
- `app/[locale]/insights/opengraph-image.tsx`
- `app/[locale]/insights/page.tsx`

### app/[locale]/insights/[slug]/
- `app/[locale]/insights/[slug]/opengraph-image.tsx`
- `app/[locale]/insights/[slug]/page.tsx`

### app/[locale]/pricing/
- `app/[locale]/pricing/opengraph-image.tsx`
- `app/[locale]/pricing/page.tsx`

### app/[locale]/report/
- `app/[locale]/report/opengraph-image.tsx`
- `app/[locale]/report/page.tsx`

### app/actions/
- `app/actions/auth.ts`
- `app/actions/stripe.ts`

### app/api/admin/analytics/
- `app/api/admin/analytics/route.ts`

### app/api/admin/coupons/
- `app/api/admin/coupons/route.ts`

### app/api/admin/crm-export/
- `app/api/admin/crm-export/route.ts`

### app/api/admin/funnel/
- `app/api/admin/funnel/route.ts`

### app/api/admin/users/
- `app/api/admin/users/route.ts`

### app/api/ai/narrative/
- `app/api/ai/narrative/route.ts`

### app/api/analytics/event/
- `app/api/analytics/event/route.ts`

### app/api/auth/[...nextauth]/
- `app/api/auth/[...nextauth]/route.ts`

### app/api/companies/
- `app/api/companies/route.ts`

### app/api/cron/drip-emails/
- `app/api/cron/drip-emails/route.ts`

### app/api/demo-request/
- `app/api/demo-request/route.ts`

### app/api/funding/
- `app/api/funding/route.ts`

### app/api/investors/
- `app/api/investors/route.ts`

### app/api/newsletter/subscribe/
- `app/api/newsletter/subscribe/route.ts`

### app/api/profile/
- `app/api/profile/route.ts`

### app/api/profile/layout/
- `app/api/profile/layout/route.ts`

### app/api/profile/onboarding/
- `app/api/profile/onboarding/route.ts`

### app/api/profile/saved-theses/
- `app/api/profile/saved-theses/route.ts`

### app/api/profile/thesis/
- `app/api/profile/thesis/route.ts`

### app/api/webhooks/stripe/
- `app/api/webhooks/stripe/route.ts`

### app/auth/error/
- `app/auth/error/page.tsx`

### app/auth/forgot-password/
- `app/auth/forgot-password/page.tsx`

### app/auth/login/
- `app/auth/login/loading.tsx`
- `app/auth/login/page.tsx`

### app/auth/reset-password/
- `app/auth/reset-password/page.tsx`

### app/auth/sign-up/
- `app/auth/sign-up/page.tsx`

### app/auth/sign-up-success/
- `app/auth/sign-up-success/page.tsx`

### app/auth/verify-email/
- `app/auth/verify-email/page.tsx`

### app/dashboard/
- `app/dashboard/error.tsx`
- `app/dashboard/layout.tsx`
- `app/dashboard/loading.tsx`
- `app/dashboard/page.tsx`

### app/dashboard/acquirer-fit/
- `app/dashboard/acquirer-fit/page.tsx`

### app/dashboard/admin/
- `app/dashboard/admin/cohort-analytics.tsx`
- `app/dashboard/admin/coupons-section.tsx`
- `app/dashboard/admin/crm-export-button.tsx`
- `app/dashboard/admin/funnel-chart.tsx`
- `app/dashboard/admin/page.tsx`
- `app/dashboard/admin/users-table.tsx`

### app/dashboard/analytics/
- `app/dashboard/analytics/page.tsx`
- `app/dashboard/analytics/startup-grid.tsx`

### app/dashboard/bar-chart/
- `app/dashboard/bar-chart/page.tsx`

### app/dashboard/box-plot/
- `app/dashboard/box-plot/page.tsx`

### app/dashboard/bubbles/
- `app/dashboard/bubbles/page.tsx`

### app/dashboard/buyer-persona/
- `app/dashboard/buyer-persona/page.tsx`

### app/dashboard/candlestick/
- `app/dashboard/candlestick/content.tsx`
- `app/dashboard/candlestick/page.tsx`

### app/dashboard/chord/
- `app/dashboard/chord/page.tsx`

### app/dashboard/co-investment/
- `app/dashboard/co-investment/page.tsx`

### app/dashboard/company/[id]/
- `app/dashboard/company/[id]/page.tsx`

### app/dashboard/compare/
- `app/dashboard/compare/page.tsx`

### app/dashboard/correlation/
- `app/dashboard/correlation/content.tsx`
- `app/dashboard/correlation/page.tsx`

### app/dashboard/customer-profile/
- `app/dashboard/customer-profile/page.tsx`

### app/dashboard/customers/
- `app/dashboard/customers/page.tsx`

### app/dashboard/deal-flow/
- `app/dashboard/deal-flow/page.tsx`

### app/dashboard/distribution/
- `app/dashboard/distribution/page.tsx`

### app/dashboard/explore/
- `app/dashboard/explore/page.tsx`

### app/dashboard/financial-heatmap/
- `app/dashboard/financial-heatmap/page.tsx`

### app/dashboard/funding-trends/
- `app/dashboard/funding-trends/page.tsx`

### app/dashboard/growth-momentum/
- `app/dashboard/growth-momentum/page.tsx`

### app/dashboard/heatmap/
- `app/dashboard/heatmap/page.tsx`

### app/dashboard/industry-penetration/
- `app/dashboard/industry-penetration/page.tsx`

### app/dashboard/investor-compare/
- `app/dashboard/investor-compare/page.tsx`

### app/dashboard/investor-network/
- `app/dashboard/investor-network/page.tsx`

### app/dashboard/investor-stats/
- `app/dashboard/investor-stats/page.tsx`

### app/dashboard/investor-views/
- `app/dashboard/investor-views/content.tsx`
- `app/dashboard/investor-views/page.tsx`

### app/dashboard/ip-dependency/
- `app/dashboard/ip-dependency/page.tsx`

### app/dashboard/landscape/
- `app/dashboard/landscape/page.tsx`

### app/dashboard/landscape-intro/
- `app/dashboard/landscape-intro/page.tsx`

### app/dashboard/map/
- `app/dashboard/map/page.tsx`

### app/dashboard/marimekko/
- `app/dashboard/marimekko/page.tsx`

### app/dashboard/market-concentration/
- `app/dashboard/market-concentration/page.tsx`

### app/dashboard/market-momentum/
- `app/dashboard/market-momentum/page.tsx`

### app/dashboard/maturity-matrix/
- `app/dashboard/maturity-matrix/content.tsx`
- `app/dashboard/maturity-matrix/page.tsx`

### app/dashboard/metros/
- `app/dashboard/metros/page.tsx`

### app/dashboard/network/
- `app/dashboard/network/page.tsx`

### app/dashboard/parallel/
- `app/dashboard/parallel/page.tsx`

### app/dashboard/patterns/
- `app/dashboard/patterns/page.tsx`

### app/dashboard/periodic-table/
- `app/dashboard/periodic-table/page.tsx`

### app/dashboard/quadrant/
- `app/dashboard/quadrant/page.tsx`

### app/dashboard/radar/
- `app/dashboard/radar/page.tsx`

### app/dashboard/reports/
- `app/dashboard/reports/content.tsx`
- `app/dashboard/reports/page.tsx`

### app/dashboard/sankey/
- `app/dashboard/sankey/page.tsx`

### app/dashboard/settings/
- `app/dashboard/settings/delete-account-button.tsx`
- `app/dashboard/settings/page.tsx`
- `app/dashboard/settings/profile-form.tsx`
- `app/dashboard/settings/redeem-code-form.tsx`

### app/dashboard/slope/
- `app/dashboard/slope/page.tsx`

### app/dashboard/spiral/
- `app/dashboard/spiral/page.tsx`

### app/dashboard/splom/
- `app/dashboard/splom/page.tsx`

### app/dashboard/sunburst/
- `app/dashboard/sunburst/page.tsx`

### app/dashboard/swot/
- `app/dashboard/swot/content.tsx`
- `app/dashboard/swot/page.tsx`

### app/dashboard/tab/advanced/
- `app/dashboard/tab/advanced/page.tsx`

### app/dashboard/tab/financial/
- `app/dashboard/tab/financial/page.tsx`

### app/dashboard/tab/geographic/
- `app/dashboard/tab/geographic/page.tsx`

### app/dashboard/tab/market/
- `app/dashboard/tab/market/page.tsx`

### app/dashboard/tab/network/
- `app/dashboard/tab/network/page.tsx`

### app/dashboard/tech-independence/
- `app/dashboard/tech-independence/page.tsx`

### app/dashboard/timeline/
- `app/dashboard/timeline/page.tsx`

### app/dashboard/treemap/
- `app/dashboard/treemap/page.tsx`

### app/dashboard/wordcloud/
- `app/dashboard/wordcloud/page.tsx`

### app/landscape/
- `app/landscape/page.tsx`

### app/privacy/
- `app/privacy/page.tsx`

### app/terms/
- `app/terms/page.tsx`

### components/
- `components/cell-drilldown-dialog.tsx`
- `components/company-details-dialog.tsx`
- `components/hub-details-dialog.tsx`
- `components/language-switcher.tsx`
- `components/theme-provider.tsx`
- `components/theme-toggle.tsx`

### components/charts/
- *(51 files: 50 .tsx, 1 .css)*

### components/checkout/
- `components/checkout/checkout-button.tsx`
- `components/checkout/checkout-toast.tsx`
- `components/checkout/manage-subscription-button.tsx`

### components/dashboard/
- *(23 files: 23 .tsx)*

### components/dashboard/thesis-steps/
- `components/dashboard/thesis-steps/isv-step.tsx`
- `components/dashboard/thesis-steps/oem-step.tsx`
- `components/dashboard/thesis-steps/vc-step.tsx`

### components/dashboards/
- `components/dashboards/admin-analytics.tsx`
- `components/dashboards/isv-dashboard.tsx`
- `components/dashboards/oem-dashboard.tsx`
- `components/dashboards/startup-dashboard.tsx`
- `components/dashboards/vc-dashboard.tsx`

### components/homepage/
- `components/homepage/homepage-dashboard-section.tsx`
- `components/homepage/homepage-dashboard.tsx`
- `components/homepage/newsletter-signup.tsx`

### components/ui/
- *(58 files: 57 .tsx, 1 .ts)*

### components/widgets/
- `components/widgets/kpi-card.tsx`
- `components/widgets/widget-card.tsx`

### content/insights/
- `content/insights/plm-startup-landscape-2026.mdx`

### contexts/
- `contexts/company-data-context.tsx`
- `contexts/filter-context.tsx`
- `contexts/layout-context.tsx`
- `contexts/plan-context.tsx`
- `contexts/scenario-context.tsx`
- `contexts/shortlist-context.tsx`
- `contexts/thesis-context.tsx`

### data/
- *(29 files: 29 .csv)*

### docs/
- `docs/admin-guide.html`
- `docs/ThreadMoat-Website-Admin-Guide.pdf`

### hooks/
- `hooks/use-idle-timeout.ts`
- `hooks/use-journey-progress.ts`
- `hooks/use-lazy-mount.ts`
- `hooks/use-mobile.ts`
- `hooks/use-page-view-tracker.ts`
- `hooks/use-thesis-gated-data.ts`
- `hooks/use-toast.ts`

### i18n/
- `i18n/navigation.ts`
- `i18n/request.ts`
- `i18n/routing.ts`

### lib/
- *(34 files: 32 .ts, 2 .tsx)*

### lib/supabase/
- `lib/supabase/client.ts`
- `lib/supabase/proxy.ts`
- `lib/supabase/server.ts`

### messages/de/
- `messages/de/about.json`
- `messages/de/common.json`
- `messages/de/home.json`
- `messages/de/pricing.json`
- `messages/de/report.json`

### messages/en/
- `messages/en/about.json`
- `messages/en/common.json`
- `messages/en/home.json`
- `messages/en/pricing.json`
- `messages/en/report.json`

### messages/es/
- `messages/es/about.json`
- `messages/es/common.json`
- `messages/es/home.json`
- `messages/es/pricing.json`
- `messages/es/report.json`

### messages/fr/
- `messages/fr/about.json`
- `messages/fr/common.json`
- `messages/fr/home.json`
- `messages/fr/pricing.json`
- `messages/fr/report.json`

### messages/it/
- `messages/it/about.json`
- `messages/it/common.json`
- `messages/it/home.json`
- `messages/it/pricing.json`
- `messages/it/report.json`

### messages/pt/
- `messages/pt/about.json`
- `messages/pt/common.json`
- `messages/pt/home.json`
- `messages/pt/pricing.json`
- `messages/pt/report.json`

### migrations/
- `migrations/002_coupons_email_verification_password_reset.sql`

### public/data/
- `public/data/incumbents.json`

### public/reports/
- `public/reports/2026-q1-market-report-sample.pdf`
- `public/reports/report-2026-Q1-teaser.pdf`

### scripts/
- *(24 files: 16 .sql, 5 .py, 3 .mjs)*

### scripts/.tag_clean_checkpoints/
- `scripts/.tag_clean_checkpoints/op_model_enrichment_state.json`
- `scripts/.tag_clean_checkpoints/proposals.json`
- `scripts/.tag_clean_checkpoints/rebuild_report_20260310_120300.txt`

### scripts/site-review/
- `scripts/site-review/app.py`
- `scripts/site-review/review-data.json`

### styles/
- `styles/globals.css`
