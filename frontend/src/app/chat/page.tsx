'use client';

import { useState } from 'react';
import { Send, BadgeCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ChatPage() {
  const { conversations, sendMessage } = useApp();
  const [selectedId, setSelectedId] = useState(conversations[0]?.id || '');
  const [draft, setDraft] = useState('');

  const activeChat =
    conversations.find((c) => c.id === selectedId) || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !activeChat) return;
    sendMessage(activeChat.id, draft);
    setDraft('');
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Header Banner: Compact, clean */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#031526] via-[#053568] to-[#031526] p-6 sm:p-8 text-white border border-white/10">
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-[#92C4EA]">
            <BadgeCheck className="h-3.5 w-3.5" />
            <span>Encrypted Satellite &amp; Cellular Comms 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Messages &amp; Concierge Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
            Real-time direct chat with assigned IFMGA mountain guides, lodge hosts, and Sherpa butlers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs min-h-[540px]">
        {/* Conversations List */}
        <div className="border-b lg:border-b-0 lg:border-r border-slate-200 divide-y divide-slate-100">
          {conversations.map((c) => {
            const active = c.id === activeChat?.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full flex items-center gap-3 p-3.5 text-left transition-all duration-150 active:scale-[0.99] ${
                  active ? 'bg-blue-50/80 border-l-3 border-[#0552A2]' : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <span
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                      c.status === 'Online' ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 truncate">
                      <span className="truncate text-xs font-bold text-slate-900">
                        {c.name}
                      </span>
                      {c.verified && (
                        <BadgeCheck className="h-3.5 w-3.5 text-[#0552A2] shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {c.lastTime}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-slate-500">
                    {c.lastMessage}
                  </p>
                </div>
                {c.unread > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0552A2] text-[9px] font-bold text-white">
                    {c.unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Thread */}
        {activeChat && (
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3.5 bg-slate-50/60">
              <img
                src={activeChat.avatar}
                alt={activeChat.name}
                className="h-9 w-9 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xs font-bold text-slate-900">
                  {activeChat.name}
                </h2>
                <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{activeChat.status}</span>
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-5 bg-slate-50/40">
              {activeChat.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md rounded-xl px-3.5 py-2 text-xs shadow-2xs ${
                      m.isMe
                        ? 'bg-[#0552A2] text-white'
                        : 'bg-white border border-slate-200 text-slate-800'
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>
                    <p
                      className={`mt-1 text-[9px] ${
                        m.isMe ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {m.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-slate-200 bg-white p-3.5"
            >
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0552A2]"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-lg bg-[#0552A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#044182] active:scale-[0.98] transition-all"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

