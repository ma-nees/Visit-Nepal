'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  Compass,
  ConciergeBell,
  Sparkles,
  Car,
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
  Check,
  Printer,
  Download,
  Shield,
  Mountain,
  Backpack,
  Activity,
  Layers,
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

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Dates & Add-ons, 2: Traveler Info, 3: Review & Payment, 4: Confirmed
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

  const handlePaymentSuccess = () => {
    setIsPaymentOpen(false);
    setStep(4);
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

  // Steps definition for header navigation
  const stepsList = [
    { num: 1, title: 'Dates & Services', short: 'Dates' },
    { num: 2, title: 'Traveler Details', short: 'Travelers' },
    { num: 3, title: 'Review & Breakdown', short: 'Review' },
    { num: 4, title: 'Confirmed Pass', short: 'Pass' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-[0_25px_60px_-15px_rgba(2,12,27,0.35)] border border-slate-200/80 overflow-hidden my-auto"
      >
        {/* 1. Refined Luxury Header */}
        <div className="relative px-5 sm:px-6 py-4 bg-gradient-to-b from-[#031526] via-[#05264b] to-[#041d39] text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-medium tracking-wide text-slate-200 backdrop-blur-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Visit Nepal 2026 · Official Reservation</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-poppins text-white truncate tracking-tight">
                {pkg.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-300 font-inter">
                <span>{days} Days</span>
                <span className="text-slate-500">•</span>
                <span className="truncate">{pkg.provider || 'Himalayan Sherpa Expeditions'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 hover:text-white transition-all flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 2. Sleek Segmented Progress Bar (Zero Cutoffs on Any Screen) */}
        <div className="border-b border-slate-200/80 bg-slate-50/70 px-5 sm:px-6 py-3">
          {/* Mobile view: concise step label + 4 smooth progress bars */}
          <div className="sm:hidden space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900">
                Step {step} of 4: <span className="text-[#0552A2] font-bold">{stepsList[step - 1].title}</span>
              </span>
              <span className="text-[11px] font-mono font-medium text-slate-400">
                {step * 25}%
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-full rounded-full transition-all duration-300 ${
                    s < step
                      ? 'bg-emerald-600'
                      : s === step
                      ? 'bg-[#0552A2]'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop & Tablet view: elegant connected step indicators */}
          <div className="hidden sm:grid grid-cols-4 gap-2">
            {stepsList.map((s) => {
              const isCurrent = step === s.num;
              const isCompleted = step > s.num;
              return (
                <div
                  key={s.num}
                  className={`flex items-center gap-2 py-1 px-2 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-white shadow-xs border border-slate-200/80 text-[#0552A2]'
                      : isCompleted
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold font-mono transition-all ${
                      isCurrent
                        ? 'bg-[#0552A2] text-white'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : s.num}
                  </span>
                  <span className="text-xs font-semibold truncate font-inter">
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Modal Content Body */}
        <div className="p-5 sm:p-6 max-h-[72vh] overflow-y-auto space-y-5 font-inter text-slate-800">
          {/* STEP 1: Dates, Group Size, and Bespoke Add-ons */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Trip Configuration Card */}
              <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#0552A2]" />
                    Expedition Schedule &amp; Party Size
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Official NTB Permit Registry
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Departure Date */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">
                      Departure Date
                    </label>
                    <div className="relative flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-[#0552A2]/20 focus-within:border-[#0552A2] transition-all shadow-2xs">
                      <Calendar className="h-3.5 w-3.5 text-[#0552A2] shrink-0 mr-2" />
                      <input
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Adults Counter */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">
                      Adults <span className="text-[10px] text-slate-400 font-normal">(Age 13+)</span>
                    </label>
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <Users className="h-3.5 w-3.5 text-[#0552A2]" />
                        <span>{adultsCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setAdultsCount((v) => Math.max(1, v - 1))}
                          className="h-6 w-6 rounded-md bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold flex items-center justify-center transition-all cursor-pointer"
                          aria-label="Decrease adults"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdultsCount((v) => Math.min(16, v + 1))}
                          className="h-6 w-6 rounded-md bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold flex items-center justify-center transition-all cursor-pointer"
                          aria-label="Increase adults"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Children Counter */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">
                      Children <span className="text-[10px] text-emerald-600 font-medium">(25% off)</span>
                    </label>
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span>{childrenCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setChildrenCount((v) => Math.max(0, v - 1))}
                          className="h-6 w-6 rounded-md bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold flex items-center justify-center transition-all cursor-pointer"
                          aria-label="Decrease children"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          onClick={() => setChildrenCount((v) => Math.min(8, v + 1))}
                          className="h-6 w-6 rounded-md bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold flex items-center justify-center transition-all cursor-pointer"
                          aria-label="Increase children"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bespoke Add-ons & Field Staff */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                    Expedition Staff &amp; Recommended Services
                  </h3>
                  <span className="text-[11px] text-[#0552A2] font-semibold">
                    Customize your experience
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* 1. Mountain Guide */}
                  <div
                    onClick={() => setGuideRequested(!guideRequested)}
                    className={`group relative flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      guideRequested
                        ? 'border-[#0552A2]/40 bg-gradient-to-r from-blue-50/50 to-white ring-1 ring-[#0552A2]/20 shadow-2xs'
                        : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/40'
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        guideRequested
                          ? 'bg-[#0552A2] text-white shadow-2xs'
                          : 'border border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {guideRequested && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900">
                          IFMGA Mountain Guide
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                            guideRequested
                              ? 'bg-blue-100/70 text-[#0552A2]'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          +NPR 6,500/d
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Certified lead guide with satellite comms &amp; wilderness first-aid.
                      </p>
                    </div>
                  </div>

                  {/* 2. High Altitude Porter */}
                  <div
                    onClick={() => setPorterRequested(!porterRequested)}
                    className={`group relative flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      porterRequested
                        ? 'border-[#0552A2]/40 bg-gradient-to-r from-blue-50/50 to-white ring-1 ring-[#0552A2]/20 shadow-2xs'
                        : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/40'
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        porterRequested
                          ? 'bg-[#0552A2] text-white shadow-2xs'
                          : 'border border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {porterRequested && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900">
                          High Altitude Porter
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                            porterRequested
                              ? 'bg-blue-100/70 text-[#0552A2]'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          +NPR 3,500/d
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Carries up to 25kg duffle with official equipment insurance.
                      </p>
                    </div>
                  </div>

                  {/* 3. Sherpa Butler */}
                  <div
                    onClick={() => setButlerRequested(!butlerRequested)}
                    className={`group relative flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      butlerRequested
                        ? 'border-[#0552A2]/40 bg-gradient-to-r from-blue-50/50 to-white ring-1 ring-[#0552A2]/20 shadow-2xs'
                        : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/40'
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        butlerRequested
                          ? 'bg-[#0552A2] text-white shadow-2xs'
                          : 'border border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {butlerRequested && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900">
                          Sherpa Butler VIP Service
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                            butlerRequested
                              ? 'bg-blue-100/70 text-[#0552A2]'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          +NPR 8,500/d
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Private tea ceremony, heated bedding, valet &amp; concierge.
                      </p>
                    </div>
                  </div>

                  {/* 4. Heli-Rescue Insurance */}
                  <div
                    onClick={() => setInsuranceRequested(!insuranceRequested)}
                    className={`group relative flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      insuranceRequested
                        ? 'border-[#0552A2]/40 bg-gradient-to-r from-blue-50/50 to-white ring-1 ring-[#0552A2]/20 shadow-2xs'
                        : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/40'
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        insuranceRequested
                          ? 'bg-[#0552A2] text-white shadow-2xs'
                          : 'border border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {insuranceRequested && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900">
                          Emergency Heli-Rescue
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                            insuranceRequested
                              ? 'bg-blue-100/70 text-[#0552A2]'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          +NPR 4,500/pp
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        24/7 mountain dispatch authorization up to 6,500m.
                      </p>
                    </div>
                  </div>

                  {/* 5. 4WD Shuttle */}
                  <div
                    onClick={() => setShuttleRequested(!shuttleRequested)}
                    className={`group relative flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      shuttleRequested
                        ? 'border-[#0552A2]/40 bg-gradient-to-r from-blue-50/50 to-white ring-1 ring-[#0552A2]/20 shadow-2xs'
                        : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/40'
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        shuttleRequested
                          ? 'bg-[#0552A2] text-white shadow-2xs'
                          : 'border border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {shuttleRequested && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900">
                          Private 4WD Airport Shuttle
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                            shuttleRequested
                              ? 'bg-blue-100/70 text-[#0552A2]'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          +NPR 6,000 flat
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Door-to-door VIP transfer between airport &amp; trailhead base.
                      </p>
                    </div>
                  </div>

                  {/* 6. Gear Kit */}
                  <div
                    onClick={() => setGearKitRequested(!gearKitRequested)}
                    className={`group relative flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      gearKitRequested
                        ? 'border-[#0552A2]/40 bg-gradient-to-r from-blue-50/50 to-white ring-1 ring-[#0552A2]/20 shadow-2xs'
                        : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/40'
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        gearKitRequested
                          ? 'bg-[#0552A2] text-white shadow-2xs'
                          : 'border border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {gearKitRequested && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900">
                          High-Alpine Gear Kit
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                            gearKitRequested
                              ? 'bg-blue-100/70 text-[#0552A2]'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          +NPR 5,000/pp
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        -20°C Down parka, 800-fill sleeping bag, crampons &amp; poles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-medium text-slate-500">Estimated Total</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg sm:text-xl font-bold font-poppins text-slate-900">
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
                  className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#0552A2] to-[#044182] hover:from-[#065eb8] hover:to-[#054b94] active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-[#0552A2]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Traveler Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Traveler Information Form */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Lead Traveler &amp; Checkpoint Information
                </h3>
                <p className="text-xs text-slate-500">
                  Required by Nepal Tourism Board (NTB) for TIMS checkpoint permits &amp; high-altitude rescue clearance.
                </p>
              </div>

              {/* Group 1: Contact Details */}
              <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-3.5 space-y-3">
                <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#0552A2]" />
                  Primary Contact
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aayush Pradhan"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20 focus:border-[#0552A2] transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. traveler@visitnepal.com"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20 focus:border-[#0552A2] transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+977-9801234567"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20 focus:border-[#0552A2] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Permits & Emergency Details */}
              <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-3.5 space-y-3">
                <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Official Permit &amp; Safety Filing
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600">Nationality *</label>
                    <input
                      type="text"
                      required
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      placeholder="Nepal / International"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20 focus:border-[#0552A2] transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600">Passport / National ID *</label>
                    <input
                      type="text"
                      required
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      placeholder="e.g. NP-9982341A"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20 focus:border-[#0552A2] transition-all uppercase"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600">Emergency Contact &amp; Phone *</label>
                    <input
                      type="text"
                      required
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="Dr. S. Pradhan (+977-9841239876)"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20 focus:border-[#0552A2] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-medium text-slate-600">
                    Medical, Dietary, or High Altitude Notes <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={dietaryNotes}
                    onChange={(e) => setDietaryNotes(e.target.value)}
                    placeholder="e.g. Vegetarian, Diamox use, mild asthma, gluten allergy..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20 focus:border-[#0552A2] transition-all"
                  />
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!fullName || !email || !phone}
                  className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#0552A2] to-[#044182] hover:from-[#065eb8] hover:to-[#054b94] active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-[#0552A2]/20 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Review &amp; Itemized Breakdown</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Complete Itemized Price Breakdown & Payment Trigger */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Itemized Expedition Quotation
                </h3>
                <p className="text-xs text-slate-500">
                  Compliant with statutory Nepal Tourism Board (NTB) fee schedules and Inland Revenue Department VAT.
                </p>
              </div>

              {/* Clean Itemized Table */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden text-xs bg-white shadow-2xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Service Description</th>
                      <th className="py-2.5 px-3 font-semibold">Units</th>
                      <th className="py-2.5 px-4 text-right font-semibold">Amount (NPR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-2 px-4 font-semibold text-slate-900">{pkg.title}</td>
                      <td className="py-2 px-3 text-slate-500">{totalTravelers} Traveler(s)</td>
                      <td className="py-2 px-4 text-right font-medium">NPR {basePackageTotal.toLocaleString()}</td>
                    </tr>
                    {guideRequested && (
                      <tr>
                        <td className="py-2 px-4">IFMGA Mountain Guide</td>
                        <td className="py-2 px-3 text-slate-500">{days} Days</td>
                        <td className="py-2 px-4 text-right font-medium">NPR {guideTotal.toLocaleString()}</td>
                      </tr>
                    )}
                    {porterRequested && (
                      <tr>
                        <td className="py-2 px-4">High Altitude Porter</td>
                        <td className="py-2 px-3 text-slate-500">{days} Days</td>
                        <td className="py-2 px-4 text-right font-medium">NPR {porterTotal.toLocaleString()}</td>
                      </tr>
                    )}
                    {butlerRequested && (
                      <tr>
                        <td className="py-2 px-4">Sherpa Butler VIP Concierge</td>
                        <td className="py-2 px-3 text-slate-500">{days} Days</td>
                        <td className="py-2 px-4 text-right font-medium">NPR {butlerTotal.toLocaleString()}</td>
                      </tr>
                    )}
                    {insuranceRequested && (
                      <tr>
                        <td className="py-2 px-4">Emergency Heli-Rescue Cover</td>
                        <td className="py-2 px-3 text-slate-500">{totalTravelers} Person(s)</td>
                        <td className="py-2 px-4 text-right font-medium">NPR {insuranceTotal.toLocaleString()}</td>
                      </tr>
                    )}
                    {shuttleRequested && (
                      <tr>
                        <td className="py-2 px-4">Private 4WD Airport Transfer</td>
                        <td className="py-2 px-3 text-slate-500">1 Vehicle</td>
                        <td className="py-2 px-4 text-right font-medium">NPR {shuttleTotal.toLocaleString()}</td>
                      </tr>
                    )}
                    {gearKitRequested && (
                      <tr>
                        <td className="py-2 px-4">Expedition Cold Weather Gear Kit</td>
                        <td className="py-2 px-3 text-slate-500">{totalTravelers} Person(s)</td>
                        <td className="py-2 px-4 text-right font-medium">NPR {gearKitTotal.toLocaleString()}</td>
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
                    <tr className="bg-blue-50/70 font-extrabold text-sm text-[#0552A2] border-t border-blue-200">
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
              <div className="rounded-xl bg-slate-50/80 p-3.5 border border-slate-200 text-xs flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Lead Traveler &amp; Rendezvous
                  </span>
                  <p className="font-bold text-slate-800">
                    {fullName} ({nationality}) • {phone}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Departure: <span className="font-semibold text-slate-700">{departureDate}</span> • Rendezvous: Kathmandu Departure Base
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>NTB Verified</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#0552A2] to-[#044182] hover:from-[#065eb8] hover:to-[#054b94] active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-[#0552A2]/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Authorize &amp; Pay NPR {finalTotalNpr.toLocaleString()}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Confirmation Digital Boarding Pass */}
          {step === 4 && (
            <div className="py-2 space-y-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-xs">
                <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] px-2.5 py-0.5 tracking-wide uppercase">
                  Official Reservation Confirmed
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-poppins text-slate-900">
                  Expedition Booked Successfully
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your reservation is saved and confirmed. An official receipt and digital boarding pass have been issued.
                </p>
              </div>

              {/* Digital Boarding Pass Card */}
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/70 p-4 sm:p-5 text-left max-w-md mx-auto shadow-sm space-y-3 font-inter">
                <div className="flex justify-between items-start border-b border-slate-200/80 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Booking Reference
                    </span>
                    <p className="font-mono text-sm font-extrabold text-[#0552A2]">
                      {createdBooking?.id || `VN-BKG-2026-${Math.floor(10000 + Math.random() * 89999)}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Invoice
                    </span>
                    <p className="font-mono text-xs font-semibold text-slate-700">
                      {createdBooking?.invoiceNumber || `VN-INV-2026-${Math.floor(10000 + Math.random() * 89999)}`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Package</span>
                    <p className="font-semibold text-slate-900 truncate">{pkg.title}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Departure Date</span>
                    <p className="font-semibold text-slate-900">{departureDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Traveler</span>
                    <p className="font-semibold text-slate-900">{sanitizeName(fullName)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Total Paid</span>
                    <p className="font-bold text-emerald-700">NPR {finalTotalNpr.toLocaleString()}</p>
                  </div>
                </div>

                {/* QR Code Barcode Row */}
                <div className="flex items-center justify-between rounded-xl border border-blue-200/70 bg-blue-50/50 p-2.5 text-slate-900">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-white border border-blue-200/60 shadow-2xs">
                      <QrCodeIcon className="h-4 w-4 text-[#0552A2]" />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-slate-700 tracking-wide truncate max-w-[200px]">
                      {createdBooking?.qrCode || `VN-PASS-${createdBooking?.id}-VERIFIED-2026`}
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                    VERIFIED
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto pt-1">
                <button
                  type="button"
                  onClick={() => printOfficialReceipt(buildOfficialReceiptData())}
                  className="w-full sm:flex-1 h-9 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0552A2] hover:bg-[#044182] text-xs font-bold text-white shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadOfficialReceiptHtml(buildOfficialReceiptData())}
                  className="w-full sm:flex-1 h-9 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 active:scale-95 transition-all cursor-pointer shadow-2xs"
                >
                  <Download className="h-3.5 w-3.5 text-[#0552A2]" />
                  <span>Save Offline Pass</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto h-9 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Embedded Secure Payment Gateway Modal */}
      {isPaymentOpen && createdBooking && (
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
