'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  Mountain,
  UserCheck,
  ConciergeBell,
  Sparkles,
  Plane,
  HeartHandshake,
  ArrowRight,
  ArrowLeft,
  FileText,
  Lock,
  QrCode as QrCodeIcon,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import PaymentModal, { PaymentMethod } from './PaymentModal';

export interface BookingPackageDetails {
  id: string;
  title: string;
  category: 'Trek' | 'Stay' | 'Adventure' | 'Transport' | 'Expedition' | 'Guide' | 'Butler' | 'Tour';
  provider?: string;
  duration?: string;
  durationDays?: number;
  location?: string;
  basePriceNpr: number;
  basePriceUsd?: number;
  imageUrl?: string;
}

interface StandardBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: BookingPackageDetails;
}

export default function StandardBookingModal({
  isOpen,
  onClose,
  pkg,
}: StandardBookingModalProps) {
  const { addBooking, currentUser } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Dates & Addons, 2: Traveler Info, 3: Review & Payment, 4: Confirmed
  const [departureDate, setDepartureDate] = useState('2026-05-15');
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  // Available add-ons
  const [guideRequested, setGuideRequested] = useState(true);
  const [porterRequested, setPorterRequested] = useState(true);
  const [butlerRequested, setButlerRequested] = useState(false);
  const [insuranceRequested, setInsuranceRequested] = useState(true);
  const [shuttleRequested, setShuttleRequested] = useState(false);
  const [gearKitRequested, setGearKitRequested] = useState(false);

  // Traveler info form
  const [fullName, setFullName] = useState(currentUser?.name || 'Aayush Pradhan');
  const [email, setEmail] = useState(currentUser?.email || 'aayush.traveler@visitnepal.com');
  const [phone, setPhone] = useState('+977-9801234567');
  const [nationality, setNationality] = useState('Nepal / International');
  const [passportNumber, setPassportNumber] = useState('NP-9982341A');
  const [emergencyContact, setEmergencyContact] = useState('Dr. S. Pradhan (+977-9841239876)');
  const [dietaryNotes, setDietaryNotes] = useState('');

  // Payment state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);

  if (!isOpen) return null;

  const totalTravelers = adultsCount + childrenCount;
  const days = pkg.durationDays || 8;

  // Add-on cost calculations
  const guideDailyRate = 6500;
  const porterDailyRate = 3500;
  const butlerDailyRate = 8500;
  const insurancePerPerson = 4500;
  const shuttleFlat = 6000;
  const gearKitPerPerson = 5000;

  const guideTotal = guideRequested ? guideDailyRate * days : 0;
  const porterTotal = porterRequested ? porterDailyRate * days : 0;
  const butlerTotal = butlerRequested ? butlerDailyRate * days : 0;
  const insuranceTotal = insuranceRequested ? insurancePerPerson * totalTravelers : 0;
  const shuttleTotal = shuttleRequested ? shuttleFlat : 0;
  const gearKitTotal = gearKitRequested ? gearKitPerPerson * totalTravelers : 0;

  const addonsTotal = guideTotal + porterTotal + butlerTotal + insuranceTotal + shuttleTotal + gearKitTotal;
  const basePackageTotal = (pkg.basePriceNpr * adultsCount) + (pkg.basePriceNpr * 0.75 * childrenCount);
  const subtotal = basePackageTotal + addonsTotal;
  const serviceCharge = Math.round(subtotal * 0.05); // 5% Nepal Tourism Service Charge
  const vat = Math.round((subtotal + serviceCharge) * 0.13); // 13% Nepal VAT
  const finalTotalNpr = subtotal + serviceCharge + vat;
  const finalTotalUsd = Math.round(finalTotalNpr / 135);

  const handleProceedToPayment = async () => {
    const selectedAddonsList: Array<{ name: string; costNpr: number }> = [];
    if (guideRequested) selectedAddonsList.push({ name: 'IFMGA Mountain Guide', costNpr: guideTotal });
    if (porterRequested) selectedAddonsList.push({ name: 'High Altitude Porter', costNpr: porterTotal });
    if (butlerRequested) selectedAddonsList.push({ name: 'VIP Sherpa Butler Concierge', costNpr: butlerTotal });
    if (insuranceRequested) selectedAddonsList.push({ name: 'Mountain Rescue & Medevac Insurance', costNpr: insuranceTotal });
    if (shuttleRequested) selectedAddonsList.push({ name: 'Airport & Trailhead Shuttle Transfer', costNpr: shuttleTotal });
    if (gearKitRequested) selectedAddonsList.push({ name: 'Expedition Cold Weather Gear Kit', costNpr: gearKitTotal });

    const newBookingData = {
      title: `${pkg.title} (${pkg.duration || `${days} Days`})`,
      provider: pkg.provider || 'Himalayan Sherpa Expeditions',
      category: pkg.category,
      date: `${departureDate} (${days} Days)`,
      amount: `NPR ${finalTotalNpr.toLocaleString()}`,
      status: 'Confirmed' as any,
      color: '#0552A2',
      meetingPoint: 'Kathmandu Departure Base (TIA Terminal 2 / Thamel)',
      assignedGuide: guideRequested ? 'Pasang Nuru Sherpa (IFMGA)' : 'Independent',
      contactPhone: phone,
      bookingType: 'standard' as const,
      optionsAndAddons: selectedAddonsList.map((a) => ({ name: a.name, priceNpr: a.costNpr })),
      priceBreakdown: {
        baseAmountNpr: basePackageTotal,
        addonsAmountNpr: addonsTotal,
        serviceChargeNpr: serviceCharge,
        vatNpr: vat,
        totalNpr: finalTotalNpr,
      },
      travelerDetails: {
        leadTravelerName: fullName,
        leadEmail: email,
        leadPhone: phone,
        leadNationality: nationality,
        passportNumber,
        emergencyContactName: emergencyContact,
        emergencyContactPhone: phone,
        dietaryOrMedicalNotes: dietaryNotes,
      },
    };

    const saved = await addBooking(newBookingData);
    setCreatedBooking(saved);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (result: any) => {
    setIsPaymentOpen(false);
    setStep(4); // Confirmed screen
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150 my-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#031526] via-[#053568] to-[#031526] text-white">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#92C4EA]">
              <Mountain className="h-3.5 w-3.5 text-[#FDB716]" />
              <span>Standard Expedition &amp; Service Reservation</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold font-poppins text-white line-clamp-1">
              {pkg.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wizard Step Progress Indicator */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 py-2.5 text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-[#0552A2]' : 'text-slate-500'}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${step === 1 ? 'bg-[#0552A2] text-white' : 'bg-slate-200 text-slate-600'}`}>
              1
            </span>
            <span>Dates &amp; Add-ons</span>
          </div>
          <span className="mx-3 text-slate-300">/</span>
          <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-[#0552A2]' : 'text-slate-500'}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${step === 2 ? 'bg-[#0552A2] text-white' : 'bg-slate-200 text-slate-600'}`}>
              2
            </span>
            <span>Traveler Details</span>
          </div>
          <span className="mx-3 text-slate-300">/</span>
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-[#0552A2]' : 'text-slate-500'}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${step === 3 ? 'bg-[#0552A2] text-white' : 'bg-slate-200 text-slate-600'}`}>
              3
            </span>
            <span>Breakdown &amp; Payment</span>
          </div>
          <span className="mx-3 text-slate-300">/</span>
          <div className={`flex items-center gap-1.5 ${step === 4 ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${step === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              ✓
            </span>
            <span>Confirmed</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* STEP 1: Dates, Travelers, Add-ons */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Departure & Group Size Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Adult Travelers
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-slate-300 px-3 py-1.5">
                    <span className="text-xs font-bold text-slate-800">{adultsCount} Adults</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAdultsCount((v) => Math.max(1, v - 1))}
                        className="h-6 w-6 rounded bg-slate-100 font-bold hover:bg-slate-200 text-xs"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdultsCount((v) => Math.min(16, v + 1))}
                        className="h-6 w-6 rounded bg-slate-100 font-bold hover:bg-slate-200 text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Children (Under 12)
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-slate-300 px-3 py-1.5">
                    <span className="text-xs font-bold text-slate-800">{childrenCount} Kids</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setChildrenCount((v) => Math.max(0, v - 1))}
                        className="h-6 w-6 rounded bg-slate-100 font-bold hover:bg-slate-200 text-xs"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setChildrenCount((v) => Math.min(8, v + 1))}
                        className="h-6 w-6 rounded bg-slate-100 font-bold hover:bg-slate-200 text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add-ons Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Recommended Add-ons &amp; Field Staff
                  </h3>
                  <span className="text-[11px] text-[#0552A2] font-semibold">
                    Customize your experience
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Lead Guide */}
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${guideRequested ? 'border-[#0552A2] bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input
                      type="checkbox"
                      checked={guideRequested}
                      onChange={(e) => setGuideRequested(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded text-[#0552A2] focus:ring-[#0552A2]"
                    />
                    <div className="text-xs">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900">IFMGA Certified Mountain Guide</span>
                        <span className="text-[10px] font-bold text-[#0552A2]">+NPR 6,500/day</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Licensed route leader with satellite comms and first-aid gear.
                      </p>
                    </div>
                  </label>

                  {/* Porter */}
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${porterRequested ? 'border-[#0552A2] bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input
                      type="checkbox"
                      checked={porterRequested}
                      onChange={(e) => setPorterRequested(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded text-[#0552A2] focus:ring-[#0552A2]"
                    />
                    <div className="text-xs">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900">High Altitude Porter</span>
                        <span className="text-[10px] font-bold text-[#0552A2]">+NPR 3,500/day</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Carries up to 25kg duffle with official equipment insurance.
                      </p>
                    </div>
                  </label>

                  {/* Sherpa Butler */}
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${butlerRequested ? 'border-[#0552A2] bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input
                      type="checkbox"
                      checked={butlerRequested}
                      onChange={(e) => setButlerRequested(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded text-[#0552A2] focus:ring-[#0552A2]"
                    />
                    <div className="text-xs">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900">Sherpa Butler VIP Service</span>
                        <span className="text-[10px] font-bold text-[#0552A2]">+NPR 8,500/day</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Private tea ritual, heated bedding, luggage valet &amp; concierge.
                      </p>
                    </div>
                  </label>

                  {/* Medevac Insurance */}
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${insuranceRequested ? 'border-[#0552A2] bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input
                      type="checkbox"
                      checked={insuranceRequested}
                      onChange={(e) => setInsuranceRequested(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded text-[#0552A2] focus:ring-[#0552A2]"
                    />
                    <div className="text-xs">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900">Emergency Heli-Rescue Cover</span>
                        <span className="text-[10px] font-bold text-[#0552A2]">+NPR 4,500/pp</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        24/7 mountain dispatch authorization up to 6,500m.
                      </p>
                    </div>
                  </label>

                  {/* Private Shuttle */}
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${shuttleRequested ? 'border-[#0552A2] bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input
                      type="checkbox"
                      checked={shuttleRequested}
                      onChange={(e) => setShuttleRequested(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded text-[#0552A2] focus:ring-[#0552A2]"
                    />
                    <div className="text-xs">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900">Private Airport 4WD Shuttle</span>
                        <span className="text-[10px] font-bold text-[#0552A2]">+NPR 6,000 flat</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Door-to-door VIP transfer between airport &amp; hotel base.
                      </p>
                    </div>
                  </label>

                  {/* Expedition Gear Kit */}
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${gearKitRequested ? 'border-[#0552A2] bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input
                      type="checkbox"
                      checked={gearKitRequested}
                      onChange={(e) => setGearKitRequested(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded text-[#0552A2] focus:ring-[#0552A2]"
                    />
                    <div className="text-xs">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900">High-Alpine Gear Kit</span>
                        <span className="text-[10px] font-bold text-[#0552A2]">+NPR 5,000/pp</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        -20°C Down jacket, sleeping bag, crampons &amp; carbon poles.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Running Price Preview Bar */}
              <div className="rounded-xl bg-slate-900 p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Total</span>
                  <p className="text-lg font-extrabold text-[#FDB716]">
                    NPR {finalTotalNpr.toLocaleString()}
                    <span className="text-xs text-slate-300 font-normal ml-1.5">
                      (~${finalTotalUsd.toLocaleString()} USD)
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0552A2] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#044182] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Continue to Traveler Details</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Traveler Information Form */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Lead Traveler Information</h3>
                <p className="text-xs text-slate-500">
                  Required for official permit filings and NTB digital boarding passes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Nationality *
                  </label>
                  <input
                    type="text"
                    required
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Passport / National ID Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-800 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Emergency Contact Name &amp; Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Dietary, Medical, or High Altitude Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Vegetarian, Gluten-Free, Previous Diamox use, etc."
                    value={dietaryNotes}
                    onChange={(e) => setDietaryNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20"
                  />
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!fullName || !email || !phone}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#044182] disabled:opacity-50 cursor-pointer"
                >
                  <span>Review &amp; Price Breakdown</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Complete Itemized Price Breakdown & Payment Trigger */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Review Booking &amp; Itemized Quotation</h3>
                <p className="text-xs text-slate-500">
                  Compliant with Nepal Tourism Board statutory pricing and taxes.
                </p>
              </div>

              {/* Itemized Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100/80 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Line Item</th>
                      <th className="py-2.5 px-3">Units</th>
                      <th className="py-2.5 px-4 text-right">Amount (NPR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-2 px-4 font-semibold">{pkg.title} (Base)</td>
                      <td className="py-2 px-3 text-slate-500">{totalTravelers} Traveler(s)</td>
                      <td className="py-2 px-4 text-right font-medium">NPR {basePackageTotal.toLocaleString()}</td>
                    </tr>
                    {guideRequested && (
                      <tr>
                        <td className="py-2 px-4">IFMGA Mountain Guide</td>
                        <td className="py-2 px-3 text-slate-500">{days} Days</td>
                        <td className="py-2 px-4 text-right">NPR {guideTotal.toLocaleString()}</td>
                      </tr>
                    )}
                    {porterRequested && (
                      <tr>
                        <td className="py-2 px-4">High Altitude Porter</td>
                        <td className="py-2 px-3 text-slate-500">{days} Days</td>
                        <td className="py-2 px-4 text-right">NPR {porterTotal.toLocaleString()}</td>
                      </tr>
                    )}
                    {butlerRequested && (
                      <tr>
                        <td className="py-2 px-4">Sherpa Butler VIP Concierge</td>
                        <td className="py-2 px-3 text-slate-500">{days} Days</td>
                        <td className="py-2 px-4 text-right">NPR {butlerTotal.toLocaleString()}</td>
                      </tr>
                    )}
                    {insuranceRequested && (
                      <tr>
                        <td className="py-2 px-4">Mountain Medevac Rescue Coverage</td>
                        <td className="py-2 px-3 text-slate-500">{totalTravelers} Person(s)</td>
                        <td className="py-2 px-4 text-right">NPR {insuranceTotal.toLocaleString()}</td>
                      </tr>
                    )}
                    {shuttleRequested && (
                      <tr>
                        <td className="py-2 px-4">Private Airport Transfer</td>
                        <td className="py-2 px-3 text-slate-500">1 Vehicle</td>
                        <td className="py-2 px-4 text-right">NPR {shuttleTotal.toLocaleString()}</td>
                      </tr>
                    )}
                    {gearKitRequested && (
                      <tr>
                        <td className="py-2 px-4">Expedition Cold Weather Gear Kit</td>
                        <td className="py-2 px-3 text-slate-500">{totalTravelers} Person(s)</td>
                        <td className="py-2 px-4 text-right">NPR {gearKitTotal.toLocaleString()}</td>
                      </tr>
                    )}

                    <tr className="bg-slate-50/70 font-semibold text-slate-800">
                      <td colSpan={2} className="py-2 px-4">Subtotal</td>
                      <td className="py-2 px-4 text-right">NPR {subtotal.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="py-1.5 px-4 text-slate-500">
                        Nepal Tourism Service Charge (5%)
                      </td>
                      <td className="py-1.5 px-4 text-right text-slate-600">NPR {serviceCharge.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="py-1.5 px-4 text-slate-500">
                        Nepal Inland Revenue VAT (13%)
                      </td>
                      <td className="py-1.5 px-4 text-right text-slate-600">NPR {vat.toLocaleString()}</td>
                    </tr>
                    <tr className="bg-blue-50/80 font-extrabold text-sm text-[#0552A2] border-t-2 border-[#0552A2]/30">
                      <td colSpan={2} className="py-3 px-4">Total Amount Payable</td>
                      <td className="py-3 px-4 text-right text-base">
                        NPR {finalTotalNpr.toLocaleString()}
                        <span className="block text-[10px] font-normal text-slate-500">
                          (~${finalTotalUsd.toLocaleString()} USD)
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Lead Traveler Card Preview */}
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Lead Traveler &amp; Rendezvous
                </span>
                <p className="font-bold text-slate-800">
                  {fullName} ({nationality}) • {phone} • {email}
                </p>
                <p className="text-slate-600 text-[11px]">
                  Departure: <span className="font-semibold text-slate-800">{departureDate}</span> • Rendezvous: Kathmandu Departure Base
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0552A2] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#044182] shadow-md cursor-pointer active:scale-[0.98] transition-all"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Confirm &amp; Proceed to Payment</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Confirmation */}
          {step === 4 && (
            <div className="py-4 space-y-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <span className="rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 uppercase tracking-wider">
                  Official Reservation Confirmed
                </span>
                <h3 className="text-xl font-bold font-poppins text-slate-900">
                  Expedition Booked Successfully!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your reservation is saved and confirmed. An official receipt and digital boarding pass have been issued.
                </p>
              </div>

              {/* Pass Card Preview */}
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 text-left max-w-lg mx-auto shadow-sm space-y-3">
                <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Unique Booking ID
                    </span>
                    <p className="font-mono text-sm font-extrabold text-[#0552A2]">
                      {createdBooking?.id || `VN-BKG-2026-${Math.floor(10000 + Math.random() * 89999)}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Invoice No.
                    </span>
                    <p className="font-mono text-sm font-extrabold text-slate-800">
                      {createdBooking?.invoiceNumber || `VN-INV-2026-${Math.floor(10000 + Math.random() * 89999)}`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Package</span>
                    <p className="font-semibold text-slate-800 line-clamp-1">{pkg.title}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Departure Date</span>
                    <p className="font-semibold text-slate-800">{departureDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Traveler</span>
                    <p className="font-semibold text-slate-800">{fullName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Amount Paid</span>
                    <p className="font-bold text-emerald-700">NPR {finalTotalNpr.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-900 p-3 text-white">
                  <div className="flex items-center gap-2">
                    <QrCodeIcon className="h-5 w-5 text-[#FDB716]" />
                    <span className="text-xs font-mono font-bold">
                      {createdBooking?.qrCode || `VN-PASS-${createdBooking?.id}-VERIFIED-2026`}
                    </span>
                  </div>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    VERIFIED
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  <span>Download / Print Invoice</span>
                </button>
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0552A2] py-2.5 text-xs font-bold text-white hover:bg-[#044182] cursor-pointer"
                >
                  <span>Go to Traveler Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Reusable Payment Gateway Modal */}
      {createdBooking && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          booking={{
            id: createdBooking.id,
            title: createdBooking.title,
            totalAmountNpr: finalTotalNpr,
            provider: pkg.provider,
            date: departureDate,
            invoiceNumber: createdBooking.invoiceNumber,
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
