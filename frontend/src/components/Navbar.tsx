'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircle2,
  ArrowRight,
  MessageSquare,
  LogOut,
  User,
  LayoutDashboard,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const getRolePortalPath = (r?: string) => {
  switch (r?.toLowerCase()) {
    case 'super_admin':
      return '/admin';
    case 'ntb_admin':
    case 'admin':
      return '/portals/admin';
    case 'agency':
    case 'business':
      return '/portals/business';
    case 'guide':
      return '/portals/guide';
    case 'butler':
      return '/portals/butler';
    default:
      return '/dashboard';
  }
};

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
  const { role, currentUser, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMenuExiting, setIsMenuExiting] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <div className="flex h-11 sm:h-12 lg:h-[52px] w-full items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Brand: Visit Nepal Logo (White over hero, Royal Blue when scrolled or open) */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group py-0.5">
          <img
            src={isTransparent ? '/logo-white.webp' : '/logo-brand.webp'}
            alt="Visit Nepal"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo-brand.webp';
            }}
            className="h-5 sm:h-6 lg:h-7 w-auto max-w-[130px] sm:max-w-none object-contain transition-transform group-hover:scale-[1.02]"
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
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {mounted && currentUser ? (
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

              {/* Role Badge Indicator: Direct shortcut to user's dashboard */}
              <Link
                href={getRolePortalPath(currentUser.role || role)}
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-semibold tracking-tight transition-all active:scale-95 shrink-0 ${isTransparent
                  ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25'
                  : 'bg-blue-50 hover:bg-blue-100/80 text-[#0552A2] border border-blue-200/80'
                  }`}
                title={`Open ${currentUser.role || role || 'Traveler'} Dashboard`}
              >
                <LayoutDashboard className="h-3 w-3 shrink-0" />
                <span className="capitalize truncate max-w-[65px] sm:max-w-none">{currentUser.role || role || 'Traveler'}</span>
              </Link>

              {/* User Profile: Direct redirect to /profile */}
              <Link
                href="/profile"
                className={`flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-lg transition-colors cursor-pointer shrink-0 ${isTransparent
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'text-slate-700 hover:text-[#0552A2] hover:bg-slate-100'
                  }`}
                title="My Profile & Switch User"
                aria-label="My Profile & Switch User"
              >
                <UserCircle2 className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </Link>
            </>
          ) : (
            <>
              {/* Logged Out Visitor State: Sign In Button */}
              <Link
                href="/login"
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-xs font-medium font-inter tracking-wide transition-colors cursor-pointer shrink-0 ${isTransparent
                  ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25'
                  : 'bg-white hover:bg-slate-50 text-[#0552A2] border border-slate-200 shadow-xs'
                  }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={toggleMobile}
            className={`lg:hidden relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer select-none shrink-0 ${
              isTransparent
                ? 'text-white hover:bg-white/10'
                : 'text-[#10243A] hover:bg-slate-100'
            }`}
            aria-label={mobileOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileOpen}
          >
            <div className="relative w-4.5 h-3.5 flex flex-col justify-between items-center pointer-events-none">
              <span
                className={`block h-[2px] w-4.5 rounded-full transition-all duration-250 origin-center ${
                  mobileOpen ? 'translate-y-[5.5px] rotate-45' : ''
                } ${isTransparent ? 'bg-white' : 'bg-slate-800'}`}
              />
              <span
                className={`block h-[2px] w-4.5 rounded-full transition-all duration-200 ${
                  mobileOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                } ${isTransparent ? 'bg-white' : 'bg-slate-800'}`}
              />
              <span
                className={`block h-[2px] w-4.5 rounded-full transition-all duration-250 origin-center ${
                  mobileOpen ? '-translate-y-[5.5px] -rotate-45' : ''
                } ${isTransparent ? 'bg-white' : 'bg-slate-800'}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Shutter Overlay & Dropdown Menu with Smooth Spring Reveal */}
      <AnimatePresence onExitComplete={() => setIsMenuExiting(false)}>
        {mobileOpen && (
          <>
            {/* Backdrop Overlay with Soft Frosted Blur */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={closeMobile}
              className="lg:hidden fixed inset-0 top-11 sm:top-12 lg:top-[52px] bg-slate-950/50 backdrop-blur-sm z-40"
              aria-hidden="true"
            />

            {/* Clean Editorial Drawer */}
            <motion.div
              key="mobile-drawer"
              initial={{ opacity: 0, y: -8 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
              }}
              exit={{
                opacity: 0,
                y: -6,
                transition: { duration: 0.15, ease: 'easeIn' },
              }}
              className="lg:hidden relative z-50 border-t border-slate-200 bg-white px-4 sm:px-6 pt-3 pb-5 space-y-2.5 text-[#10243A] max-h-[85vh] overflow-y-auto font-inter shadow-xl rounded-b-2xl border-b border-slate-200/90"
            >
              <div className="space-y-0.5">
                {/* Direct Dashboard Shortcut for Signed-in User on Mobile */}
                {mounted && currentUser && (
                  <motion.div
                    custom={0}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={itemVariants}
                  >
                    <Link
                      href={getRolePortalPath(currentUser.role || role)}
                      onClick={closeMobile}
                      className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[#0552A2] text-white shadow-xs hover:bg-[#044182] transition-all mb-2"
                    >
                      <span className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="capitalize">{currentUser.role || role || 'Traveler'} Dashboard</span>
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                )}

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
                            : 'text-slate-700 hover:text-[#0552A2] hover:bg-slate-50/80 hover:pl-3.5'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
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
                  {mounted && currentUser ? (
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
