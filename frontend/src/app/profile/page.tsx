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
  LogOut,
  Check,
  Compass,
  CalendarCheck,
  Building2,
  ConciergeBell,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { useApp, UserRole } from '@/context/AppContext';

interface PersonaProfile {
  role: UserRole;
  label: string;
  name: string;
  email: string;
  title: string;
  avatar: string;
  portalLink: string;
  portalLabel: string;
  description: string;
  highlights: string[];
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
    label: 'Traveler',
    name: 'Aayush Pradhan',
    email: 'aayush.traveler@visitnepal.com',
    title: 'Verified Himalayan trekker & explorer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    portalLink: '/dashboard',
    portalLabel: 'my bookings & passes',
    description: 'Active TIMS permits, mountain passes, certified guide bookings and trekking itineraries.',
    highlights: ['Annapurna Circuit Pass', 'TIMS Verified 2026', 'High Altitude Clearance'],
  },
  {
    role: 'guide',
    label: 'Guide',
    name: 'Pasang Nuru Sherpa',
    email: 'pasang.sherpa@visitnepal.com',
    title: 'NMA & IFMGA certified lead mountain guide',
    avatar: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=300&q=80',
    portalLink: '/portals/guide',
    portalLabel: 'mountain guide portal',
    description: 'Assigned expedition rosters, client altitude telemetry, daily rate payouts and live dispatch.',
    highlights: ['14x Everest Summits', 'IFMGA Lead Badge', 'Wilderness First Responder'],
  },
  {
    role: 'butler',
    label: 'Butler',
    name: 'Mingma Sherpa',
    email: 'sherpa.butler@visitnepal.com',
    title: 'Dedicated Sherpa butler & VIP concierge',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    portalLink: '/portals/butler',
    portalLabel: 'Sherpa butler portal',
    description: 'Guest gear portage itineraries, VIP teahouse reservations, warm bedding logistics and baggage tracking.',
    highlights: ['VIP Teahouse Desk', 'Khumbu Route Concierge', 'Portage Operations'],
  },
  {
    role: 'business',
    label: 'Agency',
    name: 'Himalayan Expeditions Enterprise',
    email: 'partner@himalayanexpeditions.com',
    title: 'Licensed tour operator & expedition suite',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    portalLink: '/portals/business',
    portalLabel: 'agency operations hub',
    description: 'Manage client group bookings, guide allocations, permit filings and financial settlements.',
    highlights: ['TAAN Certified Agency', 'Helicopter Fleet Access', 'B2B Operator Portal'],
  },
  {
    role: 'admin',
    label: 'Admin',
    name: 'Ministry Tourism Officer',
    email: 'officer@ntb.gov.np',
    title: 'Nepal Tourism Board (NTB) government admin desk',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    portalLink: '/portals/admin',
    portalLabel: 'NTB government desk',
    description: 'National real-time traveler tracking, TIMS and restricted permit queues, and compliance logs.',
    highlights: ['National Security Desk', 'Permit Approval Authority', 'Rescue Coordination'],
  },
];

/* Sharp, realistic vector barcode */
function BarcodePattern({ value }: { value: string }) {
  const bars = [
    3, 1, 2, 2, 1, 3, 1, 2, 3, 1, 1, 2, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1,
    2, 1, 1, 3, 2, 2, 1, 3, 1, 1, 2, 3, 2, 1, 1, 2, 3, 1, 2, 2, 1, 3, 1, 2,
    1, 3, 2, 1, 2, 2, 3, 1, 1, 2, 3, 2, 1, 1, 3, 2, 1, 2, 3, 1, 2, 1, 1, 3,
  ];

  let currentX = 2;
  const rects: React.ReactNode[] = [];

  bars.forEach((width, idx) => {
    if (idx % 2 === 0) {
      rects.push(
        <rect
          key={idx}
          x={currentX}
          y="0"
          width={width * 1.15}
          height="38"
          fill="#1e293b"
        />
      );
    }
    currentX += width * 1.6;
  });

  return (
    <div className="flex flex-col items-center">
      <svg
        className="h-9 w-full max-w-[280px]"
        viewBox={`0 0 ${currentX + 4} 38`}
        preserveAspectRatio="none"
      >
        {rects}
      </svg>
      <span className="mt-1 font-mono text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
        {value}
      </span>
    </div>
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

  const bookingCount = Array.isArray(bookings) ? bookings.length : 12;

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
    <div className="min-h-screen bg-slate-50 py-10 px-4 font-inter sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Open, unboxed layout (NO big dark card) */}
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          {/* Left Column: User Identity & Persona Switcher */}
          <div className="space-y-6">
            {/* Seamless Persona Switcher Pills */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Switch Operational Persona
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {personaProfiles.map((p) => {
                  const isCurrent = p.role === activeRole;
                  const isSwitching = switchingRole === p.role;
                  return (
                    <button
                      key={p.role}
                      type="button"
                      disabled={isSwitching}
                      onClick={() => handleSwitchUser(p.role)}
                      className={`cursor-pointer rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                        isCurrent
                          ? 'bg-[#0552A2] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-2xs'
                      }`}
                    >
                      {isSwitching ? '...' : p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile Avatar & Title */}
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <img
                  src={currentPersona.avatar}
                  alt={activeName}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border-2 border-[#0552A2] shadow-sm"
                />
                <span
                  className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500"
                  title="Active Session"
                />
              </div>

              <div className="min-w-0 space-y-1">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-semibold capitalize text-[#0552A2]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active {currentPersona.role}
                </div>
                <h1 className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                  {activeName}
                </h1>
                <p className="text-sm sm:text-base font-medium text-[#0552A2]">
                  {currentPersona.title}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              {currentPersona.description}
            </p>

            {/* Highlights Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {currentPersona.highlights.map((h) => (
                <span
                  key={h}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs"
                >
                  <Award className="h-3.5 w-3.5 text-[#FDB716]" />
                  {h}
                </span>
              ))}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={currentPersona.portalLink}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0552A2] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#044182] active:scale-[0.98]"
              >
                <span>Open {currentPersona.portalLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
              >
                <LogOut className="h-4 w-4 text-slate-500" />
                <span>Sign out</span>
              </button>
            </div>
          </div>

          {/* Right Column: The Cool Physical Ticket Boarding Pass */}
          <div className="relative mx-auto w-full max-w-md lg:rotate-[1.5deg] transition-transform duration-300 hover:rotate-0">
            <div className="relative overflow-hidden rounded-2xl bg-white text-slate-900 shadow-xl border border-slate-200/90">
              {/* Top Himalayan Tricolor Dash Strip */}
              <div className="h-2.5 bg-[repeating-linear-gradient(90deg,#0552A2_0_24px,#FDB716_24px_48px,#EC1F27_48px_72px,#ffffff_72px_96px)]" />

              {/* Physical Ticket Notches (Cutouts revealing page background bg-slate-50) */}
              <span className="absolute -left-3.5 top-[52%] h-7 w-7 rounded-full bg-slate-50 shadow-inner" />
              <span className="absolute -right-3.5 top-[52%] h-7 w-7 rounded-full bg-slate-50 shadow-inner" />

              <div className="p-5 sm:p-6 space-y-4">
                {/* Header: Visit Nepal + Digital TIMS pass + Verified Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#031526] text-[#FDB716] shadow-xs">
                      <Compass className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-poppins text-sm font-bold text-slate-900 leading-none">
                        Visit Nepal
                      </h4>
                      <p className="mt-1 text-[11px] font-medium text-slate-500">
                        Digital TIMS pass
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    Verified
                  </span>
                </div>

                {/* Holder Identity */}
                <div className="pt-1">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Holder
                  </p>
                  <p className="font-poppins text-base font-bold text-slate-900">
                    {activeName}
                  </p>
                  <p className="text-xs font-semibold text-[#0552A2] capitalize">
                    {activeRole}
                  </p>
                </div>

                {/* Perforated Divider Line */}
                <div className="border-t border-dashed border-slate-300 pt-4">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-xs">
                    <div className="flex items-start gap-2.5 sm:col-span-2">
                      <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0552A2]" />
                      <div className="min-w-0">
                        <dt className="text-[10px] uppercase font-semibold text-slate-400">Registered email</dt>
                        <dd className="break-all font-medium text-slate-800">{activeEmail}</dd>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0552A2]" />
                      <div>
                        <dt className="text-[10px] uppercase font-semibold text-slate-400">Emergency hotline</dt>
                        <dd className="font-semibold text-red-600">+977 1 4256909 / 1144</dd>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Globe className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0552A2]" />
                      <div>
                        <dt className="text-[10px] uppercase font-semibold text-slate-400">Jurisdiction</dt>
                        <dd className="font-medium text-slate-800">Nepal Tourism Authority</dd>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 sm:col-span-2">
                      <CalendarCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0552A2]" />
                      <div>
                        <dt className="text-[10px] uppercase font-semibold text-slate-400">Bookings</dt>
                        <dd className="font-medium text-slate-800">
                          {bookingCount} {bookingCount === 1 ? 'booking' : 'bookings'}
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>

                {/* Barcode & Monospace Ledger ID */}
                <div className="border-t border-slate-200/80 pt-3">
                  <BarcodePattern value={`VN-2026-${activeRole.toUpperCase()}-SECURE`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
