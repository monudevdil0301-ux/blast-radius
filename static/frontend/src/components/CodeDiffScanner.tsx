import React, { useState } from 'react';
import { GitPullRequest, AlertTriangle, FileCode, CheckCircle2, RefreshCw, ArrowRight, ShieldAlert, Sparkles, Terminal } from 'lucide-react';
import { invokeScanCodeDiff, SAMPLE_GIT_DIFF } from '../bridge';
import { CodeDiffScanResult } from '../types';

interface CodeDiffScannerProps {
  issueKey: string;
}

export const CodeDiffScanner: React.FC<CodeDiffScannerProps> = ({ issueKey }) => {
  const [diffText, setDiffText] = useState(SAMPLE_GIT_DIFF);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<CodeDiffScanResult | null>(null);

  const handleScan = async () => {
    setLoading(true);
    try {
      const res = await invokeScanCodeDiff(issueKey, diffText);
      setScanResult(res);
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
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
            <GitPullRequest className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Git Code Diff & Contract Breaking-Change Scanner
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Scans pull request unified diffs against downstream Compass component APIs to catch breaking signature changes before build pipelines.
            </p>
          </div>
        </div>

        <button
          onClick={handleScan}
          disabled={loading}
          className="btn-primary py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Scanning AST & Contracts...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Analyze Diff for Contract Breaks
            </>
          )}
        </button>
      </div>

      {/* Editor & Diff Preview */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>PR Unified Git Diff ({issueKey})</span>
          </label>
          <button
            onClick={() => setDiffText(SAMPLE_GIT_DIFF)}
            className="text-[11px] font-mono hover:underline transition"
            style={{ color: 'var(--accent-cyan)' }}
          >
            Reset to Sample Diff
          </button>
        </div>

        <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
          <div className="px-4 py-2 flex items-center justify-between text-[11px] font-mono"
            style={{ background: 'rgba(8,12,20,0.95)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-[10px]" style={{ color: 'var(--text-secondary)' }}>diff --git a/services/auth/token.ts</span>
            </div>
            <span>unified-diff</span>
          </div>

          <textarea
            value={diffText}
            onChange={(e) => setDiffText(e.target.value)}
            rows={8}
            className="w-full text-xs font-mono p-4 leading-relaxed resize-none focus:outline-none"
            style={{
              background: 'rgba(8,12,20,0.85)',
              color: '#93c5fd',
              caretColor: 'var(--accent-blue)',
            }}
            placeholder="Paste unified git diff here..."
          />
        </div>
      </div>

      {/* Scan Results */}
      {scanResult && (
        <div className="space-y-4 animate-slide-up">
          {/* Alert Banner */}
          <div className="p-4 rounded-xl flex flex-wrap items-center justify-between gap-3"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', boxShadow: '0 0 25px rgba(239,68,68,0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}>
                <ShieldAlert className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-wider text-red-400">
                  2 Breaking Contract Violations Detected!
                </h4>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  Downstream consumers in <strong className="text-white">FinTech Core</strong> and <strong className="text-white">Growth</strong> will throw fatal exceptions at runtime if merged without backward compatibility.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold font-mono px-3 py-1 rounded-full badge-critical">
              CRITICAL BLOCKER
            </span>
          </div>

          {/* Change Cards */}
          <div className="space-y-3">
            {scanResult.breakingChanges.map((change, idx) => (
              <div key={idx} className="p-4 rounded-xl space-y-3 transition-all"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                      {change.file}:{change.line}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded badge-critical font-bold">
                      {change.changeType}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Impacts: <strong className="font-mono text-blue-300">{change.impactedConsumer}</strong> ({change.impactedConsumerOwner})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
                    <span className="text-[10px] uppercase font-bold block mb-1 text-red-400">Legacy Signature:</span>
                    <code>- {change.oldSignature}</code>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7' }}>
                    <span className="text-[10px] uppercase font-bold block mb-1 text-emerald-400">New Signature (Breaking):</span>
                    <code>+ {change.newSignature}</code>
                  </div>
                </div>

                <div className="p-3 rounded-lg flex items-start gap-2 text-xs"
                  style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#bfdbfe' }}>
                  <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-blue-300">Suggested Remediation:</strong> {change.recommendation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
