import Link from 'next/link';
import {
  RotateCcw,
  ShieldCheck,
  Calendar,
  Building2,
  Compass,
  AlertTriangle,
  Clock,
  CreditCard,
  CheckCircle2,
  Mail,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import LegalPageLayout, { LegalSection } from '@/components/legal/LegalPageLayout';

export const metadata = {
  title: 'Refund & Cancellation Policy | Visit Nepal Official Tourism Desk',
  description:
    'Official refund timelines, 14-day free expedition cancellation window, hotel stay policies, and alpine weather rescheduling terms.',
};

const REFUND_SECTIONS: LegalSection[] = [
  { id: 'expedition-cancellation', title: '14-Day Free Trek Cancellation' },
  { id: 'hotel-stay-cancellation', title: 'Hotel & Stay Cancellation Policy' },
  { id: 'weather-force-majeure', title: 'Alpine Weather & Force Majeure' },
  { id: 'custom-trips', title: 'Custom Trips & Bespoke Treks' },
  { id: 'processing-timelines', title: 'Refund Processing & Timelines' },
  { id: 'initiating-cancellation', title: 'How to Initiate a Cancellation' },
  { id: 'support-inquiries', title: 'Support & Concierge Assistance' },
];

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund &amp; Cancellation Policy"
      eyebrow="VISIT NEPAL · LEGAL &amp; POLICIES"
      description="Transparent cancellation, refund, and booking adjustment policies for high-altitude treks, luxury heritage hotels, and verified Nepal tourism packages."
      lastUpdated="November 2026"
      currentPolicy="refund-policy"
      sections={REFUND_SECTIONS}
    >
      {/* 1. 14-Day Free Cancellation Window */}
      <section id="expedition-cancellation" className="space-y-3.5 scroll-mt-28">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 01
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            14-Day Free Trekking &amp; Expedition Cancellation Window
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          We understand that international alpine travel requires schedule flexibility. You may cancel any confirmed trekking or expedition package up to <strong>14 days prior</strong> to the scheduled departure date for a full <strong>100% refund</strong> of all expedition fees, minus nominal bank merchant processing charges.
        </p>

        {/* Highlight Card */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-xs sm:text-sm text-emerald-900">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>Guaranteed 100% Refund Eligibility (&gt; 14 Days)</span>
          </p>
          <p className="text-[12px] text-emerald-900 leading-relaxed">
            Cancellations submitted more than 14 calendar days prior to departure qualify for an immediate full refund. All unspent guide service fees, lodge bookings, and transport reservations are returned in full.
          </p>
        </div>
      </section>

      {/* 2. Hotel & Accommodation Stays Policy */}
      <section id="hotel-stay-cancellation" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 02
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Hotel &amp; Accommodation Stay Cancellation Policy
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          For hotel reservations, resort bookings, and boutique heritage stays secured through our platform, cancellation terms adhere to standardized property tiers:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-700 text-xs">&gt; 48 Hours</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10.5px] font-bold">
                100% Refund
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-xs">Standard Cancellation</h3>
            <p className="text-[11.5px] text-slate-500 leading-relaxed">
              Full refund when cancelled at least 48 hours prior to scheduled check-in time (14:00 local time).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-700 text-xs">24 – 48 Hours</span>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10.5px] font-bold">
                50% Refund
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-xs">Late Notice Cancellation</h3>
            <p className="text-[11.5px] text-slate-500 leading-relaxed">
              50% refund applied to the total stay amount. Property retains remaining portion for room reservation hold.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-700 text-xs">&lt; 24 Hours</span>
              <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 text-[10.5px] font-bold">
                Non-Refundable
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-xs">Same-Day / No-Show</h3>
            <p className="text-[11.5px] text-slate-500 leading-relaxed">
              Cancellations made within 24 hours of arrival or no-shows are non-refundable per property guarantee policy.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Weather, Landslides & Alpine Force Majeure */}
      <section id="weather-force-majeure" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 03
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Alpine Weather, Landslides &amp; Force Majeure
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          In the event of domestic mountain flight cancellations (e.g., Lukla, Jomsom, Simikot, Phaplu) due to severe monsoonal fog or winter snowfall, or official trail closures declared by the Nepal Tourism Board:
        </p>

        <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pl-1">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#0552A2] shrink-0 mt-0.5" />
            <span><strong>100% Free Date Rescheduling:</strong> Travelers are provided free date rebooking for subsequent weather windows or alternative regional trekking itineraries without penalty.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#0552A2] shrink-0 mt-0.5" />
            <span><strong>Lodging &amp; Guide Service Portion Refund:</strong> If alternative routes are declined, all unspent teahouse lodging fees and guide service portions are promptly refunded.</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <span><strong>Government Permit Statutory Exemption:</strong> Government TIMS permits and National Park conservation cards already validated and stamped at park checkpoint gates remain non-refundable per national regulation.</span>
          </li>
        </ul>
      </section>

      {/* 4. Custom Trips & Bespoke Treks */}
      <section id="custom-trips" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 04
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Custom Trips &amp; Bespoke Expeditions
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          For tailored expeditions created through our <Link href="/custom-plan" className="text-[#0552A2] font-semibold hover:underline">Custom Trip Planner</Link>, customized logistics contracts apply:
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
          <li>Custom trips may involve non-refundable prepayments for chartered private helicopters, restricted area permits (e.g. Upper Mustang, Upper Dolpo), and advance high-camp porter allocations.</li>
          <li>All non-refundable hard costs are disclosed item-by-item in your custom quotation before booking confirmation.</li>
        </ul>
      </section>

      {/* 5. Refund Processing & Timelines */}
      <section id="processing-timelines" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 05
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Refund Processing Timelines &amp; Methods
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Approved refunds are processed back directly to the original payment source:
        </p>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-xs sm:text-sm">Standard Settlement Window</span>
            <span className="px-2.5 py-0.5 rounded bg-blue-50 text-[#0552A2] font-bold text-xs">
              5 to 7 Business Days
            </span>
          </div>
          <p className="text-[12px] leading-relaxed">
            Credit card and Khalti wallet credits are initiated within 24 hours of cancellation approval. Banking institutions may require 5 to 7 business days to reflect the credit on your billing statement. An official digital refund transaction receipt is automatically dispatched via email.
          </p>
        </div>
      </section>

      {/* 6. How to Initiate a Cancellation */}
      <section id="initiating-cancellation" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 06
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            How to Initiate a Cancellation or Modification
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          You can initiate a cancellation or schedule adjustment easily through several self-service and support channels:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#0552A2]" />
              <span>Self-Service Portal</span>
            </h3>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              Navigate to <Link href="/bookings" className="text-[#0552A2] font-semibold hover:underline">My Bookings</Link>, select your reservation card, and tap &quot;Cancel Reservation&quot; to review your policy-calculated refund.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-[#0552A2]" />
              <span>Direct Concierge Support</span>
            </h3>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              Message our 24/7 concierge desk via <Link href="/chat" className="text-[#0552A2] font-semibold hover:underline">Concierge Messages</Link> or email our cancellations team directly at <a href="mailto:info@visitnepal.ai" className="text-[#0552A2] font-semibold hover:underline">info@visitnepal.ai</a>.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Support & Inquiries */}
      <section id="support-inquiries" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 07
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Support &amp; Concierge Assistance
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          For billing questions, flight delay rescheduling, or exceptional medical emergency cancellations, contact our official support desk:
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-700">
            <Building2 className="h-4 w-4 text-[#0552A2] shrink-0" />
            <span className="font-bold">Visit Nepal Official Support &amp; Concierge</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Bhrikutimandap, Kathmandu, Nepal</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Cancellations Desk: </span>
            <a href="mailto:info@visitnepal.ai" className="font-semibold text-[#0552A2] hover:underline">
              info@visitnepal.ai
            </a>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
