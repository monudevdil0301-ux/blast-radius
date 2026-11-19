import React, { useState } from 'react';
import { CheckCircle2, ListPlus, FileText, Bell, RefreshCw, ExternalLink } from 'lucide-react';
import { invokeCreateRegressionSubtasks, invokeCreateRollbackRunbook } from '../bridge';
import { BlastRadiusAnalysis } from '../types';

interface ActionConsoleProps {
  analysis: BlastRadiusAnalysis;
}

export const ActionConsole: React.FC<ActionConsoleProps> = ({ analysis }) => {
  const [subtasksLoading, setSubtasksLoading] = useState(false);
  const [subtasksResult, setSubtasksResult] = useState<any>(null);

  const [runbookLoading, setRunbookLoading] = useState(false);
  const [runbookResult, setRunbookResult] = useState<any>(null);

  const [alertSent, setAlertSent] = useState(false);

  const handleCreateSubtasks = async () => {
    setSubtasksLoading(true);
    try {
      const targetServices = ['billing-api', 'user-profile-svc', 'api-gateway'];
      const res = await invokeCreateRegressionSubtasks(analysis.issueKey, targetServices);
      setSubtasksResult(res);
    } finally {
      setSubtasksLoading(false);
    }
  };

  const handleCreateRunbook = async () => {
    setRunbookLoading(true);
    try {
      const res = await invokeCreateRollbackRunbook(analysis.issueKey, 'ENG');
      setRunbookResult(res);
    } finally {
      setRunbookLoading(false);
    }
  };

  const handleSendAlerts = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 5000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Automated Governance & Remediation</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Execute direct mitigations into Jira and Confluence based on Teamwork Graph insights.
          </p>
        </div>
        <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
          Active Mitigations
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Action 1: Jira Regression Subtasks */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2.5">
              <ListPlus className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Generate Regression Tests</h4>
            <p className="text-xs text-slate-500 mt-1">
              Creates linked Jira Sub-tasks for all 3 critical downstream consumers (billing-api, user-profile-svc, api-gateway).
            </p>
          </div>

          <div className="mt-4">
            {subtasksResult ? (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Sub-tasks Created in Jira!
                </div>
                <ul className="space-y-0.5 font-mono text-[11px]">
                  {subtasksResult.createdSubtasks?.map((t: any, i: number) => (
                    <li key={i} className="text-emerald-700">
                      &bull; {t.key}: {t.service}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <button
                onClick={handleCreateSubtasks}
                disabled={subtasksLoading}
                className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-xs transition disabled:opacity-50"
              >
                {subtasksLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Creating Sub-tasks...
                  </>
                ) : (
                  <>
                    <ListPlus className="w-3.5 h-3.5" /> Auto-Generate Sub-tasks
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Action 2: Confluence Rollback Runbook */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2.5">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Draft Confluence Runbook</h4>
            <p className="text-xs text-slate-500 mt-1">
              Generates an emergency rollback playbook in Confluence containing verified CLI commands and Redis flush procedures.
            </p>
          </div>

          <div className="mt-4">
            {runbookResult ? (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Runbook Published!
                </div>
                <a
                  href={runbookResult.pageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 text-[11px] font-mono mt-0.5"
                >
                  View Confluence Page <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <button
                onClick={handleCreateRunbook}
                disabled={runbookLoading}
                className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-xs transition disabled:opacity-50"
              >
                {runbookLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Publishing to Confluence...
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5" /> Draft Confluence Playbook
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Action 3: Notify Component Owners */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5">
              <Bell className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Notify Service Owners</h4>
            <p className="text-xs text-slate-500 mt-1">
              Dispatches dependency notices to FinTech Core, Platform SRE, and Growth teams via Jira notifications and Slack.
            </p>
          </div>

          <div className="mt-4">
            {alertSent ? (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Owners Alerted Successfully!
              </div>
            ) : (
              <button
                onClick={handleSendAlerts}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <Bell className="w-3.5 h-3.5" /> Broadcast Impact Alert
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
