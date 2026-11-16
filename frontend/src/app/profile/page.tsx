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
  LogOut,
  Check,
  Compass,
  CalendarCheck,
  Building2,
  ConciergeBell,
  Repeat,
  ExternalLink,
  Radio,
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

/* Topographic contour lines with Himalayan mountain silhouettes */
function ContourLines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 480"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <g fill="none" stroke="#92C4EA" strokeWidth="1" opacity="0.14">
          {[40, 80, 120, 160, 200, 250, 310].map((r, i) => (
            <ellipse
              key={`a${i}`}
              cx="720"
              cy="100"
              rx={r * 1.5}
              ry={r * 0.75}
              transform="rotate(-14 720 100)"
            />
          ))}
          {[30, 70, 110, 160, 220].map((r, i) => (
            <ellipse
              key={`b${i}`}
              cx="120"
              cy="360"
              rx={r * 1.6}
              ry={r * 0.7}
              transform="rotate(10 120 360)"
            />
          ))}
        </g>
        <g fill="none" stroke="#FDB716" strokeWidth="1.2" opacity="0.3">
          <ellipse cx="720" cy="100" rx="30" ry="16" transform="rotate(-14 720 100)" />
        </g>
        {/* Mountain ridge silhouettes at bottom of hero */}
        <path
          d="M0 480 L0 390 L120 340 L210 380 L340 310 L480 375 L590 325 L730 400 L860 330 L1000 370 L1000 480 Z"
          fill="#020e1c"
          opacity="0.5"
        />
        <path
          d="M0 480 L0 410 L160 360 L280 415 L430 350 L560 405 L710 360 L850 420 L1000 385 L1000 480 Z"
          fill="#010a14"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}

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
      <span className="mt-1 font-mono text-[10px] font-semibold tracking-wider text-slate-500">
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
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 font-inter sm:px-6 lg:space-y-8 lg:px-8">
      {/* 1. Hero: Identity + The Cool Tilted Boarding Ticket Pass + Bottom Highlights Bar */}
      <section className="relative overflow-hidden rounded-3xl bg-[#031526] text-white shadow-[0_24px_60px_-28px_rgba(3,21,38,0.9)] border border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_0%,rgba(5,82,162,0.5),transparent_60%)]" />
        <ContourLines />

        {/* Hero Top Content Grid */}
        <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-12">
          {/* Left: User Identity */}
          <div className="min-w-0 space-y-5">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-slate-200 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
              <span>Active session · <span className="capitalize">{currentPersona.role}</span></span>
            </div>

            {/* Avatar & Title */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <img
                  src={currentPersona.avatar}
                  alt={activeName}
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-[#FDB716] ring-offset-4 ring-offset-[#031526] sm:h-24 sm:w-24 shadow-xl"
                />
              </div>
              <div className="min-w-0">
                <h1 className="font-poppins text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {activeName}
                </h1>
                <p className="mt-1 text-sm font-medium text-[#92C4EA] sm:text-base">
                  {currentPersona.title}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-slate-300">
              {currentPersona.description}
            </p>

            {/* Actions: Primary Portal + Sign Out */}
            <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
              <Link
                href={currentPersona.portalLink}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FDB716] px-5 py-3 text-sm font-semibold text-[#031526] shadow-md transition-all hover:bg-[#ffc944] active:scale-[0.98]"
              >
                Open {currentPersona.portalLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-[0.98]"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>

          {/* Right: The Cool Boarding Pass Ticket */}
          <div className="relative lg:rotate-[1.5deg] transition-transform duration-300 hover:rotate-0">
            <div className="relative overflow-hidden rounded-2xl bg-[#F4F8FB] text-slate-900 shadow-2xl border border-white/40">
              {/* Top Himalayan Tricolor Dash Strip */}
              <div className="h-2.5 bg-[repeating-linear-gradient(90deg,#0552A2_0_24px,#FDB716_24px_48px,#EC1F27_48px_72px,#ffffff_72px_96px)]" />

              {/* Physical Ticket Notches (Cutouts on Left & Right) */}
              <span className="absolute -left-3.5 top-[52%] h-7 w-7 rounded-full bg-[#031526] shadow-inner" />
              <span className="absolute -right-3.5 top-[52%] h-7 w-7 rounded-full bg-[#031526] shadow-inner" />

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

                {/* Barcode & Ledger ID */}
                <div className="border-t border-slate-200/80 pt-3">
                  <BarcodePattern value={`VN-2026-${activeRole.toUpperCase()}-SECURE`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bottom Highlights Strip: 3-column banner */}
        <div className="grid grid-cols-1 border-t border-white/10 bg-[#020d18]/70 backdrop-blur-xs sm:grid-cols-3">
          {currentPersona.highlights.map((h, i) => (
            <div
              key={h}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-medium text-slate-200 ${
                i > 0 ? 'sm:border-l border-white/10' : ''
              }`}
            >
              <Award className="h-4 w-4 text-[#FDB716] shrink-0" />
              <span>{h}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Unified Container (NO CARDS): Seamless Persona Switcher + Portals Directory */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
        {/* Switch Persona: Clean List View (Not Cards) */}
        <section
          aria-labelledby="switch-heading"
          className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 id="switch-heading" className="font-poppins text-xl font-bold text-slate-900">
                Switch persona
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
                Pick an identity to change your session, portal access and dashboard.
              </p>
            </div>
            <Repeat className="mt-1 hidden h-5 w-5 shrink-0 text-slate-300 sm:block" />
          </div>

          <ul className="mt-3 divide-y divide-slate-100">
            {personaProfiles.map((p) => {
              const isCurrent = p.role === activeRole;
              const isSwitching = switchingRole === p.role;
              const Icon = roleIcon[p.role] ?? Compass;

              return (
                <li key={p.role} className="py-2.5 first:pt-1 last:pb-1">
                  <div
                    className={`relative flex flex-wrap items-center gap-3 rounded-2xl p-3 transition-colors sm:flex-nowrap sm:gap-4 ${
                      isCurrent ? 'bg-[#EAF2FB]' : 'hover:bg-slate-50'
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-[#0552A2]" />
                    )}

                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="h-12 w-12 shrink-0 rounded-full object-cover border border-slate-200"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-slate-900">{p.name}</h3>
                        {isCurrent && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                            <Check className="h-3 w-3 stroke-[2.5]" />
                            Active
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#0552A2]">
                        <Icon className="h-3.5 w-3.5" />
                        <span className="capitalize">{p.role}</span>
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{p.email}</p>
                    </div>

                    {isCurrent ? (
                      <Link
                        href={p.portalLink}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0552A2] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#044182] sm:w-auto shadow-xs"
                      >
                        Open portal
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={isSwitching}
                        onClick={() => handleSwitchUser(p.role)}
                        className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-800 transition hover:border-[#0552A2] hover:text-[#0552A2] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
                      >
                        {isSwitching ? 'Switching…' : 'Switch'}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Portals & Operational Desks: Clean List View (Not Cards) */}
        <section
          aria-labelledby="portals-heading"
          className="self-start rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 id="portals-heading" className="font-poppins text-xl font-bold text-slate-900">
                Portals
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500">Go straight to any operations desk.</p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#0552A2] hover:underline"
            >
              Sign in <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <ul className="mt-2 divide-y divide-slate-100">
            {[
              { href: '/bookings', label: 'Bookings & QR boarding passes', role: 'traveler' as UserRole },
              { href: '/portals/guide', label: 'Mountain guide operations', role: 'guide' as UserRole },
              { href: '/portals/butler', label: 'Sherpa butler concierge', role: 'butler' as UserRole },
              { href: '/portals/business', label: 'Tour operator & agency suite', role: 'business' as UserRole },
              { href: '/portals/admin', label: 'NTB government admin desk', role: 'admin' as UserRole },
            ].map((p) => {
              const Icon = roleIcon[p.role] ?? Compass;
              const isCurrent = p.role === activeRole;

              return (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="group flex items-center gap-3 py-3.5 text-sm text-slate-800 transition-colors hover:text-[#0552A2]"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isCurrent
                          ? 'bg-[#0552A2] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-[#EAF2FB] group-hover:text-[#0552A2]'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1 font-medium">{p.label}</span>
                    {isCurrent && (
                      <span className="rounded-full bg-[#FDB716]/20 px-2 py-0.5 text-[11px] font-semibold text-[#8a6100]">
                        Yours
                      </span>
                    )}
                    <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-[#0552A2]" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5 text-xs text-slate-600 border border-slate-100">
            <Radio className="h-4 w-4 shrink-0 text-[#0552A2] animate-pulse" />
            <span>
              Emergency Dispatch hotline is synchronized with your TIMS digital pass above.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
