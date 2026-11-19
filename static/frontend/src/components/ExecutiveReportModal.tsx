import React, { useState } from 'react';
import { FileText, Download, Copy, Check, Printer, X, ShieldAlert } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-sm">Executive Architectural Risk Briefing</h3>
              <p className="text-[11px] text-slate-300">CAB & VP of Engineering Audit Export ({analysis.issueKey})</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Content Preview */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50 font-mono text-xs text-slate-800 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs whitespace-pre-wrap leading-relaxed">
            {reportMarkdown}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 font-mono">
            Format: GitHub-Flavored Markdown & Confluence Storage Format
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Markdown
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" /> Download .MD Report
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
