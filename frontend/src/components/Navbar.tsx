'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const mobileMenuItems = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Packages' },
  { href: '/custom-plan', label: 'Custom Trip' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/services', label: 'Services' },
  { href: '/bookings', label: 'My Bookings' },
  { href: '/schedule', label: 'Schedule (14 Days)' },
  { href: '/chat', label: 'Messages & Concierge' },
  { href: '/culture', label: 'Culture & Heritage' },
  { href: '/dashboard', label: 'Traveler Dashboard' },
  { href: '/login', label: 'Partner & Admin Portals', isHighlight: true },
];

const itemVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.96,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.04 + index * 0.024,
      type: 'spring' as const,
      damping: 22,
      stiffness: 300,
    },
  }),
  exit: (index: number) => ({
    opacity: 0,
    y: -6,
    scale: 0.97,
    transition: {
      delay: (12 - index) * 0.008,
      duration: 0.18,
      ease: 'easeInOut' as const,
    },
  }),
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, currentUser, logout, notificationsList, markAllRead } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMenuExiting, setIsMenuExiting] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const openMobile = () => {
    setIsMenuExiting(false);
    setMobileOpen(true);
  };

  const closeMobile = () => {
    if (!mobileOpen) return;
    setIsMenuExiting(true);
    setMobileOpen(false);
  };

  const toggleMobile = () => {
    if (mobileOpen) {
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
    setMobileOpen(false);
    setIsMenuExiting(false);
    setNotifOpen(false);
  }, [pathname]);

  // Lock body scroll and handle Escape key when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
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
  }, [mobileOpen]);

  const unreadCount = notificationsList.filter((n) => !n.read).length;

  // Header dynamic classes:
  // When mobile drawer is open or smoothly exiting: solid clean white background for seamless continuity
  // Initial state at top of hero: completely transparent, floating, white text & white logo.
  // Scrolled state (>70px or non-home pages): solid clean white background, dark blue navigation text, subtle bottom border & shadow.
  const isMenuVisible = mobileOpen || isMenuExiting;
  const isTransparent = isHome && !isScrolled && !isMenuVisible;

  const headerBgClass = isMenuVisible
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

          {/* Mobile Menu Toggle: Apple-grade tactile morphing spring */}
          <motion.button
            type="button"
            onClick={toggleMobile}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.90 }}
            className={`lg:hidden relative flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 cursor-pointer select-none ${
              isTransparent
                ? 'text-white hover:bg-white/15'
                : 'text-[#10243A] hover:bg-slate-100/90'
            }`}
            aria-label={mobileOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileOpen}
          >
            <motion.div
              animate={mobileOpen ? { rotate: 90 } : { rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 18,
                mass: 0.8,
              }}
              className="relative w-5 h-4 flex flex-col justify-between items-center pointer-events-none"
            >
              {/* Top Bar: slides down 7px, rotates 45 degrees with fluid spring */}
              <motion.span
                animate={
                  mobileOpen
                    ? { y: 7, rotate: 45, width: 20 }
                    : { y: 0, rotate: 0, width: 20 }
                }
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  mass: 0.8,
                }}
                className={`block h-[2px] rounded-full origin-center ${
                  isTransparent ? 'bg-white' : 'bg-slate-800'
                }`}
              />

              {/* Middle Bar: smoothly compresses and dissolves */}
              <motion.span
                animate={
                  mobileOpen
                    ? { opacity: 0, scaleX: 0, x: -6 }
                    : { opacity: 1, scaleX: 1, x: 0 }
                }
                transition={{
                  duration: 0.22,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`block h-[2px] w-5 rounded-full ${
                  isTransparent ? 'bg-white' : 'bg-slate-800'
                }`}
              />

              {/* Bottom Bar: slides up 7px, rotates -45 degrees with fluid spring */}
              <motion.span
                animate={
                  mobileOpen
                    ? { y: -7, rotate: -45, width: 20 }
                    : { y: 0, rotate: 0, width: 20 }
                }
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  mass: 0.8,
                }}
                className={`block h-[2px] rounded-full origin-center ${
                  isTransparent ? 'bg-white' : 'bg-slate-800'
                }`}
              />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Shutter Overlay & Dropdown Menu with Cinematic Zoom-In & Staggered Reveal */}
      <AnimatePresence onExitComplete={() => setIsMenuExiting(false)}>
        {mobileOpen && (
          <>
            {/* Backdrop Overlay with Soft Frosted Blur */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              onClick={closeMobile}
              className="lg:hidden fixed inset-0 top-12 sm:top-13 lg:top-[52px] bg-slate-950/50 backdrop-blur-sm z-40"
              aria-hidden="true"
            />

            {/* Shutter Drawer with Spring Zoom-In & Zoom-Out */}
            <motion.div
              key="mobile-drawer"
              initial={{
                opacity: 0,
                y: -18,
                scale: 0.90,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: 'spring',
                  damping: 24,
                  stiffness: 260,
                  mass: 0.85,
                },
              }}
              exit={{
                opacity: 0,
                y: -16,
                scale: 0.90,
                transition: {
                  duration: 0.28,
                  ease: [0.32, 0, 0.67, 0],
                },
              }}
              style={{ transformOrigin: 'top center' }}
              className="lg:hidden relative z-50 border-t border-slate-200/90 bg-white/98 backdrop-blur-2xl px-5 pt-3.5 pb-6 space-y-3 text-[#10243A] max-h-[85vh] overflow-y-auto font-inter shadow-[0_30px_90px_-20px_rgba(5,82,162,0.22)] rounded-b-3xl"
            >
              <div className="space-y-0.5">
                {mobileMenuItems.map((item, index) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <motion.div
                      key={item.href}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={itemVariants}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMobile}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-b border-slate-100/70 ${
                          isActive
                            ? 'bg-blue-50/80 text-[#0552A2] font-semibold pl-3.5'
                            : item.isHighlight
                            ? 'text-[#0552A2] font-semibold hover:bg-blue-50/50 hover:pl-3.5'
                            : 'text-slate-700 hover:text-[#0552A2] hover:bg-slate-50/80 hover:pl-3.5'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0552A2] animate-pulse" />
                          )}
                          <span>{item.label}</span>
                        </span>
                        <ArrowRight
                          className={`h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 ${
                            isActive
                              ? 'text-[#0552A2]'
                              : 'text-slate-400 group-hover:text-[#0552A2]'
                          }`}
                        />
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Sign In / Sign Out Tile */}
                <motion.div
                  custom={mobileMenuItems.length}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={itemVariants}
                >
                  {currentUser ? (
                    <button
                      type="button"
                      onClick={() => {
                        closeMobile();
                        handleLogout();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50/60 transition-all duration-200 cursor-pointer mt-1"
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
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-[#0552A2] hover:bg-blue-50/60 transition-all duration-200 mt-1"
                    >
                      <span className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Sign In to Portal</span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </motion.div>
              </div>

              {/* Bottom Quick Action CTAs */}
              <motion.div
                custom={mobileMenuItems.length + 1}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={itemVariants}
                className="pt-2"
              >
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <Link
                    href="/explore"
                    onClick={closeMobile}
                    className="rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white py-2.5 font-semibold transition-all shadow-sm hover:shadow active:scale-95 flex items-center justify-center"
                  >
                    Browse Packages
                  </Link>
                  <Link
                    href="/custom-plan"
                    onClick={closeMobile}
                    className="rounded-xl border border-slate-200 hover:border-slate-300 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center bg-white"
                  >
                    Custom Trip
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
