'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Menu,
  X,
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
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const navLinks = [
  { href: '/destinations', label: 'Destinations' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/culture', label: 'Culture' },
  { href: '/services', label: 'Services' },
  { href: '/stories', label: 'Stories' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, currentUser, logout, notificationsList, markAllRead } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
    setNotifOpen(false);
  }, [pathname]);

  const unreadCount = notificationsList.filter((n) => !n.read).length;

  // Header dynamic classes:
  // Initial state at top of hero: completely transparent, floating, white text & white logo.
  // Scrolled state (>70px or non-home pages): solid clean white background, dark blue navigation text, subtle bottom border & shadow.
  const isTransparent = isHome && !isScrolled;

  const headerBgClass = isTransparent
    ? 'bg-transparent border-transparent shadow-none'
    : 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs shadow-slate-900/5';

  const positionClass = isHome ? 'fixed top-0 left-0 right-0' : 'sticky top-0';

  return (
    <header
      className={`${positionClass} z-50 w-full transition-all duration-300 ease-in-out ${headerBgClass} border-t-0 m-0`}
    >
      <div className="flex h-12 sm:h-13 lg:h-[52px] w-full items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Brand: Visit Nepal Logo (White over hero, Royal Blue when scrolled) */}
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
                  <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-sm sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50 text-slate-900 animate-subtle-fade-up">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Notifications ({unreadCount})
                      </h3>
                      <button
                        onClick={markAllRead}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0552A2] hover:underline"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        Mark read
                      </button>
                    </div>
                    <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                      {notificationsList.map((n) => (
                        <div
                          key={n.id}
                          className={`rounded-lg p-2.5 text-xs border ${n.read
                            ? 'border-slate-100 bg-white text-slate-600'
                            : 'border-blue-100 bg-blue-50/50 text-slate-900'
                            }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                            {n.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile: Direct redirect to /profile */}
              <Link
                href="/profile"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer ${
                  isTransparent
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

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`lg:hidden flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-95 ${isTransparent
              ? 'text-white hover:bg-white/10'
              : 'text-[#10243A] hover:bg-slate-100'
              }`}
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Minimal Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-md px-5 py-5 space-y-2 shadow-2xl text-[#10243A] max-h-[calc(100dvh-60px)] overflow-y-auto animate-subtle-fade-up font-inter">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-2 text-sm font-medium text-slate-800 hover:text-[#0552A2] border-b border-slate-100"
            >
              <span>Home</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-2 text-sm font-medium text-slate-800 hover:text-[#0552A2] border-b border-slate-100"
              >
                <span>{item.label}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            ))}
            <Link
              href="/schedule"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-2 text-sm font-medium text-slate-800 hover:text-[#0552A2] border-b border-slate-100"
            >
              <span>Schedule (14 Days)</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
            <Link
              href="/chat"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-2 text-sm font-medium text-slate-800 hover:text-[#0552A2] border-b border-slate-100"
            >
              <span>Messages &amp; Concierge</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
            <Link
              href="/bookings"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-2 text-sm font-medium text-slate-800 hover:text-[#0552A2] border-b border-slate-100"
            >
              <span>My Bookings</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-2 text-sm font-medium text-[#0552A2] hover:underline border-b border-slate-100"
            >
              <span>Partner &amp; Admin Portals</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#0552A2]" />
            </Link>

            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
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
                onClick={() => setMobileOpen(false)}
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
                href="/custom-plan"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-slate-200 py-2 font-medium text-slate-700 hover:bg-slate-50"
              >
                Custom Plan
              </Link>
              <Link
                href="/services"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-slate-200 py-2 font-medium text-slate-700 hover:bg-slate-50"
              >
                Services
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
