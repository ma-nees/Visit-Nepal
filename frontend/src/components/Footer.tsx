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
    <footer className="w-full border-t border-white/10 bg-[#031526] text-white font-inter overflow-hidden">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-7 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
        {/* 1. Brand Identity & Official Tourism Desk Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5 pb-5 sm:pb-6 border-b border-white/10">
          <div className="space-y-2 max-w-xl min-w-0 text-left">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <img
                src="/logo-white.webp"
                alt="Visit Nepal"
                className="h-6 sm:h-7 w-auto object-contain transition-opacity group-hover:opacity-90 shrink-0"
              />
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#FDB716] uppercase border-l border-white/20 pl-2">
                Official Tourism
              </span>
            </Link>

            <p className="text-xs sm:text-[13px] text-slate-300 font-light leading-relaxed max-w-md">
              The official editorial tourism gateway to Nepal. Connecting global travelers with certified IFMGA Sherpa leaders, heritage tea houses, living cultures, and official national park permits.
            </p>
          </div>

          {/* Official Tourism Contact Information */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 text-xs sm:text-[13px] text-slate-300 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate sm:overflow-visible">Bhrikutimandap, Kathmandu, Nepal</span>
            </div>
            <span className="hidden sm:inline text-white/20 select-none">•</span>
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <a
                href="mailto:info@visitnepal.ai"
                className="text-slate-300 hover:text-white transition-colors break-all"
              >
                info@visitnepal.ai
              </a>
            </div>
          </div>
        </div>

        {/* 2. Responsive Directory Grid (1-Col Mobile, 2-Col Tablet & Small Laptop, 4-Col Desktop) */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-8 lg:gap-x-10 gap-y-6 sm:gap-y-8 pb-6 sm:pb-7 border-b border-white/10 text-left">
          {/* Column 1 – Destinations */}
          <div className="space-y-2.5 min-w-0">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#92C4EA]">
              Destinations
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13px] text-slate-300 font-light">
              <li>
                <Link href="/explore/dest_ebc" className="hover:text-white transition-colors py-0.5 inline-block">
                  Everest Region
                </Link>
              </li>
              <li>
                <Link href="/explore/dest_annapurna" className="hover:text-white transition-colors py-0.5 inline-block">
                  Annapurna Circuit
                </Link>
              </li>
              <li>
                <Link href="/explore/dest_langtang" className="hover:text-white transition-colors py-0.5 inline-block">
                  Langtang Valley
                </Link>
              </li>
              <li>
                <Link href="/explore?q=Mustang" className="hover:text-white transition-colors py-0.5 inline-block">
                  Upper Mustang
                </Link>
              </li>
              <li>
                <Link href="/explore?q=Kathmandu" className="hover:text-white transition-colors py-0.5 inline-block">
                  Kathmandu Valley
                </Link>
              </li>
              <li>
                <Link href="/explore?q=Pokhara" className="hover:text-white transition-colors py-0.5 inline-block">
                  Pokhara &amp; Lakes
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 – Experiences */}
          <div className="space-y-2.5 min-w-0">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#92C4EA]">
              Experiences
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13px] text-slate-300 font-light">
              <li>
                <Link href="/culture" className="hover:text-white transition-colors py-0.5 inline-block">
                  Cultural Heritage
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-white transition-colors py-0.5 inline-block">
                  Field Journal
                </Link>
              </li>
              <li>
                <Link href="/explore?q=Trek" className="hover:text-white transition-colors py-0.5 inline-block">
                  Himalayan Trekking
                </Link>
              </li>
              <li>
                <Link href="/services?tab=activity" className="hover:text-white transition-colors py-0.5 inline-block">
                  Alpine Adventures
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-white transition-colors py-0.5 inline-block">
                  Expedition Schedule
                </Link>
              </li>
              <li>
                <Link
                  href="/custom-plan"
                  className="inline-flex items-center gap-1 font-semibold text-[#FDB716] hover:underline pt-0.5 transition-colors py-0.5"
                >
                  <span>Custom Trip</span>
                  <ArrowUpRight className="h-3 w-3 shrink-0" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 – Traveler Resources */}
          <div className="space-y-2.5 min-w-0">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#92C4EA]">
              Traveler Resources
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13px] text-slate-300 font-light">
              <li>
                <Link href="/community" className="hover:text-white transition-colors py-0.5 inline-block">
                  Traveler Community
                </Link>
              </li>
              <li>
                <Link
                  href="/services?tab=hotel"
                  className="hover:text-white transition-colors block py-0.5"
                >
                  Stay &amp; Hotel Booking
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="inline-flex items-center gap-1 font-semibold text-[#FDB716] hover:underline pt-0.5 transition-colors py-0.5"
                >
                  <span>District Travel Explorer</span>
                  <ArrowUpRight className="h-3 w-3 shrink-0" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 – Company & Info */}
          <div className="space-y-2.5 min-w-0">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#92C4EA]">
              Company &amp; Info
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13px] text-slate-300 font-light">
              <li>
                <Link href="/about" className="hover:text-white transition-colors py-0.5 inline-block">
                  About Visit Nepal
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors py-0.5 inline-block">
                  Official Tourism Desk
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-white transition-colors py-0.5 inline-block">
                  Concierge Messages
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@visitnepal.ai"
                  className="inline-flex items-center gap-1 font-semibold text-[#FDB716] hover:underline pt-0.5 transition-colors py-0.5"
                >
                  <span>Contact Support</span>
                  <ArrowUpRight className="h-3 w-3 shrink-0" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Legal & Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400 font-light text-left">
          <p className="leading-relaxed">
            © 2026 <strong className="text-white font-medium">Visit Nepal Official Desk</strong>. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-start sm:justify-end gap-x-3 sm:gap-x-4 gap-y-1.5 leading-relaxed">
            <Link href="/privacy" className="hover:text-white transition-colors py-0.5">
              Privacy Policy
            </Link>
            <span className="text-white/20 select-none">•</span>
            <Link href="/terms" className="hover:text-white transition-colors py-0.5">
              Terms &amp; Conditions
            </Link>
            <span className="text-white/20 select-none">•</span>
            <Link href="/cookie-policy" className="hover:text-white transition-colors py-0.5">
              Cookie Policy
            </Link>
            <span className="text-white/20 select-none">•</span>
            <Link href="/refund-policy" className="hover:text-white transition-colors py-0.5">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

