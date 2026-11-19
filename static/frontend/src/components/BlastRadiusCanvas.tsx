import React, { useState } from 'react';
import { Server, Database, Radio, Globe, Layers, AlertCircle, Shield, ExternalLink, Zap } from 'lucide-react';
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

  const root = analysis.rootService;
  const tier1 = analysis.impactedServices.filter(s => s.tier === 1);
  const tier2 = analysis.impactedServices.filter(s => s.tier === 2);

  const getServiceIcon = (type: ServiceDependency['type']) => {
    switch (type) {
      case 'database': return <Database className="w-4 h-4 text-purple-600" />;
      case 'gateway': return <Globe className="w-4 h-4 text-sky-600" />;
      case 'message-broker': return <Radio className="w-4 h-4 text-emerald-600" />;
      case 'third-party': return <Layers className="w-4 h-4 text-amber-600" />;
      default: return <Server className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: ServiceDependency['status']) => {
    switch (status) {
      case 'incident-prone':
        return <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-rose-200">Incident Prone</span>;
      case 'at-risk':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-200">At Risk</span>;
      default:
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-medium px-1.5 py-0.5 rounded">Healthy</span>;
    }
  };

  const filteredTier1 = tier1.filter(s => filter === 'all' || s.status === filter);
  const filteredTier2 = tier2.filter(s => filter === 'all' || s.status === filter);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Canvas Header & Filter Bar */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
          <h3 className="font-semibold text-slate-800 text-sm">
            Live Blast Radius Architecture Graph
          </h3>
          <span className="text-xs bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded">
            Compass & Teamwork Graph Synchronized
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Filter Nodes:</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-md transition ${filter === 'all' ? 'bg-blue-600 text-white font-medium shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
          >
            All ({analysis.impactedServices.length + 1})
          </button>
          <button
            onClick={() => setFilter('incident-prone')}
            className={`px-2.5 py-1 rounded-md transition ${filter === 'incident-prone' ? 'bg-rose-600 text-white font-medium shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
          >
            P1 Hotspots
          </button>
          <button
            onClick={() => setFilter('at-risk')}
            className={`px-2.5 py-1 rounded-md transition ${filter === 'at-risk' ? 'bg-amber-500 text-white font-medium shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
          >
            Missing Docs / High SLA
          </button>
        </div>
      </div>

      {/* Main Graph Grid (Tiers) */}
      <div className="p-6 overflow-x-auto min-h-[460px] bg-gradient-to-b from-slate-50/40 via-white to-slate-50/40">
        <div className="min-w-[760px] grid grid-cols-3 gap-8 relative">

          {/* Tier 0: Root Service (Target of PR / Ticket) */}
          <div className="flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-2 mb-4 border-b border-blue-200">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Tier 0: Target Service</span>
              <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-semibold">Change Root</span>
            </div>

            <div
              onClick={() => onSelectService(root)}
              className={`w-full relative cursor-pointer rounded-xl border-2 transition-all p-4 bg-white shadow-md hover:shadow-lg ${
                selectedService?.id === root.id
                  ? 'border-blue-600 ring-2 ring-blue-100'
                  : 'border-blue-400 hover:border-blue-500'
              }`}
            >
              {/* Pulsing indicator */}
              <div className="absolute -top-2 -right-2 flex items-center justify-center">
                <span className="absolute animate-ping inline-flex h-4 w-4 rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-blue-50">
                  {getServiceIcon(root.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{root.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono truncate">{root.id}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Team:</span>
                  <span className="font-medium text-slate-700">{root.ownerTeam}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Compass Score:</span>
                  <span className="font-bold font-mono text-emerald-600">{root.compassScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SLA:</span>
                  <span className="font-mono text-slate-700">{root.sla}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 flex items-center justify-between text-[11px]">
                <span className="text-blue-600 font-semibold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> 4 Direct Callers
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); onSimulateNode(root.id); }}
                  className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
                >
                  Simulate
                </button>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-slate-400 max-w-[200px]">
              Every commit or branch attached to <strong className="text-slate-700 font-mono">{analysis.issueKey}</strong> routes through this node.
            </div>
          </div>

          {/* Tier 1: Direct Downstream Consumers */}
          <div className="flex flex-col">
            <div className="w-full flex items-center justify-between pb-2 mb-4 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Tier 1: Direct Callers</span>
              <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">
                {filteredTier1.length} Services
              </span>
            </div>

            <div className="space-y-3">
              {filteredTier1.map((svc) => (
                <div
                  key={svc.id}
                  onClick={() => onSelectService(svc)}
                  className={`cursor-pointer rounded-lg border transition-all p-3 bg-white shadow-xs hover:shadow-md ${
                    selectedService?.id === svc.id
                      ? 'border-blue-600 ring-2 ring-blue-100'
                      : svc.status === 'incident-prone'
                      ? 'border-rose-300 hover:border-rose-400 bg-rose-50/20'
                      : svc.status === 'at-risk'
                      ? 'border-amber-300 hover:border-amber-400 bg-amber-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {getServiceIcon(svc.type)}
                      <h5 className="font-semibold text-slate-800 text-xs truncate max-w-[150px]">{svc.name}</h5>
                    </div>
                    {getStatusBadge(svc.status)}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span className="font-mono text-slate-600">{svc.ownerTeam}</span>
                    {svc.p1IncidentsLast90Days > 0 ? (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {svc.p1IncidentsLast90Days} P1 Outages
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">{svc.sla} SLA</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tier 2: Secondary & Perimeter Dependencies */}
          <div className="flex flex-col">
            <div className="w-full flex items-center justify-between pb-2 mb-4 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Tier 2: Perimeter & Storage</span>
              <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">
                {filteredTier2.length} Services
              </span>
            </div>

            <div className="space-y-3">
              {filteredTier2.map((svc) => (
                <div
                  key={svc.id}
                  onClick={() => onSelectService(svc)}
                  className={`cursor-pointer rounded-lg border transition-all p-3 bg-white shadow-xs hover:shadow-md ${
                    selectedService?.id === svc.id
                      ? 'border-blue-600 ring-2 ring-blue-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {getServiceIcon(svc.type)}
                      <h5 className="font-semibold text-slate-800 text-xs truncate max-w-[150px]">{svc.name}</h5>
                    </div>
                    {getStatusBadge(svc.status)}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span className="font-mono text-slate-600">{svc.ownerTeam}</span>
                    <span className="font-mono text-slate-500">{svc.latencyMs}ms avg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Selected Node Inspection Drawer */}
      {selectedService && (
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
              {getServiceIcon(selectedService.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-800 text-sm">{selectedService.name}</h4>
                <span className="text-xs font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">{selectedService.id}</span>
                {getStatusBadge(selectedService.status)}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Owner Team: <strong className="text-slate-700">{selectedService.ownerTeam}</strong> &bull; Compass Score: <strong className="text-slate-700">{selectedService.compassScore}%</strong> &bull; P1 Incidents: <strong className="text-rose-600">{selectedService.p1IncidentsLast90Days}</strong>
              </p>
              {selectedService.linkedConfluenceDocs.length > 0 ? (
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] text-slate-400">Linked Docs:</span>
                  {selectedService.linkedConfluenceDocs.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-100"
                    >
                      {doc.title} <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              ) : (
                <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1 inline-block">
                  ⚠️ No Confluence Runbook linked in Teamwork Graph
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSimulateNode(selectedService.id)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <Zap className="w-3.5 h-3.5" /> Simulate Node Failure
            </button>
            <button
              onClick={() => onSelectService(root)}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs transition"
            >
              Back to Root
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
