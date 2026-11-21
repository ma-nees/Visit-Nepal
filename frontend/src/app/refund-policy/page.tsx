import Link from 'next/link';
import { ShieldCheck, ArrowLeft, RotateCcw } from 'lucide-react';

export const metadata = {
  title: 'Refund & Cancellation Policy | Visit Nepal Official Tourism Desk',
  description: 'Official refund timelines, cancellation windows, and alpine weather rescheduling terms.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12 font-inter text-slate-900 antialiased">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 space-y-6 sm:space-y-8">
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
            <RotateCcw className="h-3.5 w-3.5 text-emerald-600" />
            <span>Official Traveler Guarantee &amp; Flexible Cancellation</span>
          </div>
          <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Effective Date: November 2026 · Visit Nepal Official Tourism Desk
          </p>
        </div>

        {/* Content Body */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-poppins text-base font-semibold text-slate-900">
              1. 14-Day Free Cancellation Window
            </h2>
            <p>
              We understand mountain travel requires schedule flexibility. You may cancel any confirmed expedition booking up to <strong>14 days prior</strong> to the scheduled departure date for a full 100% refund of all expedition fees, minus nominal bank merchant processing fees.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-poppins text-base font-semibold text-slate-900">
              2. Weather, Landslides &amp; Alpine Force Majeure
            </h2>
            <p>
              In the event of flight cancellations to high-altitude mountain airstrips (e.g., Lukla, Jomsom) due to severe monsoonal or winter fog, or trail closures declared by the Nepal Tourism Board:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Travelers are offered 100% free date rescheduling to alternate weather windows or equivalent regional routes.</li>
              <li>If alternate routing is declined, unspent teahouse lodging and guide service portions are promptly refunded.</li>
              <li>Government TIMS permit and conservation card fees already validated with park checkpoints remain non-refundable per national regulation.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-poppins text-base font-semibold text-slate-900">
              3. Refund Processing Timelines
            </h2>
            <p>
              Approved refunds are credited directly to the original payment method (Credit Card, Wire Transfer, or Digital Portal Wallet) within <strong>5 to 7 business days</strong>. A confirmation email and digital receipt are automatically dispatched upon initiation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-poppins text-base font-semibold text-slate-900">
              4. Initiating a Cancellation
            </h2>
            <p>
              To initiate a cancellation, visit your <Link href="/bookings" className="text-[#0552A2] font-semibold hover:underline">My Bookings</Link> dashboard and select &quot;Cancel Booking&quot;, or message our concierge via <Link href="/chat" className="text-[#0552A2] font-semibold hover:underline">Concierge Chat</Link> or email{' '}
              <a href="mailto:info@visitnepal.ai" className="font-semibold text-[#0552A2] hover:underline">
                info@visitnepal.ai
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
