'use client';

import Link from 'next/link';
import {
  ShieldCheck,
  Mountain,
  Compass,
  PhoneCall,
  Mail,
  ArrowUpRight,
  MapPin,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#031526] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Main Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Brand & Identity (Col 1 to 5) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <img
                src="/logo-white.webp"
                alt="Visit Nepal"
                className="h-8 w-auto object-contain transition-opacity group-hover:opacity-90"
              />
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#FDB716] uppercase border-l border-white/20 pl-2.5">
                Official Tourism
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-sm">
              The official editorial tourism gateway to Nepal. Connecting global travelers with certified IFMGA Sherpa leaders, heritage tea houses, living cultures, and official national park permits.
            </p>

            {/* Official Accreditations */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-slate-300">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#92C4EA]" />
                <span>Nepal Tourism Board</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1">
                <Mountain className="h-3.5 w-3.5 text-[#FDB716]" />
                <span>TAAN Authorized</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1">
                <Compass className="h-3.5 w-3.5 text-emerald-400" />
                <span>IFMGA Certified</span>
              </span>
            </div>
          </div>

          {/* Destinations (Col 6 to 7) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#92C4EA]">
              <Link href="/destinations" className="hover:text-white transition-colors">
                Destinations
              </Link>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-light">
              <li>
                <Link href="/destinations" className="hover:text-white transition-colors">
                  All Regions Map
                </Link>
              </li>
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
            </ul>
          </div>

          {/* Experiences (Col 8 to 9) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#92C4EA]">
              <Link href="/experiences" className="hover:text-white transition-colors">
                Experiences
              </Link>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-light">
              <li>
                <Link href="/experiences" className="hover:text-white transition-colors">
                  Himalayan Trekking
                </Link>
              </li>
              <li>
                <Link href="/services?tab=guide" className="hover:text-white transition-colors">
                  Mountaineering Guides
                </Link>
              </li>
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
                <Link href="/about" className="hover:text-white transition-colors">
                  About Nepal
                </Link>
              </li>
              <li>
                <Link href="/custom-plan" className="inline-flex items-center gap-1 font-semibold text-[#FDB716] hover:underline pt-0.5">
                  <span>Custom Itinerary</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Travel Desk & SOS Emergency (Col 10 to 12) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#EC1F27] flex items-center gap-1.5">
              <PhoneCall className="h-3.5 w-3.5" />
              <span>24/7 Mountain Emergency</span>
            </h4>
            <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-3 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span className="font-light">Tourist Police Desk:</span>
                <strong className="text-white font-mono">1144</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="font-light">Heli Rescue Dispatch:</span>
                <strong className="text-white font-mono">+977 1 4256909</strong>
              </div>
            </div>

            <div className="space-y-1 pt-1 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>Bhrikutimandap, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <a href="mailto:info@visitnepal.ai" className="hover:text-white transition-colors">
                  info@visitnepal.ai
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Editorial Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-light">
          <p>
            © 2026 <strong className="text-white font-medium">Visit Nepal Official Desk</strong>. All rights reserved. Where the Himalayas meet extraordinary journeys.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/services?tab=permit" className="hover:text-white transition-colors">
              Online TIMS Permits
            </Link>
            <span>•</span>
            <Link href="/explore" className="hover:text-white transition-colors">
              Mountain Safety
            </Link>
            <span>•</span>
            <Link href="/community" className="hover:text-white transition-colors">
              Traveler Feed
            </Link>
            <span>•</span>
            <Link href="/login" className="hover:text-white transition-colors">
              Portals
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
