import React, { useState } from 'react';
import { GitPullRequest, AlertTriangle, FileCode, CheckCircle2, RefreshCw, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Git Code Diff & Contract Breaking-Change Scanner</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Scans pull request unified diffs against downstream Compass component APIs to catch breaking signature changes before build pipelines.
          </p>
        </div>

        <button
          onClick={handleScan}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg shadow-sm flex items-center gap-2 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Scanning AST & Contracts...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" /> Analyze Diff for Contract Breaks
            </>
          )}
        </button>
      </div>

      {/* Editor & Diff Preview */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-slate-500" /> PR Git Diff ({issueKey})
          </label>
          <button
            onClick={() => setDiffText(SAMPLE_GIT_DIFF)}
            className="text-[11px] text-blue-600 hover:underline font-medium"
          >
            Reset to Sample Diff
          </button>
        </div>

        <textarea
          value={diffText}
          onChange={(e) => setDiffText(e.target.value)}
          rows={7}
          className="w-full text-xs font-mono bg-slate-900 text-slate-200 p-3.5 rounded-lg border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          placeholder="Paste unified git diff here..."
        />
      </div>

      {/* Scan Results */}
      {scanResult && (
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-rose-900 text-xs uppercase tracking-wide">
                  2 Breaking Contract Violations Detected!
                </h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  Downstream consumers in <strong>FinTech Core</strong> and <strong>Growth</strong> will fail at runtime if merged without backward compatibility.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold font-mono bg-rose-200 text-rose-800 px-2.5 py-1 rounded">
              CRITICAL BLOCKER
            </span>
          </div>

          <div className="space-y-3">
            {scanResult.breakingChanges.map((change, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-800">{change.file}:{change.line}</span>
                    <span className="text-[10px] font-mono bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold">
                      {change.changeType}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Impacts: <strong className="text-slate-800 font-mono">{change.impactedConsumer}</strong> ({change.impactedConsumerOwner})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-rose-50 border border-rose-100 text-rose-900">
                    <span className="text-[10px] uppercase text-rose-500 font-bold block mb-1">Legacy Signature:</span>
                    <code>- {change.oldSignature}</code>
                  </div>
                  <div className="p-2.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-900">
                    <span className="text-[10px] uppercase text-emerald-600 font-bold block mb-1">New Signature (Breaking):</span>
                    <code>+ {change.newSignature}</code>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50 border border-blue-100 rounded text-xs text-blue-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Suggested Remediation:</strong> {change.recommendation}
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
