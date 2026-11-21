'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Send,
  BadgeCheck,
  Radio,
  ShieldCheck,
  Sparkles,
  Search,
  Phone,
  Video,
  Info,
  Paperclip,
  Smile,
  MapPin,
  Calendar,
  Compass,
  CheckCheck,
  AlertTriangle,
  ArrowLeft,
  X,
  Copy,
  Check,
  Download,
  Share2,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  Filter,
  Navigation,
  Headphones,
  Signal,
  CheckCircle2,
  CloudSun
} from 'lucide-react';
import {
  INITIAL_CONCIERGE_CONVERSATIONS,
  ConciergeConversation,
  ConciergeMessage
} from '@/data/conciergeData';
import { useApp } from '@/context/AppContext';

export default function ChatPage() {
  const { showToast } = useApp();

  // State
  const [conversations, setConversations] = useState<ConciergeConversation[]>(
    INITIAL_CONCIERGE_CONVERSATIONS
  );
  const [selectedId, setSelectedId] = useState<string>(
    INITIAL_CONCIERGE_CONVERSATIONS[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'guides' | 'hosts'>('all');
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [copiedRef, setCopiedRef] = useState(false);

  // Modals & Popovers
  const [showSatelliteModal, setShowSatelliteModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState<{ open: boolean; type: 'audio' | 'video' }>({
    open: false,
    type: 'audio'
  });
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Active Chat
  const activeChat = useMemo(() => {
    return conversations.find((c) => c.id === selectedId) || conversations[0];
  }, [conversations, selectedId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isTyping]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      // Tab filter
      if (activeTab === 'unread' && c.unread === 0) return false;
      if (activeTab === 'guides' && c.category !== 'guides') return false;
      if (activeTab === 'hosts' && c.category !== 'hosts') return false;

      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.destination.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
      );
    });
  }, [conversations, activeTab, searchQuery]);

  // Handle conversation select
  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    setMobileView('chat');
    // Clear unread
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  // Handle send message
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || draft).trim();
    if (!text || !activeChat) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage: ConciergeMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'Me',
      text,
      time: timeString,
      date: 'Today',
      isMe: true,
      status: 'read'
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            lastMessage: text,
            lastTime: timeString,
            unread: 0,
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );

    if (!textToSend) {
      setDraft('');
    }

    // Realistic auto-reply simulation
    simulateGuideResponse(activeChat.name, text);
  };

  const simulateGuideResponse = (guideName: string, userText: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      let reply = `Understood! I have logged this for our itinerary. Let me know if you need any adjustments before we move out.`;
      const lower = userText.toLowerCase();

      if (lower.includes('weather') || lower.includes('temperature') || lower.includes('forecast')) {
        reply = `Current reading: clear skies, wind 8 knots from NW. Temperatures tonight will drop to approx -4°C. Perfect window for trekking tomorrow morning!`;
      } else if (lower.includes('cash') || lower.includes('money') || lower.includes('atm')) {
        reply = `Cash is strongly advised above Namche. ATMs in high altitude can run out of power or cash during peak season. Having NPR 20k-25k in small notes (500s & 1000s) is ideal.`;
      } else if (lower.includes('gear') || lower.includes('crampon') || lower.includes('jacket')) {
        reply = `Gear status: standard 800-fill down jacket, sturdy Gore-Tex boots, trekking poles, and Kahtoola microspikes are verified and ready.`;
      } else if (lower.includes('gps') || lower.includes('location') || lower.includes('coordinates')) {
        reply = `GPS telemetry acknowledged and pinned to our live trek dispatch board. Signal strength is solid on the satellite uplink.`;
      }

      const botMessage: ConciergeMessage = {
        id: `msg_guide_${Date.now()}`,
        sender: guideName,
        text: reply,
        time: timeString,
        date: 'Today',
        isMe: false,
        status: 'read'
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeChat.id) {
            return {
              ...c,
              lastMessage: reply,
              lastTime: timeString,
              messages: [...c.messages, botMessage]
            };
          }
          return c;
        })
      );
    }, 1800);
  };

  const handleCopyBookingRef = (refText: string) => {
    navigator.clipboard?.writeText(refText);
    setCopiedRef(true);
    showToast?.(`Booking reference ${refText} copied to clipboard!`);
    setTimeout(() => setCopiedRef(false), 2200);
  };

  const handleShareLocation = () => {
    const locText = `📍 Live GPS Coordinates Shared: 27°48'15"N 86°43'22"E (Altitude: 3,440m - Namche Bazaar Central Checkpoint)`;
    handleSendMessage(locText);
    showToast?.('GPS Coordinates shared with guide!');
  };

  const quickPromptChips = [
    { label: '⛅ Weather & trail check', query: 'Could you give me a quick weather and trail condition check for tomorrow?' },
    { label: '💵 Cash vs card tea houses', query: 'How much Nepalese Rupee cash should I withdraw for the upcoming tea houses?' },
    { label: '🎒 Gear & crampon checklist', query: 'Can we double-check my down jacket and crampons checklist for high pass?' },
    { label: '📍 Share my coordinates', action: handleShareLocation }
  ];

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-3.5 sm:py-5 lg:py-6 font-inter text-slate-800">
      {/* 1. Header Section */}
      <header className="relative pb-4 mb-4 border-b border-slate-200/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          {/* Title & Live Status */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/70 text-[11px] font-bold text-[#0552A2] tracking-wide uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>CONCIERGE NETWORK LIVE</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold tracking-tight text-slate-900 font-poppins">
              Messages &amp; <span className="text-[#0552A2]">Concierge</span>
            </h1>

            <p className="text-xs sm:text-[13px] text-slate-500 leading-normal">
              Connect with your guides, hosts, and local travel experts in real-time.
            </p>
          </div>

          {/* Status Badges & Satellite Link Action */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/90 text-slate-700 text-xs font-semibold border border-slate-200/60 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>8 Guides Online</span>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/90 text-slate-700 text-xs font-semibold border border-slate-200/60 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              <span>24/7 Mountain Support</span>
            </div>

            <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/90 text-slate-700 text-xs font-semibold border border-slate-200/60 shadow-2xs">
              <span className="text-slate-400 font-normal">Response:</span>
              <span className="text-emerald-700 font-bold">~5 min</span>
            </div>

            <button
              onClick={() => setShowSatelliteModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100/80 text-[#0552A2] border border-blue-200/80 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              <Radio className="h-3.5 w-3.5 text-[#0552A2] animate-pulse" />
              <span>Satellite Link</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main 3-Column Messaging Workspace */}
      <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col lg:flex-row h-[780px] max-h-[calc(100vh-180px)]">
        
        {/* ================= COLUMN 1: LEFT CONVERSATION SIDEBAR ================= */}
        <aside
          className={`w-full lg:w-[330px] xl:w-[340px] shrink-0 border-r border-slate-200/90 flex flex-col bg-slate-50/50 ${
            mobileView === 'chat' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Search Bar */}
          <div className="p-3 border-b border-slate-200/80 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations, guides..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100/80 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20 focus:border-[#0552A2] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mt-2.5 p-0.5 bg-slate-100 rounded-lg text-[11px] font-semibold text-slate-600">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'unread', label: 'Unread' },
                  { id: 'guides', label: 'Guides' },
                  { id: 'hosts', label: 'Hosts' }
                ] as const
              ).map((tab) => {
                const isActive = activeTab === tab.id;
                const unreadTotal = conversations.filter((c) => c.unread > 0).length;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-1 rounded-md text-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#0552A2] shadow-2xs font-bold'
                        : 'hover:text-slate-900 text-slate-500'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.id === 'unread' && unreadTotal > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#0552A2] text-white text-[9px] font-bold">
                        {unreadTotal}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100/90 scrollbar-thin">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Search className="h-8 w-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                <p className="text-xs font-semibold text-slate-600">No conversations found</p>
                <p className="text-[11px] text-slate-400 mt-1">Try a different search keyword or tab.</p>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = c.id === activeChat.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelectConversation(c.id)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer relative ${
                      isSelected
                        ? 'bg-blue-50/80 border-l-[3.5px] border-[#0552A2]'
                        : 'hover:bg-slate-100/70 border-l-[3.5px] border-transparent'
                    }`}
                  >
                    {/* Avatar with Status Ring */}
                    <div className="relative shrink-0 mt-0.5">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="h-11 w-11 rounded-full object-cover border border-slate-200/80 shadow-2xs"
                      />
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white shadow-xs ${
                          c.status === 'online'
                            ? 'bg-emerald-500'
                            : c.status === 'away'
                            ? 'bg-amber-400'
                            : 'bg-slate-400'
                        }`}
                        title={c.statusText}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5 mb-0.5">
                        <div className="flex items-center gap-1 min-w-0">
                          <span
                            className={`text-xs font-bold truncate ${
                              isSelected ? 'text-[#0552A2]' : 'text-slate-900'
                            }`}
                          >
                            {c.name}
                          </span>
                          {c.verified && (
                            <BadgeCheck className="h-3.5 w-3.5 text-[#0552A2] shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {c.lastTime}
                        </span>
                      </div>

                      {/* Role & Destination */}
                      <p className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-1 mb-1">
                        <span>{c.role}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400">{c.destination.split('(')[0]}</span>
                      </p>

                      {/* Last Message Preview */}
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] text-slate-600 truncate line-clamp-1 leading-snug">
                          {c.lastMessage}
                        </p>
                        {c.unread > 0 && (
                          <span className="shrink-0 h-4 min-w-4 px-1 flex items-center justify-center rounded-full bg-[#0552A2] text-white text-[9px] font-bold shadow-2xs">
                            {c.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ================= COLUMN 2: CENTER CHAT PANEL ================= */}
        <main
          className={`flex-1 flex flex-col bg-white min-w-0 ${
            mobileView === 'list' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-slate-200/90 bg-white flex items-center justify-between gap-3 shadow-2xs shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile Back Button */}
              <button
                onClick={() => setMobileView('list')}
                className="lg:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                title="Back to conversations"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              {/* Avatar & Info */}
              <div className="relative shrink-0">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="h-10 w-10 rounded-full object-cover border border-slate-200/80 shadow-2xs"
                />
                <span
                  className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                    activeChat.status === 'online'
                      ? 'bg-emerald-500'
                      : activeChat.status === 'away'
                      ? 'bg-amber-400'
                      : 'bg-slate-400'
                  }`}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold text-slate-900 truncate">
                    {activeChat.name}
                  </h2>
                  {activeChat.verified && (
                    <BadgeCheck className="h-4 w-4 text-[#0552A2] shrink-0" />
                  )}
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-[#0552A2] border border-blue-200/60 truncate">
                    {activeChat.role}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="truncate">{activeChat.statusText}</span>
                </p>
              </div>
            </div>

            {/* Actions: Audio, Video, Details Toggle */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setShowCallModal({ open: true, type: 'audio' })}
                className="p-2 text-slate-600 hover:text-[#0552A2] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-blue-200"
                title="Audio Call via Field Radio"
              >
                <Phone className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowCallModal({ open: true, type: 'video' })}
                className="p-2 text-slate-600 hover:text-[#0552A2] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-blue-200"
                title="Video Satellite Feed"
              >
                <Video className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowRightPanel((prev) => !prev)}
                className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                  showRightPanel
                    ? 'bg-blue-50 text-[#0552A2] border-blue-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
                }`}
                title="Toggle Trip & Guide Info"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/40 scrollbar-thin">
            {/* Day Separator */}
            <div className="flex items-center justify-center my-2">
              <div className="px-3 py-1 rounded-full bg-white border border-slate-200/80 text-[10px] font-bold text-slate-500 shadow-2xs">
                Today • Active Dispatch Thread
              </div>
            </div>

            {/* Messages */}
            {activeChat.messages.map((m) => {
              return (
                <div
                  key={m.id}
                  className={`flex items-end gap-2.5 ${m.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Guide Avatar for Incoming */}
                  {!m.isMe && (
                    <img
                      src={activeChat.avatar}
                      alt={activeChat.name}
                      className="h-7 w-7 rounded-full object-cover shrink-0 mb-1 border border-slate-200 shadow-2xs"
                    />
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-md md:max-w-lg rounded-2xl px-4 py-2.5 text-xs shadow-2xs leading-relaxed ${
                      m.isMe
                        ? 'bg-[#0552A2] text-white rounded-br-xs'
                        : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    {!m.isMe && (
                      <p className="text-[10px] font-bold text-[#0552A2] mb-1">
                        {m.sender}
                      </p>
                    )}

                    <p className="text-xs whitespace-pre-wrap">{m.text}</p>

                    <div
                      className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${
                        m.isMe ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{m.time}</span>
                      {m.isMe && <CheckCheck className="h-3 w-3 text-blue-200" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="h-6 w-6 rounded-full object-cover border border-slate-200"
                />
                <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 shadow-2xs flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-slate-600">
                    {activeChat.name.split(' ')[0]} is typing
                  </span>
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0552A2] animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0552A2] animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0552A2] animate-bounce [animation-delay:0.4s]" />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-4 pt-2.5 pb-1 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickPromptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (chip.action) {
                    chip.action();
                  } else if (chip.query) {
                    handleSendMessage(chip.query);
                  }
                }}
                className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#0552A2] border border-slate-200/70 hover:border-blue-200 transition-colors cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80 relative">
            {/* Emoji Picker Popup */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-4 bg-white border border-slate-200 rounded-xl shadow-lg p-2.5 z-20 flex gap-2 text-lg">
                {['🏔️', '🥾', '☕', '🇳🇵', '🎒', '☀️', '🧭', '👍', '🙏', '❄️'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setDraft((prev) => prev + emoji);
                      setShowEmojiPicker(false);
                      inputRef.current?.focus();
                    }}
                    className="p-1 hover:bg-slate-100 rounded cursor-pointer transition-transform hover:scale-110"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Attachment Button */}
              <button
                type="button"
                onClick={() => {
                  showToast?.('Permit or gear document uploaded to dispatch.');
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Attach Document / Photo"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              {/* Emoji Button */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Insert Travel Emoji"
              >
                <Smile className="h-4 w-4" />
              </button>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Message ${activeChat.name.split(' ')[0]} (trail tips, weather, logistics)...`}
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-[13px] rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20 focus:border-[#0552A2] transition-all"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!draft.trim()}
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  draft.trim()
                    ? 'bg-[#0552A2] hover:bg-[#044182] text-white shadow-xs cursor-pointer active:scale-95'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Send</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </main>

        {/* ================= COLUMN 3: RIGHT CONTEXT DRAWER / PANEL ================= */}
        {showRightPanel && (
          <aside className="w-full lg:w-[320px] xl:w-[340px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200/90 bg-slate-50/60 overflow-y-auto flex flex-col p-4 space-y-4">
            
            {/* Context Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Compass className="h-4 w-4 text-[#0552A2]" />
                <span>Expedition &amp; Guide Dossier</span>
              </div>
              <button
                onClick={() => setShowRightPanel(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                title="Hide Context Panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Trip Overview Card */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-500">Active Trip</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
                  {activeChat.trip.status}
                </span>
              </div>

              <h3 className="text-xs font-bold text-slate-900 leading-snug">
                {activeChat.trip.title}
              </h3>

              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Reference:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-[#0552A2]">
                    <span>{activeChat.trip.reference}</span>
                    <button
                      onClick={() => handleCopyBookingRef(activeChat.trip.reference)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                      title="Copy Reference"
                    >
                      {copiedRef ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Dates:</span>
                  <span className="font-medium text-slate-700">{activeChat.trip.dates}</span>
                </div>

                {activeChat.trip.altitude && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Current Altitude:</span>
                    <span className="font-bold text-slate-800">{activeChat.trip.altitude}</span>
                  </div>
                )}

                {activeChat.trip.weather && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Weather:</span>
                    <span className="font-medium text-slate-700">{activeChat.trip.weather}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Trail Route & Checkpoints */}
            {activeChat.trip.routeCheckpoints.length > 0 && (
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Trail Route &amp; Checkpoints</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {activeChat.trip.routeCheckpoints.filter((c) => c.completed).length} /{' '}
                    {activeChat.trip.routeCheckpoints.length} passed
                  </span>
                </div>

                <div className="space-y-2 relative pl-3 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeChat.trip.routeCheckpoints.map((pt, i) => (
                    <div key={i} className="relative flex items-center justify-between text-[11px] gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full shrink-0 -ml-[13px] border-2 border-white ${
                            pt.current
                              ? 'bg-[#0552A2] ring-2 ring-blue-300'
                              : pt.completed
                              ? 'bg-emerald-500'
                              : 'bg-slate-300'
                          }`}
                        />
                        <span
                          className={`truncate ${
                            pt.current
                              ? 'font-bold text-[#0552A2]'
                              : pt.completed
                              ? 'font-medium text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {pt.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {pt.altitude}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guide Profile Credentials Card */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Verified Credentials</span>
              </div>

              <div className="space-y-2 text-[11px]">
                {activeChat.license && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">License / Certification</span>
                    <span className="font-semibold text-slate-800">{activeChat.license}</span>
                  </div>
                )}

                {activeChat.experience && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Field Experience</span>
                    <span className="font-medium text-slate-700">{activeChat.experience}</span>
                  </div>
                )}

                {activeChat.languages && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Spoken Languages</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {activeChat.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeChat.emergencyPhone && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Emergency Field Phone</span>
                    <a
                      href={`tel:${activeChat.emergencyPhone}`}
                      className="font-mono font-bold text-blue-700 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <PhoneCall className="h-3 w-3" />
                      <span>{activeChat.emergencyPhone}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-1">
              <Link
                href="/bookings"
                className="w-full inline-flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs transition-colors"
              >
                <span>View Full Booking</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>

              <button
                onClick={() => {
                  showToast?.('Offline topographic route map (14.2 MB) downloaded.');
                }}
                className="w-full inline-flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  <span>Download Offline Map</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">14 MB</span>
              </button>

              <button
                onClick={handleShareLocation}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0552A2] border border-blue-200 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Live GPS Coordinates</span>
              </button>

              <button
                onClick={() => setShowEmergencyModal(true)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                <span>Emergency SAR Dispatch</span>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* ================= MODAL: SATELLITE LINK TELEMETRY ================= */}
      {showSatelliteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-[#0552A2] animate-pulse" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Encrypted Satellite Link Telemetry
                </h3>
              </div>
              <button
                onClick={() => setShowSatelliteModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-emerald-800 font-medium">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Uplink Status: Connected</span>
                </div>
                <span className="font-mono font-bold">98% Signal</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Carrier Satellite:</span>
                  <span className="font-bold text-slate-800">Iridium NEXT / Thuraya-3</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">GPS Constellation Lock:</span>
                  <span className="font-bold text-slate-800">12 Satellites In View</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Field Gateway:</span>
                  <span className="font-bold text-slate-800">Lukla / Namche Relay #04</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Encryption:</span>
                  <span className="font-mono font-bold text-blue-700">AES-256 GCM</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSatelliteModal(false);
                showToast?.('Satellite connection refreshed successfully.');
              }}
              className="w-full py-2.5 rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white text-xs font-bold transition-all cursor-pointer"
            >
              Close &amp; Keep Connected
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: AUDIO / VIDEO CALL SIMULATION ================= */}
      {showCallModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="relative mx-auto w-20 h-20">
              <img
                src={activeChat.avatar}
                alt={activeChat.name}
                className="w-full h-full rounded-full object-cover border-4 border-blue-100 shadow-md"
              />
              <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-500 text-white shadow-xs">
                {showCallModal.type === 'audio' ? (
                  <Phone className="h-3.5 w-3.5" />
                ) : (
                  <Video className="h-3.5 w-3.5" />
                )}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base">{activeChat.name}</h3>
              <p className="text-xs text-slate-500">{activeChat.role}</p>
              <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center justify-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span>
                  {showCallModal.type === 'audio'
                    ? 'Connecting Encrypted Satellite Audio...'
                    : 'Opening Low-Latency Video Uplink...'}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowCallModal({ open: false, type: 'audio' });
                  showToast?.('Call ended.');
                }}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EMERGENCY SAR DISPATCH ================= */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-100 shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Emergency Mountain Rescue (SAR)
                </h3>
                <p className="text-xs text-slate-500">
                  Direct dispatch to Himalayan Rescue Association
                </p>
              </div>
            </div>

            <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl text-xs text-rose-900 space-y-1.5">
              <p className="font-bold">⚠️ Urgent Medical or Avalanche Evacuation only.</p>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                Triggering this broadcast shares your current satellite coordinates with the Nepal Police Mountain Rescue, CAAN, and nearest heli-charter base in Lukla/Pokhara.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-100 font-mono">
                <span className="text-slate-500">HRA 24/7 Hotline:</span>
                <span className="font-bold text-rose-700">+977 1 444 3210</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-100 font-mono">
                <span className="text-slate-500">Tourist Police SOS:</span>
                <span className="font-bold text-blue-700">1144 (Toll-Free)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowEmergencyModal(false);
                  showToast?.('🚨 Emergency SAR Beacon Broadcasted to HRA Team.');
                  handleSendMessage('🚨 EMERGENCY SOS: Requesting immediate SAR / Medical check at current checkpoint.');
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                Broadcast SOS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
