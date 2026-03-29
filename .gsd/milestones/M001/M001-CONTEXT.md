# ThreadMoat Airtable Data Quality — Session State

## What Happened This Session (Mar 28, 2026)

### Funding Verification Pipeline
- **verify_funding.py** ran on 692 companies via Firecrawl search + Ollama extraction + Nemotron plausibility
- Original run produced 395 results: 177 matches, 61 airtable_low, 71 airtable_high, 57 needs_review, 29 new_data
- **162 garbage entries purged** — PitchBook paywall hallucinations, unknown-unknown sources, wrong-entity matches
- **rerun_rejected.py** re-ran the 173 purged companies with PitchBook blocked → recovered 77 with real data (35 matches, 14 high, 10 review, 9 low, 9 new)
- **crosscheck_funding.py** — Claude Sonnet cross-checked 54 entries: 18 confirmed, 7 corrected, 29 no data (Crunchbase paywalled)
- **gpt_crosscheck.py** — GPT-4o-search-preview cross-checked 65 entries: 27 confirmed, 32 corrected, 6 no data
- **ChatGPT manual cross-checks** corrected: Hadrian ($611M), Caracol ($55.8M), Shapr3D ($8.7M), Tandem AI ($89.5M), Campfire ($103.5M), Parter ($5.5M), and others
- Raven, Handoff, Citrine Informatics, Skema.AI rejected after ChatGPT found wrong data

### Pipeline Fixes Applied
1. **PitchBook blocked** in rerun and crosscheck scripts (paywalled → hallucinated numbers)
2. **"unknown unknown" hard reject** — both round and amount must be present
3. **Domain + subsegment disambiguation** in all LLM prompts (prevents wrong-entity matches)
4. **"Single round ≠ total" guard** in Ollama extraction prompts
5. **Flask approve/reject is now AJAX** — instant visual toggle, no page reload, background JSON save
6. **Airtable cache** — 5-min TTL, no API call per page load
7. **Enrichment tab lazy-loaded** — only fetches Airtable when on that tab
8. **Big red 🔴 Commit button** on Funding and Valuations tabs

### Valuation Gap-Fill
- **gpt_valuations.py** ran on 144 companies with no Estimated Market Value
- Found 11 disclosed valuations: Regrello $900M (acquisition), Generalist AI $397M, Pelico $299M, Foxglove $185M, Vsim $100M, Foundation EGI $79M, P-1 AI $78M, Drafted $35M, Aris Machina $20M, Coreflux $12M, Godela.ai $625K
- Results in Flask Valuations tab for HITL review

### Rescores
- **Attribute mapping bug fixed** — 6 of 7 score dimensions were silently dropping (only Market Opportunity worked before)
- **Justifications now captured** — all 7 dimensions get justification text saved in JSON and written to Airtable justification columns
- **Full rescore running** — `bg_826d05c5` processing 740 companies, ~12 hours, dry-run mode
- Progress: ~10/740 at session end, saving to `discovery_output/2026-03-29_rescores.json`

### Enrichments & Rescores Written to Airtable
- ✅ 343 Market Opportunity rescores written
- ✅ Deployment Model (665/740 previously committed)
- ✅ Programming Languages (155/740 previously committed)

### NOT Written to Airtable (Pending HITL)
- ❌ Funding corrections: ~65 actionable in Flask dashboard
- ❌ Valuations: 11 new in Flask dashboard  
- ❌ Full 7-dimension rescores: running as dry-run background job
- ❌ OpenAI key has ~$8-9 remaining credit

## Running Background Processes
- `bg_826d05c5` — Full rescore (740 companies, Ollama+Claude two-pass, ~12hr ETA)
- `e4acc4a5` — Flask review server on port 5050

## Key Files
- `discovery_output/2026-03-28_funding_verify.json` — Funding results (with GPT cross-checks merged)
- `discovery_output/2026-03-28_valuations.json` — Valuation gap-fill results  
- `discovery_output/2026-03-29_rescores.json` — Full rescore results (accumulating)
- `discovery_output/rescore_full_v3.log` — Rescore run log
- Scripts: `verify_funding.py`, `rerun_rejected.py`, `crosscheck_funding.py`, `gpt_crosscheck.py`, `gpt_valuations.py`, `resolve_funding.py`

## Next Session Priorities
1. **Check rescore completion** — `tail discovery_output/rescore_full_v3.log` and review results in Flask Rescores tab
2. **Review + commit funding** — ~65 items in Flask Funding tab awaiting ✓/✗ then 🔴 Commit
3. **Review + commit valuations** — 11 items in Flask Valuations tab
4. **Review + commit rescores** — once dry-run completes, approve and commit 7-dimension scores + justifications
5. **Re-export CSV** for the threadmoat-website (`fetch_airtable_csv.py` or manual Airtable export)
6. **Interview transcript scan** — extract funding/valuation data from `AI Startups/` founder transcripts as highest-priority source tier

## Data Priority Hierarchy (User-Defined)
1. Interview data < 6 months old (founder-confirmed) — NEVER overwrite
2. Website-confirmed data (company press releases, official announcements)
3. GPT/Claude cross-checked web data (PitchBook, Tracxn, Crunchbase)
4. Pipeline-extracted data (Ollama + Firecrawl)
5. "Undisclosed or unknown" — leave empty rather than guess
