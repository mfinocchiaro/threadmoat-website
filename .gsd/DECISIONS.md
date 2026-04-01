- Used dual flag emoji for English (🇺🇸🇬🇧) and Portuguese (🇧🇷🇵🇹) per user specification
- Wrote Portuguese translations manually (Ollama qwen2.5 failed previously)
- Updated all 5 existing common.json files to add Portuguese language entry
- Graceful empty string fallback for env vars instead of non-null assertions
- Fallback to inline price_data when no Stripe Price ID configured (supports coupon/manual products)
- Removed duplicate getStripe() in webhook; uses shared lib/stripe import
- Used shared helper functions in lib/metadata.ts to avoid URL-building duplication across 4 pages
- Deleted static public/robots.txt to let dynamic app/robots.ts serve sitemap reference
- English canonical URLs omit /en/ prefix consistent with localePrefix: as-needed
- Used Node runtime instead of Edge for getTranslations compatibility with next-intl file-based message loading
- System fonts only — no custom font loading to avoid asset complexity
- Text-only OG images (no logo image) for simplicity and fast rendering
- Text-based ThreadMoat logo in violet (#7c3aed) rather than image asset
- Inline styles with 'as const' type assertions for textAlign compatibility
- ReceiptEmail accepts pre-formatted date strings; lib/email.ts handles Date-to-string formatting
- Fire-and-forget pattern (no await) for all email sends to avoid blocking Stripe webhook response
- Welcome email only for subscription mode, not one-time payments
- One-time payment receipts use checkout.session.completed since invoice.payment_succeeded does not fire for payment mode
- Best-effort API call on wizard complete -- don't block user if POST fails
- Admin tier reuses Strategist steps since admins typically skip onboarding
- Local onboardingDismissed state prevents wizard re-render after API call before page reload
- Wizard placed after SidebarShell content so dashboard is visible behind the dialog overlay
- CompanyDataProvider wraps FilterProvider (company data available before filters)
- Provider hierarchy: PlanProvider > ScenarioProvider > CompanyDataProvider > FilterProvider > LayoutInner
- Filter options computed via useCompanyData() in a custom useFilterOptions hook (replicates viz-filter-bar.tsx options logic)
- Active filter chips rendered as Badge components with inline X remove button
- Each filter category is a Popover with pill-toggle buttons (not a dialog or dropdown menu)
- Search input placed inline at end of category buttons row with ml-auto
- Kept viz-filter-bar.tsx as deprecated reference, not deleted
- Removed unused 'companies' from useThesisGatedData destructuring where VizFilterBar was the only consumer
- Simplified Fragment wrappers to direct chart component renders after removing VizFilterBar sibling
- Used hasLocale() API in locale layout instead of manual includes() check
- Namespaced messages in request.ts (Common, Home, Pricing, About, Report) for proper getTranslations namespace resolution
- Used pipe-delimited strings in pricing.json for methodology items to allow split() in components
- Conference banner kept as intentionally English-only across all pages
- HomepageDashboard and report cover section kept as English brand content
- Added meta keys to all message files for generateMetadata
- Reused existing LanguageSwitcher component which uses useLocale() internally instead of accepting currentLocale prop
- Wrote translations manually rather than using Ollama qwen2.5 which returned untranslated content
- Used native Unicode characters for language labels (Francais, Espanol, Italiano, Deutsch)

---

## Decisions Table

| # | When | Scope | Decision | Choice | Rationale | Revisable? | Made By |
|---|------|-------|----------|--------|-----------|------------|---------|
| D001 |  | product | How to handle dashboard UX feedback requesting narrative reports, new heatmaps, and interactive report builder workflow | Capture as product direction for M005+ planning. Do not scope into M004 (which is verification-only). | The feedback describes a significant product evolution (analysis workbench with AI narrative). M004 is scoped for verification/sign-off only. This feedback should inform M005 planning after M004 closes. | Yes | collaborative |
