import React, { useState } from 'react';
import { Server, Database, Radio, Globe, Layers, AlertCircle, Shield, ExternalLink, Zap, ZoomIn, ZoomOut, RotateCcw, Activity } from 'lucide-react';
import { ServiceDependency, BlastRadiusAnalysis } from '../types';

interface BlastRadiusCanvasProps {
  analysis: BlastRadiusAnalysis;
  onSelectService: (service: ServiceDependency) => void;
  selectedService: ServiceDependency | null;
  onSimulateNode: (serviceId: string) => void;
}

export const BlastRadiusCanvas: React.FC<BlastRadiusCanvasProps> = ({
  analysis,
  onSelectService,
  selectedService,
  onSimulateNode
}) => {
  const [filter, setFilter] = useState<'all' | 'incident-prone' | 'at-risk'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [shockwaveActive, setShockwaveActive] = useState<boolean>(false);
  const [shockwaveStage, setShockwaveStage] = useState<number>(0);

  const root = analysis.rootService;
  const tier1 = analysis.impactedServices.filter(s => s.tier === 1);
  const tier2 = analysis.impactedServices.filter(s => s.tier === 2);

  const getServiceIcon = (type: ServiceDependency['type']) => {
    switch (type) {
      case 'database':      return <Database className="w-4 h-4" style={{ color: 'var(--accent-purple)' }} />;
      case 'gateway':       return <Globe className="w-4 h-4" style={{ color: 'var(--accent-cyan)' }} />;
      case 'message-broker':return <Radio className="w-4 h-4" style={{ color: 'var(--accent-green)' }} />;
      case 'third-party':   return <Layers className="w-4 h-4" style={{ color: 'var(--accent-amber)' }} />;
      default:              return <Server className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />;
    }
  };

  const getStatusBadge = (status: ServiceDependency['status']) => {
    switch (status) {
      case 'incident-prone':
        return <span className="badge-critical text-[9px] font-black px-1.5 py-0.5 rounded">P1 Hotspot</span>;
      case 'at-risk':
        return <span className="badge-high text-[9px] font-black px-1.5 py-0.5 rounded">At Risk</span>;
      default:
        return <span className="badge-safe text-[9px] font-bold px-1.5 py-0.5 rounded">Healthy</span>;
    }
  };

  const getNodeBorderStyle = (svc: ServiceDependency, shockStage: number, minStage: number, isSelected: boolean) => {
    if (shockStage >= minStage && svc.status === 'incident-prone') {
      return { border: '2px solid #ef4444', boxShadow: '0 0 24px rgba(239,68,68,0.6)', background: 'rgba(239,68,68,0.08)' };
    }
    if (shockStage >= minStage) {
      return { border: '2px solid #f59e0b', boxShadow: '0 0 16px rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.06)' };
    }
    if (isSelected) {
      return { border: '2px solid var(--accent-blue)', boxShadow: 'var(--glow-blue)', background: 'rgba(59,130,246,0.08)' };
    }
    if (svc.status === 'incident-prone') {
      return { border: '1px solid rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.04)' };
    }
    if (svc.status === 'at-risk') {
      return { border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.04)' };
    }
    return { border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' };
  };

  const filteredTier1 = tier1.filter(s => filter === 'all' || s.status === filter);
  const filteredTier2 = tier2.filter(s => filter === 'all' || s.status === filter);

  const triggerShockwave = () => {
    setShockwaveActive(true);
    setShockwaveStage(1);
    setTimeout(() => setShockwaveStage(2), 600);
    setTimeout(() => setShockwaveStage(3), 1300);
    setTimeout(() => { setShockwaveActive(false); setShockwaveStage(0); }, 4500);
  };

  return (
    <div className="glass-card overflow-hidden flex flex-col">
      {/* Canvas Header */}
      <div className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3"
        style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
            <span className="relative w-2 h-2 rounded-full bg-blue-500 inline-block" />
          </div>
          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            Live Blast Radius Architecture Graph
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded badge-info">
            Compass & Teamwork Graph
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Shockwave */}
          <button
            onClick={triggerShockwave}
            disabled={shockwaveActive}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              shockwaveActive ? 'btn-danger animate-pulse' : 'btn-danger'
            }`}
            style={!shockwaveActive ? { opacity: 0.85 } : {}}
          >
            <Activity className="w-3.5 h-3.5" />
            {shockwaveActive ? 'Propagating Outage...' : 'Simulate Cascade Shockwave'}
          </button>

          {/* Zoom */}
          <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
            <button onClick={() => setZoomLevel(p => Math.max(0.75, p - 0.1))} className="btn-ghost p-1.5 border-0 rounded-none">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-2" style={{ color: 'var(--text-secondary)' }}>
              {Math.round(zoomLevel * 100)}%
            </span>
            <button onClick={() => setZoomLevel(p => Math.min(1.25, p + 0.1))} className="btn-ghost p-1.5 border-0 rounded-none">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setZoomLevel(1)} className="btn-ghost p-1.5 border-0 rounded-none">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1 text-xs">
            {(['all', 'incident-prone'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-2.5 py-1 rounded-lg font-semibold transition text-[11px]"
                style={filter === f
                  ? { background: f === 'all' ? 'var(--accent-blue)' : '#ef4444', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }
                }
              >
                {f === 'all' ? `All (${analysis.impactedServices.length + 1})` : 'P1 Hotspots'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Graph Area */}
      <div className="p-6 overflow-x-auto min-h-[480px] relative" style={{ background: 'rgba(8,12,20,0.4)' }}>
        {/* Grid background */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        <div
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', transition: 'transform 0.3s ease' }}
          className="min-w-[800px] grid grid-cols-3 gap-8 relative"
        >

          {/* ── TIER 0: Root Service ── */}
          <div className="flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-2 mb-4" style={{ borderBottom: '1px solid rgba(59,130,246,0.3)' }}>
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--accent-blue)' }}>
                Tier 0 · Target Service
              </span>
              <span className="text-[9px] badge-info px-2 py-0.5 rounded font-mono font-bold">Change Root</span>
            </div>

            <div
              onClick={() => onSelectService(root)}
              className="w-full relative cursor-pointer rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]"
              style={shockwaveStage >= 1
                ? { border: '2px solid #ef4444', boxShadow: '0 0 32px rgba(239,68,68,0.7)', background: 'rgba(239,68,68,0.1)', transform: 'scale(1.02)' }
                : selectedService?.id === root.id
                ? { border: '2px solid var(--accent-blue)', boxShadow: 'var(--glow-blue)', background: 'rgba(59,130,246,0.08)' }
                : { border: '2px solid rgba(59,130,246,0.4)', background: 'rgba(59,130,246,0.04)' }
              }
            >
              {/* Live pulse */}
              <div className="absolute -top-2 -right-2">
                <span className="absolute animate-ping inline-flex h-4 w-4 rounded-full opacity-75" style={{ background: 'var(--accent-blue)' }} />
                <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: 'var(--accent-blue)' }} />
              </div>

              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 rounded-lg" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
                  {getServiceIcon(root.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{root.name}</h4>
                  <p className="text-[10px] font-mono truncate" style={{ color: 'var(--text-muted)' }}>{root.id}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Team</span>
                  <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{root.ownerTeam}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Compass Score</span>
                  <span className="font-bold font-mono" style={{ color: 'var(--accent-green)' }}>{root.compassScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>SLA</span>
                  <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{root.sla}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 flex items-center justify-between text-[11px]" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <span className="flex items-center gap-1 font-semibold" style={{ color: 'var(--accent-cyan)' }}>
                  <Zap className="w-3.5 h-3.5" /> 4 Direct Callers
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); onSimulateNode(root.id); }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold btn-ghost"
                >
                  Simulate ⚡
                </button>
              </div>

              {shockwaveStage >= 1 && (
                <div className="mt-2 text-center font-mono text-[10px] py-1.5 rounded-lg font-black animate-pulse"
                  style={{ background: 'rgba(239,68,68,0.3)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.5)' }}>
                  ⚠ INJECTED FAILURE: 500ms LATENCY
                </div>
              )}
            </div>

            <div className="mt-4 text-center text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)', maxWidth: '200px' }}>
              Every commit attached to <span className="font-mono font-bold" style={{ color: 'var(--accent-blue)' }}>{analysis.issueKey}</span> routes through this node.
            </div>
          </div>

          {/* ── TIER 1: Direct Callers ── */}
          <div className="flex flex-col">
            <div className="w-full flex items-center justify-between pb-2 mb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Tier 1 · Direct Callers</span>
              <span className="text-[9px] badge-info px-2 py-0.5 rounded font-mono font-bold">{filteredTier1.length} Services</span>
            </div>

            <div className="space-y-2.5">
              {filteredTier1.map((svc) => (
                <div
                  key={svc.id}
                  onClick={() => onSelectService(svc)}
                  className="cursor-pointer rounded-xl p-3 transition-all duration-300 hover:scale-[1.01]"
                  style={getNodeBorderStyle(svc, shockwaveStage, 2, selectedService?.id === svc.id)}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {getServiceIcon(svc.type)}
                      <h5 className="font-semibold text-xs truncate max-w-[140px]" style={{ color: 'var(--text-primary)' }}>{svc.name}</h5>
                    </div>
                    {getStatusBadge(svc.status)}
                  </div>
                  <div className="flex items-center justify-between text-[10px] mt-2 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{svc.ownerTeam}</span>
                    {svc.p1IncidentsLast90Days > 0 ? (
                      <span className="font-bold flex items-center gap-1" style={{ color: '#f87171' }}>
                        <AlertCircle className="w-3 h-3" /> {svc.p1IncidentsLast90Days} P1
                      </span>
                    ) : (
                      <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{svc.sla}</span>
                    )}
                  </div>
                  {shockwaveStage >= 2 && svc.id === 'billing-api' && (
                    <div className="mt-1.5 text-[9px] font-mono font-black px-2 py-1 rounded"
                      style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)' }}>
                      ⚡ CIRCUIT BREAKER TRIPPED (HTTP 504)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── TIER 2: Perimeter ── */}
          <div className="flex flex-col">
            <div className="w-full flex items-center justify-between pb-2 mb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Tier 2 · Perimeter & Storage</span>
              <span className="text-[9px] badge-info px-2 py-0.5 rounded font-mono font-bold">{filteredTier2.length} Services</span>
            </div>

            <div className="space-y-2.5">
              {filteredTier2.map((svc) => (
                <div
                  key={svc.id}
                  onClick={() => onSelectService(svc)}
                  className="cursor-pointer rounded-xl p-3 transition-all duration-300 hover:scale-[1.01]"
                  style={getNodeBorderStyle(svc, shockwaveStage, 3, selectedService?.id === svc.id)}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {getServiceIcon(svc.type)}
                      <h5 className="font-semibold text-xs truncate max-w-[140px]" style={{ color: 'var(--text-primary)' }}>{svc.name}</h5>
                    </div>
                    {getStatusBadge(svc.status)}
                  </div>
                  <div className="flex items-center justify-between text-[10px] mt-2 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{svc.ownerTeam}</span>
                    <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{svc.latencyMs}ms avg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Selected Node Inspector ── */}
      {selectedService && (
        <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
              {getServiceIcon(selectedService.type)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{selectedService.name}</h4>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                  {selectedService.id}
                </span>
                {getStatusBadge(selectedService.status)}
              </div>
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                Team: <strong style={{ color: 'var(--text-secondary)' }}>{selectedService.ownerTeam}</strong>
                {' · '}Compass: <strong style={{ color: 'var(--accent-green)' }}>{selectedService.compassScore}%</strong>
                {' · '}P1s: <strong style={{ color: '#f87171' }}>{selectedService.p1IncidentsLast90Days}</strong>
              </p>
              {selectedService.linkedConfluenceDocs.length > 0 ? (
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Docs:</span>
                  {selectedService.linkedConfluenceDocs.map((doc, idx) => (
                    <a key={idx} href={doc.url} target="_blank" rel="noreferrer"
                      className="text-[10px] flex items-center gap-1 font-medium px-2 py-0.5 rounded badge-info">
                      {doc.title} <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] mt-1.5 inline-block px-2 py-0.5 rounded badge-high">
                  ⚠ No Confluence Runbook linked in Teamwork Graph
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSimulateNode(selectedService.id)}
              className="btn-danger px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" /> Simulate Failure
            </button>
            <button
              onClick={() => onSelectService(root)}
              className="btn-ghost px-3 py-1.5 rounded-lg text-xs"
            >
              Back to Root
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
