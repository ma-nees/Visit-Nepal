'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Award,
  Mail,
  Phone,
  Globe,
  CreditCard,
  ArrowRight,
  Shield,
  LogOut,
  UserCheck,
  Check,
  Compass,
  CalendarCheck,
  Building2,
  ConciergeBell,
  Sparkles,
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
  highlights: string[];
}

const personaProfiles: PersonaProfile[] = [
  {
    role: 'traveler',
    name: 'Aayush Pradhan',
    email: 'aayush.traveler@visitnepal.com',
    title: 'Verified Himalayan Trekker & Explorer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    portalLink: '/bookings',
    portalLabel: 'My Bookings & Passes',
    description: 'Active TIMS permits, mountain passes, certified guide bookings, and trekking itineraries.',
    highlights: ['Annapurna Circuit Pass', 'TIMS Verified 2026', 'High Altitude Clearance'],
  },
  {
    role: 'guide',
    name: 'Pasang Nuru Sherpa',
    email: 'pasang.sherpa@visitnepal.com',
    title: 'NMA & IFMGA Certified Lead Mountain Guide',
    avatar: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=200&q=80',
    portalLink: '/portals/guide',
    portalLabel: 'Mountain Guide Portal',
    description: 'Assigned expedition rosters, client altitude telemetry, daily rate payouts, and live dispatch.',
    highlights: ['14x Everest Summits', 'IFMGA Lead Badge', 'Wilderness First Responder'],
  },
  {
    role: 'butler',
    name: 'Mingma Sherpa',
    email: 'sherpa.butler@visitnepal.com',
    title: 'Dedicated Sherpa Butler & VIP Concierge',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    portalLink: '/portals/butler',
    portalLabel: 'Sherpa Butler Portal',
    description: 'Guest gear portage itineraries, VIP teahouse reservations, warm bedding logistics, and baggage tracking.',
    highlights: ['VIP Teahouse Desk', 'Khumbu Route Concierge', 'Portage Operations'],
  },
  {
    role: 'business',
    name: 'Himalayan Expeditions Enterprise',
    email: 'partner@himalayanexpeditions.com',
    title: 'Licensed Tour Operator & Expedition Suite',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    portalLink: '/portals/business',
    portalLabel: 'Agency Operations Hub',
    description: 'Manage client group bookings, mountain guide allocations, permit filings, and financial settlements.',
    highlights: ['TAAN Certified Agency', 'Helicopter Fleet Access', 'B2B Operator Portal'],
  },
  {
    role: 'admin',
    name: 'Ministry Tourism Officer',
    email: 'officer@ntb.gov.np',
    title: 'Nepal Tourism Board (NTB) Government Admin Desk',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    portalLink: '/portals/admin',
    portalLabel: 'NTB Government Desk',
    description: 'National real-time traveler tracking, TIMS & restricted permit queues, and compliance logs.',
    highlights: ['National Security Desk', 'Permit Approval Authority', 'Rescue Coordination'],
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, role, setRole, bookings, logout } = useApp();
  const [switchingRole, setSwitchingRole] = useState<UserRole | null>(null);

  const activeRole: UserRole = currentUser?.role || role || 'traveler';
  const activeName = currentUser?.name || 'Aayush Pradhan';
  const activeEmail = currentUser?.email || 'aayush.traveler@visitnepal.com';

  const currentPersona =
    personaProfiles.find((p) => p.role === activeRole) || personaProfiles[0];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSwitchUser = async (targetRole: UserRole) => {
    if (targetRole === activeRole) return;
    setSwitchingRole(targetRole);
    try {
      await setRole(targetRole);
    } finally {
      setSwitchingRole(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-inter">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#031526] via-[#053568] to-[#031526] p-6 sm:p-10 text-white border border-white/10 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-[#92C4EA] bg-white/10 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md">
            <Shield className="h-3.5 w-3.5 text-[#FDB716]" />
            <span>Himalayan Multi-Role Account Management · 2026</span>
          </div>
          <h1 className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white leading-tight">
            User Profile &amp; Operational Credentials
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 font-normal max-w-xl leading-relaxed">
            Manage your verified identity, access digital permits, or switch between Traveler, Guide, Butler, Agency, and Government roles below.
          </p>
        </div>
      </div>

      {/* 2. Active User Identity Showcase Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5 flex-1 min-w-0">
          <div className="relative">
            <img
              src={currentPersona.avatar}
              alt={activeName}
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border-2 border-[#0552A2] shadow-sm"
            />
            <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
          </div>

          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-inter text-xl sm:text-2xl font-semibold text-slate-900 truncate">
                {activeName}
              </h2>
              <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-0.5 text-xs font-semibold capitalize text-[#0552A2]">
                {activeRole} Persona
              </span>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                Active Session
              </span>
            </div>

            <p className="text-xs text-[#0552A2] font-semibold">{currentPersona.title}</p>
            <p className="text-xs text-slate-500 font-normal leading-relaxed">{currentPersona.description}</p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentPersona.highlights.map((h) => (
                <span
                  key={h}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-50 border border-slate-200/80 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                >
                  <Award className="h-3 w-3 text-[#FDB716]" />
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full sm:w-auto shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 sm:pt-0">
          <Link
            href={currentPersona.portalLink}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0552A2] text-white hover:bg-[#044182] px-4 py-2.5 text-xs font-medium font-inter transition-all shadow-xs active:scale-95"
          >
            <span>Launch Active Portal</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 px-4 py-2.5 text-xs font-medium font-inter transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 3. SWITCH USER / ACTIVE PERSONA DIRECTLY (KEY USER REQUIREMENT) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-poppins text-xl sm:text-2xl font-medium text-slate-900">
              Switch User &amp; Active Persona
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
              Click any verified identity below to immediately switch session credentials, portal access, and operational dashboards.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personaProfiles.map((p) => {
            const isCurrent = p.role === activeRole;
            const isSwitching = switchingRole === p.role;

            return (
              <div
                key={p.role}
                className={`flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 bg-white ${
                  isCurrent
                    ? 'border-[#0552A2] ring-2 ring-[#0552A2]/15 shadow-md'
                    : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Profile Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h3 className="font-inter text-sm font-semibold text-slate-900">
                          {p.name}
                        </h3>
                        <p className="text-[11px] text-[#0552A2] font-medium capitalize">
                          {p.role} Portal
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono truncate max-w-[160px]">
                          {p.email}
                        </p>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 shrink-0">
                        <Check className="h-3 w-3 text-emerald-600" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 px-2 py-0.5 text-[10px] font-medium capitalize shrink-0">
                        {p.role}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2">
                    {p.description}
                  </p>
                </div>

                {/* Footer Switch Button / Portal Link */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {isCurrent ? (
                    <Link
                      href={p.portalLink}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0552A2] py-2 text-xs font-medium font-inter transition-colors"
                    >
                      <span>Open {p.portalLabel}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled={isSwitching}
                      onClick={() => handleSwitchUser(p.role)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-[#0552A2] text-white py-2 text-xs font-medium font-inter transition-all active:scale-[0.98] cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>{isSwitching ? 'Switching...' : `Switch to ${p.name.split(' ')[0]}`}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Credentials & Portals Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Credentials Details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
          <h2 className="font-poppins text-lg font-medium text-slate-900">
            Account Credentials &amp; Verification
          </h2>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Mail className="h-4 w-4 text-[#0552A2] shrink-0" />
              <span>Registered Email: <strong>{activeEmail}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Phone className="h-4 w-4 text-[#0552A2] shrink-0" />
              <span>Contact Emergency Hotline: <strong>+977 9851012345</strong></span>
            </div>
            <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Globe className="h-4 w-4 text-[#0552A2] shrink-0" />
              <span>Permit Jurisdiction: <strong>Nepal National Tourism Authority</strong></span>
            </div>
            <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CreditCard className="h-4 w-4 text-[#0552A2] shrink-0" />
              <span>Digital TIMS Ledger ID: <strong>VN-2026-{activeRole.toUpperCase()}-SECURE</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Operational Portals */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-poppins text-lg font-medium text-slate-900">
              Operational Portals &amp; Hubs
            </h2>
            <Link
              href="/login"
              className="text-xs font-medium font-inter text-[#0552A2] hover:underline"
            >
              Sign In with Credentials
            </Link>
          </div>
          <p className="text-xs text-slate-500 font-normal">
            Direct navigation into each dedicated operational environment.
          </p>
          <div className="space-y-2">
            {[
              { href: '/bookings', label: 'My Bookings & QR Boarding Passes', badge: 'Traveler' },
              { href: '/portals/guide', label: 'Mountain Guide Operations Portal', badge: 'Guide' },
              { href: '/portals/butler', label: 'Sherpa Butler Concierge Portal', badge: 'Butler' },
              { href: '/portals/business', label: 'Tour Operator & Agency Suite', badge: 'Business' },
              { href: '/portals/admin', label: 'NTB Government Admin Desk', badge: 'Admin' },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="flex items-center justify-between rounded-xl border border-slate-200/90 px-3.5 py-2.5 text-xs font-medium font-inter text-slate-800 hover:bg-slate-50 hover:border-[#0552A2]/40 active:scale-[0.98] transition-all"
              >
                <span>{p.label}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {p.badge}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


