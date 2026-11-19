import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Stamp, RefreshCw, Award, ExternalLink, Shield } from 'lucide-react';
import { invokeStampReleaseClearance } from '../bridge';
import { PreFlightGate, ClearanceSealResult } from '../types';

interface PreFlightGateProps {
  issueKey: string;
  riskScore: number;
}

export const PreFlightGatePanel: React.FC<PreFlightGateProps> = ({ issueKey, riskScore }) => {
  const [gates, setGates] = useState<PreFlightGate[]>([
    {
      id: 'gate-1',
      title: 'Compass Tier 1 Component Health Check',
      category: 'COMPASS',
      status: 'passed',
      detail: 'Root service Auth Token Service scores 78% (Tier 1 threshold is 75%).',
      owner: 'Platform SRE'
    },
    {
      id: 'gate-2',
      title: 'Downstream Incident Risk & Recurrence Audit',
      category: 'INCIDENT_HISTORY',
      status: 'warning',
      detail: 'billing-api suffered 2 P1 outages in the last 90 days. Mitigated via regression sub-tasks.',
      owner: 'FinTech Core'
    },
    {
      id: 'gate-3',
      title: 'Confluence Incident Runbook Freshness',
      category: 'CONFLUENCE_DOCS',
      status: 'passed',
      detail: 'Emergency Rollback Playbook drafted in Confluence space ENG with verified commands.',
      owner: 'Identity & Core Security'
    },
    {
      id: 'gate-4',
      title: 'Automated Regression Suite Verification',
      category: 'REGRESSION_COVERAGE',
      status: 'passed',
      detail: '3 linked Jira Sub-tasks assigned to billing-api, user-profile, and api-gateway.',
      owner: 'QA Automation'
    },
    {
      id: 'gate-5',
      title: 'Cross-Silo Change Advisory Board (CAB) Sign-off',
      category: 'OWNER_SIGNOFF',
      status: 'passed',
      detail: 'All 3 affected service owners notified and circuit-breaker threshold approved.',
      owner: 'Change Advisory Board'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [sealResult, setSealResult] = useState<ClearanceSealResult | null>(null);

  const passedCount = gates.filter(g => g.status === 'passed').length;
  const passRate = Math.round((passedCount / gates.length) * 100);

  const handleStampClearance = async () => {
    setLoading(true);
    try {
      const gateTitles = gates.map(g => `${g.title}: ${g.status.toUpperCase()}`);
      const res = await invokeStampReleaseClearance(issueKey, gateTitles, riskScore);
      setSealResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Change Advisory Board (CAB) Pre-Flight Clearance
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Aerospace-inspired pre-flight deployment gates ensuring zero unmitigated blast radius before release.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono" style={{ color: 'var(--text-muted)' }}>Gate Pass Rate</span>
            <div className="text-sm font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
              {passedCount} / {gates.length} Gates Clear
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs font-mono"
            style={{
              background: 'rgba(16,185,129,0.15)',
              border: '2px solid rgba(16,185,129,0.5)',
              color: '#34d399',
              boxShadow: '0 0 15px rgba(16,185,129,0.25)'
            }}>
            {passRate}%
          </div>
        </div>
      </div>

      {/* Gates Checklist */}
      <div className="space-y-3">
        {gates.map((gate) => {
          const isPassed = gate.status === 'passed';
          const isWarning = gate.status === 'warning';
          const borderColor = isPassed ? 'rgba(16,185,129,0.3)' : isWarning ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)';
          const bgColor = isPassed ? 'rgba(16,185,129,0.04)' : isWarning ? 'rgba(245,158,11,0.04)' : 'rgba(239,68,68,0.04)';

          return (
            <div
              key={gate.id}
              className="p-4 rounded-xl flex flex-wrap sm:flex-nowrap items-start justify-between gap-4 transition-all"
              style={{ background: bgColor, border: `1px solid ${borderColor}` }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  {gate.status === 'failed' && <XCircle className="w-4 h-4 text-red-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>{gate.title}</h4>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded badge-info font-bold">
                      {gate.category}
                    </span>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{gate.detail}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                  isPassed ? 'badge-safe' : isWarning ? 'badge-high' : 'badge-critical'
                }`}>
                  {gate.status}
                </span>
                <span className="block text-[10px] mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>
                  {gate.owner}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stamping Action Area */}
      <div className="p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(8,12,20,0.95), rgba(17,29,53,0.95))',
          border: '1px solid var(--border-glow)',
          boxShadow: '0 0 30px rgba(59,130,246,0.15)'
        }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}>
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Issue Certified Pre-Flight Release Clearance Seal
            </h4>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Authorizes production deployment and cryptographically stamps an official audit badge as a Jira issue comment.
            </p>
          </div>
        </div>

        {sealResult ? (
          <div className="flex items-center gap-3 p-3 rounded-xl text-xs font-mono animate-slide-up"
            style={{
              background: 'rgba(16,185,129,0.15)',
              border: '1px solid rgba(16,185,129,0.4)',
              color: '#34d399',
              boxShadow: '0 0 20px rgba(16,185,129,0.2)'
            }}>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold block text-white">SEAL ISSUED: {sealResult.sealId}</span>
              <span className="text-[10px] text-emerald-400">Stamped onto Jira {sealResult.issueKey}</span>
            </div>
          </div>
        ) : (
          <button
            onClick={handleStampClearance}
            disabled={loading}
            className="btn-primary py-2.5 px-5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition disabled:opacity-50 whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderColor: 'rgba(16,185,129,0.5)',
              boxShadow: '0 0 20px rgba(16,185,129,0.3)'
            }}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Stamping Jira Release Gate...
              </>
            ) : (
              <>
                <Stamp className="w-4 h-4" /> Issue Release Clearance Seal
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
