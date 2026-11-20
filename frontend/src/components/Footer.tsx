'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Mail,
  ArrowUpRight,
  MapPin,
  Map,
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <footer className="w-full border-t border-white/10 bg-[#031526] text-white font-inter">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-6 sm:pt-8 pb-5 sm:pb-6 space-y-5 sm:space-y-6">
        {/* 1. Brand Identity & Official Tourism Desk Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-white/10">
          <div className="space-y-1.5 max-w-lg">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <img
                src="/logo-white.webp"
                alt="Visit Nepal"
                className="h-6 sm:h-7 w-auto object-contain transition-opacity group-hover:opacity-90"
              />
              <span className="text-[9px] sm:text-[9.5px] font-bold tracking-[0.2em] text-[#FDB716] uppercase border-l border-white/20 pl-2">
                Official Tourism
              </span>
            </Link>

            <p className="text-[11.5px] sm:text-xs text-slate-300 font-light leading-snug">
              The official editorial tourism gateway to Nepal. Connecting global travelers with certified IFMGA Sherpa leaders, heritage tea houses, living cultures, and official national park permits.
            </p>
          </div>

          {/* Official Tourism Contact Strip */}
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 sm:px-4 sm:py-2.5 text-xs text-slate-300 shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#92C4EA] mb-1">
              Official Tourism Desk
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-row items-start sm:items-center gap-x-4 gap-y-1 text-[11px] sm:text-[11.5px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                <span>Bhrikutimandap, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                <a href="mailto:info@visitnepal.ai" className="hover:text-white transition-colors">
                  info@visitnepal.ai
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Structured Multi-Column Directory Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-6 sm:gap-8 lg:gap-10 pb-5 sm:pb-6 border-b border-white/10">
          {/* Column 1: DESTINATIONS */}
          <div className="space-y-2 sm:space-y-2.5">
            <h4 className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#92C4EA]">
              Destinations
            </h4>
            <ul className="space-y-1 sm:space-y-1.5 text-xs text-slate-300 font-light">
              <li>
                <Link href="/explore/dest_ebc" className="hover:text-white transition-colors block">
                  Everest Region
                </Link>
              </li>
              <li>
                <Link href="/explore/dest_annapurna" className="hover:text-white transition-colors block">
                  Annapurna Circuit
                </Link>
              </li>
              <li>
                <Link href="/explore/dest_langtang" className="hover:text-white transition-colors block">
                  Langtang Valley
                </Link>
              </li>
              <li>
                <Link href="/explore?q=Mustang" className="hover:text-white transition-colors block">
                  Upper Mustang
                </Link>
              </li>
              <li>
                <Link href="/explore?q=Kathmandu" className="hover:text-white transition-colors block">
                  Kathmandu Valley
                </Link>
              </li>
              <li>
                <Link href="/explore?q=Pokhara" className="hover:text-white transition-colors block">
                  Pokhara &amp; Lakes
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="inline-flex items-center gap-1 font-medium text-[#FDB716] hover:underline pt-0.5"
                >
                  <Map className="h-3 w-3" />
                  <span>Himalayan Atlas</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: EXPERIENCES */}
          <div className="space-y-2 sm:space-y-2.5">
            <h4 className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#92C4EA]">
              Experiences
            </h4>
            <ul className="space-y-1 sm:space-y-1.5 text-xs text-slate-300 font-light">
              <li>
                <Link href="/culture" className="hover:text-white transition-colors block">
                  Cultural Heritage
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-white transition-colors block">
                  Field Journal
                </Link>
              </li>
              <li>
                <Link href="/explore?q=Trek" className="hover:text-white transition-colors block">
                  Himalayan Trekking
                </Link>
              </li>
              <li>
                <Link href="/services?tab=activity" className="hover:text-white transition-colors block">
                  Alpine Adventures
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-white transition-colors block">
                  Expedition Schedule
                </Link>
              </li>
              <li>
                <Link
                  href="/custom-plan"
                  className="inline-flex items-center gap-1 font-medium text-[#FDB716] hover:underline pt-0.5"
                >
                  <span>Custom Trip</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: TRAVELER RESOURCES */}
          <div className="space-y-2 sm:space-y-2.5">
            <h4 className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#92C4EA]">
              Traveler Resources
            </h4>
            <ul className="space-y-1 sm:space-y-1.5 text-xs text-slate-300 font-light">
              <li>
                <Link href="/community" className="hover:text-white transition-colors block">
                  Traveler Community
                </Link>
              </li>
              <li>
                <Link href="/services?tab=hotel" className="hover:text-white transition-colors block">
                  Stay &amp; Hotel Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: COMPANY & INFORMATION */}
          <div className="space-y-2 sm:space-y-2.5">
            <h4 className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#92C4EA]">
              Company &amp; Info
            </h4>
            <ul className="space-y-1 sm:space-y-1.5 text-xs text-slate-300 font-light">
              <li>
                <Link href="/about" className="hover:text-white transition-colors block">
                  About Visit Nepal
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors block">
                  Official Tourism Desk
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-white transition-colors block">
                  Concierge Messages
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@visitnepal.ai"
                  className="inline-flex items-center gap-1 font-medium text-[#92C4EA] hover:text-white transition-colors pt-0.5"
                >
                  <span>Contact Support</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Legal & Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-slate-400 font-light text-center sm:text-left">
          <p>
            © 2026 <strong className="text-white font-medium">Visit Nepal Official Desk</strong>. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3.5 gap-y-1 text-[11px] sm:text-xs">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/refund-policy" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
