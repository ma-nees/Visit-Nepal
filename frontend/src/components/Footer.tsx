'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Mountain,
  Compass,
  Mail,
  ArrowUpRight,
  MapPin,
  Map,
  Sparkles,
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <footer className="w-full border-t border-white/10 bg-[#031526] text-white font-inter">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-8 sm:pt-14 pb-8 sm:pb-12 space-y-8 sm:space-y-12">
        {/* 1. Brand Identity & Official Tourism Desk Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="space-y-3 max-w-xl">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <img
                src="/logo-white.webp"
                alt="Visit Nepal"
                className="h-7 sm:h-8 w-auto object-contain transition-opacity group-hover:opacity-90"
              />
              <span className="text-[9.5px] sm:text-[10px] font-bold tracking-[0.2em] text-[#FDB716] uppercase border-l border-white/20 pl-2 sm:pl-2.5">
                Official Tourism
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              The official editorial tourism gateway to Nepal. Connecting global travelers with certified IFMGA Sherpa leaders, heritage tea houses, living cultures, and official national park permits.
            </p>
          </div>

          {/* Official Tourism Contact Strip */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 space-y-2 text-xs text-slate-300 shrink-0">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#92C4EA]">
              Official Tourism Desk
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>Bhrikutimandap, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <a href="mailto:info@visitnepal.ai" className="hover:text-white transition-colors">
                  info@visitnepal.ai
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Structured Multi-Column Directory Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-8 gap-x-6 sm:gap-8 pb-8 border-b border-white/10">
          {/* Column 1: DESTINATIONS */}
          <div className="space-y-2.5 sm:space-y-3">
            <h4 className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#92C4EA]">
              Destinations
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-300 font-light">
              <li>
                <Link href="/explore/dest_ebc" className="hover:text-white transition-colors">
                  Everest Region
                </Link>
              </li>
              <li>
                <Link href="/explore/dest_annapurna" className="hover:text-white transition-colors">
                  Annapurna Circuit
                </Link>
              </li>
              <li>
                <Link href="/explore/dest_langtang" className="hover:text-white transition-colors">
                  Langtang Valley
                </Link>
              </li>
              <li>
                <Link href="/explore?q=Mustang" className="hover:text-white transition-colors">
                  Upper Mustang
                </Link>
              </li>
              <li>
                <Link href="/explore?q=Kathmandu" className="hover:text-white transition-colors">
                  Kathmandu Valley
                </Link>
              </li>
              <li>
                <Link href="/explore?q=Pokhara" className="hover:text-white transition-colors">
                  Pokhara &amp; Lakes
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="inline-flex items-center gap-1 font-semibold text-[#FDB716] hover:underline pt-0.5"
                >
                  <Map className="h-3 w-3" />
                  <span>Himalayan Atlas</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: EXPERIENCES */}
          <div className="space-y-2.5 sm:space-y-3">
            <h4 className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#92C4EA]">
              Experiences
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-300 font-light">
              <li>
                <Link href="/culture" className="hover:text-white transition-colors">
                  Cultural Heritage
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-white transition-colors">
                  Field Journal
                </Link>
              </li>
              <li>
                <Link href="/explore?q=Trek" className="hover:text-white transition-colors">
                  Himalayan Trekking
                </Link>
              </li>
              <li>
                <Link href="/services?tab=activity" className="hover:text-white transition-colors">
                  Alpine Adventures
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-white transition-colors">
                  Expedition Schedule
                </Link>
              </li>
              <li>
                <Link
                  href="/custom-plan"
                  className="inline-flex items-center gap-1 font-semibold text-[#FDB716] hover:underline pt-0.5"
                >
                  <span>Custom Trip</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: TRAVELER RESOURCES */}
          <div className="space-y-2.5 sm:space-y-3">
            <h4 className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#92C4EA]">
              Traveler Resources
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-300 font-light">
              <li>
                <Link href="/community" className="hover:text-white transition-colors">
                  Traveler Feed
                </Link>
              </li>
              <li>
                <Link href="/services?tab=permit" className="hover:text-white transition-colors">
                  Online TIMS Permits
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">
                  Mountain Safety
                </Link>
              </li>
              <li>
                <Link href="/services?tab=hotel" className="hover:text-white transition-colors">
                  Stays &amp; Lodges
                </Link>
              </li>
              <li>
                <Link href="/services?tab=transport" className="hover:text-white transition-colors">
                  Overland 4x4 Transport
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Planning Essentials
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: PORTALS & SERVICES */}
          <div className="space-y-2.5 sm:space-y-3">
            <h4 className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#92C4EA]">
              Portals &amp; Services
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-300 font-light">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Traveler Dashboard
                </Link>
              </li>
              <li>
                <Link href="/services?tab=guide" className="hover:text-white transition-colors">
                  Mountain Guides
                </Link>
              </li>
              <li>
                <Link href="/services?tab=butler" className="hover:text-white transition-colors">
                  Sherpa Butler Service
                </Link>
              </li>
              <li>
                <Link href="/portals/guide" className="hover:text-white transition-colors">
                  Guide Portal
                </Link>
              </li>
              <li>
                <Link href="/portals/butler" className="hover:text-white transition-colors">
                  Butler Portal
                </Link>
              </li>
              <li>
                <Link href="/portals/business" className="hover:text-white transition-colors">
                  Merchant Portal
                </Link>
              </li>
              <li>
                <Link href="/portals/admin" className="hover:text-white transition-colors">
                  Official Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: COMPANY & INFORMATION */}
          <div className="space-y-2.5 sm:space-y-3">
            <h4 className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#92C4EA]">
              Company &amp; Info
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-300 font-light">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Visit Nepal
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Official Tourism Desk
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-white transition-colors">
                  Concierge Messages
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Traveler Profile
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In to Portal
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@visitnepal.ai"
                  className="inline-flex items-center gap-1 font-semibold text-[#92C4EA] hover:text-white transition-colors pt-0.5"
                >
                  <span>Contact Support</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Legal & Copyright Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-light text-center md:text-left">
          <p>
            © 2026 <strong className="text-white font-medium">Visit Nepal Official Desk</strong>. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <span>•</span>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
