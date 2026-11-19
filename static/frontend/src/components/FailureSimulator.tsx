import React, { useState } from 'react';
import { Play, AlertOctagon, CheckCircle2, RefreshCw, Activity, ArrowRight } from 'lucide-react';
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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-rose-500" />
          <h3 className="font-bold text-slate-800 text-sm">Chaos & Cascade Failure Simulator</h3>
        </div>
        <span className="text-[11px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">
          Proactive Resilience Testing
        </span>
      </div>

      {/* Simulator Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Target Component</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full text-xs rounded-lg border-slate-300 bg-slate-50 p-2 font-mono text-slate-700 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="auth-service">Auth & Session Token Service (Root)</option>
            <option value="billing-api">Payment & Checkout Engine</option>
            <option value="user-profile-svc">Customer Profile Service</option>
            <option value="redis-cache-cluster">User Session Redis Cluster</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Injected Failure Scenario</label>
          <select
            value={failureType}
            onChange={(e) => setFailureType(e.target.value as any)}
            className="w-full text-xs rounded-lg border-slate-300 bg-slate-50 p-2 text-slate-700 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="latency-spike">500ms Synthetic Latency Spike</option>
            <option value="unhandled-401">Invalid Key Rotation (401 Rejections)</option>
            <option value="database-timeout">Connection Pool Exhaustion</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className="w-full px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-medium text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Simulating Cascade...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Execute Simulation
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulation Results Output */}
      {result && (
        <div className="bg-slate-900 rounded-lg p-4 text-white font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span className="font-bold text-rose-300 uppercase tracking-wider text-[11px]">
                Cascade Analysis Report: {result.simulatedService}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Est. TTR: <strong className="text-amber-400">{result.cascadeEffect.estimatedTTRMinutes} min</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div className="bg-slate-800/60 p-2.5 rounded border border-slate-700/50">
              <span className="text-slate-400 text-[10px] uppercase">Circuit Breaker Status</span>
              <div className="text-sm font-bold mt-0.5 flex items-center gap-1.5">
                {result.cascadeEffect.circuitBreakerTripped ? (
                  <span className="text-rose-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> TRIPPED (Fail-Open Risk)
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Normal
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded border border-slate-700/50">
              <span className="text-slate-400 text-[10px] uppercase">Downstream Degradation</span>
              <div className="text-sm font-bold text-amber-400 mt-0.5">
                {result.cascadeEffect.downstreamDegradationRate} of caller traffic affected
              </div>
            </div>
          </div>

          <div className="mb-3">
            <span className="text-slate-400 text-[10px] uppercase block mb-1">Severely Degraded Endpoints</span>
            <ul className="space-y-1">
              {result.cascadeEffect.affectedEndpoints.map((ep, i) => (
                <li key={i} className="text-slate-300 bg-slate-800/40 px-2 py-1 rounded flex items-center gap-2 text-[11px]">
                  <ArrowRight className="w-3 h-3 text-rose-400 shrink-0" />
                  <span>{ep}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-2.5 bg-blue-950/40 rounded border border-blue-800/40 text-[11px] text-blue-200">
            <strong>Recommended Mitigation:</strong> {result.cascadeEffect.recommendedMitigation}
          </div>
        </div>
      )}
    </div>
  );
};
