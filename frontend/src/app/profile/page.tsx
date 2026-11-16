'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
  Printer,
  Maximize2,
  QrCode,
  ShieldCheck,
  MapPin,
  Sparkles,
  Download,
  Calendar,
  CheckCircle2,
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
    label: 'Mountain Guide',
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
    label: 'Sherpa Butler',
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
    label: 'Tour Agency',
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
    label: 'NTB Admin',
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
function BarcodePattern({ value, height = 38 }: { value: string; height?: number }) {
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
          height={height}
          fill="#1e293b"
        />
      );
    }
    currentX += width * 1.6;
  });

  return (
    <div className="flex flex-col items-center">
      <svg
        style={{ height: `${height}px` }}
        className="w-full max-w-[280px]"
        viewBox={`0 0 ${currentX + 4} ${height}`}
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

  // Modal expand state
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const activeRole: UserRole = currentUser?.role || role || 'traveler';
  const activeName = currentUser?.name || 'Aayush Pradhan';
  const activeEmail = currentUser?.email || 'aayush.traveler@visitnepal.com';

  const currentPersona =
    personaProfiles.find((p) => p.role === activeRole) || personaProfiles[0];

  const bookingCount = Array.isArray(bookings) ? bookings.length : 12;

  // Escape key closes expanded pass
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        closeExpandedPass();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  // Smooth cinematic pass opening (No scissors)
  const openExpandedPass = () => {
    if (isExpanded || isOpening) return;
    setIsOpening(true);

    setTimeout(() => {
      setIsExpanded(true);
      setIsOpening(false);
    }, 280);
  };

  const closeExpandedPass = () => {
    setIsExpanded(false);
  };

  const handleLogout = () => {
    logout();
    if (showToast) showToast('Signed out of session');
    router.push('/login');
  };

  const handleSwitchUser = async (targetRole: UserRole) => {
    if (targetRole === activeRole || isExpanded || isOpening) return;
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

  // Download QR Code utility
  const handleDownloadQr = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 320, 320);
      ctx.fillStyle = '#0552A2';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('VISIT NEPAL TIMS 2026', 45, 40);
      ctx.fillStyle = '#031526';
      for (let i = 0; i < 18; i++) {
        for (let j = 0; j < 18; j++) {
          if ((i + j) % 2 === 0 || (i * j) % 3 === 0) {
            ctx.fillRect(52 + i * 12, 60 + j * 12, 11, 11);
          }
        }
      }
      ctx.font = '12px monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`TOKEN: VN-2026-${activeRole.toUpperCase()}`, 50, 300);

      const a = document.createElement('a');
      a.download = `TIMS-QR-${activeRole.toUpperCase()}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
      if (showToast) showToast('QR Code saved to downloads');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 font-inter text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Top: Seamless Persona Switcher Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Switch Persona:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {personaProfiles.map((p) => {
                const isCurrent = p.role === activeRole;
                const isSwitching = switchingRole === p.role;
                const Icon = roleIcon[p.role] || Compass;
                return (
                  <button
                    key={p.role}
                    type="button"
                    disabled={isSwitching || isExpanded || isOpening}
                    onClick={() => handleSwitchUser(p.role)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'bg-[#0552A2] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                    } disabled:opacity-50`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{isSwitching ? '...' : p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active session · <span className="capitalize">{currentPersona.role}</span></span>
          </div>
        </div>

        {/* Main Content: Left Identity + Right Interactive Animated Ticket Pass */}
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          {/* Left Column: User Identity Showcase */}
          <div className="space-y-6">
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
                <h1 className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                  {activeName}
                </h1>
                <p className="text-sm sm:text-base font-semibold text-[#0552A2]">
                  {currentPersona.title}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  {activeEmail}
                </p>
              </div>
            </div>

            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              {currentPersona.description}
            </p>

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
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:scale-[0.98]"
              >
                <LogOut className="h-4 w-4 text-slate-500" />
                <span>Sign out</span>
              </button>
            </div>
          </div>

          {/* Right Column: Physical Ticket with Fluid Lift & Zoom Animation */}
          <div className="relative mx-auto w-full max-w-md">
            {/* The Floating Ticket Wrapper */}
            <motion.div
              animate={
                isOpening
                  ? {
                      scale: 1.15,
                      y: -20,
                      rotateX: 10,
                      opacity: 0.6,
                      transition: { duration: 0.28, ease: 'easeOut' },
                    }
                  : {
                      y: [0, -6, 0],
                      rotate: 1.5,
                      scale: 1,
                      opacity: 1,
                      transition: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
                    }
              }
              whileHover={{ scale: 1.025, rotate: 0, transition: { duration: 0.25 } }}
              whileTap={{ scale: 0.98 }}
              onClick={openExpandedPass}
              role="button"
              tabIndex={0}
              aria-label="Click to inspect full digital TIMS ticket details"
              className="group relative cursor-pointer select-none"
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Interaction Hint Badge: "Click to inspect full details" */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0552A2] px-3.5 py-1 text-[11px] font-semibold text-white shadow-lg shadow-[#0552A2]/30 ring-1 ring-white/40 group-hover:scale-105 transition-transform">
                  <Maximize2 className="h-3 w-3" />
                  Click to inspect full details
                </span>
              </div>

              {/* The Physical Ticket Pass Card */}
              <div className="relative overflow-hidden rounded-2xl bg-white text-slate-900 shadow-xl border border-slate-200/90 transition-all duration-300 group-hover:shadow-2xl group-hover:border-[#0552A2]/40">
                {/* Top Himalayan Tricolor Dash Strip */}
                <div className="h-2.5 bg-[repeating-linear-gradient(90deg,#0552A2_0_24px,#FDB716_24px_48px,#EC1F27_48px_72px,#ffffff_72px_96px)]" />

                {/* Left & Right Physical Cutout Notches */}
                <span className="absolute -left-3.5 top-[52%] h-7 w-7 rounded-full bg-slate-50 shadow-inner z-20" />
                <span className="absolute -right-3.5 top-[52%] h-7 w-7 rounded-full bg-slate-50 shadow-inner z-20" />

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

                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        Verified
                      </span>
                      <Maximize2 className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#0552A2] transition-colors" />
                    </div>
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
            </motion.div>
          </div>
        </div>
      </div>

      {/* EXPANDED FULL-SCREEN DIGITAL TIMS PASS MODAL */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-md"
            onClick={closeExpandedPass}
          >
            {/* The Expanded Digital Pass Card */}
            <motion.div
              initial={{ scale: 0.9, y: 25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 15, opacity: 0 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200/90 text-slate-900 my-8"
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Top Himalayan Tricolor Dash Strip */}
              <div className="h-3 bg-[repeating-linear-gradient(90deg,#0552A2_0_30px,#FDB716_30px_60px,#EC1F27_60px_90px,#ffffff_90px_120px)]" />

              {/* Physical Cutout Notches */}
              <span className="absolute -left-4 top-[40%] h-8 w-8 rounded-full bg-slate-950/75 shadow-inner" />
              <span className="absolute -right-4 top-[40%] h-8 w-8 rounded-full bg-slate-950/75 shadow-inner" />

              {/* Close Button (X) */}
              <button
                type="button"
                onClick={closeExpandedPass}
                className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer z-20"
                aria-label="Close pass details"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-6 sm:p-8 space-y-6">
                {/* 1. Header: Visit Nepal Official Digital TIMS Pass */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#031526] text-[#FDB716] shadow-sm">
                    <Compass className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0552A2]">
                        Government of Nepal · Ministry of Tourism
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 animate-pulse">
                        <CheckCircle2 className="h-3 w-3 stroke-[2.5]" />
                        OFFICIAL VERIFIED
                      </span>
                    </div>
                    <h2 className="font-poppins text-xl sm:text-2xl font-bold text-slate-900">
                      Visit Nepal Official Digital TIMS Pass
                    </h2>
                  </div>
                </div>

                {/* 2. TRAVELER INFORMATION SECTION */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0552A2]">
                      1. Traveler Information
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-500">
                      Pass ID: VN-2026-{activeRole.toUpperCase()}-8848
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium">Full Name</span>
                      <p className="font-poppins font-bold text-slate-900 text-sm mt-0.5">{activeName}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium">Traveler Category</span>
                      <p className="font-semibold text-[#0552A2] capitalize mt-0.5">{currentPersona.title}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium">Verification Status</span>
                      <p className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                        <Check className="h-3.5 w-3.5" /> Biometrics Tier 3 Cleared
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-slate-400 font-medium">Registered Email</span>
                      <p className="font-medium text-slate-800 mt-0.5 break-all">{activeEmail}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium">Registration Date</span>
                      <p className="font-medium text-slate-800 mt-0.5">November 12, 2026</p>
                    </div>

                    <div className="sm:col-span-3 pt-1">
                      <span className="text-slate-400 font-medium">Emergency Contacts</span>
                      <div className="flex flex-wrap items-center gap-4 mt-0.5 font-semibold text-red-600">
                        <span>Heli Rescue SAR: +977 1 4256909</span>
                        <span>•</span>
                        <span>Tourist Police: 1144</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. TRAVEL INFORMATION SECTION */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0552A2]">
                      2. Travel &amp; Expedition Route
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {bookingCount} Confirmed Itineraries
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium">Authorized Trekking Region</span>
                      <p className="font-semibold text-slate-900 mt-0.5">
                        Khumbu / Sagarmatha &amp; Annapurna Sanctuary
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium">Destination &amp; Maximum Altitude</span>
                      <p className="font-semibold text-slate-900 mt-0.5">
                        Everest Base Camp (5,364m) / Kala Patthar (5,644m)
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium">Trekking Stages / Route</span>
                      <p className="font-medium text-slate-800 mt-0.5">
                        Lukla → Phakding → Namche → Dingboche → Lobuche → Gorak Shep
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium">Validity Window</span>
                      <p className="font-medium text-slate-800 mt-0.5">
                        Nov 20, 2026 – Dec 10, 2026 (21 Days)
                      </p>
                    </div>

                    <div className="sm:col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 font-medium">Assigned Agency &amp; Guide Ops</span>
                        <p className="font-semibold text-slate-800">Himalayan Sherpa Expeditions (TAAN Lic #G-4402)</p>
                      </div>
                      <span className="rounded-lg bg-blue-100/70 px-2.5 py-1 text-[11px] font-bold text-[#0552A2]">
                        IFMGA Escorted
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. VERIFICATION SECTION WITH ANIMATED SCANNING LASER */}
                <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/60 to-slate-50 p-5">
                  {/* Subtle Blue Scanning Laser Line */}
                  <motion.div
                    animate={{ y: [0, 110, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#0552A2] to-transparent shadow-[0_0_12px_#0552A2] pointer-events-none z-10"
                    style={{ willChange: 'transform' }}
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-[#0552A2]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                          Official Verification &amp; Checkpost Seal
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Authorized by Nepal Tourism Authority. Present this pass at Lukla, Namche, or Besisahar checkposts.
                      </p>
                      <div className="pt-2">
                        <BarcodePattern value={`VN-2026-${activeRole.toUpperCase()}-SECURE`} height={42} />
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-3.5 shadow-sm border border-slate-200 shrink-0">
                      <QrCode className="h-28 w-28 text-[#031526]" />
                      <span className="mt-1 font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        CHECKPOST SCAN
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. INTERACTIVE ACTION BUTTONS */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0552A2] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#044182] transition-colors"
                    >
                      <Printer className="h-4 w-4" />
                      <span>Print Pass</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                      <Download className="h-4 w-4 text-slate-500" />
                      <span>Download PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadQr}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                      <QrCode className="h-4 w-4 text-slate-500" />
                      <span>Download QR</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={closeExpandedPass}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <span>Back to Ticket</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
