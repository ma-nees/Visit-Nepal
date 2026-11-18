'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
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
  Mail,
  Phone,
  Globe,
  User,
  ChevronRight,
  Printer,
  Download,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import PaymentModal, { PaymentMethod } from './PaymentModal';
import {
  printOfficialReceipt,
  downloadOfficialReceiptHtml,
  sanitizeName,
  OfficialReceiptData,
} from '@/lib/receiptGenerator';

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
  const rawInitialName = currentUser?.name || 'Aayush Pradhan';
  const cleanInitialName = rawInitialName.replace(/\./g, ' ').replace(/\s+Explorer/i, '').trim() || 'Aayush Pradhan';
  const [fullName, setFullName] = useState(cleanInitialName);
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

  const buildOfficialReceiptData = (): OfficialReceiptData => {
    const bookingId = createdBooking?.id || `VN-BKG-2026-${Math.floor(10000 + Math.random() * 89999)}`;
    const invoiceNumber = createdBooking?.invoiceNumber || `VN-INV-2026-${Math.floor(10000 + Math.random() * 89999)}`;
    const qrCode = createdBooking?.qrCode || `VN-PASS-${bookingId}-VERIFIED-2026`;

    const items = [
      {
        description: `Expedition Base Package: ${pkg.title}`,
        details: `${days} Days Route Schedule • Rendezvous Base: Kathmandu`,
        qty: `${totalTravelers} Traveler(s)`,
        amountNpr: basePackageTotal,
      },
    ];

    if (guideRequested) {
      items.push({
        description: 'IFMGA Certified Lead Mountain Guide',
        details: 'Route safety coordinator with satellite comms & high-altitude first-aid',
        qty: `${days} Days`,
        amountNpr: guideTotal,
      });
    }

    if (porterRequested) {
      items.push({
        description: 'High-Altitude Porter Expedition Logistics',
        details: 'Expedition heavy gear support up to 20kg per traveler',
        qty: `${days} Days`,
        amountNpr: porterTotal,
      });
    }

    if (butlerRequested) {
      items.push({
        description: 'VIP Sherpa Butler & Concierge Service',
        details: '24/7 tented camp dining logistics & personal assistance',
        qty: `${days} Days`,
        amountNpr: butlerTotal,
      });
    }

    if (insuranceRequested) {
      items.push({
        description: 'Emergency Helicopter Rescue Bond & TIMS Permit',
        details: 'Official Government TIMS clearance & guaranteed air evacuation bond',
        qty: `${totalTravelers} Person(s)`,
        amountNpr: insuranceTotal,
      });
    }

    if (shuttleRequested) {
      items.push({
        description: 'Private Airport & Helipad Transfers',
        details: '4WD overland vehicle transport between TIA and expedition base',
        qty: '1 Service',
        amountNpr: shuttleFlat,
      });
    }

    if (gearKitRequested) {
      items.push({
        description: 'High-Alpine Extreme Gear Kit Rental',
        details: '-20°C Down parka, 800-fill sleeping bag, crampons & carbon poles',
        qty: `${totalTravelers} Person(s)`,
        amountNpr: gearKitTotal,
      });
    }

    return {
      invoiceNumber,
      bookingId,
      qrCode,
      travelerName: sanitizeName(fullName),
      travelerEmail: email,
      travelerPhone: phone,
      travelerNationality: nationality,
      passportNumber: passportNumber,
      emergencyContact: emergencyContact,
      dietaryOrMedicalNotes: dietaryNotes,
      packageTitle: pkg.title,
      departureDate,
      duration: `${days} Days`,
      groupSize: `${adultsCount} Adults${childrenCount > 0 ? `, ${childrenCount} Kids` : ''} (${totalTravelers} Total)`,
      provider: pkg.provider || 'Himalayan Sherpa Expeditions',
      assignedGuide: guideRequested ? 'Pasang Nuru Sherpa (IFMGA)' : 'Independent Expedition',
      meetingPoint: 'Kathmandu Departure Base (TIA Terminal 2 / Thamel)',
      items,
      subtotalNpr: subtotal,
      serviceChargeNpr: serviceCharge,
      vatNpr: vat,
      totalNpr: finalTotalNpr,
      totalUsd: finalTotalUsd,
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150 my-auto">
        {/* Top Header */}
        <div className="relative flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#031526] via-[#053568] to-[#031526] text-white overflow-hidden">
          {/* Subtle atmospheric ambient glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#92C4EA]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-0.5 relative z-10">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#92C4EA]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EC1F27]" />
              <span>Official Expedition Reservation • NTB 2026</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold font-poppins text-white line-clamp-1">
              {pkg.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 rounded-full p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer active:scale-95"
            aria-label="Close modal"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Wizard Step Progress Indicator */}
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/80 px-4 sm:px-6 py-2.5 text-xs font-inter font-semibold overflow-x-auto">
          {[
            { num: 1, label: 'Dates & Add-ons' },
            { num: 2, label: 'Traveler Details' },
            { num: 3, label: 'Breakdown & Payment' },
            { num: 4, label: 'Confirmed' },
          ].map((s, idx) => {
            const isCurrent = step === s.num;
            const isCompleted = step > s.num;

            return (
              <div key={s.num} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <div
                  className={`flex items-center gap-1.5 sm:gap-2 transition-all ${
                    isCurrent
                      ? 'text-[#0552A2] font-bold'
                      : isCompleted
                      ? 'text-emerald-700 font-semibold'
                      : 'text-slate-400 font-normal'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono font-bold transition-all shadow-2xs ${
                      isCurrent
                        ? 'bg-[#0552A2] text-white ring-2 ring-[#0552A2]/20'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓' : s.num}
                  </span>
                  <span className="text-[11px] sm:text-xs">{s.label}</span>
                </div>
                {idx < 3 && <ChevronRight className="h-3.5 w-3.5 text-slate-300 mx-1 sm:mx-2 shrink-0" />}
              </div>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* STEP 1: Dates, Travelers, Add-ons */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Departure & Group Size Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs font-inter">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-mono text-slate-600 tracking-wider font-bold">
                    Departure Date
                  </label>
                  <div className="relative flex items-center bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white border border-slate-200/90 focus-within:border-[#0552A2] focus-within:ring-2 focus-within:ring-[#0552A2]/10 rounded-xl transition-all shadow-2xs">
                    <div className="pl-3 text-[#0552A2] pointer-events-none">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full bg-transparent pl-2.5 pr-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-mono text-slate-600 tracking-wider font-bold">
                    Adult Travelers
                  </label>
                  <div className="flex items-center justify-between bg-slate-50/70 border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Users className="h-3.5 w-3.5 text-[#0552A2]" />
                      <span>{adultsCount} Adults</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAdultsCount((v) => Math.max(1, v - 1))}
                        className="h-6 w-6 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 active:scale-95 text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdultsCount((v) => Math.min(16, v + 1))}
                        className="h-6 w-6 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 active:scale-95 text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-mono text-slate-600 tracking-wider font-bold">
                    Children (Under 12)
                  </label>
                  <div className="flex items-center justify-between bg-slate-50/70 border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span>{childrenCount} Kids</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setChildrenCount((v) => Math.max(0, v - 1))}
                        className="h-6 w-6 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 active:scale-95 text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setChildrenCount((v) => Math.min(8, v + 1))}
                        className="h-6 w-6 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 active:scale-95 text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
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

              {/* Running Price Preview (Pure Text & Button, No Card Box) */}
              <div className="border-t border-slate-150 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-inter">
                <div>
                  <span className="text-xs font-semibold text-slate-600">Estimated Total</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xl font-bold font-poppins text-slate-900">
                      NPR {finalTotalNpr.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 font-normal">
                      (~${finalTotalUsd.toLocaleString()} USD)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0552A2] via-[#084C93] to-[#0552A2] hover:opacity-95 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#0552A2]/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
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
              <div className="border-b border-slate-150 pb-2.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#0552A2] uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0552A2]" />
                  <span>Official Permit Documentation</span>
                </div>
                <h3 className="text-base font-bold font-poppins text-slate-900 tracking-tight mt-0.5">
                  Lead Traveler Information
                </h3>
                <p className="text-xs text-slate-500 font-inter">
                  Required for official immigration filings, park checkpoint permits, and NTB digital boarding passes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-inter">
                {/* Full Legal Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-mono text-slate-600 tracking-wider font-bold">
                    Full Legal Name *
                  </label>
                  <div className="relative flex items-center bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white border border-slate-200/90 focus-within:border-[#0552A2] focus-within:ring-2 focus-within:ring-[#0552A2]/10 rounded-xl transition-all shadow-2xs">
                    <div className="pl-3 text-[#0552A2] pointer-events-none">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aayush Pradhan"
                      className="w-full bg-transparent pl-2.5 pr-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-mono text-slate-600 tracking-wider font-bold">
                    Email Address *
                  </label>
                  <div className="relative flex items-center bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white border border-slate-200/90 focus-within:border-[#0552A2] focus-within:ring-2 focus-within:ring-[#0552A2]/10 rounded-xl transition-all shadow-2xs">
                    <div className="pl-3 text-[#0552A2] pointer-events-none">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. aayush.traveler@visitnepal.com"
                      className="w-full bg-transparent pl-2.5 pr-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* Phone / WhatsApp */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-mono text-slate-600 tracking-wider font-bold">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative flex items-center bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white border border-slate-200/90 focus-within:border-[#0552A2] focus-within:ring-2 focus-within:ring-[#0552A2]/10 rounded-xl transition-all shadow-2xs">
                    <div className="pl-3 text-[#0552A2] pointer-events-none">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+977-9801234567"
                      className="w-full bg-transparent pl-2.5 pr-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* Nationality */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-mono text-slate-600 tracking-wider font-bold">
                    Nationality *
                  </label>
                  <div className="relative flex items-center bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white border border-slate-200/90 focus-within:border-[#0552A2] focus-within:ring-2 focus-within:ring-[#0552A2]/10 rounded-xl transition-all shadow-2xs">
                    <div className="pl-3 text-[#0552A2] pointer-events-none">
                      <Globe className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      placeholder="e.g. Nepal / International"
                      className="w-full bg-transparent pl-2.5 pr-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* Passport / National ID Number */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-mono text-slate-600 tracking-wider font-bold">
                    Passport / National ID Number *
                  </label>
                  <div className="relative flex items-center bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white border border-slate-200/90 focus-within:border-[#0552A2] focus-within:ring-2 focus-within:ring-[#0552A2]/10 rounded-xl transition-all shadow-2xs">
                    <div className="pl-3 text-[#0552A2] pointer-events-none">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      placeholder="e.g. NP-9982341A"
                      className="w-full bg-transparent pl-2.5 pr-3 py-2.5 text-xs text-slate-900 font-mono font-medium uppercase focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-mono text-slate-600 tracking-wider font-bold">
                    Emergency Contact Name &amp; Phone *
                  </label>
                  <div className="relative flex items-center bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white border border-slate-200/90 focus-within:border-[#0552A2] focus-within:ring-2 focus-within:ring-[#0552A2]/10 rounded-xl transition-all shadow-2xs">
                    <div className="pl-3 text-[#0552A2] pointer-events-none">
                      <HeartHandshake className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="e.g. Dr. S. Pradhan (+977-9841239876)"
                      className="w-full bg-transparent pl-2.5 pr-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* Dietary or High Altitude Notes */}
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-mono text-slate-600 tracking-wider font-bold">
                    Dietary, Medical, or High Altitude Notes (Optional)
                  </label>
                  <div className="relative flex items-center bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white border border-slate-200/90 focus-within:border-[#0552A2] focus-within:ring-2 focus-within:ring-[#0552A2]/10 rounded-xl transition-all shadow-2xs">
                    <div className="pl-3 text-[#0552A2] pointer-events-none">
                      <FileText className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Vegetarian, Gluten-Free, Previous Diamox use, acute asthma, etc."
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                      className="w-full bg-transparent pl-2.5 pr-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!fullName || !email || !phone}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0552A2] via-[#084C93] to-[#0552A2] hover:opacity-95 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#0552A2]/20 disabled:opacity-50 transition-all cursor-pointer active:scale-95"
                >
                  <span>Review &amp; Price Breakdown</span>
                  <ArrowRight className="h-3.5 w-3.5" />
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
              <div className="flex justify-between items-center pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0552A2] via-[#084C93] to-[#0552A2] hover:opacity-95 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#0552A2]/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Confirm &amp; Proceed to Payment</span>
                  <ArrowRight className="h-3.5 w-3.5" />
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
                    <p className="font-semibold text-slate-800">{sanitizeName(fullName)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Amount Paid</span>
                    <p className="font-bold text-emerald-700">NPR {finalTotalNpr.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-blue-200/80 bg-blue-50/70 p-3 text-slate-900">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1 rounded-md bg-white border border-blue-200/60 shadow-2xs">
                      <QrCodeIcon className="h-4 w-4 text-[#0552A2]" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 tracking-wide">
                      {createdBooking?.qrCode || `VN-PASS-${createdBooking?.id}-VERIFIED-2026`}
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    VERIFIED
                  </span>
                </div>
              </div>

              {/* Action Buttons: Clean Isolated Receipt Download / Print (Receipt Only) */}
              <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto pt-2">
                <button
                  type="button"
                  onClick={() => printOfficialReceipt(buildOfficialReceiptData())}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0552A2] via-[#084C93] to-[#0552A2] hover:opacity-95 py-2.5 px-4 text-xs font-bold text-white shadow-md shadow-[#0552A2]/20 cursor-pointer active:scale-95 transition-all"
                  title="Prints or saves PDF of ONLY the official tax invoice & pass, excluding the website and background"
                >
                  <Printer className="h-4 w-4" />
                  <span>Download / Print Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadOfficialReceiptHtml(buildOfficialReceiptData())}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 px-3.5 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer active:scale-95 transition-all"
                  title="Directly download clean standalone receipt HTML file"
                >
                  <Download className="h-4 w-4 text-[#0552A2]" />
                  <span>Save File</span>
                </button>

                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 py-2.5 px-3.5 text-xs font-bold text-slate-700 cursor-pointer active:scale-95 transition-all"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
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
