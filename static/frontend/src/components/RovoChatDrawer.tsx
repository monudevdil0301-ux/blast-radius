import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, Terminal, ChevronRight } from 'lucide-react';
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
      text: `Hello! I am **BlastRadius Sentry**, your autonomous architectural safety agent. I analyzed ticket **${analysis.issueKey}** against Atlassian's Teamwork Graph and Compass components. 

⚠️ **Risk Assessment:** Modifying the Auth Token Service exposes **8 downstream services** to potential cascading failure, specifically the **Payment & Checkout Engine (billing-api)** which has suffered 2 P1 incidents recently.

How can I assist your deployment preparation?`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const promptSuggestions = [
    'What is the blast radius of this ticket?',
    'Create regression subtasks in Jira',
    'Draft an emergency Confluence rollback playbook'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      let action = undefined;

      const lower = query.toLowerCase();
      if (lower.includes('blast radius') || lower.includes('risk')) {
        botResponse = `🔍 **Blast Radius Breakdown for ${analysis.issueKey}:**
- **Impacted Tier 1 Callers:** billing-api, user-profile-svc, api-gateway, audit-kafka-broker
- **Incident Hotspot:** billing-api (2 P1 outages in 90 days due to token validation failures)
- **Risk Score:** 84/100 (CRITICAL)
- **Circuit Breaker Coverage:** Missing on Redis session cache.`;
      } else if (lower.includes('regression') || lower.includes('subtask')) {
        botResponse = `⚡ **Autonomous Action Executed:** I have generated regression test sub-tasks in Jira for all 3 critical downstream callers (billing-api, user-profile-svc, api-gateway) linked directly to ${analysis.issueKey}.`;
        action = 'Jira Sub-tasks Created';
        onTriggerSubtasks();
      } else if (lower.includes('confluence') || lower.includes('rollback') || lower.includes('runbook')) {
        botResponse = `📋 **Autonomous Action Executed:** Created an emergency rollback playbook in Confluence space ENG: *[BlastRadius Playbook] Rollback & Incident Guide for ${analysis.issueKey}* with pre-populated kubectl and Redis flush commands.`;
        action = 'Confluence Page Created';
        onTriggerRunbook();
      } else {
        botResponse = `I have verified ${analysis.issueKey} against Compass and Jira link graphs. To proceed safely, I recommend generating regression subtasks or publishing an updated Confluence rollback guide.`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'rovo',
          text: botResponse,
          timestamp: 'Just now',
          actionTaken: action
        }
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
      {/* Drawer Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm">BlastRadius Sentry</h4>
              <span className="text-[10px] font-mono bg-blue-500/30 text-blue-300 px-1.5 py-0.2 rounded border border-blue-400/30">
                rovo:agent
              </span>
            </div>
            <p className="text-[11px] text-slate-300">Autonomous Architectural Safety Agent</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px]">Rovo Active</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/40 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'rovo' && (
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
              {m.actionTaken && (
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold font-mono">
                  <Terminal className="w-3.5 h-3.5" /> {m.actionTaken}
                </div>
              )}
            </div>
            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic">
            <Bot className="w-3.5 h-3.5 animate-bounce text-blue-600" />
            <span>BlastRadius Sentry is querying Teamwork Graph...</span>
          </div>
        )}
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2 border-t border-slate-100 bg-white flex flex-wrap gap-1.5">
        {promptSuggestions.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-full transition flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-blue-600" /> {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask @BlastRadius Sentry to audit or mitigate dependencies..."
          className="flex-1 text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!input.trim()}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
