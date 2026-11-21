'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowLeft,
  Printer,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  FileText,
  Lock,
  Cookie,
  RotateCcw,
  Building2,
  Mail,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export interface LegalSection {
  id: string;
  title: string;
  number?: string;
}

export interface LegalPageLayoutProps {
  title: string;
  eyebrow?: string;
  description: string;
  lastUpdated: string;
  currentPolicy: 'privacy' | 'terms' | 'cookie-policy' | 'refund-policy';
  sections: LegalSection[];
  children: React.ReactNode;
}

const ALL_POLICIES = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    href: '/privacy',
    icon: Lock,
    tagline: 'Traveler credential security, TIMS data privacy, and encryption standards.',
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    href: '/terms',
    icon: FileText,
    tagline: 'Expedition agreements, IFMGA guide authority, and booking conditions.',
  },
  {
    id: 'cookie-policy',
    title: 'Cookie Policy',
    href: '/cookie-policy',
    icon: Cookie,
    tagline: 'Session management, browser storage, and traveler preferences.',
  },
  {
    id: 'refund-policy',
    title: 'Refund & Cancellation Policy',
    href: '/refund-policy',
    icon: RotateCcw,
    tagline: '14-day free trek cancellation, hotel policies, and alpine force majeure.',
  },
];

export default function LegalPageLayout({
  title,
  eyebrow = 'VISIT NEPAL · LEGAL & POLICIES',
  description,
  lastUpdated,
  currentPolicy,
  sections,
  children,
}: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  // Scroll spy to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      // Determine active section based on scroll position
      const scrollPosition = window.scrollY + 180;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setIsMobileTocOpen(false);
    const target = document.getElementById(id);
    if (target) {
      const headerOffset = 90;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  // Other policies excluding current
  const relatedPolicies = ALL_POLICIES.filter((p) => p.id !== currentPolicy);

  const activeSectionTitle =
    sections.find((s) => s.id === activeSection)?.title || sections[0]?.title || 'Table of Contents';

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-inter antialiased">
      {/* 1. Top Breadcrumb & Back Strip */}
      <div className="w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-xs sticky top-0 z-20">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-3 flex items-center justify-between gap-4 text-xs">
          <nav className="flex items-center gap-1.5 text-slate-500 overflow-x-auto no-scrollbar font-medium">
            <Link href="/" className="hover:text-[#0552A2] transition-colors whitespace-nowrap">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="text-slate-500 whitespace-nowrap">Legal &amp; Governance</span>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-900 whitespace-nowrap truncate max-w-[180px] sm:max-w-none">
              {title}
            </span>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0552A2] transition-colors cursor-pointer"
              title="Print Policy Document"
            >
              <Printer className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Print Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Editorial Header Block */}
      <header className="w-full border-b border-slate-200/80 bg-white py-8 sm:py-12 lg:py-14">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 space-y-4 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#EDF5FD] border border-blue-200/80 text-[11px] font-bold tracking-wider text-[#0552A2] uppercase">
            <ShieldCheck className="h-3.5 w-3.5 text-[#0552A2]" />
            <span>{eyebrow}</span>
          </div>

          <h1 className="font-poppins text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-bold text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl font-light leading-relaxed">
            {description}
          </p>

          {/* Metadata & Jurisdiction Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 border-t border-slate-100">
            <div>
              <span className="text-slate-400 font-medium">Effective Date: </span>
              <span className="font-semibold text-slate-800">{lastUpdated}</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-1 text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>Nepal Tourism Board Desk, Bhrikutimandap, Kathmandu</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Official Statutory Clearance</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Mobile Sticky Section Index Dropdown */}
      {sections.length > 0 && (
        <div className="lg:hidden sticky top-[41px] z-10 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
          <div className="px-4 sm:px-6 py-2.5">
            <button
              type="button"
              onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-800 p-1 cursor-pointer select-none"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#0552A2] tracking-wider shrink-0">
                  Jump to Section:
                </span>
                <span className="truncate font-bold text-slate-900">{activeSectionTitle}</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform shrink-0 ${
                  isMobileTocOpen ? 'rotate-180 text-[#0552A2]' : ''
                }`}
              />
            </button>

            {isMobileTocOpen && (
              <div className="mt-2 pt-2 border-t border-slate-100 max-h-60 overflow-y-auto space-y-1 animate-fade-in">
                {sections.map((s, idx) => {
                  const isCurrent = activeSection === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => scrollToSection(s.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        isCurrent
                          ? 'bg-[#EDF5FD] text-[#0552A2] font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">
                        {idx + 1}. {s.title}
                      </span>
                      {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-[#0552A2] shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Main Editorial Content Container */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12 lg:py-14">
        <div className="flex flex-col lg:flex-row items-start gap-10 xl:gap-14">
          {/* A. Sticky Table of Contents Sidebar (Desktop lg:) */}
          {sections.length > 0 && (
            <aside className="hidden lg:block lg:w-64 xl:w-72 shrink-0 sticky top-20">
              <div className="space-y-3 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider">
                    Contents
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{sections.length} Sections</span>
                </div>

                <nav className="space-y-1">
                  {sections.map((s, idx) => {
                    const isCurrent = activeSection === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => scrollToSection(s.id)}
                        className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition-all flex items-start gap-2 cursor-pointer group ${
                          isCurrent
                            ? 'bg-[#EDF5FD] text-[#0552A2] font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal'
                        }`}
                      >
                        <span
                          className={`font-mono text-[11px] shrink-0 ${
                            isCurrent ? 'text-[#0552A2]' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        >
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        <span className="leading-snug line-clamp-2">{s.title}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Desk Support Card */}
                <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5 text-slate-500">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Official Inquiries
                  </span>
                  <p className="text-[11.5px] leading-relaxed text-slate-600">
                    Questions about policy compliance or permits?
                  </p>
                  <a
                    href="mailto:info@visitnepal.ai"
                    className="inline-flex items-center gap-1 font-semibold text-[#0552A2] hover:underline text-xs"
                  >
                    <Mail className="h-3 w-3" />
                    <span>info@visitnepal.ai</span>
                  </a>
                </div>
              </div>
            </aside>
          )}

          {/* B. Main Legal Article Prose */}
          <article className="flex-1 max-w-3xl min-w-0 space-y-8 sm:space-y-10 text-slate-700 leading-relaxed font-inter">
            {children}

            {/* C. Official Authority Disclaimer */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-[#0552A2]" />
                <span>Statutory Authority &amp; Government Jurisdiction</span>
              </div>
              <p className="text-[12px] leading-relaxed text-slate-600">
                Visit Nepal operates under statutory authorization from the Nepal Tourism Board (NTB) and the Ministry of Culture, Tourism and Civil Aviation (MoCTCA). All expedition permits, Trekker Information Management System (TIMS) cards, and licensed mountain guide assignments adhere to official government directives.
              </p>
            </div>

            {/* D. Related Policies Cross-Link Grid */}
            <div className="pt-6 sm:pt-8 border-t border-slate-200 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0552A2]">
                  Explore Related Policies
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-poppins">
                  Traveler Protection &amp; Governance Directory
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedPolicies.map((policy) => {
                  const Icon = policy.icon;
                  return (
                    <Link
                      key={policy.id}
                      href={policy.href}
                      className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-[#0552A2]/50 transition-all group flex flex-col justify-between space-y-2"
                    >
                      <div className="space-y-1.5">
                        <div className="h-8 w-8 rounded-lg bg-slate-50 text-[#0552A2] group-hover:bg-[#EDF5FD] flex items-center justify-center transition-colors">
                          <Icon className="h-4 w-4" />
                        </div>
                        <h4 className="font-poppins text-xs font-bold text-slate-900 group-hover:text-[#0552A2] transition-colors">
                          {policy.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {policy.tagline}
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0552A2] pt-1">
                        <span>Read Policy</span>
                        <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* 5. Back to Top Floating Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-30 h-10 w-10 rounded-full bg-[#0552A2] hover:bg-[#044182] text-white shadow-lg flex items-center justify-center transition-all animate-fade-in cursor-pointer active:scale-95"
          title="Back to Top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
