# BlastRadius: Architectural Impact & Dependency Radar

**Built for Codegeist 2026**  
*Track: Apps for Software Teams*  
*Bonus Track Target: Best Agents (Rovo) & Best Teamwork Graph Integration*

---

## 💡 Inspiration
Modern engineering teams deploy microservices faster than ever, but architectural context remains deeply fragmented. When an engineer opens a pull request or Jira ticket to refactor an authentication module or migrate database schemas, they almost never possess the full cross-departmental blast radius:
- Which downstream payment or checkout APIs depend on this token rotation?
- Which services suffered P1/P2 outages over the last 90 days when this component fluctuated?
- Are the Confluence rollback playbooks current, or did someone deprecate a critical step six months ago?

Catastrophic production outages don't happen because engineers are careless—they happen because **context is locked in silos**. We built **BlastRadius** to give software teams the contextual intelligence to ship with supreme confidence.

---

## 🚀 What BlastRadius Does
BlastRadius is a next-generation architectural impact sentry built natively on **Atlassian Forge**, integrating **Jira**, **Compass**, **Confluence**, and **Rovo**:

1. **Interactive Blast Radius Canvas (Forge Custom UI):**
   - Directly inside Jira issue views, BlastRadius queries Atlassian's **Teamwork Graph** and Compass component catalog.
   - Visually maps out Tier 0 (Target Service), Tier 1 (Direct Callers), and Tier 2 (Perimeter & Databases) with real-time risk color coding.
   - Displays real-time Compass health scores, SLA thresholds, latency metrics, and P1 incident history badges.

2. **Weighted Bayesian Risk Gauge:**
   - Quantifies deployment risk from 0 to 100 based on downstream consumer criticality, historical incident frequency, and Confluence documentation freshness.
   - Automatically classifies changes into **SAFE**, **ELEVATED**, **HIGH**, or **CRITICAL** deployment risk tiers.

3. **Chaos & Cascading Failure Simulator:**
   - Allows developers and SREs to simulate synthetic failure modes (e.g., 500ms latency spikes, 401 unhandled token rotation rejections, Redis connection pool exhaustion) to visually observe downstream degradation before touching staging.

4. **Autonomous Rovo Sentry (`@BlastRadius`):**
   - Registered as a native `rovo:agent` with custom `rovo:action` tools.
   - Chat directly on Jira tickets or Rovo Chat:
     - *"What is the blast radius of this change?"*
     - *"Auto-generate Jira regression sub-tasks for affected downstream services."*
     - *"Draft an emergency rollback playbook in Confluence."*

5. **1-Click Governance & Mitigation:**
   - **Auto-Generate Jira Regression Tests:** Dispatches linked Sub-tasks directly to Jira for affected downstream teams.
   - **Publish Confluence Rollback Runbook:** Autonomously drafts an audit-ready playbook populated with verified rollback CLI commands and escalation contacts.
   - **Broadcast Dependency Alerts:** Proactively notifies component owners across Jira and Slack.

---

## 🛠️ Architecture & Tech Stack
- **Platform:** Atlassian Forge (Serverless Node.js / TypeScript runtime)
- **Manifest Modules:**
  - `jira:issuePanel` (Custom UI)
  - `rovo:agent` (Autonomous Rovo Agent)
  - `rovo:action` (`analyze-blast-radius`, `generate-regression-tests`, `draft-rollback-runbook`)
  - `function` (Forge Resolvers with `@forge/api`)
- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Data Integrations:**
  - Atlassian Teamwork Graph API
  - Atlassian Compass Component & Dependency Catalog
  - Jira Cloud REST API v3
  - Confluence Cloud REST API v2

---

## 🏆 How It Fulfills Codegeist 2026 Criteria
- **Build with Context. Ship with Confidence:** Translates invisible, distributed microservice dependencies into an actionable, visual radar right where developers work.
- **Action-Oriented Agents:** BlastRadius doesn't stop at passive warnings—it takes concrete action by creating linked Jira issues and Confluence runbooks.
- **Enterprise-Ready Polish:** Runs seamlessly in Jira Cloud iframe environments and provides zero-configuration fallback simulations for testing.
