# Feature Landscape: SEO Observability for ThreadMoat (M027)

**Domain:** SEO analytics dashboards built on Google Search Console (GSC) data
**Researched:** 2026-05-05
**Scope:** GSC-specific features only — keyword rankings, CTR, impressions, opportunity scoring. Does NOT cover existing ThreadMoat capabilities (charting, filtering, admin, auth).
**Overall confidence:** HIGH (multiple sources, current 2026 references)

---

## Executive Summary

Modern SEO dashboards built on GSC data converge on a four-pillar feature model: **Keyword Tracking** (the raw query/position data), **Traffic Analysis** (clicks/impressions/CTR over time, segmented by brand vs non-brand), **Opportunity Detection** (striking-distance keywords and CTR underperformers), and **Benchmarking** (period-over-period, expected-vs-actual CTR curves).

The single most important opportunity-scoring concept is **"striking distance"**: keywords ranking position 8-20 with high impressions and below-average CTR represent the highest ROI optimization targets. A keyword at position 12 with 5,000 impressions and 0.5% CTR is universally considered a better target than position 6 with 200 impressions and 4% CTR. ThreadMoat must implement at least the basic version of this scoring.

In 2026, two macro shifts reshape the feature priority list: (1) **AI Overviews now reduce traditional clicks ~58%**, making impression-share and AI-surface visibility newly important; and (2) **GSC's native brand/non-brand filter** (rolled out in 2025) means dashboards should default to segmented views — blended metrics now read as amateur. ThreadMoat is well-positioned because B2B SaaS has clear brand vs non-brand distinction (queries containing "threadmoat" vs generic PLM/CAD/CAE queries).

For a v1 milestone, the recommendation is: ship table-stakes keyword tracking + striking-distance opportunity detection + brand/non-brand segmentation. Defer competitor benchmarking, what-if forecasting, and AI-Overview tracking to follow-on milestones.

---

## 1. Table Stakes

These are features users expect from any SEO dashboard. Missing any single one of these makes the product feel incomplete or amateur.

### Keyword Tracking

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Query list with clicks/impressions/CTR/position** | The four core GSC metrics — universal across every SEO tool | Low | Direct GSC API surface; one query, one row |
| **Position tracking over time (line chart)** | Users need to see if rankings are rising or falling | Low | Daily granularity; GSC API returns date-bucketed data |
| **Top queries / top pages tables** | Foundational view in every SEO tool | Low | Sortable, paginated; default sort by impressions |
| **Query → page mapping** | "Which page ranks for this query?" is the second question every SEO asks | Medium | Requires joining query and page dimensions in GSC API; 50K row/day limit complicates large sites |
| **Search type filter (web/image/video/news)** | GSC's native dimension; users expect parity | Low | API parameter, no derived logic |
| **Device segmentation (mobile/desktop/tablet)** | Mobile vs desktop CTR differs materially | Low | GSC dimension; same query plumbing |
| **Country/locale filter** | International sites need this — ThreadMoat operates in 6 languages | Low | GSC dimension; align with existing locale infrastructure |
| **Date range selector with comparison** | "Last 28 days vs prior 28 days" is the universal SEO comparison | Low | Default to last 28 days; offer 7/28/90/12-month |

### Traffic Analysis

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Clicks + impressions stacked time-series** | Headline chart on every SEO dashboard | Low | Recharts already in stack |
| **CTR over time chart** | CTR is a leading indicator of SERP changes; users expect to see the trend | Low | Derived: clicks/impressions per bucket |
| **Average position over time** | Inverted Y-axis (lower = better) is convention — easy to get wrong | Low | Position is averaged across impressions, not queries — clarify in tooltip |
| **Position distribution (top 3 / top 10 / 11-20 / 21+)** | Top 3 captures ~75% of clicks; distribution is more honest than average | Medium | Bucket logic; bar chart by date |
| **Brand vs non-brand split** | GSC added native filter in 2025; users now expect this by default | Medium | Either rely on GSC's native filter (new) OR build regex-based classification ("threadmoat\|thread moat") |
| **Period-over-period delta indicators** | "+12% clicks vs prior period" arrows on every metric | Low | Simple math; format as ±% with color coding |

### Opportunity Detection (basic)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Striking distance report (positions 8-20)** | THE table-stakes opportunity feature — every tool has this | Medium | Filter + sort by impressions DESC; positions 8-20 with >100 impressions |
| **Low CTR for position flagging** | Catches queries that rank well but users don't click (snippet/title issue) | Medium | Requires expected-CTR-by-position curve; v1 can use simple thresholds (CTR < 1% at position 1-5) |
| **Page performance summary (top pages by clicks/impressions)** | Pages, not queries, are the unit of optimization work | Low | GSC `page` dimension |

### Benchmarking (basic)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Period-over-period comparison** | Built into GSC itself; users expect parity | Low | Side-by-side or overlay charts |
| **Year-over-year comparison** | Captures seasonality | Low | 12-month default range surfaces this naturally |
| **Aggregate KPI cards (total clicks, impressions, avg CTR, avg position)** | Header tiles on every dashboard | Low | Already a ThreadMoat dashboard pattern |

---

## 2. Differentiators

Features that elevate a dashboard from "GSC clone" to "professional tool worth paying for." Not expected, but valued by power users.

### Keyword Tracking (advanced)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Query clustering by SERP similarity** | Groups variants ("PLM software" + "PLM solutions" + "best PLM tool") into one cluster | High | Requires SERP scraping or embeddings; Keyword Insights / Keyword Cupid use 30%+ shared URLs as cluster threshold. ThreadMoat could use Ollama embeddings (per CLAUDE.md guidance) for semantic clustering instead. |
| **Search intent classification (informational/commercial/transactional/navigational)** | Lets users filter "show me only commercial-intent queries" | Medium-High | Can use GPT/local LLM classification; cache results to avoid recompute |
| **Branded query detection with confidence score** | Beyond regex: detect partial brand matches, misspellings ("thred moat") | Medium | Fuzzy matching + manual override list |
| **Keyword cannibalization detection** | Multiple pages competing for same query — flagged with "wrong page winning" warning | High | Requires query→page mapping over time; distinguish "good" SERP dominance from "bad" cannibalization. Most generic tools flag too aggressively |

### Traffic Analysis (advanced)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Anomaly detection / alerting** | Auto-flag traffic drops or ranking spikes vs baseline | Medium-High | Statistical (z-score, MAD) is achievable; full ML (Prophet, ARIMA) is overkill for v1 |
| **Algorithm update overlay** | Vertical bands on time series for known Google updates | Medium | Maintain manual list of updates with dates; overlay on charts |
| **Page-level traffic decay analysis** | "These pages used to drive traffic and now don't" | Medium | Needs historical comparison; surfaces refresh candidates |
| **CTR vs expected-CTR chart** | Shows where you're under-/over-performing position-based CTR norms | Medium | Requires baseline CTR curve (industry-standard: pos 1 = 27.6%, pos 2 = 15.8%, etc.) |
| **AI Overview / SERP feature impact tracking** | "How much traffic did AI Overviews steal from this query?" | High | Requires SERP scraping or third-party data; AI Overviews reduce CTR ~58%; emerging feature in 2026 tools |

### Opportunity Detection (advanced)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Composite opportunity score (0-100)** | Single number combining position, impressions, CTR gap, query difficulty | Medium | Formula example: `score = impressions × (expected_CTR - actual_CTR) × position_weight`. Make formula visible/explainable |
| **Tiered opportunity ranking (Tier 1/2/3)** | Aligns with industry framework: T1 = pos 8-15 + >1K impressions + <2% CTR | Low | Simple bucketing once score is computed |
| **Effort vs impact quadrant chart** | Visual triage: high-impact + low-effort wins go top-right | Medium | Effort proxy: position (closer = lower effort). Impact proxy: impressions × CTR gap |
| **"Quick wins" curated list** | Top 10 actionable opportunities ranked by composite score | Low | Just a saved view of the opportunity score, sorted |
| **Title/meta description suggestions** | LLM-generated rewrites for low-CTR queries | High | Can be done with local Ollama per CLAUDE.md cost-saving guidance |

### Benchmarking (advanced)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **What-if forecasting / traffic projection** | "If we move query X from position 12 to 5, we gain ~Y clicks" | Medium-High | Multiply current impressions × expected-CTR-at-target-position. Conservative/aggressive adjustments are industry pattern |
| **Goal tracking** | Set click/impression targets, see progress over time | Medium | Database schema + UI; integrates with admin dashboard pattern |
| **Industry benchmark comparison** | "Your CTR for pos 5 is 4%; industry avg is 5.5%" | Medium | Needs benchmark dataset; ThreadMoat could derive from aggregated tenant data eventually |
| **Export to CSV / PDF reports** | Agencies and consultants need shareable artifacts | Low | ThreadMoat already has CSV pipeline patterns |

---

## 3. Anti-Features (NOT in v1)

Features explicitly to NOT build in M027. These are common in mature SEO tools but inappropriate for an MVP scope or for ThreadMoat's positioning.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Competitor rank tracking** | Requires third-party SERP API (DataForSEO, SerpApi) — recurring cost, scope creep, and ThreadMoat is positioned as market intel not SEO agency tool | Use only GSC first-party data; defer competitive view to a future milestone |
| **Backlink analysis** | Needs Ahrefs/Majestic-class crawl infrastructure — completely out of scope | Not a GSC capability; never build in-house |
| **Keyword research (volume/difficulty for keywords you DON'T rank for)** | Requires external keyword databases (Semrush has 27.9B keywords, Ahrefs 28.7B) — impossible to replicate | Frame the dashboard as "optimize what you already rank for" not "discover new keywords" |
| **On-page content audits / technical SEO crawling** | Requires Screaming Frog / Sitebulb-class crawler; massive scope | Defer; not GSC-driven |
| **Real-time updates / streaming dashboards** | GSC API has 2-day lag inherently — real-time is impossible | Daily refresh is the industry standard and is honest about data freshness |
| **Custom SQL query interface** | Power-user feature that increases support burden | Provide preset views; export raw data to CSV if needed |
| **Multi-tenant agency view (manage 50 client sites)** | ThreadMoat is single-domain B2B SaaS, not an agency tool | One GSC property per ThreadMoat instance |
| **Aggressive cannibalization warnings** | Generic tools "scream Danger!" on every duplicate ranking; SERP dominance is often *good* | If shipping cannibalization detection, require a "wrong page is winning" condition (target URL underperforming) |
| **AI-generated content rewriting at scale** | Suggestion of meta titles is OK; bulk rewrite/publishing creates accuracy and accountability problems | Surface opportunities; let human write the fix |
| **Mobile-only / device-specific deep dives** | Useful but low-priority noise for a v1 | Aggregate views; expose device dimension in filters but no dedicated reports |

---

## 4. Complexity Notes

Ordered by implementation difficulty. ThreadMoat already has the visualization layer (Recharts, D3, 44+ chart components), so complexity ratings refer specifically to *new* logic for M027 (data fetching, scoring, classification).

### Low Complexity (v1 candidates)

- **GSC API client + raw query/clicks/impressions/CTR/position table** — Direct API mapping, no derived logic. The "hello world" of SEO dashboards.
- **Time-series charts** — ThreadMoat's chart library handles this trivially.
- **Position distribution buckets** — Simple bucketing logic.
- **Period-over-period deltas** — Basic arithmetic.
- **Striking distance filter (positions 8-20 + impression threshold)** — A filtered table view.
- **Aggregate KPI cards** — ThreadMoat pattern already exists.

### Medium Complexity

- **Brand/non-brand classification** — Regex or fuzzy match list; needs admin UI for managing brand patterns. NOTE: GSC's native brand filter (2025) may eliminate need to roll our own.
- **Query → page mapping joins** — GSC API's 50K row/day limit means large sites need pagination + multiple calls.
- **Expected CTR baseline curves** — Static lookup table is simple; making it industry-segmented is harder.
- **Composite opportunity score** — Formula design + UI to explain "why this score." Score legitimacy depends on transparency.
- **CTR underperformance detection** — Requires the expected-CTR baseline above.
- **Anomaly alerting (statistical)** — z-score / MAD is straightforward; productionizing alerts (email, in-app) adds work.
- **What-if forecasting (linear)** — `impressions × expected_CTR_at_target` is simple math; UI for "move this keyword to position X" is the work.

### High Complexity (defer to later milestones)

- **Query clustering** — Embedding generation (use local Ollama per CLAUDE.md), similarity matrix, dendogram visualization. ThreadMoat has D3 so visualization is solved; the data pipeline is the cost.
- **Search intent classification** — LLM call per query (use local LLM); caching strategy critical for cost.
- **Keyword cannibalization detection (done well)** — Distinguishing good SERP dominance from bad cannibalization requires temporal analysis + page intent comparison.
- **AI Overview / SERP feature tracking** — Requires SERP scraping infrastructure or third-party API. New problem space in 2026.
- **Beyond-16-month historical storage** — Requires a BigQuery-style export pipeline or self-managed Postgres aggregation. Important strategically but high engineering cost.

---

## 5. Dependency Notes

Feature dependencies. Build prerequisites first; otherwise downstream features become brittle or impossible.

```
Foundation Layer (must exist first):
  GSC API client + auth + rate-limit handling
    ├─→ Daily data ingestion job → DB persistence (for history beyond 16 months later)
    └─→ Raw query/page tables (clicks, impressions, CTR, position by date)
         │
         ├─→ Time-series charts
         ├─→ Top queries / top pages views
         ├─→ Period-over-period deltas
         ├─→ KPI cards
         │
         ├─→ Brand/non-brand classifier (regex layer)
         │     └─→ Brand-segmented versions of every chart above
         │
         ├─→ Position distribution buckets
         │     └─→ Position trend analysis
         │
         ├─→ Striking distance filter
         │     ├─→ Composite opportunity score
         │     │     └─→ Tiered opportunity ranking
         │     │     └─→ Effort/impact quadrant
         │     │     └─→ "Quick wins" curated list
         │     └─→ What-if forecasting
         │
         ├─→ Expected CTR baseline curves (static)
         │     ├─→ CTR underperformance detection
         │     └─→ CTR vs expected chart
         │
         ├─→ Anomaly detection (statistical)
         │     └─→ Alerting (email/in-app)
         │
         ├─→ Query→page mapping
         │     └─→ Cannibalization detection (advanced)
         │
         └─→ Embedding pipeline (local Ollama)
               ├─→ Query clustering
               └─→ Intent classification
                     └─→ Intent-filtered views
```

### Critical Dependencies

1. **GSC API client must handle rate limits + 50K rows/day cap** before anything downstream is reliable. This is the #1 risk — get it wrong and every other feature is unstable.
2. **Database persistence must exist from day 1**, even if the "beyond-16-month history" feature ships later. Otherwise you'll lose data permanently when the rolling window passes.
3. **Brand/non-brand classifier should ship in v1** because almost every chart benefits from segmentation — retrofitting later means reworking every visualization.
4. **Expected CTR baseline curves are a foundational lookup** — many opportunity-scoring features depend on them. Bake in early; refine the values over time.
5. **Composite opportunity score depends on expected CTR + striking distance + brand classifier** — schedule these three first if scoring is a v1 goal.

### Soft Dependencies (Nice-to-Have Sequencing)

- **Anomaly detection** is more useful with **algorithm update overlay** (so users can distinguish "Google updated" from "we broke something").
- **What-if forecasting** is more credible with **expected CTR curves visible** (so users see the assumption being modeled).
- **Query clustering** is more useful when **intent classification** runs on cluster representatives rather than every query (cost-saving).

---

## MVP Recommendation for M027

**Ship in v1:**

1. GSC API client + daily ingestion + DB persistence (foundation)
2. Query/page list with clicks/impressions/CTR/position
3. Time-series charts (clicks, impressions, CTR, avg position)
4. Position distribution (top 3 / top 10 / 11-20 / 21+)
5. Period-over-period comparison (28-day default, YoY available)
6. Brand vs non-brand segmentation (regex-based; expose admin config)
7. Striking distance report (positions 8-20, impressions > threshold)
8. Composite opportunity score with tiered ranking (T1/T2/T3)
9. Aggregate KPI cards with delta indicators
10. CSV export

**Defer to v1.1 / future milestones:**

- Anomaly detection + alerting
- What-if forecasting
- Query clustering + intent classification
- Cannibalization detection (do it well or not at all)
- AI Overview impact tracking
- Beyond-16-month historical storage (BigQuery pipeline)
- Algorithm update overlay
- Industry benchmark comparison

**Rationale:** The v1 set hits all four pillars (Keyword Tracking, Traffic Analysis, Opportunity Detection, Benchmarking) with table-stakes depth in each. The opportunity score is the single non-table-stakes feature and is the differentiator that justifies the dashboard's existence beyond "GSC clone." Deferred items are either high-complexity (clustering, AI Overview) or require infrastructure investments (16-month+ storage) that should be planned milestones of their own.

---

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| Table-stakes feature list | HIGH | Universal across every reviewed source (Improvado, Incremys, Search Engine Land, ALM Corp, multiple 2026 tool comparisons) |
| Striking distance methodology | HIGH | Convergent definitions across SEOTesting, Clutch, Clearscope, GSCdaddy, SEO Scout. The position-8-15 + impressions + low-CTR formula is industry consensus |
| Brand vs non-brand priority | HIGH | GSC's native filter rolled out in 2025 confirms this is now baseline. Search Engine Land coverage is authoritative |
| AI Overview impact (58% CTR drop) | MEDIUM | Single primary stat repeated across sources; could shift quickly. Treat as directional, not precise |
| Opportunity scoring formulas | MEDIUM | Tier 1/2/3 framework is consistent but exact thresholds vary by source. Recommend tunable in admin UI |
| Cannibalization detection nuance | MEDIUM | Strong signal that "good vs bad cannibalization" matters; fewer sources on detection methodology |
| Query clustering algorithms | MEDIUM | 30%-shared-URLs threshold is specific to Keyword Cupid; semantic embedding alternatives are increasingly popular but no single industry standard |
| Forecasting methods | LOW-MEDIUM | Sources cover the concept but expose proprietary methodologies; ThreadMoat would need to design its own model |

---

## Sources

- [SEO Dashboard Google Data Studio: Visualize & Analyze 2026 (Improvado)](https://improvado.io/blog/seo-dashboard-in-google-data-studio)
- [SEO KPIs in 2026: A Tracking Guide (Incremys)](https://www.incremys.com/en/resources/blog/seo-kpis)
- [How to Track a Website's Ranking in 2026 (Incremys)](https://www.incremys.com/en/resources/blog/website-rank)
- [Striking Distance Keywords - SEOTesting](https://seotesting.com/blog/striking-distance-keywords/)
- [Striking-Distance Keywords: What Are They & How to Target Them (Clutch)](https://clutch.co/resources/striking-distance-keywords)
- [What Are Striking Distance Keywords (Clearscope)](https://www.clearscope.io/blog/what-are-striking-distance-keywords)
- [The Complete Guide to Striking Distance Keywords in 2026 (GSCdaddy)](https://www.gscdaddy.com/blog/striking-distance-keywords-guide)
- [Page 2 Potential: Striking Distance Keywords (SEO Scout)](https://seoscout.com/guides/page-2-potential-how-to-find-striking-distance-k)
- [Semrush vs Ahrefs: Complete Comparison Guide 2026 (SEOmator)](https://seomator.com/blog/semrush-vs-ahrefs)
- [Ahrefs vs Semrush: Which SEO Tool Should You Use in 2026 (Backlinko)](https://backlinko.com/ahrefs-vs-semrush)
- [How GSC's branded query filter changes SEO reporting (Search Engine Land)](https://searchengineland.com/google-search-console-branded-query-filter-seo-reporting-analysis-472474)
- [AI Overviews Killed CTR 61%: 9 Strategies (Dataslayer)](https://www.dataslayer.ai/blog/google-ai-overviews-the-end-of-traditional-ctr-and-how-to-adapt-in-2025)
- [Google AI Overview SEO Impact: 2026 Data (Stackmatix)](https://www.stackmatix.com/blog/google-ai-overview-seo-impact)
- [Google Search Console API: A Guide to All Available Data (RankStudio)](https://rankstudio.net/articles/en/google-search-console-api-guide)
- [GSC Historical Data: Export and Store 16 Months (DadSEO)](https://getdadseo.com/blog/google-search-console-historical-data)
- [Google Search Console Analytics API now has 16 months of data (Search Engine Land)](https://searchengineland.com/google-search-console-analytics-api-now-has-16-months-of-data-300430)
- [SEO Forecasting Methods with Examples (SEranking)](https://seranking.com/blog/seo-forecasting/)
- [How to Do Realistic SEO Forecasting (Backlinko)](https://backlinko.com/seo-forecasting)
- [SEO Forecasting Tool — Win Pitches with Data (SEOmonitor)](https://www.seomonitor.com/seo-forecast)
- [Search Intent Classification: An SEO Method (Incremys)](https://www.incremys.com/en/resources/blog/search-intent-classification)
- [Keyword Clustering Tool – Group Keywords by SERP Similarity (Keyword Insights)](https://www.keywordinsights.ai/features/keyword-clustering/)
- [How Semantic Keyword Clustering Revolutionizes SEO (SEO.ai)](https://seo.ai/blog/semantic-keyword-clustering)
- [GSC Data Anomalies Playbook (Vizup)](https://www.tryvizup.com/blog/gsc-data-anomalies)
- [Anomaly Detection In SEO Analytics (Meegle)](https://www.meegle.com/en_us/topics/anomaly-detection/anomaly-detection-in-seo-analytics)
- [Best Keyword Cannibalization Tools in 2026 (Epic Slope)](https://www.epicslope.partners/unclash-ai/keyword-cannibalization-tools)
- [How to Fix SEO Cannibalization 2026 (TrueRanker)](https://trueranker.com/blog/how-to-detect-fix-seo-cannibalization/)
