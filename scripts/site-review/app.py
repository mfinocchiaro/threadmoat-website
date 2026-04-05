#!/usr/bin/env python3
"""
ThreadMoat Site Review Tool

A lightweight Flask app for systematic page-by-page review of the production site.
Navigate to each page via an embedded iframe, add comments, then export all
feedback as a structured markdown file ready for GSD milestone planning.

Usage:
    python3 scripts/site-review/app.py
    Open http://localhost:5050
"""

import json
import os
from datetime import datetime
from flask import Flask, render_template_string, request, jsonify, redirect

app = Flask(__name__)

DATA_FILE = os.path.join(os.path.dirname(__file__), "review-data.json")
SITE_BASE = os.environ.get("SITE_URL", "https://threadmoat.com")

# ─── Page registry organized by section ─────────────────────────────────────

SECTIONS = [
    {
        "id": "public",
        "title": "🌐 Public Marketing Pages",
        "pages": [
            {"path": "/", "label": "Homepage (EN)"},
            {"path": "/pricing", "label": "Pricing"},
            {"path": "/about", "label": "About"},
            {"path": "/report", "label": "Market Report"},
            {"path": "/landscape", "label": "Investment Landscape (public)"},
            {"path": "/privacy", "label": "Privacy Policy"},
            {"path": "/terms", "label": "Terms of Service"},
        ],
    },
    {
        "id": "i18n",
        "title": "🌍 Translations",
        "pages": [
            {"path": "/fr", "label": "Homepage (FR)"},
            {"path": "/es", "label": "Homepage (ES)"},
            {"path": "/it", "label": "Homepage (IT)"},
            {"path": "/de", "label": "Homepage (DE)"},
            {"path": "/pt", "label": "Homepage (PT)"},
            {"path": "/fr/pricing", "label": "Pricing (FR)"},
            {"path": "/es/pricing", "label": "Pricing (ES)"},
            {"path": "/it/pricing", "label": "Pricing (IT)"},
            {"path": "/de/pricing", "label": "Pricing (DE)"},
            {"path": "/pt/pricing", "label": "Pricing (PT)"},
            {"path": "/pt/about", "label": "About (PT)"},
            {"path": "/pt/report", "label": "Report (PT)"},
        ],
    },
    {
        "id": "auth",
        "title": "🔐 Auth Flow",
        "pages": [
            {"path": "/auth/login", "label": "Login"},
            {"path": "/auth/sign-up", "label": "Sign Up"},
            {"path": "/auth/forgot-password", "label": "Forgot Password"},
        ],
    },
    {
        "id": "dash-main",
        "title": "📊 Dashboard — Main & Market Maps",
        "pages": [
            {"path": "/dashboard", "label": "Dashboard Home"},
            {"path": "/dashboard/landscape-intro", "label": "Investment Landscape"},
            {"path": "/dashboard/quadrant", "label": "Magic Quadrant"},
            {"path": "/dashboard/bubbles", "label": "Bubble Chart"},
            {"path": "/dashboard/landscape", "label": "Landscape Grid"},
            {"path": "/dashboard/periodic-table", "label": "Periodic Table"},
            {"path": "/dashboard/compare", "label": "Compare"},
            {"path": "/dashboard/sunburst", "label": "Sunburst"},
        ],
    },
    {
        "id": "dash-financial",
        "title": "💰 Dashboard — Financial",
        "pages": [
            {"path": "/dashboard/tab/financial", "label": "Financial Tab"},
            {"path": "/dashboard/bar-chart", "label": "Bar Chart"},
            {"path": "/dashboard/treemap", "label": "Treemap"},
            {"path": "/dashboard/candlestick", "label": "Valuation Candlestick"},
            {"path": "/dashboard/spiral", "label": "Spiral"},
        ],
    },
    {
        "id": "dash-geo",
        "title": "🌎 Dashboard — Geographic",
        "pages": [
            {"path": "/dashboard/tab/geographic", "label": "Geographic Tab"},
            {"path": "/dashboard/map", "label": "Geography Map"},
            {"path": "/dashboard/metros", "label": "Metro Areas"},
        ],
    },
    {
        "id": "dash-network",
        "title": "🔗 Dashboard — Networks",
        "pages": [
            {"path": "/dashboard/tab/network", "label": "Network Tab"},
            {"path": "/dashboard/network", "label": "Startup Ecosystem"},
            {"path": "/dashboard/customers", "label": "Customer Network"},
            {"path": "/dashboard/investor-network", "label": "Investor Network"},
        ],
    },
    {
        "id": "dash-advanced",
        "title": "⚡ Dashboard — Advanced Charts",
        "pages": [
            {"path": "/dashboard/tab/advanced", "label": "Advanced Tab"},
            {"path": "/dashboard/radar", "label": "Radar Chart"},
            {"path": "/dashboard/heatmap", "label": "Heatmap"},
            {"path": "/dashboard/parallel", "label": "Parallel Coords"},
            {"path": "/dashboard/box-plot", "label": "Box Plot"},
            {"path": "/dashboard/distribution", "label": "Distribution"},
            {"path": "/dashboard/slope", "label": "Slope Chart"},
            {"path": "/dashboard/splom", "label": "Scatter Matrix"},
            {"path": "/dashboard/chord", "label": "Chord Diagram"},
            {"path": "/dashboard/wordcloud", "label": "Word Cloud"},
        ],
    },
    {
        "id": "dash-admin",
        "title": "🛡️ Dashboard — Admin Analytics",
        "pages": [
            {"path": "/dashboard/investor-stats", "label": "Investor Stats"},
            {"path": "/dashboard/financial-heatmap", "label": "Financial Heatmap"},
            {"path": "/dashboard/industry-penetration", "label": "Industry Penetration"},
            {"path": "/dashboard/tech-independence", "label": "Tech Independence"},
            {"path": "/dashboard/growth-momentum", "label": "Growth Momentum"},
            {"path": "/dashboard/buyer-persona", "label": "Buyer Persona"},
            {"path": "/dashboard/correlation", "label": "Correlation Matrix"},
            {"path": "/dashboard/maturity-matrix", "label": "Maturity Matrix"},
            {"path": "/dashboard/swot", "label": "SWOT Analysis"},
            {"path": "/dashboard/market-momentum", "label": "Market Momentum"},
            {"path": "/dashboard/customer-profile", "label": "Customer Profile"},
            {"path": "/dashboard/ip-dependency", "label": "IP Dependency"},
            {"path": "/dashboard/co-investment", "label": "Co-Investment Heatmap"},
            {"path": "/dashboard/investor-compare", "label": "Investor Compare"},
            {"path": "/dashboard/investor-views", "label": "Investor Views"},
        ],
    },
    {
        "id": "dash-tools",
        "title": "🛠️ Dashboard — Tools & Reports",
        "pages": [
            {"path": "/dashboard/reports", "label": "Report Generator"},
            {"path": "/dashboard/explore", "label": "Free Explorer"},
            {"path": "/dashboard/settings", "label": "Settings"},
            {"path": "/dashboard/analytics", "label": "Analytics"},
        ],
    },
]


def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE) as f:
            return json.load(f)
    return {}


def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)


TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>ThreadMoat Site Review</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background: #0f0f14; color: #e0e0e8; }

  .layout { display: flex; height: 100vh; }

  /* Sidebar */
  .sidebar { width: 320px; background: #16161e; border-right: 1px solid #2a2a3a; overflow-y: auto; flex-shrink: 0; }
  .sidebar h1 { font-size: 16px; padding: 16px 16px 8px; color: #a78bfa; font-weight: 700; }
  .sidebar .stats { padding: 4px 16px 12px; font-size: 11px; color: #666; border-bottom: 1px solid #2a2a3a; }
  .section-title { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.5px; padding: 14px 16px 6px; }
  .page-link { display: flex; align-items: center; gap: 8px; padding: 6px 16px; font-size: 13px; cursor: pointer; border-left: 3px solid transparent; transition: all 0.15s; text-decoration: none; color: #c0c0cc; }
  .page-link:hover { background: #1e1e2a; color: #fff; }
  .page-link.active { background: #1e1e2e; border-left-color: #a78bfa; color: #fff; }
  .page-link .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .dot.none { background: #333; }
  .dot.has-comments { background: #f59e0b; }
  .dot.approved { background: #22c55e; }

  /* Main area */
  .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

  /* Toolbar */
  .toolbar { background: #16161e; border-bottom: 1px solid #2a2a3a; padding: 10px 20px; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .toolbar .page-title { font-size: 15px; font-weight: 600; flex: 1; }
  .toolbar .page-path { font-size: 12px; color: #888; font-family: monospace; }
  .toolbar button { padding: 6px 14px; border-radius: 6px; border: 1px solid #3a3a4a; background: #1e1e2e; color: #e0e0e8; font-size: 12px; cursor: pointer; transition: all 0.15s; }
  .toolbar button:hover { background: #2a2a3e; border-color: #a78bfa; }
  .toolbar button.approve { background: #166534; border-color: #22c55e; }
  .toolbar button.approve:hover { background: #15803d; }
  .toolbar button.export-btn { background: #4c1d95; border-color: #a78bfa; }
  .toolbar button.export-btn:hover { background: #5b21b6; }

  /* Content split */
  .content { flex: 1; display: flex; min-height: 0; }

  /* Preview area */
  .iframe-container { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #1a1a24; }
  .iframe-container iframe { width: 100%; height: 100%; border: none; background: #fff; }
  .open-page { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; }
  .open-page a { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: 10px; background: #a78bfa; color: #fff; font-size: 16px; font-weight: 600; text-decoration: none; transition: all 0.15s; }
  .open-page a:hover { background: #8b5cf6; transform: translateY(-1px); }
  .open-page .hint { font-size: 12px; color: #666; max-width: 400px; line-height: 1.5; }
  .open-page .path { font-family: monospace; font-size: 14px; color: #888; background: #1e1e2e; padding: 6px 14px; border-radius: 6px; border: 1px solid #2a2a3a; }

  /* Comment panel */
  .comment-panel { width: 380px; background: #16161e; border-left: 1px solid #2a2a3a; display: flex; flex-direction: column; flex-shrink: 0; }
  .comment-panel h3 { font-size: 13px; font-weight: 600; padding: 14px 16px 8px; color: #a78bfa; }
  .comments-list { flex: 1; overflow-y: auto; padding: 0 16px; }
  .comment { background: #1e1e2e; border: 1px solid #2a2a3a; border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; font-size: 12px; line-height: 1.5; position: relative; }
  .comment .severity { font-size: 10px; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
  .comment .severity.bug { color: #ef4444; }
  .comment .severity.issue { color: #f59e0b; }
  .comment .severity.suggestion { color: #3b82f6; }
  .comment .severity.note { color: #888; }
  .comment .delete-btn { position: absolute; top: 6px; right: 8px; background: none; border: none; color: #666; cursor: pointer; font-size: 14px; padding: 2px; }
  .comment .delete-btn:hover { color: #ef4444; }
  .comment-input { padding: 12px 16px; border-top: 1px solid #2a2a3a; }
  .comment-input select { width: 100%; padding: 6px 8px; border-radius: 6px; border: 1px solid #3a3a4a; background: #1e1e2e; color: #e0e0e8; font-size: 12px; margin-bottom: 8px; }
  .comment-input textarea { width: 100%; height: 80px; padding: 8px 10px; border-radius: 6px; border: 1px solid #3a3a4a; background: #1e1e2e; color: #e0e0e8; font-size: 12px; resize: vertical; font-family: inherit; }
  .comment-input textarea:focus { outline: none; border-color: #a78bfa; }
  .comment-input button { width: 100%; margin-top: 8px; padding: 8px; border-radius: 6px; border: none; background: #a78bfa; color: #fff; font-size: 12px; font-weight: 600; cursor: pointer; }
  .comment-input button:hover { background: #8b5cf6; }

  /* Nav buttons */
  .nav-buttons { display: flex; gap: 6px; }
  .nav-buttons button { font-size: 18px; padding: 4px 10px; }
</style>
</head>
<body>

<div class="layout">
  <!-- Sidebar -->
  <div class="sidebar">
    <h1>🏰 ThreadMoat Review</h1>
    <div class="stats" id="stats">Loading...</div>

    {% for section in sections %}
    <div class="section-title">{{ section.title }}</div>
    {% for page in section.pages %}
    <a class="page-link {% if page.path == current_path %}active{% endif %}"
       href="/?page={{ page.path | urlencode }}"
       data-path="{{ page.path }}">
      <span class="dot none"></span>
      {{ page.label }}
    </a>
    {% endfor %}
    {% endfor %}
  </div>

  <!-- Main -->
  <div class="main">
    <div class="toolbar">
      <div class="nav-buttons">
        <button onclick="navPrev()" title="Previous page">←</button>
        <button onclick="navNext()" title="Next page">→</button>
      </div>
      <span class="page-title" id="page-title">{{ current_label }}</span>
      <span class="page-path" id="page-path">{{ current_path }}</span>
      <button onclick="openInTab()">Open in tab ↗</button>
      <button class="approve" onclick="approveThisPage()">✓ Approve</button>
      <button class="export-btn" onclick="window.location='/export'">📋 Export All</button>
    </div>

    <div class="content">
      <div class="iframe-container">
        <div class="open-page">
          <div class="path">{{ site_base }}{{ current_path }}</div>
          <a href="{{ site_base }}{{ current_path }}" target="_blank" rel="noopener">
            Open {{ current_label }} ↗
          </a>
          <div class="hint">
            Review the page in the new tab, then return here to add comments.
            Use ← → arrow keys or the nav buttons to move between pages.
          </div>
        </div>
      </div>

      <div class="comment-panel">
        <h3>Comments for this page</h3>
        <div class="comments-list" id="comments-list"></div>
        <div class="comment-input">
          <select id="severity">
            <option value="bug">🔴 Bug — broken/wrong</option>
            <option value="issue" selected>🟡 Issue — needs fixing</option>
            <option value="suggestion">🔵 Suggestion — nice to have</option>
            <option value="note">⚪ Note — observation</option>
          </select>
          <textarea id="comment-text" placeholder="Describe what you see..."></textarea>
          <button onclick="addComment()">Add Comment</button>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
const SITE_BASE = {{ site_base | tojson }};
const CURRENT_PATH = {{ current_path | tojson }};
const ALL_PAGES = {{ all_pages | tojson }};

// Load comments for current page
async function loadComments() {
  const resp = await fetch('/api/comments?path=' + encodeURIComponent(CURRENT_PATH));
  const data = await resp.json();
  const list = document.getElementById('comments-list');
  list.innerHTML = '';
  if (data.comments && data.comments.length > 0) {
    data.comments.forEach((c, i) => {
      const div = document.createElement('div');
      div.className = 'comment';
      div.innerHTML = `
        <div class="severity ${c.severity}">${c.severity}</div>
        <div>${c.text}</div>
        <button class="delete-btn" onclick="deleteComment(${i})">×</button>
      `;
      list.appendChild(div);
    });
  } else {
    list.innerHTML = '<div style="padding:20px;text-align:center;color:#555;font-size:12px">No comments yet.<br>Review the page and add feedback below.</div>';
  }
}

async function addComment() {
  const text = document.getElementById('comment-text').value.trim();
  if (!text) return;
  const severity = document.getElementById('severity').value;
  await fetch('/api/comments', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ path: CURRENT_PATH, severity, text })
  });
  document.getElementById('comment-text').value = '';
  loadComments();
  updateDots();
}

async function deleteComment(index) {
  await fetch('/api/comments', {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ path: CURRENT_PATH, index })
  });
  loadComments();
  updateDots();
}

async function approveThisPage() {
  await fetch('/api/approve', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ path: CURRENT_PATH })
  });
  updateDots();
}

async function updateDots() {
  const resp = await fetch('/api/status');
  const data = await resp.json();
  document.querySelectorAll('.page-link').forEach(link => {
    const path = link.dataset.path;
    const dot = link.querySelector('.dot');
    if (!dot) return;
    const info = data[path];
    dot.className = 'dot';
    if (info && info.approved) {
      dot.classList.add('approved');
    } else if (info && info.comment_count > 0) {
      dot.classList.add('has-comments');
    } else {
      dot.classList.add('none');
    }
  });
  // Update stats
  const total = ALL_PAGES.length;
  const approved = Object.values(data).filter(v => v.approved).length;
  const withComments = Object.values(data).filter(v => v.comment_count > 0 && !v.approved).length;
  const remaining = total - approved - withComments;
  document.getElementById('stats').textContent =
    `${approved} approved · ${withComments} with comments · ${remaining} not reviewed · ${total} total`;
}

function openInTab() {
  window.open(SITE_BASE + CURRENT_PATH, '_blank');
}

function navPrev() {
  const idx = ALL_PAGES.indexOf(CURRENT_PATH);
  if (idx > 0) window.location = '/?page=' + encodeURIComponent(ALL_PAGES[idx - 1]);
}

function navNext() {
  const idx = ALL_PAGES.indexOf(CURRENT_PATH);
  if (idx < ALL_PAGES.length - 1) window.location = '/?page=' + encodeURIComponent(ALL_PAGES[idx + 1]);
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
  if (e.key === 'ArrowLeft') navPrev();
  if (e.key === 'ArrowRight') navNext();
});

loadComments();
updateDots();
</script>
</body>
</html>
"""

EXPORT_TEMPLATE = """
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Review Export</title>
<style>
body { font-family: -apple-system, system-ui, sans-serif; max-width: 900px; margin: 40px auto; padding: 0 20px; background: #0f0f14; color: #e0e0e8; }
h1 { color: #a78bfa; }
h2 { color: #f59e0b; margin-top: 32px; border-bottom: 1px solid #2a2a3a; padding-bottom: 6px; }
pre { background: #1e1e2e; padding: 20px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.6; white-space: pre-wrap; }
.actions { margin: 20px 0; display: flex; gap: 12px; }
button { padding: 10px 20px; border-radius: 8px; border: 1px solid #3a3a4a; background: #1e1e2e; color: #e0e0e8; cursor: pointer; font-size: 14px; }
button:hover { border-color: #a78bfa; }
.copy-btn { background: #4c1d95; border-color: #a78bfa; }
a { color: #a78bfa; }
.stat { display: inline-block; background: #1e1e2e; border: 1px solid #2a2a3a; border-radius: 8px; padding: 8px 16px; margin: 4px; font-size: 13px; }
</style></head>
<body>
<h1>🏰 ThreadMoat Site Review — Export</h1>
<p>Generated: {{ timestamp }}</p>
<div>
  <span class="stat">🔴 {{ bug_count }} bugs</span>
  <span class="stat">🟡 {{ issue_count }} issues</span>
  <span class="stat">🔵 {{ suggestion_count }} suggestions</span>
  <span class="stat">✅ {{ approved_count }} approved</span>
  <span class="stat">📄 {{ total_pages }} total pages</span>
</div>

<div class="actions">
  <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('md').textContent)">📋 Copy Markdown</button>
  <a href="/"><button>← Back to Review</button></a>
</div>

<h2>Markdown Output</h2>
<pre id="md">{{ markdown }}</pre>

</body></html>
"""


@app.route("/")
def index():
    current_path = request.args.get("page", "/")
    current_label = "Homepage"
    for section in SECTIONS:
        for page in section["pages"]:
            if page["path"] == current_path:
                current_label = page["label"]
                break

    all_pages = []
    for section in SECTIONS:
        for page in section["pages"]:
            all_pages.append(page["path"])

    return render_template_string(
        TEMPLATE,
        sections=SECTIONS,
        current_path=current_path,
        current_label=current_label,
        site_base=SITE_BASE,
        all_pages=all_pages,
    )


@app.route("/api/comments", methods=["GET"])
def get_comments():
    path = request.args.get("path", "/")
    data = load_data()
    page_data = data.get(path, {})
    return jsonify({"comments": page_data.get("comments", [])})


@app.route("/api/comments", methods=["POST"])
def add_comment():
    body = request.json
    path = body["path"]
    data = load_data()
    if path not in data:
        data[path] = {"comments": [], "approved": False}
    data[path]["comments"].append(
        {"severity": body["severity"], "text": body["text"], "timestamp": datetime.now().isoformat()}
    )
    data[path]["approved"] = False  # un-approve if new comment added
    save_data(data)
    return jsonify({"ok": True})


@app.route("/api/comments", methods=["DELETE"])
def delete_comment():
    body = request.json
    path = body["path"]
    index = body["index"]
    data = load_data()
    if path in data and 0 <= index < len(data[path]["comments"]):
        data[path]["comments"].pop(index)
    save_data(data)
    return jsonify({"ok": True})


@app.route("/api/approve", methods=["POST"])
def approve():
    body = request.json
    path = body["path"]
    data = load_data()
    if path not in data:
        data[path] = {"comments": [], "approved": True}
    else:
        data[path]["approved"] = True
    save_data(data)
    return jsonify({"ok": True})


@app.route("/api/status")
def status():
    data = load_data()
    result = {}
    for section in SECTIONS:
        for page in section["pages"]:
            path = page["path"]
            page_data = data.get(path, {})
            result[path] = {
                "approved": page_data.get("approved", False),
                "comment_count": len(page_data.get("comments", [])),
            }
    return jsonify(result)


@app.route("/export")
def export():
    data = load_data()
    lines = ["# ThreadMoat Site Review — Feedback", ""]
    lines.append(f"**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    lines.append(f"**Site:** {SITE_BASE}")
    lines.append("")

    bug_count = issue_count = suggestion_count = approved_count = 0
    total_pages = sum(len(s["pages"]) for s in SECTIONS)

    for section in SECTIONS:
        section_comments = []
        section_approved = []
        for page in section["pages"]:
            path = page["path"]
            page_data = data.get(path, {})
            comments = page_data.get("comments", [])
            is_approved = page_data.get("approved", False)

            if is_approved:
                approved_count += 1
                section_approved.append(page["label"])

            if comments:
                section_comments.append((page, comments))
                for c in comments:
                    if c["severity"] == "bug":
                        bug_count += 1
                    elif c["severity"] == "issue":
                        issue_count += 1
                    elif c["severity"] == "suggestion":
                        suggestion_count += 1

        if section_comments or section_approved:
            lines.append(f"## {section['title']}")
            lines.append("")

            if section_approved:
                lines.append(f"✅ Approved: {', '.join(section_approved)}")
                lines.append("")

            for page, comments in section_comments:
                lines.append(f"### {page['label']} (`{page['path']}`)")
                lines.append("")
                for c in comments:
                    icon = {"bug": "🔴", "issue": "🟡", "suggestion": "🔵", "note": "⚪"}.get(c["severity"], "⚪")
                    lines.append(f"- {icon} **{c['severity'].upper()}**: {c['text']}")
                lines.append("")

    lines.append("---")
    lines.append(f"**Summary:** {bug_count} bugs · {issue_count} issues · {suggestion_count} suggestions · {approved_count}/{total_pages} pages approved")

    markdown = "\n".join(lines)

    return render_template_string(
        EXPORT_TEMPLATE,
        markdown=markdown,
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M"),
        bug_count=bug_count,
        issue_count=issue_count,
        suggestion_count=suggestion_count,
        approved_count=approved_count,
        total_pages=total_pages,
    )


if __name__ == "__main__":
    print(f"\n🏰 ThreadMoat Site Review Tool")
    print(f"   Reviewing: {SITE_BASE}")
    print(f"   Open: http://localhost:5050")
    print(f"   Data: {DATA_FILE}")
    print(f"   Arrow keys ← → to navigate pages\n")
    app.run(port=5050, debug=True)
