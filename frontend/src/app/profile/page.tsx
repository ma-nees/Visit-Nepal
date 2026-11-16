'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Award,
  Mail,
  Phone,
  Globe,
  ArrowRight,
  Shield,
  ShieldCheck,
  LogOut,
  Check,
  Compass,
  CalendarCheck,
  Building2,
  ConciergeBell,
  Sparkles,
  QrCode,
  MapPin,
  ExternalLink,
  ChevronRight,
  Radio,
  FileText,
  UserCheck,
  Clock,
  type LucideIcon,
} from 'lucide-react';
import { useApp, UserRole } from '@/context/AppContext';

interface PersonaProfile {
  role: UserRole;
  name: string;
  email: string;
  title: string;
  avatar: string;
  portalLink: string;
  portalLabel: string;
  description: string;
  badge: string;
  badgeColor: { bg: string; text: string; border: string; accent: string };
  highlights: string[];
  capabilities: string[];
}

const roleIcon: Record<UserRole, LucideIcon> = {
  traveler: Compass,
  guide: Award,
  butler: ConciergeBell,
  business: Building2,
  admin: Shield,
};

const personaProfiles: PersonaProfile[] = [
  {
    role: 'traveler',
    name: 'Aayush Pradhan',
    email: 'aayush.traveler@visitnepal.com',
    title: 'Verified Himalayan Trekker & Explorer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    portalLink: '/dashboard',
    portalLabel: 'Traveler Dashboard & Bookings',
    description: 'Manages digital TIMS permits, customized itineraries, certified guide bookings, and tea-house passes.',
    badge: 'Verified Explorer',
    badgeColor: {
      bg: 'bg-blue-50 text-[#0552A2] border-blue-200',
      text: 'text-[#0552A2]',
      border: 'border-blue-200',
      accent: '#0552A2',
    },
    highlights: ['Annapurna Circuit Pass', 'TIMS Verified 2026', 'High Altitude Clearance (5,416m)'],
    capabilities: ['Personal Trip Builder', 'QR Boarding Passes', 'Emergency SOS Broadcast', 'Permit Ledger'],
  },
  {
    role: 'guide',
    name: 'Pasang Nuru Sherpa',
    email: 'pasang.sherpa@visitnepal.com',
    title: 'NMA & IFMGA Certified Lead Mountain Guide',
    avatar: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80',
    portalLink: '/portals/guide',
    portalLabel: 'Mountain Guide Portal',
    description: 'Oversees expedition client rosters, live oxygen & altitude telemetry, trail conditions, and dispatch ops.',
    badge: 'IFMGA Lead Guide',
    badgeColor: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      accent: '#059669',
    },
    highlights: ['14x Everest Summits', 'Wilderness First Responder', 'NMA License #G-4402'],
    capabilities: ['Client Roster & Telemetry', 'Altitude Check-in Gateway', 'Trail Hazard Reporting', 'Payout Ledger'],
  },
  {
    role: 'butler',
    name: 'Mingma Sherpa',
    email: 'sherpa.butler@visitnepal.com',
    title: 'Dedicated Sherpa Butler & Alpine VIP Concierge',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    portalLink: '/portals/butler',
    portalLabel: 'Sherpa Butler Concierge Hub',
    description: 'Coordinates VIP teahouse reservations, heated bedding, gourmet meal prep, and baggage portage.',
    badge: 'VIP Concierge',
    badgeColor: {
      bg: 'bg-amber-50 text-amber-900 border-amber-200',
      text: 'text-amber-900',
      border: 'border-amber-200',
      accent: '#D97706',
    },
    highlights: ['Khumbu VIP Desk', 'Luxury Teahouse Liaison', 'Oxygen Logistics Expert'],
    capabilities: ['Teahouse Reservation Desk', 'Luggage Portage Tracking', 'Dietary & Dietary Logistics', 'Client Room Setup'],
  },
  {
    role: 'business',
    name: 'Himalayan Expeditions Enterprise',
    email: 'partner@himalayanexpeditions.com',
    title: 'Licensed Tour Operator & B2B Agency Suite',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    portalLink: '/portals/business',
    portalLabel: 'Agency Operations Hub',
    description: 'Administers corporate client bookings, customized itinerary quotations, guide allocations, and TAAN permit filings.',
    badge: 'Licensed Agency',
    badgeColor: {
      bg: 'bg-purple-50 text-purple-900 border-purple-200',
      text: 'text-purple-900',
      border: 'border-purple-200',
      accent: '#7C3AED',
    },
    highlights: ['TAAN Certified Agency', 'Helicopter Fleet Access', 'B2B Wholesale Operator'],
    capabilities: ['Custom Itinerary Quotations', 'Group Booking Management', 'Guide & Porter Allocation', 'Bank Payouts & Invoicing'],
  },
  {
    role: 'admin',
    name: 'Ministry Tourism Officer',
    email: 'officer@ntb.gov.np',
    title: 'Nepal Tourism Board (NTB) Government Desk',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    portalLink: '/portals/admin',
    portalLabel: 'NTB Government Oversight Desk',
    description: 'National real-time traveler tracking, restricted permit approvals, helicopter SAR coordination, and compliance.',
    badge: 'Government Official',
    badgeColor: {
      bg: 'bg-rose-50 text-rose-900 border-rose-200',
      text: 'text-rose-900',
      border: 'border-rose-200',
      accent: '#EC1F27',
    },
    highlights: ['National Security Desk', 'Restricted Permit Authority', 'Heli Search & Rescue Desk'],
    capabilities: ['Permit Review & Issuance', 'National Trail Tracker', 'Heli SAR Emergency Dispatch', 'Agency Audit Logs'],
  },
];

/* Topographic contour lines: elegant alpine backdrop texture */
function TopoContourBackground() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
    >
      <defs>
        <linearGradient id="contourGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#92C4EA" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#FDB716" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0552A2" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#contourGrad1)" strokeWidth="1.2">
        {[60, 110, 160, 210, 270, 330, 400, 480].map((r, i) => (
          <ellipse
            key={`a${i}`}
            cx="820"
            cy="110"
            rx={r * 1.6}
            ry={r * 0.75}
            transform="rotate(-12 820 110)"
          />
        ))}
        {[50, 100, 150, 210, 280, 360].map((r, i) => (
          <ellipse
            key={`b${i}`}
            cx="140"
            cy="440"
            rx={r * 1.7}
            ry={r * 0.7}
            transform="rotate(8 140 440)"
          />
        ))}
      </g>
      {/* Mountain peak rings */}
      <circle cx="820" cy="110" r="14" fill="#FDB716" fillOpacity="0.2" stroke="#FDB716" strokeWidth="1" />
      <circle cx="820" cy="110" r="5" fill="#FDB716" />
      <circle cx="140" cy="440" r="12" fill="#92C4EA" fillOpacity="0.2" stroke="#92C4EA" strokeWidth="1" />
    </svg>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, role, setRole, bookings, logout, showToast } = useApp();
  const [switchingRole, setSwitchingRole] = useState<UserRole | null>(null);

  const activeRole: UserRole = currentUser?.role || role || 'traveler';
  const activeName = currentUser?.name || 'Aayush Pradhan';
  const activeEmail = currentUser?.email || 'aayush.traveler@visitnepal.com';

  const currentPersona =
    personaProfiles.find((p) => p.role === activeRole) || personaProfiles[0];

  const bookingCount = Array.isArray(bookings) ? bookings.length : 0;
  const ActiveIcon = roleIcon[activeRole] || Compass;

  const handleLogout = () => {
    logout();
    if (showToast) showToast('Signed out of session');
    router.push('/login');
  };

  const handleSwitchUser = async (targetRole: UserRole) => {
    if (targetRole === activeRole) return;
    setSwitchingRole(targetRole);
    try {
      await setRole(targetRole);
      if (showToast) {
        const target = personaProfiles.find((p) => p.role === targetRole);
        showToast(`Switched persona to ${target?.name || targetRole}`);
      }
    } finally {
      setSwitchingRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 font-inter text-slate-800">
      {/* 1. Subtle Sub-Nav Breadcrumb & Status Ribbon */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="transition hover:text-[#0552A2]">
              Visit Nepal
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-medium text-slate-800">User Identity &amp; Operational Pass</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              TIMS National Gateway Live
            </span>
            <span className="hidden items-center gap-1 text-[11px] text-slate-400 sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0552A2]" />
              256-Bit Encrypted Session
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-6 sm:px-6 lg:px-8">
        {/* 2. Hero Section: Alpine Luxury Identity Showcase + Official Holographic Pass */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#020E1E] via-[#052F5C] to-[#021327] text-white shadow-2xl border border-white/10">
          <TopoContourBackground />

          {/* Ambient Lighting Orbs */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#0552A2]/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#FDB716]/15 blur-3xl" />

          <div className="relative z-10 grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-12">
            {/* Left: Active Identity Information */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-[#92C4EA] backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#FDB716]" />
                <span>Nepal Tourism Board · Verified Persona &amp; Pass</span>
              </div>

              {/* Avatar & Name */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="relative shrink-0">
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl p-1 bg-gradient-to-tr from-[#FDB716] via-white to-[#0552A2] shadow-xl">
                    <img
                      src={currentPersona.avatar}
                      alt={activeName}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  </div>
                  <span
                    className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#020E1E] bg-emerald-500 text-white shadow-md"
                    title="Active Identity"
                  >
                    <Check className="h-4 w-4 stroke-[3]" />
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FDB716] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#020E1E]">
                      <ActiveIcon className="h-3.5 w-3.5" />
                      {currentPersona.badge}
                    </span>
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                      ID: VN-2026-{activeRole.toUpperCase()}
                    </span>
                  </div>
                  <h1 className="font-poppins text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                    {activeName}
                  </h1>
                  <p className="text-sm font-medium text-[#92C4EA] sm:text-base">
                    {currentPersona.title}
                  </p>
                </div>
              </div>

              {/* Bio & Description */}
              <p className="max-w-xl text-sm leading-relaxed text-slate-200">
                {currentPersona.description}
              </p>

              {/* Highlights Pill Badges */}
              <div className="flex flex-wrap gap-2">
                {currentPersona.highlights.map((h) => (
                  <span
                    key={h}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-100 backdrop-blur-sm"
                  >
                    <Award className="h-3.5 w-3.5 text-[#FDB716]" />
                    {h}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={currentPersona.portalLink}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FDB716] to-[#f7a600] px-6 py-3 text-sm font-semibold text-[#020E1E] shadow-lg shadow-[#FDB716]/20 transition-all hover:brightness-105 active:scale-[0.98]"
                >
                  <span>Launch {currentPersona.portalLabel}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98]"
                >
                  <LogOut className="h-4 w-4 text-slate-300" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>

            {/* Right: Authentic Digital TIMS & Mountain License Card */}
            <div className="relative mx-auto w-full max-w-md">
              <div className="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/95 p-6 text-slate-900 shadow-2xl backdrop-blur-xl transition-transform duration-300 hover:scale-[1.01]">
                {/* Holographic Security Ribbon */}
                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#0552A2] via-[#92C4EA] via-[#FDB716] to-[#EC1F27]" />

                {/* Top Card Bar */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-4 pt-1">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Shield className="h-4 w-4 text-[#0552A2]" />
                      <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                        Government of Nepal · NTB
                      </span>
                    </div>
                    <p className="font-poppins text-sm font-bold text-slate-900 mt-0.5">
                      E-TIMS SMART PASS 2026
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                    <Check className="h-3 w-3 stroke-[3]" />
                    VERIFIED ACTIVE
                  </span>
                </div>

                {/* Card Middle: Chip + QR Code + Metadata */}
                <div className="my-5 grid grid-cols-[1fr_auto] items-center gap-4">
                  <div className="space-y-3">
                    {/* Simulated Smart Microchip */}
                    <div className="inline-flex h-8 w-11 items-center justify-center rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-1 shadow-inner">
                      <div className="h-full w-full rounded border border-amber-800/40 opacity-80 grid grid-cols-2 grid-rows-2 gap-0.5 p-0.5">
                        <div className="border-r border-b border-amber-900/50" />
                        <div className="border-b border-amber-900/50" />
                        <div className="border-r border-amber-900/50" />
                        <div />
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-medium uppercase text-slate-400">Pass Holder</p>
                      <p className="font-poppins text-base font-bold text-slate-900">{activeName}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-medium uppercase text-slate-400">Ledger Identification</p>
                      <p className="font-mono text-xs font-bold text-[#0552A2]">
                        VN-2026-{activeRole.toUpperCase()}-8848
                      </p>
                    </div>
                  </div>

                  {/* QR Code Graphic Box */}
                  <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center shadow-xs">
                    <div className="relative rounded-lg bg-white p-2 shadow-xs">
                      <QrCode className="h-16 w-16 text-[#031526]" />
                    </div>
                    <span className="mt-1 font-mono text-[9px] font-semibold text-slate-500">
                      SCAN @ CHECKPOST
                    </span>
                  </div>
                </div>

                {/* Card Details Grid */}
                <div className="space-y-2.5 rounded-xl bg-slate-50 p-3.5 text-xs border border-slate-100">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Mail className="h-3.5 w-3.5 text-[#0552A2]" /> Email
                    </span>
                    <span className="truncate max-w-[200px] font-medium text-slate-900">{activeEmail}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Phone className="h-3.5 w-3.5 text-[#0552A2]" /> Rescue Hotline
                    </span>
                    <span className="font-semibold text-red-600">+977 1 4256909 / 1144</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Globe className="h-3.5 w-3.5 text-[#0552A2]" /> Authority
                    </span>
                    <span className="font-medium text-slate-900">Nepal Tourism Board &amp; TAAN</span>
                  </div>
                  {activeRole === 'traveler' && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <CalendarCheck className="h-3.5 w-3.5 text-[#0552A2]" /> Confirmed Trips
                      </span>
                      <span className="rounded-md bg-blue-100 px-2 py-0.5 font-bold text-[#0552A2]">
                        {bookingCount} Active
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Micro-Notice */}
                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Authorized Himalayan Smart Pass</span>
                  <span className="font-mono">EXP: DEC 2026</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Persona Switcher Section: Aesthetic Grid of Roles */}
        <section aria-labelledby="persona-switcher-title" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0552A2]">
                <UserCheck className="h-4 w-4" />
                <span>Simulation &amp; Account Switching</span>
              </div>
              <h2 id="persona-switcher-title" className="font-poppins text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Switch Operational Persona
              </h2>
              <p className="text-sm text-slate-500 max-w-2xl mt-1">
                Experience the platform through different stakeholder perspectives. Switching personas immediately updates your session, permits, and dashboard permissions.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto shadow-2xs">
              5 Role Presets Available
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {personaProfiles.map((persona) => {
              const isCurrent = persona.role === activeRole;
              const isSwitching = switchingRole === persona.role;
              const Icon = roleIcon[persona.role] || Compass;

              return (
                <div
                  key={persona.role}
                  className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 ${
                    isCurrent
                      ? 'border-[#0552A2] bg-gradient-to-b from-blue-50/70 via-white to-white shadow-md ring-2 ring-[#0552A2]/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  {/* Active Indicator Top Pill */}
                  {isCurrent && (
                    <div className="absolute -top-3 right-5 flex items-center gap-1 rounded-full bg-[#0552A2] px-3 py-0.5 text-[11px] font-semibold text-white shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Session
                    </div>
                  )}

                  <div>
                    {/* Header: Avatar + Identity */}
                    <div className="flex items-start gap-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={persona.avatar}
                          alt={persona.name}
                          className="h-14 w-14 rounded-xl object-cover border border-slate-200 shadow-2xs"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white text-white ${
                            isCurrent ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-poppins text-sm font-bold text-slate-900">
                            {persona.name}
                          </h3>
                        </div>
                        <span
                          className={`inline-block mt-0.5 rounded px-2 py-0.5 text-[11px] font-semibold ${persona.badgeColor.bg} border ${persona.badgeColor.border}`}
                        >
                          {persona.badge}
                        </span>
                        <p className="mt-1 truncate text-xs text-slate-500 font-mono">
                          {persona.email}
                        </p>
                      </div>
                    </div>

                    {/* Bio & Scope */}
                    <p className="mt-3.5 text-xs leading-relaxed text-slate-600 line-clamp-2">
                      {persona.description}
                    </p>

                    {/* Feature tags */}
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {persona.capabilities.slice(0, 3).map((cap) => (
                        <span
                          key={cap}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                    {isCurrent ? (
                      <Link
                        href={persona.portalLink}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0552A2] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#044283] active:scale-[0.98] shadow-xs"
                      >
                        <span>Open Workspace</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={isSwitching}
                        onClick={() => handleSwitchUser(persona.role)}
                        className="w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-[#0552A2] hover:bg-slate-50 hover:text-[#0552A2] active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
                      >
                        {isSwitching ? (
                          <>
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                            <span>Switching...</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-3.5 w-3.5" />
                            <span>Switch to {persona.role}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Operational Portals Suite & Direct Access */}
        <section aria-labelledby="portals-title" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0552A2]">
                <Building2 className="h-4 w-4" />
                <span>Ecosystem Directory</span>
              </div>
              <h2 id="portals-title" className="font-poppins text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Specialized Operations Portals
              </h2>
              <p className="text-sm text-slate-500 max-w-2xl mt-1">
                Access dedicated operational workspaces designed for each tourism discipline.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0552A2] hover:underline self-start sm:self-auto"
            >
              <span>Credentials Login</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                title: 'Traveler Dashboard',
                desc: 'Passes, custom trips & itinerary vouchers',
                role: 'traveler' as UserRole,
                href: '/dashboard',
                color: 'from-blue-600 to-[#0552A2]',
              },
              {
                title: 'Mountain Guide Portal',
                desc: 'Expedition rosters & telemetry dispatch',
                role: 'guide' as UserRole,
                href: '/portals/guide',
                color: 'from-emerald-600 to-teal-800',
              },
              {
                title: 'Sherpa Butler Desk',
                desc: 'VIP teahouse concierge & luggage portage',
                role: 'butler' as UserRole,
                href: '/portals/butler',
                color: 'from-amber-600 to-orange-700',
              },
              {
                title: 'Agency Suite',
                desc: 'B2B quotes, custom plans & guide hiring',
                role: 'business' as UserRole,
                href: '/portals/business',
                color: 'from-purple-600 to-indigo-900',
              },
              {
                title: 'NTB Government Desk',
                desc: 'National permits, heli SAR & safety registry',
                role: 'admin' as UserRole,
                href: '/portals/admin',
                color: 'from-rose-600 to-[#EC1F27]',
              },
            ].map((item) => {
              const Icon = roleIcon[item.role] || Compass;
              const isCurrent = item.role === activeRole;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    isCurrent
                      ? 'border-[#0552A2] bg-white ring-2 ring-[#0552A2]/10 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-white bg-gradient-to-tr ${item.color} shadow-xs`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      {isCurrent && (
                        <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-[#0552A2]">
                          Current
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 font-poppins text-sm font-bold text-slate-900 group-hover:text-[#0552A2] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-[#0552A2]">
                    <span>Enter portal</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 5. 24/7 Mountain Emergency & Safety Information Bar */}
        <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-[#031526] to-slate-900 p-6 text-white shadow-md">
          <div className="grid gap-6 md:grid-cols-3 md:items-center">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FDB716]">
                <Radio className="h-3.5 w-3.5 animate-pulse text-red-500" />
                <span>24/7 Mountain Emergency Hotline</span>
              </div>
              <h3 className="font-poppins text-base font-bold text-white">
                Himalayan Search &amp; Rescue Grid
              </h3>
              <p className="text-xs text-slate-400">
                Direct emergency dispatch for high-altitude medevac, tourist police, and mountain distress.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                <span className="text-[11px] font-medium text-slate-400">Tourist Police</span>
                <p className="font-poppins text-base font-bold text-white mt-0.5">1144</p>
                <span className="text-[10px] text-emerald-400">Toll Free · 24/7</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                <span className="text-[11px] font-medium text-slate-400">Heli Rescue Dispatch</span>
                <p className="font-mono text-sm font-bold text-[#FDB716] mt-0.5">+977 1 4256909</p>
                <span className="text-[10px] text-slate-400">Civil Aviation Authority</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row md:justify-end">
              <Link
                href="/map"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                <MapPin className="h-3.5 w-3.5 text-[#FDB716]" />
                <span>Open Himalayan Map</span>
              </Link>
              <Link
                href="/bookings"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FDB716] px-4 py-2.5 text-xs font-bold text-[#031526] transition hover:bg-[#ffc944]"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>View Permits</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
