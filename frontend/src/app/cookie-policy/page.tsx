import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Cookie } from 'lucide-react';

export const metadata = {
  title: 'Cookie Policy | Visit Nepal Official Tourism Desk',
  description: 'Official cookie and session storage policies for Visit Nepal travelers and portal users.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12 font-inter text-slate-900 antialiased">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0552A2] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Homepage</span>
        </Link>

        {/* Header Block */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-900">
            <Cookie className="h-3.5 w-3.5 text-amber-700" />
            <span>Browser Storage &amp; Session Management</span>
          </div>
          <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Effective Date: November 2026 · Visit Nepal Official Tourism Desk
          </p>
        </div>

        {/* Content Body */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-poppins text-base font-semibold text-slate-900">
              1. What Are Cookies
            </h2>
            <p>
              Cookies and local browser storage are minimal text files placed on your device to maintain secure session state, remember selected expedition dates, and retain your active portal role (Traveler, Guide, Butler, Business, or Admin).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-poppins text-base font-semibold text-slate-900">
              2. Categories of Cookies We Use
            </h2>
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 space-y-1">
                <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Essential &amp; Operational Cookies</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Required for core platform functionality: persisting your active booking session, digital boarding passes, and authenticated role credentials across page transitions.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 space-y-1">
                <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Functional Preferences</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Used to retain your preferred currency (USD/NPR), selected map waypoints, and itinerary filter parameters without requiring manual reconfiguration.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="font-poppins text-base font-semibold text-slate-900">
              3. Managing Cookie Preferences
            </h2>
            <p>
              You can block or delete cookies through your browser settings at any time. Disabling essential cookies may impair your ability to complete online bookings or access authenticated portals.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
