# BlastRadius — Video Demo Script (Under 5 Minutes)
**Target Hackathon:** Codegeist 2026 on Devpost  
**Presenter Tone:** Confident, crisp, developer-focused, showcasing context and action.

---

### [0:00 - 0:40] The Hook & The Problem
* **Visual:** Open a Jira issue: `AUTH-412: Refactor Token Validation & Key Rotation Pipeline`.
* **Audio:**
  > *"Every engineering team has experienced this nightmare: a developer refactors an internal authentication helper. The unit tests pass, the PR is merged, and within ten minutes, the entire production checkout engine goes down. Why? Because the payment gateway relied on a subtle token header format that wasn't documented in the ticket.*
  > 
  > *In modern distributed architectures, catastrophic outages don't happen because engineers write bad code. They happen because **architectural context is fragmented across Compass, Jira, and Confluence**. Today, we are introducing **BlastRadius**—the architectural impact and dependency radar built natively on Atlassian Forge for Codegeist 2026."*

---

### [0:40 - 1:45] The Core Experience: Live Blast Radius Radar
* **Visual:** Point to the **BlastRadius** panel embedded directly on the Jira ticket.
* **Audio:**
  > *"Right inside the Jira issue view, BlastRadius automatically taps into Atlassian's **Teamwork Graph** and **Compass** service catalog.*
  > 
  > *Look at the **Blast Radius Gauge**: this change is rated **84/100 — CRITICAL RISK**.
  > 
  > *In the interactive canvas, we see the complete 3-tier cascade:
  > - **Tier 0** is our change root: the Auth Service.
  > - **Tier 1** reveals direct callers: our Edge Gateway, Customer Profile, and most critically, the **Payment & Checkout Engine (billing-api)**.
  > - Notice the red warning badge: billing-api has suffered **2 P1 outages in the last 90 days** from previous auth regressions.
  > - Clicking on any node exposes team ownership, live Compass scores, and linked Confluence ADRs. And notice: our Confluence rollback runbook is marked stale—it hasn't been updated in over six months."*

---

### [1:45 - 2:30] Chaos & Cascading Failure Simulator
* **Visual:** Click the **Chaos Simulator** tab.
* **Audio:**
  > *"Before writing a single line of code, developers can simulate catastrophic cascade effects. Let's inject a 500ms synthetic latency spike into the Auth Service.
  > 
  > *Executing the simulation immediately reveals that the billing circuit breaker will trip, 87% of checkout traffic will degrade, and external Stripe webhooks will backlog over 14,000 requests. BlastRadius provides proactive resilience analysis before changes ever touch staging."*

---

### [2:30 - 3:30] Autonomous Rovo Sentry & 1-Click Governance
* **Visual:** Switch to the **Rovo Sentry** tab / chat console.
* **Audio:**
  > *"Now, here is what makes BlastRadius a true agentic winner. It doesn't just display warnings—it **takes action**.
  > 
  > *BlastRadius registers a native **Rovo Agent** (`@BlastRadius Sentry`) with custom Forge actions.
  > 
  > *Let's ask Rovo: 'Generate regression sub-tasks for affected downstream services.'
  > 
  > *In seconds, Rovo calls the Jira Cloud REST API, creating linked regression test sub-tasks for billing-api, user-profile-svc, and api-gateway, assigning them directly to the component owners.
  > 
  > *Next, we click 'Draft Confluence Runbook.' BlastRadius connects to Confluence, generating a pre-populated emergency rollback playbook with verified kubectl rollout undo commands and cache flush procedures."*

---

### [3:30 - 4:00] Conclusion & Why It Wins
* **Visual:** Show the complete dashboard with all mitigation badges turned green.
* **Audio:**
  > *"BlastRadius bridges Atlassian's entire System of Work: Jira for issue tracking, Compass for component ownership, Confluence for institutional knowledge, and Rovo for autonomous remediation.
  > 
  > *With BlastRadius, software teams finally have the context to **build with context and ship with confidence**.
  > 
  > *Thank you!"*
