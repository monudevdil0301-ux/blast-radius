import React from 'react';
import { AlertTriangle, ShieldCheck, Flame, BookOpen, Clock } from 'lucide-react';
import { BlastRadiusAnalysis } from '../types';

interface RiskGaugeProps {
  analysis: BlastRadiusAnalysis;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ analysis }) => {
  const { riskScore, riskTier, recentIncidentsFound, missingRunbooksCount, totalServicesImpacted } = analysis;

  // SVG parameters
  const size = 160;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  // We'll show a 240-degree arc gauge
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * (riskScore / 100));

  const getTierColor = () => {
    switch (riskTier) {
      case 'CRITICAL': return { text: 'text-red-600', stroke: '#DE350B', bg: 'bg-red-50', border: 'border-red-200' };
      case 'HIGH': return { text: 'text-amber-600', stroke: '#FF8B00', bg: 'bg-amber-50', border: 'border-amber-200' };
      case 'ELEVATED': return { text: 'text-yellow-600', stroke: '#FFAB00', bg: 'bg-yellow-50', border: 'border-yellow-200' };
      default: return { text: 'text-emerald-600', stroke: '#36B37E', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    }
  };

  const colors = getTierColor();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row items-center gap-6">
      {/* Radial Gauge */}
      <div className="relative flex flex-col items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-135">
          {/* Background Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Value Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Gauge Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-2">
          <span className="text-3xl font-bold font-mono tracking-tight text-slate-800">
            {riskScore}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            / 100 Risk
          </span>
          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 mt-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
            {riskTier}
          </span>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Impact Radius</span>
          </div>
          <div className="text-xl font-bold text-slate-800 font-mono">
            {totalServicesImpacted} <span className="text-xs font-normal text-slate-500">services</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">2 architectural tiers deep</div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>P1 Hotspots</span>
          </div>
          <div className="text-xl font-bold text-slate-800 font-mono">
            {recentIncidentsFound} <span className="text-xs font-normal text-slate-500">incidents</span>
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-0.5">Across downstream consumers</div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>Missing Runbooks</span>
          </div>
          <div className="text-xl font-bold text-slate-800 font-mono">
            {missingRunbooksCount} <span className="text-xs font-normal text-slate-500">services</span>
          </div>
          <div className="text-[11px] text-rose-500 font-medium mt-0.5">Stale or unlinked Confluence docs</div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Deployment Risk</span>
          </div>
          <div className="text-xl font-bold text-slate-800 font-mono">
            {riskScore >= 75 ? 'BLOCKED' : riskScore >= 50 ? 'WARNING' : 'SAFE'}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Regression gate active</div>
        </div>
      </div>
    </div>
  );
};
