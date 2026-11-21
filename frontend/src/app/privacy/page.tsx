import Link from 'next/link';
import {
  Lock,
  ShieldCheck,
  FileText,
  CreditCard,
  Building2,
  Users,
  Eye,
  KeyRound,
  Mail,
  MapPin,
  CheckCircle2,
  Info,
} from 'lucide-react';
import LegalPageLayout, { LegalSection } from '@/components/legal/LegalPageLayout';

export const metadata = {
  title: 'Privacy Policy & Traveler Data Protection | Visit Nepal Official Desk',
  description:
    'Official privacy, data protection, and TIMS credential security policies for Visit Nepal travelers, climbers, and hospitality guests.',
};

const PRIVACY_SECTIONS: LegalSection[] = [
  { id: 'information-we-collect', title: 'Information We Collect' },
  { id: 'how-we-use-information', title: 'How We Use Traveler Information' },
  { id: 'booking-permits-data', title: 'Booking & TIMS Permit Registration' },
  { id: 'payment-security', title: 'Payment Processing & Telemetry' },
  { id: 'information-sharing', title: 'Information Sharing & Authorities' },
  { id: 'data-security-standards', title: 'Data Security & Encryption' },
  { id: 'data-retention-rights', title: 'Data Retention & Traveler Rights' },
  { id: 'cookies-tracking', title: 'Cookies & Browser Storage' },
  { id: 'contact-dpo', title: 'Contact Data Protection Officer' },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy &amp; Traveler Data Protection"
      eyebrow="VISIT NEPAL · LEGAL &amp; POLICIES"
      description="Your privacy matters. Learn how Visit Nepal collects, protects, and uses your personal and travel credentials throughout your journey across Nepal."
      lastUpdated="November 2026"
      currentPolicy="privacy"
      sections={PRIVACY_SECTIONS}
    >
      {/* 1. Information We Collect */}
      <section id="information-we-collect" className="space-y-3.5 scroll-mt-28">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 01
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Information We Collect
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          When you book high-altitude expeditions, secure Trekker Information Management System (TIMS) cards, reserve verified heritage stays, or contract certified IFMGA Sherpa guides through Visit Nepal, we collect only necessary traveler credentials required for safety, logistics, and legal compliance:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#0552A2]" />
              <span>Identity &amp; Citizenship</span>
            </h3>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              Full legal passport names, nationalities, dates of birth, passport numbers, and emergency next-of-kin contacts for high-altitude manifests.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Conservation &amp; Park Clearances</span>
            </h3>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              National Park and Conservation Area permit records (Sagarmatha, ACAP, Langtang), TIMS card IDs, and restricted-area permits.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-[#0552A2]" />
              <span>Hospitality &amp; Stay Preferences</span>
            </h3>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              Check-in and check-out dates, room configurations, dietary specifications, estimated arrival schedules, and guest notes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-[#0552A2]" />
              <span>Billing &amp; Transaction Hashes</span>
            </h3>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              Cryptographically hashed transaction IDs, payment confirmations, and official VAT invoice records. We never store raw payment card numbers.
            </p>
          </div>
        </div>
      </section>

      {/* 2. How We Use Traveler Information */}
      <section id="how-we-use-information" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 02
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            How We Use Traveler Information
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Your personal information is strictly utilized to operate statutory tourism services and ensure high-altitude traveler safety across Nepal:
        </p>

        <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pl-1">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Permit Clearance Issuance:</strong> Transmitting official manifests to the Nepal Tourism Board (NTB) and Department of National Parks &amp; Wildlife Conservation.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Guide &amp; Concierge Matching:</strong> Linking travelers with licensed IFMGA mountain guides, local trekking agencies, and hotel reception teams.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Emergency Search &amp; Rescue Coordination:</strong> Providing Himalayan Rescue Association (HRA) and helicopter air ambulance dispatchers with accurate telemetry and altitude profiles during emergencies.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Portal Management &amp; Pass Verification:</strong> Maintaining your active digital reservations, QR checkpoint tokens, and official receipts in <Link href="/bookings" className="text-[#0552A2] font-semibold hover:underline">My Bookings</Link>.</span>
          </li>
        </ul>

        {/* Highlighted Policy Guarantee */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>Zero Data Monetization Guarantee</span>
          </p>
          <p className="text-[12px] text-emerald-900 leading-relaxed">
            We never sell, monetize, license, or distribute traveler data or passport records to third-party advertisers, data brokers, or marketing networks.
          </p>
        </div>
      </section>

      {/* 3. Booking & TIMS Permit Registration */}
      <section id="booking-permits-data" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 03
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Booking &amp; TIMS Permit Registration
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The Trekkers Information Management System (TIMS) is a statutory requirement established by the Nepal Tourism Board (NTB) and Trekking Agencies Association of Nepal (TAAN) to record hiker checkpoints and coordinate medical evacuations in remote mountain zones.
        </p>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          When a TIMS permit or hotel booking is processed through our system, your registration is assigned a unique verifiable token (e.g., <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">VN-PASS-2026-XXXX</code>) that checkpoint rangers scan at trailhead entry posts.
        </p>
      </section>

      {/* 4. Payment Processing & Telemetry */}
      <section id="payment-security" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 04
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Payment Processing &amp; Financial Telemetry
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Online transactions for hotel reservations, trekking packages, and permits are facilitated through PCI-DSS Level 1 compliant financial gateways including Khalti Digital Wallet and verified international card acquiring banks:
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
          <li>Credit card numbers, CVV security codes, and bank PINs are handled directly by payment gateway tokenization APIs and never touch or reside on Visit Nepal application servers.</li>
          <li>We retain only payment transaction identifiers, merchant reference IDs, currency designations, and the statutory 13% Nepal Government VAT and 10% Luxury Service Charge records necessary for tax compliance.</li>
        </ul>
      </section>

      {/* 5. Information Sharing with Official Authorities */}
      <section id="information-sharing" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 05
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Information Sharing &amp; Official Authorities
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          We disclose traveler information only to parties essential to providing contracted tourism services or mandated by the laws of Nepal:
        </p>

        <div className="space-y-2 text-xs sm:text-sm text-slate-600">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <strong className="text-slate-900 block font-semibold">Government &amp; Park Authorities:</strong>
            <p className="text-[12px] text-slate-600 mt-0.5">
              Nepal Tourism Board (NTB), Department of Immigration, and national park conservancies to validate high-altitude permits and protected area checkpoints.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <strong className="text-slate-900 block font-semibold">Service Providers &amp; Guides:</strong>
            <p className="text-[12px] text-slate-600 mt-0.5">
              Certified IFMGA guide leaders, Sherpa butlers, and reserved hotel front desks receive only operational details required to conduct treks or check guests in.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <strong className="text-slate-900 block font-semibold">Emergency Medical Evacuation Providers:</strong>
            <p className="text-[12px] text-slate-600 mt-0.5">
              Himalayan Rescue Association (HRA), chartered helicopter dispatchers, and designated medical facilities when emergency assistance is initiated.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Data Security & Encryption Standards */}
      <section id="data-security-standards" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 06
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Data Security &amp; Encryption Standards
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          All data communications with the Visit Nepal platform are secured using TLS 1.3 protocol encryption. Passwords, session tokens, and portal credentials are cryptographically hashed using salted algorithms (bcrypt / Argon2) and never stored in plain text.
        </p>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Internal access to traveler files is strictly governed by Role-Based Access Control (RBAC). Guides and local businesses have access solely to operational trip manifests for their assigned travelers.
        </p>
      </section>

      {/* 7. Data Retention & Traveler Rights */}
      <section id="data-retention-rights" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 07
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Data Retention &amp; Traveler Rights
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          We retain traveler booking records and statutory permit verifications for the period necessary to comply with Nepal Tourism Board audits and tax regulations.
        </p>

        <div className="space-y-2 text-xs sm:text-sm text-slate-600">
          <p>As a Visit Nepal traveler, you maintain the following rights:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Access &amp; Portability:</strong> Request an export of your personal credentials and booking history.</li>
            <li><strong>Correction &amp; Updates:</strong> Update your passport details, emergency contact, or travel preferences via your <Link href="/profile" className="text-[#0552A2] font-semibold hover:underline">Profile Settings</Link>.</li>
            <li><strong>Account Deletion:</strong> Request the deletion of your user account, subject to mandatory government conservation record retention mandates.</li>
          </ul>
        </div>
      </section>

      {/* 8. Cookies & Session Storage */}
      <section id="cookies-tracking" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 08
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Cookies &amp; Browser Storage
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          We use strictly necessary session cookies and local storage tokens to keep you logged in, persist your active expedition and hotel reservation cart, and remember your currency preferences (NPR / USD).
        </p>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          For detailed information regarding how cookies are deployed and managed, please review our comprehensive{' '}
          <Link href="/cookie-policy" className="font-semibold text-[#0552A2] hover:underline">
            Cookie Policy
          </Link>.
        </p>
      </section>

      {/* 9. Contact Data Protection Officer */}
      <section id="contact-dpo" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 09
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Contact the Data Protection Officer
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          For data access requests, permit verification questions, or privacy compliance inquiries, contact our official desk:
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-700">
            <Building2 className="h-4 w-4 text-[#0552A2] shrink-0" />
            <span className="font-bold">Visit Nepal Official Tourism Desk</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Bhrikutimandap, Kathmandu, Bagmati Province, Nepal</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Official Email: </span>
            <a href="mailto:info@visitnepal.ai" className="font-semibold text-[#0552A2] hover:underline">
              info@visitnepal.ai
            </a>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
