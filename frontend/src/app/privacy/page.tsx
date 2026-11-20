import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Visit Nepal Official Tourism Desk',
  description: 'Official privacy, data protection, and TIMS credential security policies for Visit Nepal travelers.',
};

export default function PrivacyPolicyPage() {
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
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-xs font-semibold text-[#0552A2]">
            <Lock className="h-3.5 w-3.5" />
            <span>Official Government Tourism Clearance &amp; Privacy Standard</span>
          </div>
          <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Privacy Policy &amp; Traveler Data Protection
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Effective Date: November 2026 · Visit Nepal Official Tourism Desk (Bhrikutimandap, Kathmandu)
          </p>
        </div>

        {/* Content Body */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-poppins text-base font-semibold text-slate-900">
              1. Information We Collect
            </h2>
            <p>
              When you book high-altitude expeditions, secure Trekker Information Management System (TIMS) cards, or contract certified IFMGA Sherpa leaders through Visit Nepal, we collect only necessary traveler credentials:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Full legal passport names, nationalities, and emergency rescue contact data.</li>
              <li>Official National Park &amp; Conservation Area entry permit registration numbers.</li>
              <li>Booking dates, travel group compositions, and optional dietary/altitude acclimation notes.</li>
              <li>Encrypted transaction logs and official digital invoice telemetry.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-poppins text-base font-semibold text-slate-900">
              2. How Your Credentials Are Used
            </h2>
            <p>
              Your personal information is strictly utilized to issue valid Government of Nepal trekking permits, arrange licensed mountain guide matching, coordinate 24/7 Medevac helicopter dispatch if required, and maintain your confirmed booking record in the traveler portal. We never sell, monetize, or distribute traveler data to third-party advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-poppins text-base font-semibold text-slate-900">
              3. Data Encryption &amp; Storage Security
            </h2>
            <p>
              All portal transmissions and booking records are secured using TLS 1.3 encryption. Passwords and portal session credentials are cryptographically hashed and never stored in cleartext.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-poppins text-base font-semibold text-slate-900">
              4. Contact the Data Protection Officer
            </h2>
            <p>
              For data access requests, permit verification queries, or account deletion, contact the Official Tourism Desk at{' '}
              <a href="mailto:info@visitnepal.ai" className="font-semibold text-[#0552A2] hover:underline">
                info@visitnepal.ai
              </a>{' '}
              or visit our desk at Bhrikutimandap, Kathmandu, Nepal.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
