# BlastRadius: Architectural Impact & Dependency Radar

**Built for Codegeist 2026**  
*Category:* **Apps for Software Teams** ($15,000)  
*Bonus Tracks Targeted:* **Best Atlassian MCP App ($1,500)**, **Best Agents (Rovo) ($1,500)**, **Best Teamwork Graph Integration ($1,500)**  
*Live Vercel Interactive Preview:* [https://frontend-sandy-mu-63.vercel.app](https://frontend-sandy-mu-63.vercel.app)  
*Atlassian Cloud Site:* [https://monudevdil0301.atlassian.net](https://monudevdil0301.atlassian.net)  
*GitHub Repo:* [https://github.com/monudevdil0301-ux/blast-radius](https://github.com/monudevdil0301-ux/blast-radius)

---

## 💡 Inspiration
Modern engineering teams deploy microservices faster than ever, but architectural context remains deeply fragmented. When an engineer opens a pull request or Jira ticket to refactor an authentication module or migrate database schemas, they almost never possess the full cross-departmental blast radius:
- Which downstream payment or checkout APIs depend on this token rotation?
- Which services suffered P1/P2 outages over the last 90 days when this component fluctuated?
- Are the Confluence rollback playbooks current, or did someone deprecate a critical step six months ago?

Catastrophic production outages don't happen because engineers are careless—they happen because **context is locked in silos**. We built **BlastRadius** to give software teams the contextual intelligence to ship with supreme confidence.

---

## 🚀 What BlastRadius Does

1. **Interactive Topology Canvas with Live Cascade Shockwave:**
   - Directly inside Jira issue views, BlastRadius queries Atlassian's **Teamwork Graph** and **Compass** component catalog.
   - Visually maps out Tier 0 (Target Service), Tier 1 (Direct Callers), and Tier 2 (Perimeter & Databases) with real-time risk color coding.
   - **Simulate Cascade Shockwave:** Watch an animated red shockwave ripple across caller nodes to see cascading failure paths in real time.

2. **Atlassian Model Context Protocol (MCP) Server:**
   - Exposes standardized Model Context Protocol (MCP) endpoints (`blastradius_inspect_dependencies`, `blastradius_simulate_failure`, `blastradius_scan_code_diff`, `blastradius_verify_preflight_clearance`).
   - Enables Claude Desktop, Cursor, and Atlassian Rovo to execute blast radius audits natively through standard tool calling.

3. **Git Code Diff & Breaking Contract Scanner:**
   - Parses unified git diffs from pull requests and cross-references Compass API signatures.
   - Flags breaking parameter alterations and schema modifications before build pipelines, identifying exact downstream consumer code lines (e.g. `billing-api/auth_middleware.go:42`).

4. **Change Advisory Board (CAB) Pre-Flight Deployment Clearance Gate:**
   - Aerospace-inspired pre-flight checklist verifying 5 critical gates (Compass health, incident recurrence, runbook freshness, regression coverage, owner sign-offs).
   - Generates a certified cryptographic clearance seal and stamps an official audit badge directly as a Jira issue comment.

5. **Autonomous Rovo Sentry (`@BlastRadius`):**
   - Registered as a native `rovo:agent` with custom `action:` tools.
   - Chat directly on Jira tickets or Rovo Chat:
     - *"What is the blast radius of this change?"*
     - *"Auto-generate Jira regression sub-tasks for affected downstream services."*
     - *"Draft an emergency rollback playbook in Confluence."*

6. **1-Click Executive Risk Briefing Exporter:**
   - Exports an audit-grade Markdown and Confluence-ready briefing for engineering leadership.

---

## 🛠️ Architecture & Tech Stack
- **Platform:** Atlassian Forge (Serverless Node.js 22.x runtime)
- **Manifest Modules:**
  - `jira:issuePanel` (Custom UI)
  - `rovo:agent` (`BlastRadius Sentry`)
  - `action:` (`analyze-blast-radius`, `generate-regression-tests`, `draft-rollback-runbook`)
  - `function` (Forge Resolvers with `@forge/api`)
- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Integrations:**
  - Model Context Protocol (MCP) JSON-RPC 2.0 Engine
  - Atlassian Teamwork Graph API
  - Atlassian Compass Component & Dependency Catalog
  - Jira Cloud REST API v3
  - Confluence Cloud REST API v2
