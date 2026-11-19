import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, Terminal } from 'lucide-react';
import { BlastRadiusAnalysis } from '../types';

interface Message {
  sender: 'user' | 'rovo';
  text: string;
  timestamp: string;
  actionTaken?: string;
}

interface RovoChatDrawerProps {
  analysis: BlastRadiusAnalysis;
  onTriggerSubtasks: () => void;
  onTriggerRunbook: () => void;
}

export const RovoChatDrawer: React.FC<RovoChatDrawerProps> = ({
  analysis,
  onTriggerSubtasks,
  onTriggerRunbook
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'rovo',
      text: `Initializing BlastRadius Sentry v2.4...\n\nI've analyzed ${analysis.issueKey} against the Atlassian Teamwork Graph and Compass component catalog.\n\n⚠️ Risk Score: ${analysis.riskScore}/100 (${analysis.riskTier})\n📡 Downstream exposure: ${analysis.totalServicesImpacted} services across 2 tiers\n🔥 Incident hotspot: billing-api (2 P1s / 90 days)\n\nHow can I assist with deployment safety?`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptSuggestions = [
    'What is the blast radius?',
    'Create regression subtasks',
    'Draft rollback playbook',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = { sender: 'user', text: query, timestamp: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      let action = undefined;

      const lower = query.toLowerCase();
      if (lower.includes('blast radius') || lower.includes('risk')) {
        botResponse = `🔍 Blast Radius Breakdown — ${analysis.issueKey}\n\n• Tier 1 Callers: billing-api, user-profile-svc, api-gateway, audit-kafka-broker\n• Incident Hotspot: billing-api (2 P1 outages in 90 days)\n• Risk Score: ${analysis.riskScore}/100 (${analysis.riskTier})\n• Missing: Circuit breaker on Redis session cache`;
      } else if (lower.includes('regression') || lower.includes('subtask')) {
        botResponse = `⚡ Autonomous Action: Generated regression test sub-tasks in Jira for all 3 critical downstream callers (billing-api, user-profile-svc, api-gateway) linked directly to ${analysis.issueKey}.`;
        action = 'Jira Sub-tasks Created';
        onTriggerSubtasks();
      } else if (lower.includes('confluence') || lower.includes('rollback') || lower.includes('runbook') || lower.includes('playbook')) {
        botResponse = `📋 Autonomous Action: Created emergency rollback playbook in Confluence ENG space: [BlastRadius Playbook] Rollback & Incident Guide for ${analysis.issueKey} — includes pre-populated kubectl and Redis flush commands.`;
        action = 'Confluence Page Created';
        onTriggerRunbook();
      } else {
        botResponse = `Verified ${analysis.issueKey} against Compass and Jira link graphs.\n\nTo proceed safely:\n1. Generate regression subtasks for downstream consumers\n2. Publish an updated Confluence rollback runbook\n3. Stamp Pre-Flight CAB clearance seal`;
      }

      setMessages(prev => [...prev, { sender: 'rovo', text: botResponse, timestamp: 'Just now', actionTaken: action }]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="glass-card overflow-hidden flex flex-col h-[520px]">
      {/* Header */}
      <div className="px-5 py-3.5 flex items-center justify-between flex-shrink-0"
        style={{ background: 'linear-gradient(90deg, rgba(15,10,40,0.95), rgba(30,20,80,0.9))', borderBottom: '1px solid rgba(139,92,246,0.3)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)' }}>
            <Bot className="w-5 h-5" style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>BlastRadius Sentry</h4>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded badge-purple">rovo:agent</span>
            </div>
            <p className="text-[10px] font-mono" style={{ color: '#8b5cf6' }}>Autonomous Architectural Safety Agent</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono font-bold" style={{ color: '#34d399' }}>ROVO ACTIVE</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs"
        style={{ background: 'rgba(8,12,20,0.5)' }}>
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'rovo' && (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'rgba(139,92,246,0.3)', border: '1px solid rgba(139,92,246,0.4)' }}>
                <Bot className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} />
              </div>
            )}

            <div className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
              m.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'
            }`} style={m.sender === 'user'
              ? { background: 'rgba(59,130,246,0.25)', border: '1px solid rgba(59,130,246,0.4)', color: '#e8f0ff' }
              : { background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }
            }>
              <div className="whitespace-pre-line">{m.text}</div>
              {m.actionTaken && (
                <div className="mt-2 pt-2 flex items-center gap-1.5 text-[10px] font-semibold font-mono"
                  style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--accent-green)' }}>
                  <Terminal className="w-3 h-3" /> {m.actionTaken}
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)' }}>
                <User className="w-3.5 h-3.5" style={{ color: 'var(--accent-blue)' }} />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs italic" style={{ color: 'var(--text-muted)' }}>
            <div className="flex gap-1 items-center">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ background: 'var(--accent-purple)', animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
            <span>Querying Teamwork Graph...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-4 py-2 flex flex-wrap gap-1.5 flex-shrink-0"
        style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
        {promptSuggestions.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 transition"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}
          >
            <Sparkles className="w-3 h-3" /> {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 flex items-center gap-2 flex-shrink-0"
        style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(8,12,20,0.6)' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask @BlastRadius Sentry to audit or mitigate..."
          className="dark-input flex-1 text-xs rounded-xl px-3.5 py-2.5"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!input.trim()}
          className="btn-primary p-2.5 rounded-xl transition disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
