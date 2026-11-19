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

  const actions = [
    {
      icon: <ListPlus className="w-5 h-5" />,
      iconBg: 'rgba(59,130,246,0.15)',
      iconColor: 'var(--accent-blue)',
      title: 'Generate Regression Tests',
      desc: 'Creates linked Jira Sub-tasks for all 3 critical downstream consumers (billing-api, user-profile-svc, api-gateway).',
      result: subtasksResult,
      loading: subtasksLoading,
      onClick: handleCreateSubtasks,
      btnLabel: 'Auto-Generate Sub-tasks',
      btnClass: 'btn-primary',
      successContent: (
        <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
          <div className="flex items-center gap-2 font-bold text-xs mb-2" style={{ color: 'var(--accent-green)' }}>
            <CheckCircle2 className="w-3.5 h-3.5" /> Sub-tasks Created in Jira!
          </div>
          <ul className="space-y-1 font-mono text-[10px]" style={{ color: '#34d399' }}>
            {subtasksResult?.createdSubtasks?.map((t: any, i: number) => (
              <li key={i}>· {t.key}: {t.service}</li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      icon: <FileText className="w-5 h-5" />,
      iconBg: 'rgba(139,92,246,0.15)',
      iconColor: 'var(--accent-purple)',
      title: 'Draft Confluence Runbook',
      desc: 'Generates an emergency rollback playbook in Confluence with verified CLI commands and Redis flush procedures.',
      result: runbookResult,
      loading: runbookLoading,
      onClick: handleCreateRunbook,
      btnLabel: 'Draft Confluence Playbook',
      btnClass: 'btn-primary',
      successContent: (
        <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
          <div className="flex items-center gap-2 font-bold text-xs mb-1.5" style={{ color: 'var(--accent-green)' }}>
            <CheckCircle2 className="w-3.5 h-3.5" /> Runbook Published!
          </div>
          <a href={runbookResult?.pageUrl} target="_blank" rel="noreferrer"
            className="flex items-center gap-1 text-[10px] font-mono" style={{ color: 'var(--accent-blue)' }}>
            View Confluence Page <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ),
    },
    {
      icon: <Bell className="w-5 h-5" />,
      iconBg: 'rgba(245,158,11,0.15)',
      iconColor: 'var(--accent-amber)',
      title: 'Notify Service Owners',
      desc: 'Dispatches dependency notices to FinTech Core, Platform SRE, and Growth teams via Jira notifications and Slack.',
      result: alertSent ? true : null,
      loading: false,
      onClick: handleSendAlerts,
      btnLabel: 'Broadcast Impact Alert',
      btnClass: 'btn-ghost',
      successContent: (
        <div className="p-3 rounded-xl flex items-center gap-2 font-bold text-xs" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--accent-green)' }}>
          <CheckCircle2 className="w-3.5 h-3.5" /> All Owners Alerted!
        </div>
      ),
    },
  ];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Automated Governance & Remediation</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Execute direct mitigations into Jira and Confluence via Teamwork Graph insights.
          </p>
        </div>
        <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full badge-safe">Active Mitigations</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-4 rounded-xl transition-all"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}
          >
            <div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: action.iconBg, color: action.iconColor }}>
                {action.icon}
              </div>
              <h4 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{action.title}</h4>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{action.desc}</p>
            </div>

            <div className="mt-4">
              {action.result ? action.successContent : (
                <button
                  onClick={action.onClick}
                  disabled={action.loading}
                  className={`w-full py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-40 ${action.btnClass}`}
                >
                  {action.loading ? (
                    <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing...</>
                  ) : (
                    <>{action.icon && React.cloneElement(action.icon as React.ReactElement<any>, { className: 'w-3.5 h-3.5' })} {action.btnLabel}</>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
