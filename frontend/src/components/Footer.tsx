'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Mail,
  ArrowUpRight,
  MapPin,
  ChevronDown,
} from 'lucide-react';

interface FooterSection {
  id: string;
  title: string;
  links: Array<{
    label: string;
    href: string;
    isExternal?: boolean;
    isHighlight?: boolean;
  }>;
}

const FOOTER_SECTIONS: FooterSection[] = [
  {
    id: 'destinations',
    title: 'Destinations',
    links: [
      { label: 'Everest Region', href: '/explore/dest_ebc' },
      { label: 'Annapurna Circuit', href: '/explore/dest_annapurna' },
      { label: 'Langtang Valley', href: '/explore/dest_langtang' },
      { label: 'Upper Mustang', href: '/explore?q=Mustang' },
      { label: 'Kathmandu Valley', href: '/explore?q=Kathmandu' },
      { label: 'Pokhara & Lakes', href: '/explore?q=Pokhara' },
    ],
  },
  {
    id: 'experiences',
    title: 'Experiences',
    links: [
      { label: 'Cultural Heritage', href: '/culture' },
      { label: 'Field Journal', href: '/stories' },
      { label: 'Himalayan Trekking', href: '/explore?q=Trek' },
      { label: 'Alpine Adventures', href: '/services?tab=activity' },
      { label: 'Expedition Schedule', href: '/schedule' },
      { label: 'Custom Trip', href: '/custom-plan', isHighlight: true, isExternal: true },
    ],
  },
  {
    id: 'traveler-resources',
    title: 'Traveler Resources',
    links: [
      { label: 'Traveler Community', href: '/community' },
      { label: 'Hotels & Stays Booking', href: '/hotels' },
      { label: 'My Bookings & Passes', href: '/bookings' },
      { label: 'District Travel Explorer', href: '/map', isHighlight: true, isExternal: true },
    ],
  },
  {
    id: 'company-support',
    title: 'Company & Support',
    links: [
      { label: 'About Visit Nepal', href: '/about' },
      { label: 'Official Tourism Desk', href: '/about' },
      { label: 'Concierge Messages', href: '/chat' },
      { label: 'Contact Support', href: 'mailto:info@visitnepal.ai', isHighlight: true, isExternal: true },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <footer className="w-full border-t border-white/10 bg-[#031526] text-white font-inter overflow-hidden">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-5 sm:py-7 lg:py-10 space-y-5 sm:space-y-6 lg:space-y-8">
        {/* =========================================================================
            1. BRAND IDENTITY & CONTACT HEADER
            ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-5 pb-4 sm:pb-6 border-b border-white/10">
          <div className="space-y-1.5 sm:space-y-2 max-w-xl min-w-0 text-left">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <img
                src="/logo-white.webp"
                alt="Visit Nepal"
                className="h-5.5 sm:h-7 w-auto object-contain transition-opacity group-hover:opacity-90 shrink-0"
              />
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#FDB716] uppercase border-l border-white/20 pl-2">
                Official Tourism
              </span>
            </Link>

            {/* Desktop Full Description */}
            <p className="hidden md:block text-xs sm:text-[13px] text-slate-300 font-light leading-relaxed max-w-md">
              The official editorial tourism gateway to Nepal. Connecting global travelers with certified IFMGA Sherpa leaders, heritage tea houses, living cultures, and official national park permits.
            </p>

            {/* Mobile Compact 1-line Description */}
            <p className="md:hidden text-xs text-slate-300 font-light leading-snug">
              Official tourism gateway to Nepal — permits, verified stays &amp; expeditions.
            </p>

            {/* Mobile Contact Quick Bar */}
            <div className="flex md:hidden items-center gap-3 pt-1 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 shrink-0">
                <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                <span>Kathmandu, Nepal</span>
              </div>
              <span className="text-white/20 select-none">•</span>
              <div className="flex items-center gap-1.5 min-w-0">
                <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                <a href="mailto:info@visitnepal.ai" className="hover:text-white truncate">
                  info@visitnepal.ai
                </a>
              </div>
            </div>
          </div>

          {/* Desktop Tourism Contact Information */}
          <div className="hidden md:flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 text-xs sm:text-[13px] text-slate-300 min-w-0">
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

        {/* =========================================================================
            2A. MOBILE COMPACT ACCORDION DIRECTORY (md:hidden)
            Drastically reduces vertical height on mobile with smooth expandable sections.
            ========================================================================= */}
        <div className="md:hidden divide-y divide-white/10 border-b border-white/10 pb-3">
          {FOOTER_SECTIONS.map((section) => {
            const isOpen = openSection === section.id;
            return (
              <div key={section.id} className="py-0.5">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between py-2 text-left text-xs font-bold uppercase tracking-[0.14em] text-[#92C4EA] hover:text-white transition-colors cursor-pointer select-none"
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="pb-2.5 pt-0.5 pl-1 animate-fade-in">
                    <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-slate-300 font-light">
                      {section.links.map((link) => (
                        <li key={link.label}>
                          {link.href.startsWith('mailto:') ? (
                            <a
                              href={link.href}
                              className={`py-0.5 inline-flex items-center gap-1 transition-colors ${
                                link.isHighlight
                                  ? 'text-[#FDB716] font-semibold hover:underline'
                                  : 'hover:text-white'
                              }`}
                            >
                              <span className="truncate">{link.label}</span>
                              {link.isExternal && <ArrowUpRight className="h-3 w-3 shrink-0" />}
                            </a>
                          ) : (
                            <Link
                              href={link.href}
                              className={`py-0.5 inline-flex items-center gap-1 transition-colors ${
                                link.isHighlight
                                  ? 'text-[#FDB716] font-semibold hover:underline'
                                  : 'hover:text-white'
                              }`}
                            >
                              <span className="truncate">{link.label}</span>
                              {link.isExternal && <ArrowUpRight className="h-3 w-3 shrink-0" />}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            2B. DESKTOP DIRECTORY GRID (hidden md:grid)
            Preserves the original 4-column layout, typography, and styling exactly.
            ========================================================================= */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-8 lg:gap-x-10 gap-y-6 sm:gap-y-8 pb-6 sm:pb-7 border-b border-white/10 text-left">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.id} className="space-y-2.5 min-w-0">
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#92C4EA]">
                {section.title}
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13px] text-slate-300 font-light">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('mailto:') ? (
                      <a
                        href={link.href}
                        className={`py-0.5 inline-flex items-center gap-1 transition-colors ${
                          link.isHighlight
                            ? 'font-semibold text-[#FDB716] hover:underline pt-0.5'
                            : 'hover:text-white'
                        }`}
                      >
                        <span>{link.label}</span>
                        {link.isExternal && <ArrowUpRight className="h-3 w-3 shrink-0" />}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className={`py-0.5 inline-flex items-center gap-1 transition-colors ${
                          link.isHighlight
                            ? 'font-semibold text-[#FDB716] hover:underline pt-0.5'
                            : 'hover:text-white'
                        }`}
                      >
                        <span>{link.label}</span>
                        {link.isExternal && <ArrowUpRight className="h-3 w-3 shrink-0" />}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* =========================================================================
            3. BOTTOM LEGAL & COPYRIGHT BAR
            ========================================================================= */}
        {/* Desktop Bottom Bar (hidden on mobile) */}
        <div className="hidden md:flex flex-row items-center justify-between gap-3 text-xs text-slate-400 font-light text-left">
          <p className="leading-relaxed">
            © 2026 <strong className="text-white font-medium">Visit Nepal Official Desk</strong>. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-end gap-x-3 sm:gap-x-4 gap-y-1.5 leading-relaxed">
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

        {/* Mobile Compact Bottom Bar (visible on mobile only) */}
        <div className="md:hidden flex flex-col items-center text-center gap-2 pt-0.5 text-xs text-slate-400 font-light">
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-slate-300 text-[11.5px]">
            <Link href="/privacy" className="hover:text-white py-0.5">
              Privacy Policy
            </Link>
            <span className="text-white/20 select-none">•</span>
            <Link href="/terms" className="hover:text-white py-0.5">
              Terms &amp; Conditions
            </Link>
            <span className="text-white/20 select-none">•</span>
            <Link href="/cookie-policy" className="hover:text-white py-0.5">
              Cookie Policy
            </Link>
            <span className="text-white/20 select-none">•</span>
            <Link href="/refund-policy" className="hover:text-white py-0.5">
              Refund Policy
            </Link>
          </div>

          <p className="text-[11px] text-slate-400">
            © 2026 <strong className="text-slate-300 font-medium">Visit Nepal Official Desk</strong>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
