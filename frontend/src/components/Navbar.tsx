'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  UserCircle2,
  ArrowRight,
  Bell,
  MessageSquare,
  CheckCheck,
  LogOut,
  User,
  Shield,
  CalendarCheck,
  Compass,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const navLinks = [
  { href: '/explore', label: 'Packages' },
  { href: '/custom-plan', label: 'Custom Trip' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/services', label: 'Services' },
  { href: '/bookings', label: 'My Bookings' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, currentUser, logout, notificationsList, markAllRead } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const openMobile = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsClosing(false);
    setMobileOpen(true);
  };

  const closeMobile = () => {
    if (!mobileOpen || isClosing) return;
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setMobileOpen(false);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, 280);
  };

  const toggleMobile = () => {
    if (mobileOpen && !isClosing) {
      closeMobile();
    } else {
      openMobile();
    }
  };

  // Close notifications dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notifOpen]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isHome = pathname === '/';

  // Passive high-performance scroll listener to toggle transparency beyond 70px
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 70);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setMobileOpen(false);
    setIsClosing(false);
    setNotifOpen(false);
  }, [pathname]);

  // Lock body scroll and handle Escape key when mobile menu is open
  useEffect(() => {
    if (mobileOpen && !isClosing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen, isClosing]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const unreadCount = notificationsList.filter((n) => !n.read).length;

  // Header dynamic classes:
  // When mobile drawer is open: solid clean white background for seamless shutter connection
  // Initial state at top of hero: completely transparent, floating, white text & white logo.
  // Scrolled state (>70px or non-home pages): solid clean white background, dark blue navigation text, subtle bottom border & shadow.
  const isTransparent = isHome && !isScrolled && !mobileOpen;

  const headerBgClass = mobileOpen
    ? 'bg-white border-b border-slate-200 shadow-sm'
    : isTransparent
    ? 'bg-transparent border-transparent shadow-none'
    : 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs shadow-slate-900/5';

  const positionClass = isHome ? 'fixed top-0 left-0 right-0' : 'sticky top-0';

  return (
    <header
      className={`${positionClass} z-50 w-full transition-all duration-300 ease-in-out ${headerBgClass} border-t-0 m-0`}
    >
      <div className="flex h-12 sm:h-13 lg:h-[52px] w-full items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Brand: Visit Nepal Logo (White over hero, Royal Blue when scrolled or open) */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group py-0.5">
          <img
            src={isTransparent ? '/logo-white.webp' : '/logo-brand.webp'}
            alt="Visit Nepal"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo-brand.webp';
            }}
            className="h-6 sm:h-7 w-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
        </Link>

        {/* Minimal Desktop Nav: Elegant typography, whitespace-driven */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-inter">
          {navLinks.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 text-[13px] font-medium tracking-wide transition-colors duration-200 outline-none ${isTransparent
                  ? active
                    ? 'text-white font-medium'
                    : 'text-white/80 hover:text-white'
                  : active
                    ? 'text-[#0552A2] font-medium'
                    : 'text-[#10243A]/80 hover:text-[#0552A2]'
                  }`}
              >
                <span>{item.label}</span>
                {active && (
                  <span
                    className={`absolute -bottom-1 left-0 right-0 h-[2px] rounded-full ${isTransparent ? 'bg-[#FDB716]' : 'bg-[#0552A2]'
                      }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Sign In or Authenticated User Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <>
              {/* Messages shortcut (desktop) */}
              <Link
                href="/chat"
                className={`hidden md:flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-95 ${isTransparent
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-slate-600 hover:text-[#0552A2] hover:bg-slate-100'
                  }`}
                title="Concierge & Messages"
              >
                <MessageSquare className="h-4 w-4" />
              </Link>

              {/* Role Badge Indicator */}
              <Link
                href="/profile"
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all active:scale-95 ${isTransparent
                  ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-xs'
                  : 'bg-blue-50/90 hover:bg-blue-100 text-[#0552A2] border border-blue-200/70'
                  }`}
                title="Active Portal / Profile"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="capitalize">{currentUser.role || role || 'Traveler'}</span>
              </Link>

              {/* Notifications bell */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setNotifOpen((v) => !v)}
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer ${isTransparent
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-[#0552A2] hover:bg-slate-100'
                    }`}
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute 1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#EC1F27] text-[8px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div
                    ref={notifRef}
                    className="absolute right-0 mt-2.5 w-[calc(100vw-24px)] max-w-sm sm:w-[380px] rounded-2xl border border-slate-200/90 bg-white/98 backdrop-blur-xl shadow-[0_20px_50px_-10px_rgba(3,21,38,0.20),0_0_0_1px_rgba(3,21,38,0.04)] z-50 text-slate-900 animate-subtle-fade-up overflow-hidden font-inter"
                  >
                    {/* Header: Clean, balanced typography with pill count and action */}
                    <div className="flex items-center justify-between px-4.5 py-3 border-b border-slate-100 bg-slate-50/60">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 font-poppins uppercase tracking-wider">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <span className="bg-[#0552A2]/10 text-[#0552A2] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#0552A2] transition-colors cursor-pointer"
                      >
                        <CheckCheck className="h-3.5 w-3.5 text-[#0552A2]" />
                        <span>Mark read</span>
                      </button>
                    </div>

                    {/* Seamless Notification List (NO separated cards) */}
                    <div className="divide-y divide-slate-100/90 max-h-[320px] overflow-y-auto scrollbar-thin">
                      {notificationsList.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400">
                          No notifications at this time
                        </div>
                      ) : (
                        notificationsList.map((n) => {
                          const isPermit = n.title.toLowerCase().includes('permit');
                          const isBooking =
                            n.title.toLowerCase().includes('booking') ||
                            n.title.toLowerCase().includes('reservation') ||
                            n.title.toLowerCase().includes('confirmed');
                          const isWeather =
                            n.title.toLowerCase().includes('weather') ||
                            n.title.toLowerCase().includes('advisory');

                          return (
                            <div
                              key={n.id}
                              className={`group flex items-start gap-3 px-4.5 py-3 transition-colors duration-150 hover:bg-slate-50/80 cursor-pointer ${
                                !n.read ? 'bg-blue-50/30' : 'bg-transparent'
                              }`}
                            >
                              {/* Visual Circle Indicator */}
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5 ${
                                  isPermit
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : isBooking
                                    ? 'bg-blue-50 text-[#0552A2]'
                                    : isWeather
                                    ? 'bg-amber-50 text-amber-600'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {isPermit ? (
                                  <ShieldCheck className="h-4 w-4" />
                                ) : isBooking ? (
                                  <CalendarCheck className="h-4 w-4" />
                                ) : isWeather ? (
                                  <Compass className="h-4 w-4" />
                                ) : (
                                  <Bell className="h-4 w-4" />
                                )}
                              </div>

                              {/* Notification Body Text */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline justify-between gap-2">
                                  <span
                                    className={`text-xs font-semibold truncate ${
                                      !n.read ? 'text-slate-900 font-bold' : 'text-slate-800'
                                    }`}
                                  >
                                    {n.title}
                                  </span>
                                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                                    {n.time}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-[11px] text-slate-500 leading-relaxed font-normal">
                                  {n.body}
                                </p>
                              </div>

                              {/* Tiny Unread Accent Dot */}
                              {!n.read && (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#0552A2] ring-2 ring-blue-100 shrink-0 mt-2" />
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Aesthetic Bottom Action Bar */}
                    <div className="border-t border-slate-100 bg-slate-50/60 px-4.5 py-2.5 flex items-center justify-between">
                      <Link
                        href="/dashboard"
                        onClick={() => setNotifOpen(false)}
                        className="text-[11px] font-semibold text-slate-600 hover:text-[#0552A2] flex items-center gap-1 transition-colors"
                      >
                        <span>View all in Dashboard</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Live NTB Sync
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile: Direct redirect to /profile */}
              <Link
                href="/profile"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer ${isTransparent
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'text-slate-700 hover:text-[#0552A2] hover:bg-slate-100'
                  }`}
                title="My Profile & Switch User"
                aria-label="My Profile & Switch User"
              >
                <UserCircle2 className="h-5 w-5" />
              </Link>
            </>
          ) : (
            <>
              {/* Logged Out Visitor State: Sign In Button */}
              <Link
                href="/login"
                className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-medium font-inter tracking-wide transition-all active:scale-95 cursor-pointer ${isTransparent
                  ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-xs'
                  : 'bg-white hover:bg-blue-50 text-[#0552A2] border border-blue-200/80 shadow-2xs'
                  }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle: Ultra-smooth physical 3-line morph into X */}
          <button
            type="button"
            onClick={toggleMobile}
            className={`lg:hidden relative flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer ${
              isTransparent
                ? 'text-white hover:bg-white/10'
                : 'text-[#10243A] hover:bg-slate-100'
            }`}
            aria-label={mobileOpen && !isClosing ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileOpen && !isClosing}
          >
            <div className="relative w-4.5 h-3.5 flex flex-col justify-between items-center pointer-events-none">
              <span
                className={`block h-[2px] w-full rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                  isTransparent ? 'bg-white' : 'bg-slate-800'
                } ${
                  mobileOpen && !isClosing
                    ? 'translate-y-[6px] rotate-45'
                    : 'translate-y-0 rotate-0'
                }`}
              />
              <span
                className={`block h-[2px] w-full rounded-full transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isTransparent ? 'bg-white' : 'bg-slate-800'
                } ${
                  mobileOpen && !isClosing
                    ? 'opacity-0 scale-x-0'
                    : 'opacity-100 scale-x-100'
                }`}
              />
              <span
                className={`block h-[2px] w-full rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                  isTransparent ? 'bg-white' : 'bg-slate-800'
                } ${
                  mobileOpen && !isClosing
                    ? '-translate-y-[6px] -rotate-45'
                    : 'translate-y-0 rotate-0'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Shutter Overlay & Dropdown Menu */}
      {mobileOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            onClick={closeMobile}
            className={`lg:hidden fixed inset-0 top-12 sm:top-13 lg:top-[52px] bg-slate-950/45 backdrop-blur-xs z-40 ${
              isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
            }`}
            aria-hidden="true"
          />

          {/* Shutter Drawer: drops down from top on open, rolls back up on close */}
          <div
            className={`lg:hidden relative z-50 border-t border-slate-200/90 bg-white/98 backdrop-blur-md px-5 py-5 space-y-2 text-[#10243A] max-h-[85vh] overflow-y-auto font-inter shadow-2xl ${
              isClosing ? 'animate-shutter-up' : 'animate-shutter-down'
            }`}
          >
            <div className="space-y-1">
              <Link
                href="/"
                onClick={closeMobile}
                className="group flex items-center justify-between py-2 text-sm font-medium text-slate-800 hover:text-[#0552A2] border-b border-slate-100 transition-colors"
              >
                <span>Home</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#0552A2] group-hover:translate-x-0.5 transition-all" />
              </Link>
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className="group flex items-center justify-between py-2 text-sm font-medium text-slate-800 hover:text-[#0552A2] border-b border-slate-100 transition-colors"
                >
                  <span>{item.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#0552A2] group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
              <Link
                href="/schedule"
                onClick={closeMobile}
                className="group flex items-center justify-between py-2 text-sm font-medium text-slate-800 hover:text-[#0552A2] border-b border-slate-100 transition-colors"
              >
                <span>Schedule (14 Days)</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#0552A2] group-hover:translate-x-0.5 transition-all" />
              </Link>
              <Link
                href="/chat"
                onClick={closeMobile}
                className="group flex items-center justify-between py-2 text-sm font-medium text-slate-800 hover:text-[#0552A2] border-b border-slate-100 transition-colors"
              >
                <span>Messages &amp; Concierge</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#0552A2] group-hover:translate-x-0.5 transition-all" />
              </Link>
              <Link
                href="/culture"
                onClick={closeMobile}
                className="group flex items-center justify-between py-2 text-sm font-medium text-slate-800 hover:text-[#0552A2] border-b border-slate-100 transition-colors"
              >
                <span>Culture &amp; Heritage</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#0552A2] group-hover:translate-x-0.5 transition-all" />
              </Link>
              <Link
                href="/dashboard"
                onClick={closeMobile}
                className="group flex items-center justify-between py-2 text-sm font-medium text-slate-800 hover:text-[#0552A2] border-b border-slate-100 transition-colors"
              >
                <span>Traveler Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#0552A2] group-hover:translate-x-0.5 transition-all" />
              </Link>
              <Link
                href="/login"
                onClick={closeMobile}
                className="group flex items-center justify-between py-2 text-sm font-medium text-[#0552A2] hover:underline border-b border-slate-100 transition-colors"
              >
                <span>Partner &amp; Admin Portals</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#0552A2] group-hover:translate-x-0.5 transition-all" />
              </Link>

              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-between py-2.5 text-sm font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out / Log Out</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMobile}
                  className="w-full flex items-center justify-between py-2.5 text-sm font-bold text-[#0552A2] hover:underline"
                >
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Sign In to Portal</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            <div className="pt-2">
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <Link
                  href="/explore"
                  onClick={closeMobile}
                  className="rounded-xl bg-[#0552A2] text-white py-2.5 font-semibold hover:bg-[#044182] transition-colors shadow-2xs active:scale-95"
                >
                  Browse Packages
                </Link>
                <Link
                  href="/custom-plan"
                  onClick={closeMobile}
                  className="rounded-xl border border-slate-200 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 transition-colors active:scale-95"
                >
                  Custom Trip
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
