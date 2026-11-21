import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Compass,
  Building2,
  CreditCard,
  Scale,
  RotateCcw,
  CheckCircle2,
  Mail,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import LegalPageLayout, { LegalSection } from '@/components/legal/LegalPageLayout';

export const metadata = {
  title: 'Terms & Conditions | Visit Nepal Official Tourism Desk',
  description:
    'Official terms and conditions for expedition bookings, hotel stays, IFMGA mountain leader authority, and Himalayan tourism services.',
};

const TERMS_SECTIONS: LegalSection[] = [
  { id: 'acceptance-of-terms', title: 'Acceptance of Terms & Scope' },
  { id: 'account-registration', title: 'Account Registration & Conduct' },
  { id: 'guide-authority-safety', title: 'Guide Authority & Alpine Safety' },
  { id: 'conservation-permits', title: 'Permits & Conservation Code' },
  { id: 'booking-rates-payments', title: 'Bookings, Rates & Payments' },
  { id: 'hotel-stay-conditions', title: 'Hotel & Partner Accommodations' },
  { id: 'cancellations-refunds', title: 'Cancellations & Rescheduling' },
  { id: 'liability-force-majeure', title: 'Limitation of Liability' },
  { id: 'governing-law-disputes', title: 'Governing Law & Jurisdiction' },
  { id: 'modifications-contact', title: 'Modifications & Contact Desk' },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms &amp; Conditions of Service &amp; Booking"
      eyebrow="VISIT NEPAL · LEGAL &amp; POLICIES"
      description="Clear guidelines for using Visit Nepal and booking your next Himalayan experience, verified heritage hotel stay, or high-altitude expedition."
      lastUpdated="November 2026"
      currentPolicy="terms"
      sections={TERMS_SECTIONS}
    >
      {/* 1. Acceptance of Terms */}
      <section id="acceptance-of-terms" className="space-y-3.5 scroll-mt-28">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 01
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Acceptance of Terms &amp; Service Scope
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          By accessing the Visit Nepal platform, creating an account, reserving luxury heritage hotel accommodations, purchasing official trekking permits, or contracting certified IFMGA Sherpa leaders and butlers, you enter into a legally binding agreement with <strong>Visit Nepal Official Tourism Desk</strong> and authorized licensed Nepal Tourism Board (NTB) operators.
        </p>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          If you do not accept these terms in their entirety, you must discontinue using our reservation and information services.
        </p>
      </section>

      {/* 2. Account Registration & Conduct */}
      <section id="account-registration" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 02
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Account Registration &amp; Traveler Conduct
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          When creating an account or submitting booking manifests, you must provide accurate, current, and complete legal identity information matching your official passport or government credential:
        </p>

        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 pl-1">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>You are responsible for maintaining the confidentiality of your portal credentials and all activities executed under your account.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Misrepresentation of identity or falsification of emergency contacts may result in immediate revocation of trekking permits and expulsion from protected conservation areas.</span>
          </li>
        </ul>
      </section>

      {/* 3. Guide Authority & Alpine Safety */}
      <section id="guide-authority-safety" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 03
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            High-Altitude Expeditions &amp; Guide Authority
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Himalayan trekking and mountaineering involve inherent physiological and environmental hazards, including acute mountain sickness (AMS), high-altitude pulmonary/cerebral edema (HAPE/HACE), rapid weather shifts, glacial moraine terrain, and stonefall.
        </p>

        {/* Critical Safety Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-xs sm:text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
            <span>Mandatory Field Leader Authority</span>
          </div>
          <p className="text-[12px] leading-relaxed text-amber-900">
            Licensed IFMGA (International Federation of Mountain Guides Associations) and NMA (Nepal Mountaineering Association) leaders possess <strong>absolute authority</strong> over all expedition matters, including daily route pace, weather assessments, acclimatization halts, and mandatory emergency medical evacuations.
          </p>
          <p className="text-[12px] leading-relaxed text-amber-900">
            If a lead guide deems a traveler physiologically unfit to proceed to higher elevations, the traveler must comply with descent directives for their own safety and group integrity.
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          All high-altitude trekkers traveling above 3,000 meters are required to possess valid international travel insurance with specific coverage for emergency high-altitude helicopter rescue and medical repatriation up to 6,000 meters.
        </p>
      </section>

      {/* 4. Permits & Conservation Code */}
      <section id="conservation-permits" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 04
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Permits &amp; Conservation Code of Conduct
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Trekkers must carry verified physical or digital TIMS passes and National Park Conservation cards (e.g., Sagarmatha National Park, Annapurna Conservation Area Project) at all designated trail checkpoints.
        </p>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          In strict accordance with the Great Himalayan Trail Leave No Trace mandate and national cultural heritage protections:
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
          <li>Trekkers must not litter single-use plastics or disposable packaging along wilderness trails.</li>
          <li>Disturbance or feeding of Himalayan wildlife (including snow leopards, musk deer, and red pandas) is strictly prohibited.</li>
          <li>Removal or desecration of cultural artifacts, mani stones, prayer flags, chortens, or monastery relics constitutes a criminal offense under Nepali law.</li>
        </ul>
      </section>

      {/* 5. Bookings, Rates & Payments */}
      <section id="booking-rates-payments" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 05
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Bookings, Rates &amp; Payment Terms
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          All prices for services are published in Nepalese Rupees (NPR) with statutory foreign currency equivalencies displayed for convenience.
        </p>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <CreditCard className="h-4 w-4 text-[#0552A2]" />
            <span>Statutory Taxes &amp; Fee Transparency</span>
          </div>
          <p className="text-[12px] leading-relaxed">
            Per Nepal Tourism Board and Inland Revenue Department directives, all published accommodation rates and expedition costs include:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>10% Hotel &amp; Luxury Service Charge</strong> (distributed to hospitality staff).</li>
            <li><strong>13% Nepal Government Value Added Tax (VAT)</strong>.</li>
          </ul>
        </div>
      </section>

      {/* 6. Hotel & Partner Accommodations */}
      <section id="hotel-stay-conditions" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 06
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Hotel &amp; Partner Accommodations
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Reservations secured through our verified <Link href="/hotels" className="text-[#0552A2] font-semibold hover:underline">Hotels &amp; Stays</Link> catalog are held in trust by licensed properties. Guests must present valid identification and their digital check-in pass at the front desk upon arrival.
        </p>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Standard property check-in is scheduled from <strong>14:00 (2:00 PM)</strong> and check-out until <strong>12:00 (Noon)</strong>, unless an early arrival or late departure has been confirmed with the property desk.
        </p>
      </section>

      {/* 7. Cancellations, Rescheduling & Refunds */}
      <section id="cancellations-refunds" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 07
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Cancellations, Rescheduling &amp; Refunds
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Cancellations, date modifications, and refund claims are governed by our official{' '}
          <Link href="/refund-policy" className="font-semibold text-[#0552A2] hover:underline">
            Refund &amp; Cancellation Policy
          </Link>:
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
          <li><strong>Expeditions &amp; Packages:</strong> Free cancellation with a 100% refund up to 14 days prior to departure.</li>
          <li><strong>Hotel Stays:</strong> Free cancellation up to 48 hours prior to check-in, 50% refund between 24 and 48 hours, non-refundable within 24 hours.</li>
          <li><strong>Government Permits:</strong> Validated TIMS cards and National Park fees are strictly non-refundable once activated with park checkpoints.</li>
        </ul>
      </section>

      {/* 8. Limitation of Liability & Force Majeure */}
      <section id="liability-force-majeure" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 08
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Limitation of Liability &amp; Alpine Force Majeure
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Visit Nepal and its operating partners shall not be liable for itinerary disruptions, flight schedule changes (e.g. Lukla, Jomsom weather delays), road closures, or delays arising from:
        </p>

        <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
          <li>Alpine force majeure: blizzards, avalanches, rockfalls, monsoonal landslides, or earthquakes.</li>
          <li>Civil unrest, state regulatory route closures, or airspace restrictions.</li>
          <li>Personal medical conditions or altitude failure on the part of the traveler.</li>
        </ul>
      </section>

      {/* 9. Governing Law & Jurisdiction */}
      <section id="governing-law-disputes" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 09
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Governing Law &amp; Jurisdiction
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          These terms and all related booking agreements are governed exclusively by the laws of Nepal and regulations promulgated by the Ministry of Culture, Tourism and Civil Aviation (MoCTCA).
        </p>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Any legal disputes arising under these terms are subject to the exclusive jurisdiction of the competent courts of <strong>Kathmandu, Nepal</strong>.
        </p>
      </section>

      {/* 10. Modifications & Contact Desk */}
      <section id="modifications-contact" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 10
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Modifications to Terms &amp; Contact Desk
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          We reserve the right to revise these terms to reflect changes in tourism legislation or platform capabilities. Material revisions will be posted with updated effective dates.
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-700">
            <Building2 className="h-4 w-4 text-[#0552A2] shrink-0" />
            <span className="font-bold">Visit Nepal Official Legal Registry</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Bhrikutimandap, Kathmandu, Bagmati Province, Nepal</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Inquiries: </span>
            <a href="mailto:info@visitnepal.ai" className="font-semibold text-[#0552A2] hover:underline">
              info@visitnepal.ai
            </a>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
