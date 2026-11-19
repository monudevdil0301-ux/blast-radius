import React, { useState } from 'react';
import { FileText, Download, Copy, Check, Printer, X, ShieldAlert, Terminal } from 'lucide-react';
import { BlastRadiusAnalysis } from '../types';

interface ExecutiveReportModalProps {
  analysis: BlastRadiusAnalysis;
  onClose: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({ analysis, onClose }) => {
  const [copied, setCopied] = useState(false);

  const reportMarkdown = `# ARCHITECTURAL BLAST RADIUS & RISK AUDIT BRIEFING
**Document Reference:** BR-AUDIT-${analysis.issueKey}-${new Date().toISOString().split('T')[0]}  
**Target Jira Issue:** ${analysis.issueKey} — ${analysis.issueSummary}  
**Assessing Platform:** BlastRadius Sentry (Atlassian Forge & Compass)  
**Classification:** Internal Change Advisory Board (CAB) Confidential  

---

## 1. Executive Summary
- **Overall Blast Radius Risk Score:** **${analysis.riskScore} / 100 (${analysis.riskTier})**
- **Root Microservice:** ${analysis.rootService.name} (\`${analysis.rootService.id}\`)
- **Total Impacted Microservices:** ${analysis.totalServicesImpacted} services across 2 architectural tiers.
- **Recent Downstream P1 Outages (90d):** ${analysis.recentIncidentsFound} recorded incidents.
- **Documentation Gaps:** ${analysis.missingRunbooksCount} downstream services lack current Confluence runbooks.

---

## 2. Architectural Impact Breakdown

### Tier 0 (Target of Code Change)
- **Service:** ${analysis.rootService.name} (Owner: ${analysis.rootService.ownerTeam})
- **Compass Health Score:** ${analysis.rootService.compassScore}% | **SLA:** ${analysis.rootService.sla}
- **Direct Downstream Callers:** ${analysis.rootService.dependencies.join(', ')}

### Tier 1 (Direct Consumer Dependencies)
${analysis.impactedServices
  .filter(s => s.tier === 1)
  .map(
    s => `- **${s.name}** (\`${s.id}\`) — Owner: ${s.ownerTeam} | Compass: ${s.compassScore}% | P1 Outages: ${s.p1IncidentsLast90Days}`
  )
  .join('\n')}

### Tier 2 (Perimeter Databases & Gateways)
${analysis.impactedServices
  .filter(s => s.tier === 2)
  .map(
    s => `- **${s.name}** (\`${s.id}\`) — Owner: ${s.ownerTeam} | SLA: ${s.sla}`
  )
  .join('\n')}

---

## 3. High-Risk Collateral & Vulnerabilities
${analysis.riskFactors.map(rf => `### ${rf.title} [${rf.severity.toUpperCase()}]\n${rf.description}`).join('\n\n')}

---

## 4. Governance & Mitigation Checklist
${analysis.recommendedActions.map(rec => `- [x] ${rec}`).join('\n')}

---
*Certified by BlastRadius Sentry via Atlassian Teamwork Graph on ${new Date().toLocaleString()}*`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([reportMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BlastRadius-Audit-${analysis.issueKey}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(4,6,10,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="glass-card-elevated max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-slide-up"
        style={{ boxShadow: '0 0 50px rgba(0,0,0,0.8), 0 0 30px rgba(59,130,246,0.2)' }}>
        
        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ background: 'rgba(8,12,20,0.95)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: 'var(--accent-blue)' }}>
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                Executive Architectural Risk Briefing
              </h3>
              <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                CAB & VP of Engineering Audit Export ({analysis.issueKey})
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg btn-ghost"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Report Content Preview */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4"
          style={{ background: 'rgba(8,12,20,0.6)' }}>
          <div className="p-5 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed"
            style={{
              background: 'rgba(13,21,38,0.8)',
              border: '1px solid var(--border-subtle)',
              color: '#93c5fd'
            }}>
            {reportMarkdown}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 flex items-center justify-between gap-3"
          style={{ background: 'rgba(8,12,20,0.95)', borderTop: '1px solid var(--border-subtle)' }}>
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
            Markdown & Confluence Format
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="btn-ghost px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Markdown
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="btn-primary px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download .MD Report
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
