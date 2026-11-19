import React, { useState, useEffect } from 'react';
import { Flame, ShieldAlert, Activity, Bot, RefreshCw, Layers, CheckCircle2, ChevronRight, Terminal, Info } from 'lucide-react';
import { fetchBlastRadiusData } from './bridge';
import { BlastRadiusAnalysis, ServiceDependency } from './types';
import { RiskGauge } from './components/RiskGauge';
import { BlastRadiusCanvas } from './components/BlastRadiusCanvas';
import { FailureSimulator } from './components/FailureSimulator';
import { ActionConsole } from './components/ActionConsole';
import { RovoChatDrawer } from './components/RovoChatDrawer';

export function App() {
  const [currentIssue, setCurrentIssue] = useState<string>('AUTH-412');
  const [analysis, setAnalysis] = useState<BlastRadiusAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'graph' | 'chaos' | 'rovo' | 'audit'>('graph');
  const [selectedService, setSelectedService] = useState<ServiceDependency | null>(null);
  const [simTarget, setSimTarget] = useState<string>('auth-service');

  const loadData = async (issueKey: string) => {
    setLoading(true);
    try {
      const data = await fetchBlastRadiusData(issueKey);
      setAnalysis(data);
      setSelectedService(data.rootService);
      setSimTarget(data.rootService.id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentIssue);
  }, [currentIssue]);

  const handleSimulateNode = (serviceId: string) => {
    setSimTarget(serviceId);
    setActiveTab('chaos');
  };

  if (loading || !analysis) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-600">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <h3 className="font-semibold text-slate-800 text-sm">Querying Teamwork Graph & Compass Catalog...</h3>
        <p className="text-xs text-slate-400 mt-1">Analyzing cyclomatic service dependencies for {currentIssue}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-[#172B4D]">
      {/* Top Navigation & Context Banner */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 via-red-600 to-amber-600 flex items-center justify-center text-white shadow-sm">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-base tracking-tight">BlastRadius</h1>
                <span className="text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                  Codegeist 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Architectural Impact & Dependency Radar</p>
            </div>
          </div>

          {/* Active Jira Issue Selector (Demo Mode) */}
          <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 pl-2">Inspecting Issue:</span>
            <select
              value={currentIssue}
              onChange={(e) => setCurrentIssue(e.target.value)}
              className="text-xs font-mono font-bold bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="AUTH-412">AUTH-412: Refactor Token Validation (Critical)</option>
              <option value="PAY-892">PAY-892: Stripe Webhook v3 Upgrade (Elevated)</option>
            </select>
            <button
              onClick={() => loadData(currentIssue)}
              title="Refresh Graph"
              className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('graph')}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                activeTab === 'graph' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Dependency Radar
            </button>
            <button
              onClick={() => setActiveTab('chaos')}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                activeTab === 'chaos' ? 'bg-white text-rose-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Chaos Simulator
            </button>
            <button
              onClick={() => setActiveTab('rovo')}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                activeTab === 'rovo' ? 'bg-white text-indigo-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5" /> Rovo Sentry
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                activeTab === 'audit' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Risk Factors ({analysis.riskFactors.length})
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Issue Banner Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded border border-blue-200">
              {analysis.issueKey}
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{analysis.issueSummary}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Component: <span className="font-mono font-medium text-slate-700">{analysis.rootService.name}</span> &bull; Owner: <span className="text-slate-700">{analysis.rootService.ownerTeam}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Blast Radius Assessment:</span>
            <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-md ${
              analysis.riskTier === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-200' :
              analysis.riskTier === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
              'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              {analysis.riskTier} RISK &bull; {analysis.riskScore}/100
            </span>
          </div>
        </div>

        {/* Hero Risk Gauge & Stats */}
        <RiskGauge analysis={analysis} />

        {/* Dynamic Tab Views */}
        {activeTab === 'graph' && (
          <div className="space-y-6">
            <BlastRadiusCanvas
              analysis={analysis}
              onSelectService={setSelectedService}
              selectedService={selectedService}
              onSimulateNode={handleSimulateNode}
            />
            <ActionConsole analysis={analysis} />
          </div>
        )}

        {activeTab === 'chaos' && (
          <div className="space-y-6">
            <FailureSimulator initialServiceId={simTarget} />
            <ActionConsole analysis={analysis} />
          </div>
        )}

        {activeTab === 'rovo' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RovoChatDrawer
                analysis={analysis}
                onTriggerSubtasks={() => {}}
                onTriggerRunbook={() => {}}
              />
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase mb-2">
                  <Terminal className="w-4 h-4 text-blue-600" /> Rovo Tooling Manifest
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  BlastRadius Sentry is registered as a native <code>rovo:agent</code> with three assignable <code>rovo:action</code> tools in Forge:
                </p>
                <ul className="mt-2.5 space-y-2 text-xs font-mono text-slate-700">
                  <li className="bg-slate-50 p-2 rounded border border-slate-100">
                    <strong className="text-blue-700">analyze_blast_radius</strong>
                    <div className="text-[11px] text-slate-500">Traverses Teamwork Graph dependencies</div>
                  </li>
                  <li className="bg-slate-50 p-2 rounded border border-slate-100">
                    <strong className="text-blue-700">generate_regression_tests</strong>
                    <div className="text-[11px] text-slate-500">Dispatches Jira sub-tasks via REST API</div>
                  </li>
                  <li className="bg-slate-50 p-2 rounded border border-slate-100">
                    <strong className="text-blue-700">draft_rollback_runbook</strong>
                    <div className="text-[11px] text-slate-500">Creates Confluence markdown playbook</div>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <Info className="w-4 h-4 text-blue-700" />
                  Codegeist Bonus Track: Best Agents
                </div>
                <p className="leading-relaxed">
                  Judges can interact directly with <code>@BlastRadius Sentry</code> in Jira issue comments or Rovo Chat to execute multi-step architectural safety workflows without leaving their discussion context.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Detailed Risk Factor Breakdown</h3>
              <span className="text-xs text-slate-500 font-mono">Weighted Bayesian Risk Model</span>
            </div>

            <div className="space-y-4">
              {analysis.riskFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    factor.severity === 'critical' ? 'bg-red-50/50 border-red-200' :
                    factor.severity === 'high' ? 'bg-amber-50/50 border-amber-200' :
                    'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-bold text-slate-800 text-sm">{factor.title}</h4>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      factor.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      factor.severity === 'high' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {factor.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{factor.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-800 text-xs uppercase mb-2">Automated Policy Recommendations</h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {analysis.recommendedActions.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
export default App;
