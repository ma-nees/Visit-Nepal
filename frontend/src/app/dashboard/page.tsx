'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Compass,
  FileText,
  CreditCard,
  Bookmark,
  MessageSquare,
  Bell,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  QrCode as QrCodeIcon,
  Download,
  AlertCircle,
  ArrowRight,
  Mountain,
  Building2,
  X,
  Printer,
  ChevronRight,
  HelpCircle,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import PaymentModal from '@/components/features/booking/PaymentModal';
import {
  printOfficialReceipt,
  downloadOfficialReceiptHtml,
  sanitizeName,
} from '@/lib/receiptGenerator';

type DashboardTab =
  | 'bookings'
  | 'custom-trips'
  | 'history'
  | 'payments'
  | 'saved'
  | 'messages'
  | 'notifications'
  | 'profile';

export default function TravelerDashboardPage() {
  const {
    bookings,
    cancelBooking,
    customPlans,
    refreshCustomPlans,
    acceptQuotation,
    rejectQuotation,
    currentUser,
    notificationsList,
    markAllRead,
    conversations,
  } = useApp();

  const [activeTab, setActiveTab] = useState<DashboardTab>('bookings');
  const [selectedPassBooking, setSelectedPassBooking] = useState<any | null>(null);
  const [rejectFeedbackModal, setRejectFeedbackModal] = useState<{ planId: string; quoteId: string } | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [paymentModalBooking, setPaymentModalBooking] = useState<any | null>(null);

  // Interactive controls state
  const [bookingSearch, setBookingSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'PAID' | 'PENDING'>('ALL');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    refreshCustomPlans();
  }, []);

  const handleSyncStatus = () => {
    setIsSyncing(true);
    refreshCustomPlans();
    setTimeout(() => {
      setIsSyncing(false);
    }, 700);
  };

  // Filter bookings for active vs history
  const activeBookings = bookings.filter(
    (b) => b.status === 'Confirmed' || b.status === 'Paid' || b.status === 'Pending' || b.status === 'Quoted'
  );

  const filteredActiveBookings = activeBookings.filter((b) => {
    const q = bookingSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      b.title?.toLowerCase().includes(q) ||
      b.id?.toLowerCase().includes(q) ||
      b.provider?.toLowerCase().includes(q) ||
      b.assignedGuide?.toLowerCase().includes(q) ||
      b.category?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'CONFIRMED' && b.status === 'Confirmed') ||
      (statusFilter === 'PAID' && b.status === 'Paid') ||
      (statusFilter === 'PENDING' && (b.status === 'Pending' || b.status === 'Quoted'));

    return matchesSearch && matchesStatus;
  });

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

  const pastBookings = bookings.filter(
    (b) => b.status === 'Completed' || b.status === 'Cancelled'
  );

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

  return (
    <div className="max-w-7xl mx-auto w-full px-3.5 py-3.5 sm:px-6 sm:py-5 lg:px-8 lg:py-6 space-y-3 sm:space-y-4 font-inter">
      {/* 1. Dashboard Welcome Header */}
      <div className="relative pb-3 sm:pb-4 border-b border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0552A2] tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Traveler Portal • NTB 2026</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-poppins leading-tight">
              Welcome Back, <span className="text-[#0552A2]">{currentUser?.name || 'Aayush Pradhan'}</span>
            </h1>

            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              Manage your verified Himalayan expedition permits, custom quotations, QR boarding passes, and invoices.
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href="/custom-plan"
              className="h-8 inline-flex items-center gap-1.5 rounded-lg bg-[#0552A2] text-white px-3 py-1.5 text-xs font-semibold hover:bg-[#044182] shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
            >
              <Mountain className="h-3 w-3" />
              <span>Plan Custom Trip</span>
            </Link>
            <Link
              href="/explore"
              className="h-8 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer shadow-2xs"
            >
              <span>Explore Routes</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Interactive KPI Overview Hub (Clickable Command Metrics to Switch Tabs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {[
          {
            id: 'bookings',
            title: 'Active Expeditions',
            value: activeBookings.length,
            subtitle: 'Confirmed & Boarding Passes',
            icon: Calendar,
            accentColor: 'text-[#0552A2]',
            bgIcon: 'bg-blue-50',
          },
          {
            id: 'custom-trips',
            title: 'Custom Itineraries',
            value: customPlans.length,
            subtitle: 'Operator Quotes & Reviews',
            icon: Compass,
            accentColor: 'text-purple-600',
            bgIcon: 'bg-purple-50',
          },
          {
            id: 'history',
            title: 'Completed Treks',
            value: pastBookings.length,
            subtitle: 'Tax Invoices & Records',
            icon: Clock,
            accentColor: 'text-emerald-600',
            bgIcon: 'bg-emerald-50',
          },
          {
            id: 'notifications',
            title: 'Alerts & Messages',
            value: notificationsList.filter((n) => !n.read).length + conversations.length,
            subtitle: 'Direct Operator Updates',
            icon: Bell,
            accentColor: 'text-amber-600',
            bgIcon: 'bg-amber-50',
          },
        ].map((kpi) => {
          const KpiIcon = kpi.icon;
          const isSelected = activeTab === kpi.id;
          return (
            <button
              key={kpi.id}
              type="button"
              onClick={() => setActiveTab(kpi.id as DashboardTab)}
              className={`text-left rounded-xl p-3 sm:p-3.5 transition-all border cursor-pointer group active:scale-[0.99] ${
                isSelected
                  ? 'bg-blue-50/40 border-[#0552A2] ring-2 ring-[#0552A2]/20 shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`p-2 rounded-xl ${kpi.bgIcon} ${kpi.accentColor}`}>
                  <KpiIcon className="h-4 w-4" />
                </span>
                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-[#0552A2] transition-colors flex items-center gap-0.5">
                  <span>View</span>
                  <ChevronRight className="h-3 w-3" />
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-poppins">
                {kpi.value}
              </div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{kpi.title}</div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">{kpi.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* 3. Full-Width Non-Scrollable Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 p-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs w-full">
        {[
          { id: 'bookings', label: 'My Bookings', icon: Calendar, badge: activeBookings.length },
          { id: 'custom-trips', label: 'Custom Trips', icon: Compass, badge: customPlans.length },
          { id: 'history', label: 'History', icon: Clock, badge: pastBookings.length },
          { id: 'payments', label: 'Payments', icon: CreditCard },
          { id: 'saved', label: 'Saved', icon: Bookmark },
          { id: 'messages', label: 'Messages', icon: MessageSquare, badge: conversations.length },
          { id: 'notifications', label: 'Alerts', icon: Bell, badge: notificationsList.filter((n) => !n.read).length },
          { id: 'profile', label: 'Profile', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DashboardTab)}
              className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                isActive
                  ? 'bg-[#0552A2] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{tab.label}</span>
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 leading-none ${
                    isActive ? 'bg-white text-[#0552A2]' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Tab Contents */}

      {/* TAB 1: MY BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold font-poppins text-slate-900">
                Active &amp; Upcoming Reservations ({activeBookings.length})
              </h2>
              <p className="text-xs text-slate-500">
                Official NTB verified passes, QR permits &amp; expedition manifests
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSyncStatus}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-60"
                title="Sync latest permit & clearance data with NTB"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-[#0552A2] ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Passes'}</span>
              </button>
              <Link
                href="/custom-plan"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#044182] transition-all"
              >
                <Mountain className="h-3.5 w-3.5" />
                <span>New Trip</span>
              </Link>
            </div>
          </div>

          {/* Interactive Search & Status Filter Controls */}
          {activeBookings.length > 0 && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by expedition name, ID, or guide..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20 focus:border-[#0552A2] transition-all"
                />
                {bookingSearch && (
                  <button
                    type="button"
                    onClick={() => setBookingSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter Pills: Compact grid on mobile, flex on desktop */}
              <div className="grid grid-cols-4 sm:flex items-center gap-1 sm:gap-1.5 pb-1 md:pb-0">
                <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden sm:inline-flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Filter:
                </span>
                {[
                  { id: 'ALL', label: 'All', count: activeBookings.length },
                  { id: 'CONFIRMED', label: 'Confirmed', count: activeBookings.filter((b) => b.status === 'Confirmed').length },
                  { id: 'PAID', label: 'Paid', count: activeBookings.filter((b) => b.status === 'Paid').length },
                  { id: 'PENDING', label: 'Pending', count: activeBookings.filter((b) => b.status === 'Pending' || b.status === 'Quoted').length },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setStatusFilter(pill.id as any)}
                    className={`inline-flex items-center justify-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === pill.id
                        ? 'bg-[#0552A2] text-white shadow-2xs font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{pill.label}</span>
                    <span
                      className={`text-[9px] sm:text-[10px] px-1 py-0 rounded-full font-medium ${
                        statusFilter === pill.id ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {pill.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeBookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white space-y-3">
              <Calendar className="mx-auto h-8 w-8 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-800">No active bookings yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our curated trekking expeditions or design a custom trip tailored to your Himalayan goals.
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#044182]"
              >
                Browse Expeditions
              </Link>
            </div>
          ) : filteredActiveBookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center bg-white space-y-3">
              <Search className="mx-auto h-7 w-7 text-slate-400" />
              <h4 className="text-sm font-bold text-slate-800">No matching reservations found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No bookings match &quot;{bookingSearch}&quot; with selected filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setBookingSearch('');
                  setStatusFilter('ALL');
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5 text-[#0552A2]" />
                <span>Reset Search &amp; Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActiveBookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0552A2] bg-blue-50 px-2 py-0.5 rounded">
                          {b.category || 'Trek'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {b.id}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                        {b.title}
                      </h3>
                      <p className="text-xs text-slate-500">{b.provider}</p>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      b.status === 'Confirmed' || b.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Dates</span>
                      <span className="font-semibold text-slate-800">{b.date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Amount</span>
                      <span className="font-bold text-[#0552A2]">{b.amount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Assigned Guide</span>
                      <span className="text-slate-700">{b.assignedGuide}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Invoice</span>
                      <span className="font-mono text-slate-700">{b.invoiceNumber || `INV-${b.id}`}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPassBooking(b)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      <QrCodeIcon className="h-3.5 w-3.5 text-[#0552A2]" />
                      <span>View Pass / QR</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePrintBookingReceipt(b)}
                        className="p-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer"
                        title="Print Official Receipt Only"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => cancelBooking(b.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CUSTOM TRIPS */}
      {activeTab === 'custom-trips' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-poppins text-slate-900">
                Custom Expedition Requests &amp; Agency Quotations ({customPlans.length})
              </h2>
              <p className="text-xs text-slate-500">
                Review submitted custom itineraries, agency quotations, and alternative route feedback.
              </p>
            </div>
            <Link
              href="/custom-plan"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#044182]"
            >
              <Mountain className="h-3.5 w-3.5" />
              <span>Create New Custom Plan</span>
            </Link>
          </div>

          {customPlans.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white space-y-3">
              <Compass className="mx-auto h-8 w-8 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-800">No custom trips submitted yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Use our 7-step builder to design your own route, select IFMGA guides, and receive binding quotations.
              </p>
              <Link
                href="/custom-plan"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#044182]"
              >
                Launch Custom Trip Builder
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
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-[#0552A2] bg-blue-50 px-2 py-0.5 rounded">
                            {plan.id}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            isConfirmed
                              ? 'bg-emerald-100 text-emerald-800'
                              : isQuoted
                              ? 'bg-purple-100 text-purple-800 ring-1 ring-purple-300'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {plan.status}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 font-poppins mt-1">
                          {plan.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {plan.durationDays} Days • Start Date: {plan.startDate || 'Spring 2026'} • Party: {plan.travelersCount || 2} Traveler(s)
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">
                          Estimated Budget
                        </span>
                        <span className="text-base font-extrabold text-[#0552A2]">
                          NPR {(plan.estimatedBudgetNpr || 250000).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Itinerary Preview */}
                    {plan.itinerary && plan.itinerary.length > 0 && (
                      <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Itinerary Stages Preview ({plan.itinerary.length} Days)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-700">
                          {plan.itinerary.slice(0, 4).map((stage: any, i: number) => (
                            <div key={i} className="bg-white p-2 rounded-lg border border-slate-200">
                              <span className="font-extrabold text-[#0552A2]">D{stage.day}:</span> {stage.title || stage.activity}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AGENCY QUOTATION CARD (When QUOTED) */}
                    {isQuoted && latestQuote && (
                      <div className="rounded-xl border-2 border-purple-300 bg-purple-50/60 p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-purple-700" />
                            <div>
                              <h4 className="text-xs font-bold text-purple-950">
                                Official Quotation from {latestQuote.businessName || 'Himalayan Sherpa Expeditions'}
                              </h4>
                              <p className="text-[10px] text-purple-700">
                                Quote ID: {latestQuote.id} • Issued by NTB Verified Tour Operator
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold uppercase text-purple-700 block">
                              Quoted Price
                            </span>
                            <span className="text-lg font-extrabold text-purple-900">
                              NPR {(latestQuote.quotedAmountNpr || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {latestQuote.remarks && (
                          <div className="text-xs text-purple-900 bg-white/80 p-2.5 rounded-lg border border-purple-200">
                            <span className="font-bold">Operator Remarks: </span>
                            {latestQuote.remarks}
                          </div>
                        )}

                        {latestQuote.alternativeRouteNotes && (
                          <div className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-start gap-1.5">
                            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">Suggested Route Optimization: </span>
                              {latestQuote.alternativeRouteNotes}
                            </div>
                          </div>
                        )}

                        {/* Accept / Decline Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleAcceptQuote(plan.id, latestQuote.id)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white py-2.5 text-xs font-bold shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Accept Quotation &amp; Confirm Booking</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectFeedbackModal({ planId: plan.id, quoteId: latestQuote.id })}
                            className="rounded-xl border border-purple-300 bg-white hover:bg-purple-100 text-purple-900 px-4 py-2 text-xs font-bold transition-all cursor-pointer"
                          >
                            <span>Decline / Request Revision</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Pending Agency Review Notification */}
                    {isPending && (
                      <div className="flex items-center gap-2 text-xs text-slate-600 bg-amber-50 border border-amber-200 p-3 rounded-xl">
                        <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                        <span>
                          Tour operators are currently reviewing your custom itinerary for guide availability, permit staging, and weather logistics. You will receive an official quotation here.
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

      {/* TAB 3: BOOKING HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-poppins text-slate-900">
              Completed &amp; Past Expeditions ({pastBookings.length})
            </h2>
            <span className="text-xs text-slate-500">Historical climbing logs &amp; certificates</span>
          </div>

          {pastBookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white space-y-2">
              <Clock className="mx-auto h-8 w-8 text-slate-400" />
              <p className="text-xs text-slate-500">No past completed expeditions recorded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastBookings.map((b) => (
                <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{b.title}</h3>
                      <p className="text-xs text-slate-500">{b.date}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {b.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                    <span className="font-semibold text-slate-700">{b.amount}</span>
                    <button
                      type="button"
                      onClick={() => handlePrintBookingReceipt(b)}
                      className="text-[#0552A2] hover:underline font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Tax Invoice</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PAYMENT HISTORY */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-poppins text-slate-900">
              Verified Payment Transactions &amp; Receipts
            </h2>
            <span className="text-xs text-slate-500">Official NTB Settlement Desks</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-3">Service / Expedition</th>
                  <th className="py-3 px-3">Gateway</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-[#0552A2]">TXN-KHALTI-991204</td>
                  <td className="py-3 px-3 font-semibold">Everest Base Camp &amp; Kala Patthar</td>
                  <td className="py-3 px-3">Khalti Wallet (NPR)</td>
                  <td className="py-3 px-3 font-bold text-slate-900">NPR 182,500</td>
                  <td className="py-3 px-3">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      SUCCESSFUL
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        handlePrintBookingReceipt({
                          id: 'BKG-991204',
                          invoiceNumber: 'VN-INV-991204',
                          title: 'Everest Base Camp & Kala Patthar',
                          amount: 'NPR 182,500',
                          date: '2026-05-15',
                        })
                      }
                      className="text-[#0552A2] hover:underline font-bold text-xs cursor-pointer"
                    >
                      Print Receipt
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-[#0552A2]">TXN-ESEWA-881290</td>
                  <td className="py-3 px-3 font-semibold">Gokyo Lakes High Pass Route</td>
                  <td className="py-3 px-3">eSewa Mobile (NPR)</td>
                  <td className="py-3 px-3 font-bold text-slate-900">NPR 312,000</td>
                  <td className="py-3 px-3">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      SUCCESSFUL
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        handlePrintBookingReceipt({
                          id: 'BKG-881290',
                          invoiceNumber: 'VN-INV-881290',
                          title: 'Gokyo Lakes High Pass Route',
                          amount: 'NPR 312,000',
                          date: '2026-06-01',
                        })
                      }
                      className="text-[#0552A2] hover:underline font-bold text-xs cursor-pointer"
                    >
                      Print Receipt
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SAVED ITINERARIES */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold font-poppins text-slate-900">
            Saved Routes &amp; Wishlist
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
              <span className="text-[10px] font-bold text-[#0552A2] bg-blue-50 px-2 py-0.5 rounded uppercase">
                Trek
              </span>
              <h3 className="text-sm font-bold text-slate-900">Manaslu Circuit &amp; Larkya La Pass</h3>
              <p className="text-xs text-slate-500">14 Days • 5,106m • Challenging</p>
              <Link
                href="/custom-plan"
                className="block text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 mt-2"
              >
                Customize Route
              </Link>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
              <span className="text-[10px] font-bold text-[#0552A2] bg-blue-50 px-2 py-0.5 rounded uppercase">
                Restricted Area
              </span>
              <h3 className="text-sm font-bold text-slate-900">Upper Mustang: Kingdom of Lo</h3>
              <p className="text-xs text-slate-500">10 Days • 3,840m • Moderate</p>
              <Link
                href="/custom-plan"
                className="block text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 mt-2"
              >
                Customize Route
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MESSAGES */}
      {activeTab === 'messages' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold font-poppins text-slate-900">
              Agency &amp; Guide Communications
            </h2>
            <Link href="/community" className="text-xs text-[#0552A2] font-bold hover:underline">
              Open Full Community Chat
            </Link>
          </div>
          <div className="space-y-3">
            {conversations.map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{c.lastMessage}</p>
                </div>
                <Link
                  href="/community"
                  className="rounded-lg bg-[#0552A2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#044182]"
                >
                  Reply
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 p-5 bg-slate-50/50">
            <h2 className="text-base font-bold font-poppins text-slate-900">
              System &amp; Expedition Notifications
            </h2>
            <button
              onClick={markAllRead}
              className="text-xs text-[#0552A2] font-bold hover:underline"
            >
              Mark all as read
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {notificationsList.map((n) => {
              const isPermit = n.title.toLowerCase().includes('permit');
              const isBooking =
                n.title.toLowerCase().includes('booking') ||
                n.title.toLowerCase().includes('reservation') ||
                n.title.toLowerCase().includes('confirmed');
              const isWeather =
                n.title.toLowerCase().includes('weather') ||
                n.title.toLowerCase().includes('advisory');

              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3.5 px-5 py-3.5 transition-colors hover:bg-slate-50/80 ${
                    !n.read ? 'bg-blue-50/25' : 'bg-transparent'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5 ${
                      isPermit
                        ? 'bg-emerald-50 text-emerald-600'
                        : isBooking
                        ? 'bg-blue-50 text-[#0552A2]'
                        : isWeather
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isPermit ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : isBooking ? (
                      <Calendar className="h-4 w-4" />
                    ) : isWeather ? (
                      <Compass className="h-4 w-4" />
                    ) : (
                      <Bell className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className={`text-xs font-semibold ${!n.read ? 'text-slate-900 font-bold' : 'text-slate-800'}`}>
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">{n.time}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed font-normal">{n.body}</p>
                  </div>
                  {!n.read && (
                    <span className="h-2 w-2 rounded-full bg-[#0552A2] ring-2 ring-blue-100 shrink-0 mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 8: PROFILE & DOCUMENTS */}
      {activeTab === 'profile' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-poppins text-slate-900">
                Traveler Profile &amp; High Altitude Documents
              </h2>
              <p className="text-xs text-slate-500">
                Official documents used for automated permit validation at NTB checkpoints.
              </p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
              KYC Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Full Name</span>
              <p className="font-bold text-slate-900">{currentUser?.name || 'Aayush Pradhan'}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Email Address</span>
              <p className="font-bold text-slate-900">{currentUser?.email || 'aayush.traveler@visitnepal.com'}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Passport / National ID</span>
              <p className="font-mono font-bold text-slate-900">NP-9982341A (Nepal)</p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">High Altitude Travel Insurance</span>
              <p className="font-bold text-emerald-700">Allianz Global Mountain Medevac (Valid through 2026)</p>
            </div>
          </div>
        </div>
      )}

      {/* QR PASS INSPECTION MODAL */}
      {selectedPassBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <button
              onClick={() => setSelectedPassBooking(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1 pt-2">
              <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 uppercase">
                Official Checkpoint Digital Boarding Pass
              </span>
              <h3 className="text-lg font-bold font-poppins text-slate-900 mt-1">
                {selectedPassBooking.title}
              </h3>
              <p className="text-xs text-slate-500">
                Reservation #{selectedPassBooking.id} • Lead Traveler: {currentUser?.name || 'Aayush Pradhan'}
              </p>
            </div>

            {/* QR Mock Rendering */}
            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-inner">
              <div className="flex flex-col items-center justify-center space-y-2">
                <QrCodeIcon className="h-28 w-28 text-slate-900" />
                <span className="font-mono text-[9px] font-extrabold text-slate-800 tracking-wider">
                  {selectedPassBooking.qrCode}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 text-left space-y-1">
              <div className="flex justify-between">
                <span>Verification Desk:</span>
                <span className="font-semibold text-slate-800">Nepal Tourism Board (NTB)</span>
              </div>
              <div className="flex justify-between">
                <span>Assigned Guide:</span>
                <span className="font-semibold text-slate-800">{selectedPassBooking.assignedGuide}</span>
              </div>
              <div className="flex justify-between">
                <span>Rendezvous Base:</span>
                <span className="font-semibold text-slate-800">{selectedPassBooking.meetingPoint}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handlePrintBookingReceipt(selectedPassBooking)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0552A2] py-2.5 text-xs font-bold text-white hover:bg-[#044182] shadow-sm cursor-pointer"
                title="Print or save PDF of official boarding pass and receipt"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Official Pass</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPassBooking(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT QUOTE / REQUEST MODIFICATION MODAL */}
      {rejectFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Decline Quotation / Request Revision</h3>
              <button
                onClick={() => setRejectFeedbackModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Provide feedback or adjustments for the tour operator (e.g. adjust budget, change staging dates, or swap accommodation).
            </p>
            <textarea
              rows={4}
              placeholder="e.g., We would like to add an extra acclimatization day in Namche and check if budget can be lowered slightly..."
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20"
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectFeedbackModal(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectQuote}
                className="rounded-xl bg-[#0552A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#044182]"
              >
                Send Revision Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL (Triggered upon quote acceptance) */}
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
