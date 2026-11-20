'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Mail,
  ArrowUpRight,
  MapPin,
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <footer className="w-full border-t border-white/10 bg-[#031526] text-white font-inter">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-7 space-y-5 sm:space-y-6">
        {/* 1. Compact Brand Identity & Official Tourism Desk Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 sm:pb-5 border-b border-white/10">
          <div className="space-y-1.5 max-w-xl">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <img
                src="/logo-white.webp"
                alt="Visit Nepal"
                className="h-6 sm:h-6.5 w-auto object-contain transition-opacity group-hover:opacity-90"
              />
              <span className="text-[9.5px] font-bold tracking-[0.2em] text-[#FDB716] uppercase border-l border-white/20 pl-2">
                Official Tourism
              </span>
            </Link>

            <p className="text-xs text-slate-300 font-light leading-relaxed max-w-md">
              The official editorial tourism gateway to Nepal. Connecting global travelers with certified IFMGA Sherpa leaders, heritage tea houses, living cultures, and official national park permits.
            </p>
          </div>

          {/* Compact Official Tourism Contact Information */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs text-slate-300 shrink-0">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>Bhrikutimandap, Kathmandu, Nepal</span>
            </div>
            <span className="hidden sm:inline text-white/20">•</span>
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <a href="mailto:info@visitnepal.ai" className="text-slate-300 hover:text-white transition-colors">
                info@visitnepal.ai
              </a>
            </div>
          </div>
        </div>

        {/* 2. Compact 4-Column Directory Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 sm:gap-x-8 lg:gap-10 gap-y-6 pb-5 sm:pb-6 border-b border-white/10">
          {/* Column 1 – Destinations */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#92C4EA]">
              Destinations
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 font-light">
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
                  className="inline-flex items-center gap-1 font-semibold text-[#FDB716] hover:underline pt-0.5 transition-colors"
                >
                  <span>Himalayan Atlas</span>
                  <ArrowUpRight className="h-3 w-3 shrink-0" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 – Experiences */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#92C4EA]">
              Experiences
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 font-light">
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
                  className="inline-flex items-center gap-1 font-semibold text-[#FDB716] hover:underline pt-0.5 transition-colors"
                >
                  <span>Custom Trip</span>
                  <ArrowUpRight className="h-3 w-3 shrink-0" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 – Traveler Resources */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#92C4EA]">
              Traveler Resources
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 font-light">
              <li>
                <Link href="/community" className="hover:text-white transition-colors">
                  Traveler Community
                </Link>
              </li>
              <li>
                <Link
                  href="/services?tab=hotel"
                  className="inline-flex items-center gap-1 font-semibold text-[#FDB716] hover:underline pt-0.5 transition-colors"
                >
                  <span>Stay &amp; Hotel Booking</span>
                  <ArrowUpRight className="h-3 w-3 shrink-0" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 – Company & Info */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#92C4EA]">
              Company &amp; Info
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 font-light">
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
                <a
                  href="mailto:info@visitnepal.ai"
                  className="inline-flex items-center gap-1 font-semibold text-[#FDB716] hover:underline pt-0.5 transition-colors"
                >
                  <span>Contact Support</span>
                  <ArrowUpRight className="h-3 w-3 shrink-0" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Compact Bottom Legal & Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] sm:text-xs text-slate-400 font-light text-center sm:text-left">
          <p>
            © 2026 <strong className="text-white font-medium">Visit Nepal Official Desk</strong>. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/refund-policy" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
