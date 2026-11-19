'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Compass,
  FileText,
  CreditCard,
  QrCode as QrCodeIcon,
  Download,
  AlertCircle,
  ArrowRight,
  Mountain,
  Building2,
  X,
  Printer,
  ChevronRight,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MapPin,
  User,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import PaymentModal from '@/components/features/booking/PaymentModal';
import { printOfficialReceipt, sanitizeName } from '@/lib/receiptGenerator';

type DashboardView = 'trips' | 'custom' | 'invoices';
type TripFilter = 'active' | 'completed';

export default function TravelerDashboardPage() {
  const {
    bookings,
    cancelBooking,
    customPlans,
    refreshCustomPlans,
    acceptQuotation,
    rejectQuotation,
    currentUser,
  } = useApp();

  const [activeView, setActiveView] = useState<DashboardView>('trips');
  const [tripFilter, setTripFilter] = useState<TripFilter>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPassBooking, setSelectedPassBooking] = useState<any | null>(null);
  const [rejectFeedbackModal, setRejectFeedbackModal] = useState<{ planId: string; quoteId: string } | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [paymentModalBooking, setPaymentModalBooking] = useState<any | null>(null);

  useEffect(() => {
    refreshCustomPlans();
  }, []);

  // Filter bookings
  const activeBookings = useMemo(
    () => bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Paid' || b.status === 'Pending' || b.status === 'Quoted'),
    [bookings]
  );

  const pastBookings = useMemo(
    () => bookings.filter((b) => b.status === 'Completed' || b.status === 'Cancelled'),
    [bookings]
  );

  // Trips matching search query
  const displayedBookings = useMemo(() => {
    const list = tripFilter === 'active' ? activeBookings : pastBookings;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (b) =>
        b.title?.toLowerCase().includes(q) ||
        b.id?.toLowerCase().includes(q) ||
        b.provider?.toLowerCase().includes(q) ||
        b.assignedGuide?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q)
    );
  }, [tripFilter, activeBookings, pastBookings, searchQuery]);

  // Featured upcoming trip (if any active booking exists)
  const premierTrip = useMemo(() => {
    return activeBookings.length > 0 ? activeBookings[0] : null;
  }, [activeBookings]);

  // Secondary active trips
  const secondaryBookings = useMemo(() => {
    if (tripFilter === 'active' && premierTrip && !searchQuery) {
      return displayedBookings.filter((b) => b.id !== premierTrip.id);
    }
    return displayedBookings;
  }, [displayedBookings, premierTrip, tripFilter, searchQuery]);

  // Number of active custom proposals awaiting review
  const pendingQuotesCount = useMemo(() => {
    return customPlans.filter((p) => p.status === 'QUOTED').length;
  }, [customPlans]);

  const handlePrintBookingReceipt = (b: any) => {
    const amountNum = parseInt(String(b?.amount || '0').replace(/[^0-9]/g, ''), 10) || 120000;
    const subtotal = Math.round(amountNum / 1.18);
    const serviceCharge = Math.round(subtotal * 0.05);
    const vat = Math.round(subtotal * 0.13);

    printOfficialReceipt({
      invoiceNumber: b?.invoiceNumber || `VN-INV-2026-${b?.id || Math.floor(10000 + Math.random() * 89999)}`,
      bookingId: b?.id || `VN-BKG-2026-${Math.floor(10000 + Math.random() * 89999)}`,
      qrCode: b?.qrCode || `VN-PASS-${b?.id}-VERIFIED-2026`,
      travelerName: sanitizeName(b?.travelerDetails?.leadTravelerName || currentUser?.name || 'Aayush Pradhan'),
      travelerEmail: b?.travelerDetails?.leadEmail || currentUser?.email || 'aayush.traveler@visitnepal.com',
      travelerPhone: b?.travelerDetails?.leadPhone || b?.contactPhone || '+977-9801234567',
      packageTitle: b?.title || 'Himalayan Expedition',
      departureDate: b?.date || '2026-05-15',
      provider: b?.provider || 'Himalayan Sherpa Expeditions',
      assignedGuide: b?.assignedGuide || 'Pasang Nuru Sherpa (IFMGA)',
      meetingPoint: b?.meetingPoint || 'Kathmandu Departure Base',
      items: [
        {
          description: b?.title || 'Expedition Package',
          details: 'Official NTB Verified Expedition Itinerary & Field Services',
          qty: '1 Reservation',
          amountNpr: subtotal,
        },
      ],
      subtotalNpr: subtotal,
      serviceChargeNpr: serviceCharge,
      vatNpr: vat,
      totalNpr: amountNum,
    });
  };

  const handleAcceptQuote = async (planId: string, quoteId: string) => {
    try {
      const res = await acceptQuotation(planId, quoteId);
      if (res?.booking) {
        setPaymentModalBooking(res.booking);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectQuote = async () => {
    if (!rejectFeedbackModal) return;
    try {
      await rejectQuotation(rejectFeedbackModal.planId, rejectFeedbackModal.quoteId, rejectNotes);
      setRejectFeedbackModal(null);
      setRejectNotes('');
    } catch (err) {
      console.error(err);
    }
  };

  const userName = currentUser?.name || 'Aayush Pradhan';

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 font-inter text-slate-900 antialiased">
      {/* 1. EDITORIAL HEADER BANNER */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#0552A2]">
                <ShieldCheck className="h-4 w-4" />
                <span>Verified Traveler Workspace · NTB 2026</span>
              </div>

              <h1 className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900">
                Welcome, {userName}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Manage your verified Himalayan permits, boarding passes, custom expedition proposals, and official tax invoices.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/custom-plan"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white px-4 py-2.5 text-xs font-semibold tracking-wide shadow-xs active:scale-95 transition-all"
              >
                <Mountain className="h-4 w-4" />
                <span>Plan Custom Trip</span>
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-xs font-semibold tracking-wide active:scale-95 transition-all shadow-2xs"
              >
                <User className="h-4 w-4 text-slate-500" />
                <span>TIMS Pass &amp; Profile</span>
              </Link>
            </div>
          </div>

          {/* Telemetry Summary Bar */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0552A2]">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 font-poppins block leading-tight">
                  {activeBookings.length} Active
                </span>
                <span className="text-xs text-slate-500">Expeditions &amp; Stays</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 font-poppins block leading-tight">
                  {customPlans.length} Custom Plans
                </span>
                <span className="text-xs text-slate-500">
                  {pendingQuotesCount > 0 ? `${pendingQuotesCount} quote ready for review` : 'Operator bids & drafts'}
                </span>
              </div>
            </div>

            <div className="col-span-2 lg:col-span-1 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 font-poppins block leading-tight">
                  {bookings.length} Tax Invoices
                </span>
                <span className="text-xs text-slate-500">Official NTB settlements</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-6">
        {/* Core Navigation Bar: 3 Clean, Purposeful Sections */}
        <div className="flex items-center justify-between border-b border-slate-200">
          <nav className="flex items-center gap-2 -mb-px">
            <button
              type="button"
              onClick={() => setActiveView('trips')}
              className={`inline-flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeView === 'trips'
                  ? 'border-[#0552A2] text-[#0552A2]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Trips &amp; Bookings</span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  activeView === 'trips' ? 'bg-blue-100/70 text-[#0552A2]' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {activeBookings.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('custom')}
              className={`inline-flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeView === 'custom'
                  ? 'border-[#0552A2] text-[#0552A2]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Custom Proposals</span>
              {customPlans.length > 0 && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    pendingQuotesCount > 0
                      ? 'bg-purple-100 text-purple-800 font-bold'
                      : activeView === 'custom'
                      ? 'bg-blue-100/70 text-[#0552A2]'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {customPlans.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveView('invoices')}
              className={`inline-flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeView === 'invoices'
                  ? 'border-[#0552A2] text-[#0552A2]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Invoices &amp; Receipts</span>
            </button>
          </nav>

          <Link
            href="/explore"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#0552A2] hover:underline"
          >
            <span>Browse All Packages</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* =========================================================================
            SECTION 1: TRIPS & BOOKINGS VIEW
            ========================================================================= */}
        {activeView === 'trips' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              {/* Segmented Filter: Active vs Completed */}
              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 self-start">
                <button
                  type="button"
                  onClick={() => setTripFilter('active')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    tripFilter === 'active'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Upcoming &amp; Active</span>
                  <span className="text-[10px] font-bold text-[#0552A2]">({activeBookings.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTripFilter('completed')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    tripFilter === 'completed'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Completed Archive</span>
                  <span className="text-[10px] font-medium text-slate-400">({pastBookings.length})</span>
                </button>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by name, ID, or guide..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0552A2] focus:border-[#0552A2] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Empty State */}
            {displayedBookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center bg-white space-y-3">
                <Calendar className="mx-auto h-8 w-8 text-slate-300" />
                <h3 className="text-sm font-semibold text-slate-800">
                  {searchQuery
                    ? `No reservations match "${searchQuery}"`
                    : tripFilter === 'active'
                    ? 'No upcoming expeditions scheduled'
                    : 'No completed trips in your archive'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {tripFilter === 'active'
                    ? 'Browse curated Himalayan packages or design a custom private trek tailored to your requirements.'
                    : 'Once you conclude an expedition with your IFMGA guide, completion records and tax certificates appear here.'}
                </p>
                {tripFilter === 'active' && (
                  <div className="pt-2 flex justify-center gap-3">
                    <Link
                      href="/explore"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#044182]"
                    >
                      Browse Expeditions
                    </Link>
                    <Link
                      href="/custom-plan"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Custom Plan
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. Premier Featured Expedition Card (Only for active tab when not searching) */}
                {tripFilter === 'active' && premierTrip && !searchQuery && (
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                    <div className="p-6 sm:p-7 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-[#0552A2] bg-blue-50 px-2.5 py-0.5 rounded-md">
                              Next Expedition · {premierTrip.category || 'High Alpine Trek'}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              #{premierTrip.id}
                            </span>
                          </div>
                          <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                            {premierTrip.title}
                          </h2>
                          <p className="text-xs text-slate-500 font-medium">
                            Operator: <span className="text-slate-800">{premierTrip.provider}</span>
                          </p>
                        </div>

                        <div className="flex sm:flex-col sm:items-end justify-between items-center shrink-0">
                          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                            {premierTrip.status} &amp; Cleared
                          </span>
                          <span className="text-base sm:text-lg font-bold text-[#0552A2] mt-1 font-poppins">
                            {premierTrip.amount}
                          </span>
                        </div>
                      </div>

                      {/* Editorial Detail Columns */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
                        <div>
                          <span className="text-[11px] text-slate-400 block font-medium">Departure Window</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">{premierTrip.date}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block font-medium">Lead Mountain Guide</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">{premierTrip.assignedGuide}</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block font-medium">Rendezvous Base</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block truncate" title={premierTrip.meetingPoint}>
                            {premierTrip.meetingPoint}
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block font-medium">Official Invoice</span>
                          <span className="font-mono text-slate-700 mt-0.5 block">
                            {premierTrip.invoiceNumber || `INV-${premierTrip.id}`}
                          </span>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedPassBooking(premierTrip)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white px-4 py-2 text-xs font-semibold tracking-wide active:scale-95 transition-all shadow-xs cursor-pointer"
                          >
                            <QrCodeIcon className="h-4 w-4" />
                            <span>Digital Boarding Pass &amp; QR</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePrintBookingReceipt(premierTrip)}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 text-xs font-semibold active:scale-95 transition-all shadow-2xs cursor-pointer"
                            title="Download or print official NTB tax invoice"
                          >
                            <Printer className="h-3.5 w-3.5 text-slate-500" />
                            <span>Tax Invoice</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => cancelBooking(premierTrip.id)}
                          className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Grid of Other Reservations */}
                {secondaryBookings.length > 0 && (
                  <div className="space-y-3">
                    {tripFilter === 'active' && premierTrip && !searchQuery && (
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 pt-2">
                        Other Active Reservations ({secondaryBookings.length})
                      </h3>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {secondaryBookings.map((b) => (
                        <div
                          key={b.id}
                          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-semibold text-[#0552A2] bg-blue-50 px-2 py-0.5 rounded-md">
                                {b.category || 'Reservation'}
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                b.status === 'Confirmed' || b.status === 'Paid'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {b.status}
                              </span>
                            </div>

                            <h4 className="font-poppins text-base font-semibold text-slate-900 leading-snug">
                              {b.title}
                            </h4>
                            <p className="text-xs text-slate-500">{b.provider}</p>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                              <div>
                                <span className="text-[10px] text-slate-400 block font-medium">Dates</span>
                                <span className="font-semibold text-slate-800">{b.date}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block font-medium">Amount</span>
                                <span className="font-semibold text-[#0552A2]">{b.amount}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-[10px] text-slate-400 block font-medium">Assigned Guide / Desk</span>
                                <span className="text-slate-700 truncate block">{b.assignedGuide || 'Station Desk'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-100 pt-3 gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedPassBooking(b)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0552A2] hover:text-[#044182] cursor-pointer"
                            >
                              <QrCodeIcon className="h-3.5 w-3.5" />
                              <span>View Pass</span>
                            </button>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handlePrintBookingReceipt(b)}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                                title="Print tax invoice"
                              >
                                <Printer className="h-3.5 w-3.5" />
                              </button>
                              {tripFilter === 'active' && (
                                <button
                                  type="button"
                                  onClick={() => cancelBooking(b.id)}
                                  className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            SECTION 2: CUSTOM PROPOSALS & QUOTATIONS VIEW
            ========================================================================= */}
        {activeView === 'custom' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-poppins text-lg font-semibold text-slate-900">
                  Custom Itinerary Proposals &amp; Operator Bids
                </h2>
                <p className="text-xs text-slate-500">
                  Review customized high-altitude routes, official agency quotes, and price agreements.
                </p>
              </div>

              <Link
                href="/custom-plan"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white px-4 py-2 text-xs font-semibold shadow-xs active:scale-95 transition-all self-start sm:self-auto"
              >
                <Mountain className="h-3.5 w-3.5" />
                <span>Create New Custom Route</span>
              </Link>
            </div>

            {customPlans.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white space-y-3">
                <Compass className="mx-auto h-8 w-8 text-slate-300" />
                <h3 className="text-sm font-semibold text-slate-800">No custom proposals submitted</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Have a specific high-pass traverse, private Sherpa group, or custom staging schedule in mind? Use our interactive route builder.
                </p>
                <Link
                  href="/custom-plan"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0552A2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#044182]"
                >
                  Start Custom Itinerary Builder
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {customPlans.map((plan: any) => {
                  const isQuoted = plan.status === 'QUOTED';
                  const isPending = plan.status === 'PENDING_REVIEW';
                  const isConfirmed = plan.status === 'CONFIRMED';
                  const latestQuote = plan.quotations && plan.quotations.length > 0 ? plan.quotations[0] : null;

                  return (
                    <div
                      key={plan.id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5"
                    >
                      {/* Plan Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-semibold text-[#0552A2] bg-blue-50 px-2 py-0.5 rounded">
                              {plan.id}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                isConfirmed
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : isQuoted
                                  ? 'bg-purple-50 text-purple-800 border border-purple-200 font-bold'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {plan.status === 'QUOTED' ? 'Quote Ready for Review' : plan.status}
                            </span>
                          </div>

                          <h3 className="font-poppins text-lg font-semibold text-slate-900">
                            {plan.title}
                          </h3>

                          <p className="text-xs text-slate-500">
                            {plan.durationDays} Days · Target Start: {plan.startDate || 'Spring 2026'} · Party of {plan.travelersCount || 2}
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <span className="text-[11px] text-slate-400 block font-medium">Estimated Budget</span>
                          <span className="text-base font-bold text-[#0552A2] font-poppins">
                            NPR {(plan.estimatedBudgetNpr || 250000).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Itinerary Preview */}
                      {plan.itinerary && plan.itinerary.length > 0 && (
                        <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-xs space-y-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                            Itinerary Outline ({plan.itinerary.length} Days)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            {plan.itinerary.slice(0, 4).map((stage: any, i: number) => (
                              <div key={i} className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                                <span className="font-bold text-[#0552A2]">Day {stage.day}:</span>{' '}
                                <span className="text-slate-700">{stage.title || stage.activity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* OPERATOR QUOTATION CARD */}
                      {isQuoted && latestQuote && (
                        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-5 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <Building2 className="h-5 w-5 text-purple-700 shrink-0" />
                              <div>
                                <h4 className="text-xs font-semibold text-purple-950">
                                  Official Proposal from {latestQuote.businessName || 'Himalayan Sherpa Expeditions'}
                                </h4>
                                <p className="text-[11px] text-purple-700">
                                  Quote #{latestQuote.id} · Issued by Licensed NTB Operator
                                </p>
                              </div>
                            </div>

                            <div className="sm:text-right">
                              <span className="text-[10px] font-semibold uppercase text-purple-700 block">
                                Binding Price
                              </span>
                              <span className="text-lg font-bold text-purple-950 font-poppins">
                                NPR {(latestQuote.quotedAmountNpr || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {latestQuote.remarks && (
                            <div className="text-xs text-purple-900 bg-white p-3 rounded-lg border border-purple-100 leading-relaxed">
                              <span className="font-semibold">Operator Note: </span>
                              {latestQuote.remarks}
                            </div>
                          )}

                          {latestQuote.alternativeRouteNotes && (
                            <div className="text-xs text-amber-900 bg-amber-50 p-3 rounded-lg border border-amber-200 flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                              <div className="leading-relaxed">
                                <span className="font-semibold">Suggested Adjustment: </span>
                                {latestQuote.alternativeRouteNotes}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                            <button
                              type="button"
                              onClick={() => handleAcceptQuote(plan.id, latestQuote.id)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Accept Quotation &amp; Confirm Booking</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setRejectFeedbackModal({ planId: plan.id, quoteId: latestQuote.id })}
                              className="rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-purple-900 px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer"
                            >
                              Request Modification
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Pending Review State */}
                      {isPending && (
                        <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl">
                          <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                          <span>
                            Licensed tour operators are reviewing your custom staging schedule. You will be notified when an official quotation is ready.
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            SECTION 3: INVOICES & OFFICIAL RECEIPTS VIEW
            ========================================================================= */}
        {activeView === 'invoices' && (
          <div className="space-y-5">
            <div>
              <h2 className="font-poppins text-lg font-semibold text-slate-900">
                Official Tax Invoices &amp; Receipts
              </h2>
              <p className="text-xs text-slate-500">
                Download verified VAT receipts and digital settlement records for your expedition bookings.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Service / Package</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#0552A2]">
                          {b.invoiceNumber || `VN-INV-${b.id}`}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-900">
                          {b.title}
                          <span className="block text-[11px] text-slate-400 font-normal">{b.provider}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{b.date}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 font-poppins">{b.amount}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            <span>Paid &amp; Cleared</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handlePrintBookingReceipt(b)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0552A2] hover:text-[#044182] cursor-pointer"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            <span>Print / PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODALS
          ========================================================================= */}

      {/* 1. DIGITAL BOARDING PASS & QR MODAL */}
      {selectedPassBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <button
              onClick={() => setSelectedPassBooking(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1 pt-1">
              <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold px-2.5 py-0.5 uppercase tracking-wide">
                NTB Official Checkpoint Boarding Pass
              </span>
              <h3 className="font-poppins text-lg font-semibold text-slate-900 mt-1">
                {selectedPassBooking.title}
              </h3>
              <p className="text-xs text-slate-500">
                Reservation #{selectedPassBooking.id} · Traveler: {userName}
              </p>
            </div>

            {/* QR Code Presentation */}
            <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-2xl border-2 border-slate-900 bg-white p-3 shadow-sm">
              <div className="flex flex-col items-center justify-center space-y-1.5">
                <QrCodeIcon className="h-28 w-28 text-slate-900" />
                <span className="font-mono text-[9px] font-bold text-slate-800 tracking-wider">
                  {selectedPassBooking.qrCode}
                </span>
              </div>
            </div>

            {/* Verification Metadata */}
            <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Issuing Body:</span>
                <span className="font-medium text-slate-900">Nepal Tourism Board (NTB)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Guide:</span>
                <span className="font-medium text-slate-900">{selectedPassBooking.assignedGuide}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rendezvous Base:</span>
                <span className="font-medium text-slate-900 truncate max-w-[200px]" title={selectedPassBooking.meetingPoint}>
                  {selectedPassBooking.meetingPoint}
                </span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handlePrintBookingReceipt(selectedPassBooking)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0552A2] hover:bg-[#044182] py-2.5 text-xs font-semibold text-white shadow-xs cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Official Pass</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPassBooking(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. REJECT QUOTE / REQUEST MODIFICATION MODAL */}
      {rejectFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">Request Proposal Revision</h3>
              <button
                onClick={() => setRejectFeedbackModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Describe the adjustments you would like the tour operator to make (e.g. adjust budget, alter staging days, or add acclimatization).
            </p>
            <textarea
              rows={4}
              placeholder="e.g., Please add an extra acclimatization day in Namche Bazaar and check if private porter rate is included..."
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0552A2] focus:border-[#0552A2]"
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectFeedbackModal(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectQuote}
                className="rounded-xl bg-[#0552A2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#044182] cursor-pointer"
              >
                Send Revision Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. PAYMENT MODAL (Triggered upon quote acceptance) */}
      {paymentModalBooking && (
        <PaymentModal
          isOpen={!!paymentModalBooking}
          onClose={() => setPaymentModalBooking(null)}
          booking={{
            id: paymentModalBooking.id,
            title: paymentModalBooking.title,
            totalAmountNpr: paymentModalBooking.totalAmountNpr || 300000,
            provider: paymentModalBooking.provider,
            date: paymentModalBooking.date,
            invoiceNumber: paymentModalBooking.invoiceNumber,
          }}
          onPaymentSuccess={() => {
            setPaymentModalBooking(null);
            refreshCustomPlans();
          }}
        />
      )}
    </div>
  );
}
