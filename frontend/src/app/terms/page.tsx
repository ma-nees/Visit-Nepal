import Link from 'next/link';
import { FileText, ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Visit Nepal Official Tourism Desk',
  description: 'Expedition booking agreements, high-altitude liability terms, and IFMGA trekking protocols.',
};

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-800">
            <FileText className="h-3.5 w-3.5 text-emerald-600" />
            <span>Official Expedition Service Level Agreement</span>
          </div>
          <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Terms &amp; Conditions of Expedition Booking
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Effective Date: November 2026 · Visit Nepal Official Tourism Desk
          </p>
        </div>

        {/* Content Body */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-poppins text-base font-semibold text-slate-900">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing the Visit Nepal portal, booking Himalayan expeditions, purchasing official trekking permits, or hiring certified Sherpa guides and butlers, you enter into a legally binding agreement with Visit Nepal and licensed Nepal Tourism Board operators.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-poppins text-base font-semibold text-slate-900">
              2. High-Altitude Expeditions &amp; Guide Authority
            </h2>
            <p>
              Himalayan trekking carries inherent physiological and environmental risks including acute mountain sickness (AMS), extreme alpine weather, and terrain fluctuations. Licensed IFMGA/NMA mountain leaders maintain absolute authority regarding trail safety, route alterations, acclimatization pacing, and mandatory evacuations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-poppins text-base font-semibold text-slate-900">
              3. Permits &amp; Conservation Code of Conduct
            </h2>
            <p>
              All trekkers must carry official TIMS cards and National Park permits at all times. In adherence to the Great Himalayan Trail Leave No Trace mandate, trekkers must not litter single-use plastics, disturb wildlife, or remove cultural artifacts from monasteries or chortens.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-poppins text-base font-semibold text-slate-900">
              4. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of Nepal and regulations enforced by the Ministry of Culture, Tourism and Civil Aviation (MoCTCA). Disputes are subject to the exclusive jurisdiction of the courts of Kathmandu, Nepal.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
