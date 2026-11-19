import React, { useState, useEffect } from 'react';
import {
  Flame, ShieldAlert, Activity, Bot, RefreshCw, Layers,
  CheckCircle2, Terminal, Info, GitPullRequest, ShieldCheck,
  FileDown, Zap, Cpu
} from 'lucide-react';
import { fetchBlastRadiusData } from './bridge';
import { BlastRadiusAnalysis, ServiceDependency } from './types';
import { RiskGauge } from './components/RiskGauge';
import { BlastRadiusCanvas } from './components/BlastRadiusCanvas';
import { FailureSimulator } from './components/FailureSimulator';
import { ActionConsole } from './components/ActionConsole';
import { RovoChatDrawer } from './components/RovoChatDrawer';
import { CodeDiffScanner } from './components/CodeDiffScanner';
import { PreFlightGatePanel } from './components/PreFlightGate';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';

type TabId = 'graph' | 'diff' | 'preflight' | 'chaos' | 'rovo' | 'audit';

const TABS: { id: TabId; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'graph',    label: 'Radar',           icon: <Layers className="w-3.5 h-3.5" />,     color: 'text-blue-400' },
  { id: 'diff',     label: 'Diff Scanner',    icon: <GitPullRequest className="w-3.5 h-3.5" />, color: 'text-indigo-400' },
  { id: 'preflight',label: 'Pre-Flight CAB',  icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'text-emerald-400' },
  { id: 'chaos',    label: 'Chaos Sim',       icon: <Activity className="w-3.5 h-3.5" />,   color: 'text-rose-400' },
  { id: 'rovo',     label: 'Rovo Sentry',     icon: <Bot className="w-3.5 h-3.5" />,        color: 'text-purple-400' },
  { id: 'audit',    label: 'Risk Factors',    icon: <ShieldAlert className="w-3.5 h-3.5" />, color: 'text-amber-400' },
];

export function App() {
  const [currentIssue, setCurrentIssue] = useState<string>('AUTH-412');
  const [analysis, setAnalysis] = useState<BlastRadiusAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabId>('graph');
  const [selectedService, setSelectedService] = useState<ServiceDependency | null>(null);
  const [simTarget, setSimTarget] = useState<string>('auth-service');
  const [showExecutiveModal, setShowExecutiveModal] = useState<boolean>(false);
  const [liveTime, setLiveTime] = useState(new Date());

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

  useEffect(() => { loadData(currentIssue); }, [currentIssue]);
  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleSimulateNode = (serviceId: string) => {
    setSimTarget(serviceId);
    setActiveTab('chaos');
  };

  /* ── LOADING SCREEN ─────────────────────────── */
  if (loading || !analysis) {
    return (
      <div className="min-h-screen grid-bg flex flex-col items-center justify-center p-6" style={{ background: 'var(--bg-base)' }}>
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-glow-pulse"
            style={{ background: 'linear-gradient(135deg,#ef4444,#f59e0b)', boxShadow: '0 0 40px rgba(239,68,68,0.5)' }}>
            <Flame className="w-8 h-8 text-white animate-float" />
          </div>
        </div>
        <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
          BlastRadius Radar
        </h3>
        <div className="flex items-center gap-2 mt-3" style={{ color: 'var(--text-secondary)' }}>
          <RefreshCw className="w-4 h-4 animate-spin" style={{ color: 'var(--accent-blue)' }} />
          <span className="text-sm font-mono">Querying Teamwork Graph & Compass Catalog...</span>
        </div>
        <p className="text-xs mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>
          Analyzing cyclomatic dependencies for {currentIssue}
        </p>
      </div>
    );
  }

  const riskColor = analysis.riskTier === 'CRITICAL' ? 'var(--accent-red)' :
                    analysis.riskTier === 'HIGH'     ? 'var(--accent-amber)' : 'var(--accent-green)';

  return (
    <div className="min-h-screen grid-bg" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* ── HEADER ────────────────────────────────────── */}
      <header className="sticky top-0 z-30" style={{
        background: 'rgba(8,12,20,0.85)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(20px)',
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white animate-glow-pulse"
              style={{ background: 'linear-gradient(135deg,#ef4444,#f59e0b)', boxShadow: '0 0 20px rgba(239,68,68,0.4)' }}>
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base tracking-tight text-glow-blue" style={{ color: 'var(--text-primary)' }}>
                  BlastRadius
                </h1>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full badge-critical">
                  Codegeist 2026
                </span>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full badge-info font-mono">
                  MCP ✓
                </span>
              </div>
              <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                Architectural Impact & Dependency Radar
              </p>
            </div>
          </div>

          {/* Live Clock + Issue Selector */}
          <div className="flex items-center gap-2">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold" style={{ color: '#34d399' }}>LIVE</span>
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                {liveTime.toLocaleTimeString('en-US', { hour12: false })}
              </span>
            </div>

            {/* Issue Selector */}
            <div className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
              <span className="text-[10px] font-mono pl-1" style={{ color: 'var(--text-muted)' }}>Issue</span>
              <select
                value={currentIssue}
                onChange={(e) => setCurrentIssue(e.target.value)}
                className="dark-input text-[11px] font-mono font-bold rounded px-2 py-0.5"
                style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
              >
                <option value="AUTH-412">AUTH-412 · Token Validation · CRITICAL</option>
                <option value="PAY-892">PAY-892 · Stripe Webhook v3 · HIGH</option>
              </select>
              <button
                onClick={() => loadData(currentIssue)}
                title="Refresh"
                className="p-1 rounded btn-ghost"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* Export */}
            <button
              onClick={() => setShowExecutiveModal(true)}
              className="btn-primary px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5" /> Audit Report
            </button>
          </div>

        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-0 flex items-center gap-1 overflow-x-auto"
          style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive ? `${tab.color} tab-active-indicator` : 'hover:opacity-80'
                }`}
                style={{ color: isActive ? undefined : 'var(--text-muted)' }}
              >
                {tab.icon}
                {tab.label}
                {tab.id === 'audit' && (
                  <span className="ml-0.5 text-[9px] badge-high px-1.5 py-0.5 rounded-full font-mono">
                    {analysis.riskFactors.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── ISSUE CONTEXT BANNER ────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
        <div className="glass-card-elevated p-4 flex flex-wrap items-center justify-between gap-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-xs px-2.5 py-1 rounded badge-info">
              {analysis.issueKey}
            </span>
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{analysis.issueSummary}</h2>
              <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Root: <span style={{ color: 'var(--accent-blue)' }}>{analysis.rootService.name}</span>
                {' · '}Owner: <span style={{ color: 'var(--text-secondary)' }}>{analysis.rootService.ownerTeam}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Blast Assessment</div>
              <div className="font-black font-mono text-sm" style={{ color: riskColor, textShadow: `0 0 12px ${riskColor}` }}>
                {analysis.riskTier} · {analysis.riskScore}/100
              </div>
            </div>
            <div className="w-px h-8" style={{ background: 'var(--border-subtle)' }} />
            <Cpu className="w-5 h-5" style={{ color: riskColor, opacity: 0.8 }} />
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5">

        {/* Risk Gauge always visible */}
        <RiskGauge analysis={analysis} />

        {/* Dynamic Tab Views */}
        {activeTab === 'graph' && (
          <div className="space-y-5 animate-slide-up">
            <BlastRadiusCanvas
              analysis={analysis}
              onSelectService={setSelectedService}
              selectedService={selectedService}
              onSimulateNode={handleSimulateNode}
            />
            <ActionConsole analysis={analysis} />
          </div>
        )}

        {activeTab === 'diff' && (
          <div className="animate-slide-up">
            <CodeDiffScanner issueKey={analysis.issueKey} />
          </div>
        )}

        {activeTab === 'preflight' && (
          <div className="animate-slide-up">
            <PreFlightGatePanel issueKey={analysis.issueKey} riskScore={analysis.riskScore} />
          </div>
        )}

        {activeTab === 'chaos' && (
          <div className="space-y-5 animate-slide-up">
            <FailureSimulator initialServiceId={simTarget} />
            <ActionConsole analysis={analysis} />
          </div>
        )}

        {activeTab === 'rovo' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-slide-up">
            <div className="lg:col-span-2">
              <RovoChatDrawer
                analysis={analysis}
                onTriggerSubtasks={() => {}}
                onTriggerRunbook={() => {}}
              />
            </div>
            <div className="space-y-4">
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase mb-3" style={{ color: 'var(--accent-blue)' }}>
                  <Terminal className="w-4 h-4" /> MCP Tool Manifest
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'blastradius_inspect_dependencies', desc: 'Multi-tier Teamwork Graph inspection' },
                    { name: 'blastradius_simulate_failure', desc: 'Synthetic cascade failure modeling' },
                    { name: 'blastradius_verify_preflight_clearance', desc: 'Automated CAB clearance seals' },
                  ].map((tool) => (
                    <div key={tool.name} className="p-2.5 rounded-lg" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}>
                      <div className="text-[11px] font-mono font-bold" style={{ color: 'var(--accent-cyan)' }}>{tool.name}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{tool.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-4" style={{ borderColor: 'rgba(139,92,246,0.3)' }}>
                <div className="flex items-center gap-2 font-bold text-xs mb-2" style={{ color: 'var(--accent-purple)' }}>
                  <Zap className="w-4 h-4" /> Codegeist Bonus Tracks
                </div>
                <div className="space-y-1.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  {['Best Agents ($1,500)', 'Best Atlassian MCP App ($1,500)', 'Best Teamwork Graph Integration ($1,500)'].map(t => (
                    <div key={t} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--accent-green)' }} />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-2 font-bold text-xs mb-2" style={{ color: 'var(--accent-amber)' }}>
                  <Info className="w-4 h-4" /> Registered as
                </div>
                <div className="space-y-1 font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  <div>· <span style={{ color: 'var(--accent-blue)' }}>rovo:agent</span> → BlastRadius Sentry</div>
                  <div>· <span style={{ color: 'var(--accent-cyan)' }}>mcp:server</span> → Forge MCP Handler</div>
                  <div>· <span style={{ color: 'var(--accent-green)' }}>jira:globalPage</span> → BlastRadius Radar</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="glass-card p-6 space-y-6 animate-slide-up">
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Detailed Risk Factor Breakdown</h3>
              <button
                onClick={() => setShowExecutiveModal(true)}
                className="btn-ghost px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5" /> Executive Briefing
              </button>
            </div>

            <div className="space-y-3">
              {analysis.riskFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl transition-all"
                  style={{
                    background: factor.severity === 'critical' ? 'rgba(239,68,68,0.06)' :
                                factor.severity === 'high'     ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${
                      factor.severity === 'critical' ? 'rgba(239,68,68,0.3)' :
                      factor.severity === 'high'     ? 'rgba(245,158,11,0.3)' : 'var(--border-subtle)'
                    }`
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{factor.title}</h4>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                      factor.severity === 'critical' ? 'badge-critical' :
                      factor.severity === 'high'     ? 'badge-high' : 'badge-info'
                    }`}>
                      {factor.severity}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{factor.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <h4 className="font-bold text-xs uppercase mb-3" style={{ color: 'var(--accent-blue)' }}>Automated Policy Recommendations</h4>
              <ul className="space-y-2">
                {analysis.recommendedActions.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--accent-green)' }} />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </main>

      {/* Executive Report Modal */}
      {showExecutiveModal && (
        <ExecutiveReportModal
          analysis={analysis}
          onClose={() => setShowExecutiveModal(false)}
        />
      )}
    </div>
  );
}
export default App;
