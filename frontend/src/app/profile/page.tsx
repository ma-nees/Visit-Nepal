'use client';

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
} from 'lucide-react';
import { currentUser } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

export default function ProfilePage() {
  const router = useRouter();
  const { bookings, role, logout } = useApp();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Header Banner: Compact, clean */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#031526] via-[#053568] to-[#031526] p-6 sm:p-8 text-white border border-white/10">
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-[#92C4EA]">
            <Shield className="h-3.5 w-3.5" />
            <span>Verified Himalayan Traveler Identity 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Traveler Profile &amp; Expedition Credentials
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
            Digital TIMS trekking permit profiles, passport verification, emergency contacts, and summit badges.
          </p>
        </div>
      </div>

      {/* Header Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="h-20 w-20 rounded-xl object-cover border-2 border-[#0552A2]"
        />
        <div className="flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900">
              {currentUser.name}
            </h1>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold capitalize text-[#0552A2]">
              {role} Account
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{currentUser.bio}</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentUser.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-800"
              >
                <Award className="h-3 w-3 text-[#FDB716]" />
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Log Out Button */}
        <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 px-4 py-2 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out / Log Out</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Trips Completed
          </p>
          <p className="mt-1 text-2xl font-extrabold text-[#0552A2]">
            {currentUser.tripsCompleted}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Active Bookings
          </p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-600">
            {bookings.filter((b) => b.status === 'Confirmed').length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Trail Reviews Written
          </p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">
            {currentUser.reviewsCount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Credentials */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3.5 shadow-xs">
          <h2 className="text-sm font-extrabold text-slate-900">
            Traveler Credentials
          </h2>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <span>{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <span>{currentUser.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <Globe className="h-4 w-4 text-slate-400 shrink-0" />
              <span>Nationality: {currentUser.nationality}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <CreditCard className="h-4 w-4 text-slate-400 shrink-0" />
              <span>Passport / ID: {currentUser.passportNumber}</span>
            </div>
          </div>
        </div>

        {/* Role Portals */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#0552A2]" />
              <h2 className="text-sm font-extrabold text-slate-900">
                Partner &amp; Admin Portals
              </h2>
            </div>
            <Link
              href="/login"
              className="text-xs font-bold text-[#0552A2] hover:underline"
            >
              Switch Role &amp; Login
            </Link>
          </div>
          <p className="text-xs text-slate-500">
            Switch between authorized Visit Nepal role dashboards.
          </p>
          <div className="space-y-2 pt-1">
            {[
              {
                href: '/portals/business',
                label: 'Business & Expedition Agency Dashboard',
              },
              { href: '/portals/guide', label: 'Mountain Guide Operations Portal' },
              { href: '/portals/butler', label: 'Sherpa Butler Concierge Portal' },
              { href: '/portals/admin', label: 'NTB Government Admin Desk' },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 hover:border-[#0552A2]/40 active:scale-[0.98] transition-all"
              >
                <span>{p.label}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

