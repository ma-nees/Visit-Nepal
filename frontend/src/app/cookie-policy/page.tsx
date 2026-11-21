import Link from 'next/link';
import {
  Cookie,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  Settings,
  Mail,
  MapPin,
  Building2,
  Info,
} from 'lucide-react';
import LegalPageLayout, { LegalSection } from '@/components/legal/LegalPageLayout';

export const metadata = {
  title: 'Cookie Policy | Visit Nepal Official Tourism Desk',
  description:
    'Official cookie, session storage, and browser telemetry policy for Visit Nepal travelers, climbers, and portal users.',
};

const COOKIE_SECTIONS: LegalSection[] = [
  { id: 'what-are-cookies', title: 'What Are Cookies & Storage' },
  { id: 'categories-of-cookies', title: 'Categories of Cookies We Use' },
  { id: 'third-party-cookies', title: 'Third-Party Services & Maps' },
  { id: 'managing-cookies', title: 'Managing Cookie Preferences' },
  { id: 'contact-policy', title: 'Policy Inquiries & Contact' },
];

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy &amp; Browser Storage"
      eyebrow="VISIT NEPAL · LEGAL &amp; POLICIES"
      description="Understand how cookies, local session storage, and lightweight telemetry help power verified expedition bookings, hotel passes, and personalized traveler preferences."
      lastUpdated="November 2026"
      currentPolicy="cookie-policy"
      sections={COOKIE_SECTIONS}
    >
      {/* 1. What Are Cookies */}
      <section id="what-are-cookies" className="space-y-3.5 scroll-mt-28">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 01
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            What Are Cookies &amp; Local Storage
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Cookies and local browser storage are minimal, secure data fragments stored on your device when you navigate Visit Nepal. They enable our servers to recognize your authenticated session, remember your selected expedition dates and hotel reservations, and maintain consistent portal navigation.
        </p>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          We use cookies and client-side storage solely to power platform functionality and protect traveler credentials. We do not use intrusive cross-site tracking cookies or sell your browsing history.
        </p>
      </section>

      {/* 2. Categories of Cookies We Use */}
      <section id="categories-of-cookies" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 02
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Categories of Cookies We Use
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The cookies and storage keys deployed across the platform fall into the following specific functional categories:
        </p>

        <div className="space-y-3 pt-1">
          {/* Essential */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#0552A2]" />
                <span>1. Strictly Necessary &amp; Security Cookies</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0552A2] font-mono text-[10px] font-bold">
                Mandatory
              </span>
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed">
              Essential for core portal operation, session persistence, secure authentication tokens, and fraud prevention during booking checkout. Without these cookies, services such as traveler login, cart persistence, and QR pass access cannot function.
            </p>
          </div>

          {/* Functional */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <Settings className="h-4 w-4 text-emerald-600" />
                <span>2. Functional &amp; Preference Cookies</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold">
                Functional
              </span>
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed">
              Used to remember your preferences across visits, including currency selection (NPR / USD), language options, itinerary map zoom level, and active role personas (Traveler, Guide, Butler).
            </p>
          </div>

          {/* Performance */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-600" />
                <span>3. Performance &amp; Latency Telemetry</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-mono text-[10px] font-bold">
                Performance
              </span>
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed">
              Measures aggregate page response times, server latency, and UI rendering performance to maintain optimal connectivity for remote trail access and high-altitude teahouse connections.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Third-Party Services & Maps */}
      <section id="third-party-cookies" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 03
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Third-Party Services &amp; Interactive Maps
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Some interactive features on Visit Nepal rely on vetted external providers who may set limited technical cookies:
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
          <li><strong>Interactive Map Tiles:</strong> OpenStreetMap and Mapbox render topological trails and district boundaries.</li>
          <li><strong>Payment Gateways:</strong> Khalti and card gateway tokenizers deploy transient anti-fraud security tokens during active transactions.</li>
          <li><strong>Typography &amp; Fonts:</strong> Google Fonts delivers web typography without collecting personal profile data.</li>
        </ul>
      </section>

      {/* 4. Managing Cookie Preferences */}
      <section id="managing-cookies" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 04
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Managing Cookie Preferences
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          You can adjust, block, or delete cookies at any time through your browser settings:
        </p>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
          <p className="font-bold">Important Notice Regarding Essential Cookies:</p>
          <p className="text-[12px] leading-relaxed">
            Disabling strictly necessary cookies may prevent authentication, disrupt checkout processing, and disable access to your verified digital boarding vouchers in <Link href="/bookings" className="text-[#0552A2] font-semibold hover:underline">My Bookings</Link>.
          </p>
        </div>
      </section>

      {/* 5. Policy Inquiries & Contact */}
      <section id="contact-policy" className="space-y-3.5 scroll-mt-28 border-t border-slate-200/70 pt-8 sm:pt-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0552A2] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded">
            Section 05
          </span>
          <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
            Policy Inquiries &amp; Contact Desk
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          If you have questions about how we handle session storage or privacy compliance, refer to our comprehensive{' '}
          <Link href="/privacy" className="font-semibold text-[#0552A2] hover:underline">
            Privacy Policy
          </Link>{' '}
          or contact us:
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-700">
            <Building2 className="h-4 w-4 text-[#0552A2] shrink-0" />
            <span className="font-bold">Visit Nepal Official Tourism Desk</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Bhrikutimandap, Kathmandu, Nepal</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Email: </span>
            <a href="mailto:info@visitnepal.ai" className="font-semibold text-[#0552A2] hover:underline">
              info@visitnepal.ai
            </a>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
