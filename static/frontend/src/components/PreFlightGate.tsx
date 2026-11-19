import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Stamp, RefreshCw, Award, ExternalLink } from 'lucide-react';
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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Change Advisory Board (CAB) Pre-Flight Clearance</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Aerospace-inspired pre-flight deployment gates ensuring zero unmitigated blast radius before release.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium">Gate Pass Rate</span>
            <div className="text-sm font-bold text-slate-800 font-mono">
              {passedCount} / {gates.length} Gates Passed
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono border-2 border-emerald-400">
            {Math.round((passedCount / gates.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Gates Checklist */}
      <div className="space-y-3">
        {gates.map((gate) => (
          <div
            key={gate.id}
            className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 ${
              gate.status === 'passed' ? 'bg-slate-50/60 border-slate-200' :
              gate.status === 'warning' ? 'bg-amber-50/50 border-amber-200' :
              'bg-rose-50/50 border-rose-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {gate.status === 'passed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {gate.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                {gate.status === 'failed' && <XCircle className="w-4 h-4 text-rose-600" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-800 text-xs">{gate.title}</h4>
                  <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                    {gate.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{gate.detail}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                gate.status === 'passed' ? 'bg-emerald-100 text-emerald-800' :
                gate.status === 'warning' ? 'bg-amber-100 text-amber-800' :
                'bg-rose-100 text-rose-800'
              }`}>
                {gate.status}
              </span>
              <span className="block text-[10px] text-slate-400 mt-1">Owner: {gate.owner}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Stamping Action Area */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-sm">Issue Certified Pre-Flight Release Clearance Seal</h4>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Authorizes production deployment and cryptographically stamps an official audit badge as a Jira issue comment.
          </p>
        </div>

        {sealResult ? (
          <div className="flex items-center gap-3 bg-emerald-500/20 border border-emerald-400/40 p-3 rounded-lg text-emerald-300 text-xs font-mono">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold block text-white">SEAL ISSUED: {sealResult.sealId}</span>
              <span className="text-[10px] text-emerald-300">Stamped onto Jira {sealResult.issueKey}</span>
            </div>
          </div>
        ) : (
          <button
            onClick={handleStampClearance}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> Stamping Jira Release Gate...
              </>
            ) : (
              <>
                <Stamp className="w-4 h-4 text-slate-950" /> Issue Release Clearance Seal
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
