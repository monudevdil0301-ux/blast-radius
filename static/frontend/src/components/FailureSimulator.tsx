import React, { useState } from 'react';
import { Play, AlertOctagon, CheckCircle2, RefreshCw, Activity, ArrowRight, Zap, Flame, ShieldAlert } from 'lucide-react';
import { invokeSimulateFailure } from '../bridge';
import { SimulationResult } from '../types';

interface FailureSimulatorProps {
  initialServiceId?: string;
}

export const FailureSimulator: React.FC<FailureSimulatorProps> = ({ initialServiceId = 'auth-service' }) => {
  const [selectedService, setSelectedService] = useState(initialServiceId);
  const [failureType, setFailureType] = useState<'latency-spike' | 'unhandled-401' | 'database-timeout'>('latency-spike');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const sim = await invokeSimulateFailure(selectedService, failureType);
      setResult(sim);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Chaos & Cascade Failure Simulator
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Synthetic chaos fault injection to measure cascading downstream blast radius
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full badge-critical font-bold">
          FAULT INJECTION RADAR
        </span>
      </div>

      {/* Control Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Target Component
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="dark-input w-full text-xs rounded-xl p-2.5 font-mono"
          >
            <option value="auth-service">Auth & Session Token Service (Root)</option>
            <option value="billing-api">Payment & Checkout Engine</option>
            <option value="user-profile-svc">Customer Profile Service</option>
            <option value="redis-cache-cluster">User Session Redis Cluster</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Injected Failure Scenario
          </label>
          <select
            value={failureType}
            onChange={(e) => setFailureType(e.target.value as any)}
            className="dark-input w-full text-xs rounded-xl p-2.5"
          >
            <option value="latency-spike">⚡ 500ms Synthetic Latency Spike</option>
            <option value="unhandled-401">🔑 Invalid Key Rotation (401 Drop)</option>
            <option value="database-timeout">🛑 Connection Pool Exhaustion</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className="w-full btn-danger py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Simulating Cascade...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Execute Simulation
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Output */}
      {result && (
        <div className="rounded-xl p-5 space-y-4 font-mono text-xs animate-slide-up"
          style={{ background: 'rgba(8,12,20,0.85)', border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 0 25px rgba(239,68,68,0.1)' }}>
          {/* Status Row */}
          <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-red-400" />
              <span className="font-bold text-red-400 uppercase tracking-wider text-xs">
                Cascade Impact: {result.simulatedService}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Est. Mean TTR: <strong className="text-amber-400 font-bold">{result.cascadeEffect.estimatedTTRMinutes} min</strong>
              </span>
            </div>
          </div>

          {/* Metric Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Circuit Breaker Status</span>
              <div className="text-sm font-bold mt-1 flex items-center gap-1.5">
                {result.cascadeEffect.circuitBreakerTripped ? (
                  <span className="text-red-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> TRIPPED (Fail-Open Risk)
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Normal
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Downstream Degradation</span>
              <div className="text-sm font-bold text-amber-400 mt-1">
                {result.cascadeEffect.downstreamDegradationRate} of caller requests impacted
              </div>
            </div>
          </div>

          {/* Degraded Endpoints */}
          <div>
            <span className="text-[10px] uppercase font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Severely Degraded Downstream Endpoints
            </span>
            <div className="space-y-1.5">
              {result.cascadeEffect.affectedEndpoints.map((ep, i) => (
                <div key={i} className="px-3 py-2 rounded-lg flex items-center gap-2"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                  <ArrowRight className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <code className="text-blue-300 text-xs">{ep}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Remediation */}
          <div className="p-3.5 rounded-lg flex items-start gap-2.5"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#93c5fd' }}>
            <Zap className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-300">Recommended Policy Mitigation:</strong>{' '}
              <span>{result.cascadeEffect.recommendedMitigation}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
