# User Feedback — Dashboard UX & Report Generator (March 2026)

## Source
Direct feedback from a dashboard user (likely investor/analyst persona).

## Key Themes

### 1. Filter Workflow Confusion
> "I don't understand the workflow starting with these filters. How/When does that come into effect?"

**Problem:** The filter toolbar exists but the user doesn't understand the workflow — when to set filters, what they affect, and how they relate to the charts below. The connection between filters and chart output isn't obvious.

**Implication:** Need either better onboarding/tooltips explaining the filter→chart pipeline, or a more guided workflow where filters are part of a step-by-step process rather than a passive toolbar.

### 2. Report Generator Needs Expert Narrative
> "I gravitate toward Report Generator rather than the charts, but am left wanting more narrative — Impressions, Conclusions, Beware, Overlooked Opportunity — by the SME to have that expert interpretation"

**Problem:** Charts and data are available but users want *analysis*, not just visualization. The report generator produces data summaries but lacks the interpretive layer that a human analyst would provide.

**Implication:** The report generator should produce sections like:
- **Impressions** — what stands out in this data
- **Conclusions** — what the data suggests
- **Beware** — risks and red flags
- **Overlooked Opportunities** — non-obvious patterns
- **Considerations** — strategic implications

This could be AI-generated (LLM analysis of the filtered data) with the SME persona baked in, or actual human-written commentary attached to segments.

### 3. Additional Heatmaps Requested
Beyond the Financial Heatmap (which they love), they want:
- **Market Momentum** — # new customers over time
- **Industry Penetration** — # new customers per industry
- **Target Customer Profile** — size, industry, geography, supply chain role (OEM, Tier 1-3)
- **IP Dependency** — who owns the IP, third-party dependencies, competitor exposure

**Implication:** The heatmap component pattern is proven and loved. Extending it to new dimensions is high-value, but requires new data columns (customer acquisition data, IP ownership, supply chain role) that may not exist in the current Airtable schema.

### 4. Desired Workflow (Complete Vision)
The user described their ideal workflow:

1. **Set filters** — Cognitive Thread, Workflow Automation, USA, Blue Ocean, Size (random exploration)
2. **Choose charts** — pick which visualizations to include
3. **Select companies** — drag-drop or pick 1-N specific companies to evaluate
4. **Generate report** — push to Report Generator which produces a narrative document including:
   - Filters chosen
   - Selected companies
   - Chosen charts and graphs
   - AI/SME-generated: Insights, Surprises, Concerns, Conclusions, Considerations, Opportunities

**Implication:** This is a significant product evolution — from "dashboard of charts" to "interactive analysis workbench with report builder." The current architecture has filters and charts but no concept of:
- User-selected chart curation (pick which charts to include)
- Company shortlist/workspace (select specific companies across charts)
- Narrative report generation with analytical commentary
- Exportable document combining all of the above

## Priority Assessment

| Request | Effort | Value | Data Available? |
|---------|--------|-------|----------------|
| Filter workflow explanation/onboarding | Low | Medium | Yes |
| AI narrative in report generator | Medium | **High** | Yes (use LLM on filtered data) |
| Market Momentum heatmap | Medium | High | Partial (customer data sparse) |
| Industry Penetration heatmap | Medium | High | Partial |
| Target Customer Profile heatmap | High | High | Partial (supply chain role missing) |
| IP Dependency heatmap | High | Medium | No (IP data not in schema) |
| Interactive report builder workflow | **High** | **Very High** | Partial |

## Recommendation
The highest-impact, most-feasible next step is **AI-generated narrative in the report generator** — the data is there, the LLM can analyze it, and it directly addresses the user's top request. The interactive report builder is the long-term vision but requires significant architecture work.