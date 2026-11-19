import React from 'react';
import { AlertTriangle, ShieldCheck, Flame, BookOpen } from 'lucide-react';
import { BlastRadiusAnalysis } from '../types';

interface RiskGaugeProps {
  analysis: BlastRadiusAnalysis;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ analysis }) => {
  const { riskScore, riskTier, recentIncidentsFound, missingRunbooksCount, totalServicesImpacted } = analysis;

  // SVG gauge parameters — 240° arc
  const size = 180;
  const strokeWidth = 16;
  const center = size / 2;
  const radius = center - strokeWidth - 4;
  const circumference = 2 * Math.PI * radius;
  const arcFraction = 0.75;
  const arcLength = circumference * arcFraction;
  const strokeDashoffset = arcLength - (arcLength * (riskScore / 100));

  const tierConfig = {
    CRITICAL: {
      stroke: '#ef4444',
      glowColor: 'rgba(239,68,68,0.6)',
      trackColor: 'rgba(239,68,68,0.12)',
      badgeClass: 'badge-critical',
      textColor: '#f87171',
    },
    HIGH: {
      stroke: '#f59e0b',
      glowColor: 'rgba(245,158,11,0.6)',
      trackColor: 'rgba(245,158,11,0.12)',
      badgeClass: 'badge-high',
      textColor: '#fbbf24',
    },
    ELEVATED: {
      stroke: '#f59e0b',
      glowColor: 'rgba(245,158,11,0.5)',
      trackColor: 'rgba(245,158,11,0.1)',
      badgeClass: 'badge-high',
      textColor: '#fbbf24',
    },
    LOW: {
      stroke: '#10b981',
      glowColor: 'rgba(16,185,129,0.6)',
      trackColor: 'rgba(16,185,129,0.12)',
      badgeClass: 'badge-safe',
      textColor: '#34d399',
    },
  } as const;

  const cfg = tierConfig[riskTier as keyof typeof tierConfig] ?? tierConfig.LOW;

  const deployStatus = riskScore >= 75 ? 'BLOCKED' : riskScore >= 50 ? 'CAUTION' : 'SAFE';
  const deployStatusColor = riskScore >= 75 ? '#ef4444' : riskScore >= 50 ? '#f59e0b' : '#10b981';

  return (
    <div className="glass-card p-5 flex flex-col md:flex-row items-center gap-6">
      {/* ── Radial Gauge ── */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg
          width={size}
          height={size}
          className="transform -rotate-[135deg]"
          style={{ filter: `drop-shadow(0 0 12px ${cfg.glowColor})` }}
        >
          {/* Track arc */}
          <circle
            cx={center} cy={center} r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Value arc */}
          <circle
            cx={center} cy={center} r={radius}
            fill="transparent"
            stroke={cfg.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          {/* Glow arc overlay */}
          <circle
            cx={center} cy={center} r={radius}
            fill="transparent"
            stroke={cfg.stroke}
            strokeWidth={strokeWidth * 0.4}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            opacity={0.5}
            style={{ filter: `blur(4px)` }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className="text-4xl font-black font-mono leading-none"
            style={{ color: cfg.textColor, textShadow: `0 0 20px ${cfg.glowColor}` }}
          >
            {riskScore}
          </span>
          <span className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>/ 100</span>
          <span className={`text-[9px] font-black uppercase px-2 py-0.5 mt-1.5 rounded-full ${cfg.badgeClass}`}>
            {riskTier}
          </span>
        </div>
      </div>

      {/* ── Metric Cards Grid ── */}
      <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Impact Radius */}
        <div className="rounded-xl p-3.5" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Flame className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Impact Radius</span>
          </div>
          <div className="font-black text-2xl font-mono" style={{ color: '#f87171' }}>
            {totalServicesImpacted}
          </div>
          <div className="text-[10px] mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>services · 2 tiers deep</div>
        </div>

        {/* P1 Hotspots */}
        <div className="rounded-xl p-3.5" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>P1 Hotspots</span>
          </div>
          <div className="font-black text-2xl font-mono" style={{ color: '#fbbf24' }}>
            {recentIncidentsFound}
          </div>
          <div className="text-[10px] mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>incidents · 90d window</div>
        </div>

        {/* Missing Runbooks */}
        <div className="rounded-xl p-3.5" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--accent-blue)' }} />
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Missing Runbooks</span>
          </div>
          <div className="font-black text-2xl font-mono" style={{ color: '#60a5fa' }}>
            {missingRunbooksCount}
          </div>
          <div className="text-[10px] mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>stale Confluence docs</div>
        </div>

        {/* Deploy Gate */}
        <div className="rounded-xl p-3.5" style={{
          background: `${deployStatusColor}10`,
          border: `1px solid ${deployStatusColor}30`,
        }}>
          <div className="flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: deployStatusColor }} />
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Deploy Gate</span>
          </div>
          <div
            className="font-black text-lg font-mono"
            style={{ color: deployStatusColor, textShadow: `0 0 12px ${deployStatusColor}80` }}
          >
            {deployStatus}
          </div>
          <div className="text-[10px] mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>regression gate active</div>
        </div>
      </div>
    </div>
  );
};
