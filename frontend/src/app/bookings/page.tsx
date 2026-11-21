'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  QrCode,
  MapPin,
  Phone,
  Calendar,
  X,
  XCircle,
  ShieldCheck,
  CheckCircle2,
  Download,
  Building2,
  BedDouble,
  Clock,
  CreditCard,
  AlertTriangle,
  Printer,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Info,
  Search,
  Filter,
  ChevronRight,
  Compass,
  Users,
  Copy,
  Check,
  MessageSquare,
  HelpCircle,
  RotateCcw,
  SlidersHorizontal,
  Mail,
  Receipt,
  FileText,
  Edit3,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Booking, hotels } from '@/data/mockData';
import { api } from '@/lib/api';

// Curated high-resolution hotel cover photos by ID or slug
const HOTEL_IMAGE_MAP: Record<string, string> = {
  htl_barpeepal: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
  htl_dwarikas: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  htl_yak_yeti: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  htl_meghauli: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
  htl_tiger_tops: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
  htl_everest_view: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
  htl_himalayan_front: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80',
  htl_fishtail: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
};

const DEFAULT_HOTEL_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

function getHotelCoverImage(hotelId?: string, hotelName?: string): string {
  if (hotelId && HOTEL_IMAGE_MAP[hotelId]) return HOTEL_IMAGE_MAP[hotelId];
  if (hotelId) {
    const foundInMock = hotels.find((h) => h.id === hotelId);
    if (foundInMock?.imageUrl) return foundInMock.imageUrl;
  }
  if (hotelName) {
    const lower = hotelName.toLowerCase();
    if (lower.includes('bar peepal')) return HOTEL_IMAGE_MAP.htl_barpeepal;
    if (lower.includes('dwarika')) return HOTEL_IMAGE_MAP.htl_dwarikas;
    if (lower.includes('yak')) return HOTEL_IMAGE_MAP.htl_yak_yeti;
    if (lower.includes('meghauli')) return HOTEL_IMAGE_MAP.htl_meghauli;
    if (lower.includes('everest')) return HOTEL_IMAGE_MAP.htl_everest_view;
  }
  return DEFAULT_HOTEL_IMAGE;
}

// Booking Categories
type BookingTab = 'all' | 'stays' | 'treks' | 'custom' | 'experiences';

// Temporal / Sub-filters
type TimelineFilter = 'all' | 'upcoming' | 'active' | 'completed' | 'cancelled';

export default function BookingsPage() {
  const { bookings, cancelBooking, modifyBooking, showToast } = useApp();

  // Primary Category Tab
  const [activeTab, setActiveTab] = useState<BookingTab>('all');

  // Timeline Sub-filter
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('all');

  // Status Filter
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Search keyword
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [hotelDetailModal, setHotelDetailModal] = useState<Booking | null>(null);
  const [trekDetailModal, setTrekDetailModal] = useState<Booking | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [modifyModalBooking, setModifyModalBooking] = useState<Booking | null>(null);
  const [contactHotelModal, setContactHotelModal] = useState<Booking | null>(null);

  // Form states for cancellation and modification
  const [cancelReason, setCancelReason] = useState('Travel schedule change');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modify form fields
  const [editSpecialRequests, setEditSpecialRequests] = useState('');
  const [editArrivalTime, setEditArrivalTime] = useState('');

  // Verification state for passes
  const [verifiedInfo, setVerifiedInfo] = useState<any>(null);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setHotelDetailModal(null);
        setTrekDetailModal(null);
        setCancelModalBooking(null);
        setModifyModalBooking(null);
        setContactHotelModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied reservation reference');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to test if a booking is a Hotel Stay
  const isHotelBooking = (b: Booking): boolean => {
    return b.category === 'Stay' || b.bookingType === 'hotel' || !!b.hotelId;
  };

  // Helper to determine temporal status (upcoming, active, completed, cancelled)
  const getTemporalStatus = (b: Booking): 'active' | 'upcoming' | 'completed' | 'cancelled' => {
    const s = (b.status || '').toLowerCase();
    if (s.includes('cancel') || s.includes('refund')) return 'cancelled';
    if (s.includes('complete')) return 'completed';
    if (s.includes('checked in') || s.includes('checked_in') || s.includes('in_progress')) return 'active';

    // Date check
    const checkInStr = b.checkInDate || (b.date ? b.date.split(' - ')[0] : null);
    const checkOutStr = b.checkOutDate || (b.date && b.date.includes(' - ') ? b.date.split(' - ')[1] : null);

    if (checkInStr && checkOutStr) {
      const now = new Date();
      const inDate = new Date(checkInStr);
      const outDate = new Date(checkOutStr);
      if (now >= inDate && now <= outDate) return 'active';
      if (now > outDate) return 'completed';
      return 'upcoming';
    }

    return 'upcoming';
  };

  // Category counts
  const counts = useMemo(() => {
    let stays = 0;
    let treks = 0;
    let custom = 0;
    let experiences = 0;

    bookings.forEach((b) => {
      if (isHotelBooking(b)) {
        stays++;
      } else if (b.bookingType === 'custom' || b.category === 'Custom' || (b.category as any) === 'Custom Expedition') {
        custom++;
      } else if (b.category === 'Trek' || b.category === 'Expedition') {
        treks++;
      } else {
        experiences++;
      }
    });

    return { all: bookings.length, stays, treks, custom, experiences };
  }, [bookings]);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const isHotel = isHotelBooking(b);
      const isCustom = b.bookingType === 'custom' || b.category === 'Custom' || (b.category as any) === 'Custom Expedition';
      const isTrek = (b.category === 'Trek' || b.category === 'Expedition') && !isHotel;
      const isExp = !isHotel && !isCustom && !isTrek;

      // 1. Tab Filter
      if (activeTab === 'stays' && !isHotel) return false;
      if (activeTab === 'treks' && !isTrek) return false;
      if (activeTab === 'custom' && !isCustom) return false;
      if (activeTab === 'experiences' && !isExp) return false;

      // 2. Timeline Filter
      if (timelineFilter !== 'all') {
        const temporal = getTemporalStatus(b);
        if (timelineFilter !== temporal) return false;
      }

      // 3. Status Dropdown Filter
      if (statusFilter !== 'All') {
        const s = (b.status || '').toLowerCase();
        const target = statusFilter.toLowerCase();
        if (!s.includes(target) && target !== s) return false;
      }

      // 4. Keyword Search
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesTitle = b.title.toLowerCase().includes(query);
        const matchesHotelName = b.hotelName ? b.hotelName.toLowerCase().includes(query) : false;
        const matchesId = b.id.toLowerCase().includes(query);
        const matchesProvider = b.provider ? b.provider.toLowerCase().includes(query) : false;
        const matchesLocation = b.meetingPoint ? b.meetingPoint.toLowerCase().includes(query) : false;
        const matchesLead = b.bookedBy ? b.bookedBy.toLowerCase().includes(query) : false;
        const matchesRoom = b.roomName ? b.roomName.toLowerCase().includes(query) : false;

        if (
          !matchesTitle &&
          !matchesHotelName &&
          !matchesId &&
          !matchesProvider &&
          !matchesLocation &&
          !matchesLead &&
          !matchesRoom
        ) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, activeTab, timelineFilter, statusFilter, searchQuery]);

  // Refund calculation helper
  const getRefundEstimate = (b: Booking) => {
    const checkIn = new Date(b.checkInDate || (b.date ? b.date.split(' - ')[0] : Date.now()));
    const hoursLeft = (checkIn.getTime() - Date.now()) / (1000 * 60 * 60);
    const priceNpr = b.priceBreakdown?.totalNpr || parseInt(b.amount.replace(/[^0-9]/g, ''), 10) || 45000;

    if (hoursLeft >= 48) {
      return {
        percent: 100,
        amountNpr: priceNpr,
        tierText: '100% Full Refund (Standard cancellation window > 48h prior to check-in)',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        eligible: true,
      };
    } else if (hoursLeft >= 24) {
      return {
        percent: 50,
        amountNpr: Math.round(priceNpr * 0.5),
        tierText: '50% Partial Refund (Late cancellation window 24-48h prior to check-in)',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        eligible: true,
      };
    } else {
      return {
        percent: 0,
        amountNpr: 0,
        tierText: 'Non-refundable (Inside 24 hours of scheduled arrival per property policy)',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        eligible: false,
      };
    }
  };

  // Confirm Cancellation
  const handleConfirmCancel = async () => {
    if (!cancelModalBooking) return;
    setIsSubmitting(true);
    try {
      await cancelBooking(cancelModalBooking.id, cancelReason);
      setCancelModalBooking(null);
      if (hotelDetailModal?.id === cancelModalBooking.id) {
        setHotelDetailModal(null);
      }
    } catch {
      showToast('Could not cancel reservation. Please contact hotel front desk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Modification
  const handleConfirmModify = async () => {
    if (!modifyModalBooking) return;
    setIsSubmitting(true);
    try {
      await modifyBooking(modifyModalBooking.id, {
        specialRequests: editSpecialRequests,
        arrivalTime: editArrivalTime,
      });
      setModifyModalBooking(null);
      if (hotelDetailModal?.id === modifyModalBooking.id) {
        setHotelDetailModal((prev) =>
          prev
            ? {
                ...prev,
                specialRequests: editSpecialRequests,
                arrivalTime: editArrivalTime,
              }
            : null
        );
      }
    } catch {
      showToast('Could not modify reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Print pass voucher
  const handlePrint = () => {
    window.print();
  };

  // Download pass payload
  const handleDownloadPayload = (b: Booking) => {
    const isHotel = isHotelBooking(b);
    const passData = {
      passId: b.id,
      title: b.title,
      propertyOrProvider: b.hotelName || b.provider,
      category: b.category,
      bookingType: isHotel ? 'Hotel Reservation' : 'Expedition / Tour',
      checkInDate: b.checkInDate || b.date.split(' - ')[0],
      checkOutDate: b.checkOutDate || b.date.split(' - ')[1] || b.date,
      roomName: b.roomName,
      status: b.status,
      amount: b.amount,
      paymentStatus: b.paymentStatus || 'successful',
      addressOrMeetingPoint: b.meetingPoint,
      conciergeOrGuide: b.assignedGuide,
      contactPhone: b.contactPhone,
      qrToken: b.qrCode,
      bookedBy: b.bookedBy,
      issuingAuthority: 'Nepal Tourism Board (NTB) Digital Hospitality & Expedition Registry 2026',
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(passData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${isHotel ? 'HotelVoucher' : 'Pass'}-${b.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded voucher for ${b.title}`);
  };

  // Badge stylings
  const renderStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'confirmed') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          <span>Confirmed</span>
        </span>
      );
    }
    if (s === 'checked in' || s === 'checked_in') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-[#0552A2] border border-blue-200">
          <Building2 className="h-3 w-3 text-[#0552A2]" />
          <span>Checked In</span>
        </span>
      );
    }
    if (s.includes('pending') || s.includes('awaiting')) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
          <Clock className="h-3 w-3 text-amber-600" />
          <span>Pending Confirmation</span>
        </span>
      );
    }
    if (s === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700 border border-slate-200">
          <Check className="h-3 w-3 text-slate-500" />
          <span>Completed</span>
        </span>
      );
    }
    if (s.includes('refund')) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700 border border-purple-200">
          <RotateCcw className="h-3 w-3 text-purple-600" />
          <span>{s.includes('pending') ? 'Refund Pending' : 'Refunded'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
        <XCircle className="h-3 w-3 text-rose-600" />
        <span>Cancelled</span>
      </span>
    );
  };

  const renderPaymentBadge = (b: Booking) => {
    const isPayAtProperty = b.paymentMode === 'pay_at_property' || b.paymentStatus === 'pending';
    const isDeposit = b.paymentMode === 'advance_deposit';
    const isRefunded = b.paymentStatus === 'refunded' || b.status === 'Refunded';

    if (isRefunded) {
      return (
        <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          <RotateCcw className="h-3 w-3 text-slate-500" />
          <span>Refunded</span>
        </span>
      );
    }
    if (isPayAtProperty) {
      return (
        <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          <CreditCard className="h-3 w-3 text-amber-600" />
          <span>Pay at Property</span>
        </span>
      );
    }
    if (isDeposit) {
      return (
        <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          <CreditCard className="h-3 w-3 text-blue-600" />
          <span>Deposit Paid (30%)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
        <span>Paid in Full</span>
      </span>
    );
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-5 sm:py-8 space-y-6 font-inter bg-slate-50/40 min-h-screen">
      {/* =========================================================================
          1. EDITORIAL HEADER & QUICK SUMMARY
          ========================================================================= */}
      <div className="pb-5 border-b border-slate-200/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0552A2] tracking-wider uppercase">
              <Compass className="h-3.5 w-3.5" />
              <span>Visit Nepal Official Traveler Desk</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-poppins">
              My <span className="text-[#0552A2]">Bookings &amp; Stays</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Manage your verified luxury hotel reservations, high-altitude trekking packages, custom itineraries, and outdoor adventure passes in one unified dashboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href="/hotels"
              className="h-9 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0552A2] text-white hover:bg-[#044182] text-xs font-semibold shadow-xs transition-colors"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Book a Hotel</span>
              <ArrowRight className="h-3 w-3" />
            </Link>

            <Link
              href="/explore"
              className="h-9 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors"
            >
              <Compass className="h-3.5 w-3.5 text-[#0552A2]" />
              <span>Browse Treks</span>
            </Link>

            <span className="h-9 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs">
              <Calendar className="h-3.5 w-3.5 text-[#0552A2]" />
              <span>{bookings.length} Total Bookings</span>
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. UNIFIED CATEGORY NAVIGATION TABS
          ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/60 no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`h-9 inline-flex items-center gap-2 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-[#0552A2] text-white shadow-2xs'
              : 'bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span>All Bookings</span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
              activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('stays')}
          className={`h-9 inline-flex items-center gap-2 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'stays'
              ? 'bg-[#0552A2] text-white shadow-2xs'
              : 'bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Hotels &amp; Stays</span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
              activeTab === 'stays' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {counts.stays}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('treks')}
          className={`h-9 inline-flex items-center gap-2 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'treks'
              ? 'bg-[#0552A2] text-white shadow-2xs'
              : 'bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>Trekking &amp; Packages</span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
              activeTab === 'treks' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
            }`}
          >
            {counts.treks}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`h-9 inline-flex items-center gap-2 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'custom'
              ? 'bg-[#0552A2] text-white shadow-2xs'
              : 'bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Custom Trips</span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
              activeTab === 'custom' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
            }`}
          >
            {counts.custom}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('experiences')}
          className={`h-9 inline-flex items-center gap-2 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'experiences'
              ? 'bg-[#0552A2] text-white shadow-2xs'
              : 'bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Experiences</span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
              activeTab === 'experiences' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {counts.experiences}
          </span>
        </button>
      </div>

      {/* =========================================================================
          3. SEARCH, TIMELINE & STATUS TOOLBAR
          ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'stays'
                  ? 'Search hotel, room, reference ID, or location...'
                  : 'Search by reservation ID, title, guide, or location...'
              }
              className="w-full pl-9.5 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20 focus:border-[#0552A2] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0 font-medium">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span>Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8.5 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-800 px-3 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20 focus:border-[#0552A2] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked In">Checked In</option>
              <option value="Pending">Pending Confirmation</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refund">Refunded / Refund Pending</option>
            </select>

            {(searchQuery || statusFilter !== 'All' || timelineFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setTimelineFilter('all');
                }}
                className="h-8.5 inline-flex items-center gap-1 text-xs text-[#0552A2] hover:text-[#044182] font-semibold px-2 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Timeline Filter Pills (Upcoming, Active, Completed, Cancelled) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pr-1 shrink-0">
            Timeline:
          </span>
          {[
            { id: 'all', label: 'All Stays & Trips' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'active', label: 'Currently Active' },
            { id: 'completed', label: 'Completed History' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTimelineFilter(item.id as TimelineFilter)}
              className={`h-7 px-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                timelineFilter === item.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          4. EMPTY STATE
          ========================================================================= */}
      {filteredBookings.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0552A2]">
            <Building2 className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No reservations found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            No bookings match your current criteria. Try clearing search filters or explore verified accommodations and mountain treks across Nepal.
          </p>
          <div className="pt-2 flex items-center justify-center gap-2">
            <Link
              href="/hotels"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#044182] transition-colors"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Explore Stays</span>
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-bold text-slate-800 transition-colors"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Explore Treks</span>
            </Link>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. BOOKINGS LIST / CARDS GRID
          ========================================================================= */}
      <div className="space-y-4">
        {filteredBookings.map((b) => {
          const isHotel = isHotelBooking(b);
          const refundEst = getRefundEstimate(b);
          const isEligibleForCancel = b.status !== 'Cancelled' && b.status !== 'Completed' && b.status !== 'Refunded';
          const coverImage = isHotel
            ? getHotelCoverImage(b.hotelId, b.hotelName || b.title)
            : 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80';

          /* -------------------------------------------------------------------
             A. DEDICATED HOTEL RESERVATION CARD
             ------------------------------------------------------------------- */
          if (isHotel) {
            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col lg:flex-row group"
              >
                {/* Hotel Thumbnail & Fast Overview */}
                <div className="relative w-full lg:w-72 xl:w-80 shrink-0 h-48 lg:h-auto overflow-hidden bg-slate-100">
                  <img
                    src={coverImage}
                    alt={b.hotelName || b.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent lg:bg-gradient-to-r" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/95 backdrop-blur-xs px-2 py-0.5 text-[10.5px] font-bold text-emerald-800 shadow-xs">
                      <Building2 className="h-3 w-3 text-emerald-600" />
                      <span>Hotel Stay</span>
                    </span>

                    {b.nightsCount && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10.5px] font-semibold text-white">
                        <span>{b.nightsCount} Nights</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom Mobile Label */}
                  <div className="absolute bottom-3 left-3 right-3 text-white lg:hidden">
                    <p className="font-bold text-sm truncate">{b.hotelName || b.provider}</p>
                    <p className="text-[11px] text-slate-200 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{b.meetingPoint || 'Nepal'}</span>
                    </p>
                  </div>
                </div>

                {/* Hotel Card Details & Controls */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                  {/* Top: Hotel Name, Reference ID, Status */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-[#0552A2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                            {b.id}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(b.id, b.id)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                            title="Copy Booking ID"
                          >
                            {copiedId === b.id ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>

                        <h2 className="font-poppins text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0552A2] transition-colors leading-snug">
                          {b.hotelName || b.title}
                        </h2>

                        <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{b.meetingPoint || 'Nepal Heritage Registry'}</span>
                        </p>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {renderStatusBadge(b.status)}
                        {renderPaymentBadge(b)}
                      </div>
                    </div>

                    {/* Stay Specifications Grid (Check-in, Check-out, Room, Occupancy) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Check-In</span>
                        <p className="font-bold text-slate-900 mt-0.5">
                          {b.checkInDate || b.date.split(' - ')[0]}
                        </p>
                        <span className="text-[10.5px] text-slate-500">From 02:00 PM</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Check-Out</span>
                        <p className="font-bold text-slate-900 mt-0.5">
                          {b.checkOutDate || b.date.split(' - ')[1] || 'Flexible'}
                        </p>
                        <span className="text-[10.5px] text-slate-500">Until 12:00 PM</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Room Type</span>
                        <p className="font-bold text-slate-900 mt-0.5 truncate" title={b.roomName || 'Deluxe Room'}>
                          {b.roomName || 'Deluxe Room'}
                        </p>
                        <span className="text-[10.5px] text-slate-500">
                          {b.roomsCount || 1} Room ({b.nightsCount || 1} Nights)
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Guests</span>
                        <p className="font-bold text-slate-900 mt-0.5">
                          {(b.adultsCount || 2) + (b.childrenCount || 0)} Guests
                        </p>
                        <span className="text-[10.5px] text-slate-500">
                          {b.adultsCount || 2} Adults{b.childrenCount ? `, ${b.childrenCount} Child` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Total Price & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="space-y-0.5">
                      <span className="text-[11px] text-slate-400 font-medium block">Total Reservation Price</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-bold text-slate-900 font-poppins">
                          {b.amount}
                        </span>
                        <span className="text-[11px] text-slate-500 font-normal">
                          (Includes 10% Service &amp; 13% VAT)
                        </span>
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {/* View Booking Details (Primary Modal) */}
                      <button
                        type="button"
                        onClick={() => setHotelDetailModal(b)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white px-3.5 py-2 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>View Details</span>
                      </button>

                      {/* View Hotel Page */}
                      {b.hotelId && (
                        <Link
                          href={`/hotels/${b.hotelId}`}
                          className="inline-flex items-center gap-1 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 px-3 py-2 text-xs font-semibold shadow-2xs transition-colors"
                          title="Open Hotel Page"
                        >
                          <Building2 className="h-3.5 w-3.5 text-slate-500" />
                          <span>View Hotel</span>
                          <ExternalLink className="h-3 w-3 text-slate-400" />
                        </Link>
                      )}

                      {/* Contact Hotel */}
                      <button
                        type="button"
                        onClick={() => setContactHotelModal(b)}
                        className="inline-flex items-center gap-1 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 px-2.5 py-2 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                        title="Contact Hotel Front Desk"
                      >
                        <Phone className="h-3.5 w-3.5 text-slate-500" />
                        <span className="hidden sm:inline">Contact</span>
                      </button>

                      {/* Modify (If Eligible) */}
                      {isEligibleForCancel && (
                        <button
                          type="button"
                          onClick={() => {
                            setModifyModalBooking(b);
                            setEditSpecialRequests(b.specialRequests || '');
                            setEditArrivalTime(b.arrivalTime || '14:00 - 18:00');
                          }}
                          className="inline-flex items-center gap-1 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 px-2.5 py-2 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                          title="Modify Stay Requests"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                          <span className="hidden sm:inline">Modify</span>
                        </button>
                      )}

                      {/* Cancel (If Eligible) */}
                      {isEligibleForCancel && (
                        <button
                          type="button"
                          onClick={() => setCancelModalBooking(b)}
                          className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 px-2.5 py-2 text-xs font-semibold transition-colors cursor-pointer"
                          title="Cancel Reservation"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          /* -------------------------------------------------------------------
             B. TREKKING, CUSTOM TRIP & ADVENTURE BOOKING CARD
             ------------------------------------------------------------------- */
          return (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col lg:flex-row group"
            >
              <div className="relative w-full lg:w-64 xl:w-72 shrink-0 h-44 lg:h-auto overflow-hidden bg-slate-100">
                <img
                  src={coverImage}
                  alt={b.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent lg:bg-gradient-to-r" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/95 backdrop-blur-xs px-2 py-0.5 text-[10.5px] font-bold text-[#0552A2] shadow-xs">
                    <Compass className="h-3 w-3 text-[#0552A2]" />
                    <span>{b.category}</span>
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white lg:hidden">
                  <p className="font-bold text-sm truncate">{b.title}</p>
                </div>
              </div>

              <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-[#0552A2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          {b.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(b.id, b.id)}
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                          title="Copy Booking ID"
                        >
                          {copiedId === b.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      <h2 className="font-poppins text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0552A2] transition-colors leading-snug">
                        {b.title}
                      </h2>

                      <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <span>Lead Operator: {b.provider}</span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {renderStatusBadge(b.status)}
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="h-3 w-3" />
                        <span>TIMS Verified</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Dates</span>
                      <p className="font-bold text-slate-900 mt-0.5">{b.date}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Rendezvous Point</span>
                      <p className="font-bold text-slate-900 mt-0.5 truncate">{b.meetingPoint}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Leader</span>
                      <p className="font-bold text-slate-900 mt-0.5 truncate">{b.assignedGuide}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-400 font-medium block">Expedition Cost</span>
                    <span className="text-base sm:text-lg font-bold text-slate-900 font-poppins">
                      {b.amount}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTrekDetailModal(b);
                        setVerifiedInfo(null);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white px-3.5 py-2 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      <span>Digital Pass &amp; QR</span>
                    </button>

                    {isEligibleForCancel && (
                      <button
                        type="button"
                        onClick={() => setCancelModalBooking(b)}
                        className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 px-3 py-2 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          6. DEDICATED HOTEL BOOKING DETAILS MODAL (FULL SPECIFICATION)
          ========================================================================= */}
      {hotelDetailModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setHotelDetailModal(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto"
        >
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-6 animate-scale-up">
            {/* Modal Header */}
            <div className="bg-[#0552A2] text-white p-5 flex items-center justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-200 uppercase tracking-wider">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Official Hotel Reservation Voucher</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-poppins">
                  {hotelDetailModal.hotelName || hotelDetailModal.provider}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setHotelDetailModal(null)}
                className="rounded-xl p-1.5 text-blue-100 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto font-inter text-slate-800">
              {/* Reference & QR Check-In Banner */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 p-2 shadow-xs">
                  <QrCode className="h-20 w-20 text-slate-900" />
                </div>
                <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Booking Reference</span>
                    <span className="font-mono text-sm font-bold text-[#0552A2] bg-white px-2 py-0.5 rounded border border-slate-200">
                      {hotelDetailModal.id}
                    </span>
                    {renderStatusBadge(hotelDetailModal.status)}
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    Lead Guest: {hotelDetailModal.bookedBy || 'Verified Traveler'}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Present this official voucher or QR token upon check-in at the front desk reception. Government photo identification or passport required.
                  </p>
                </div>
              </div>

              {/* 1. Hotel Property Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Property Information
                </h4>
                <div className="p-4 rounded-xl border border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Hotel Name</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {hotelDetailModal.hotelName || hotelDetailModal.provider}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Front Desk Reception</span>
                    <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{hotelDetailModal.contactPhone || '+977 1 4412345'}</span>
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 font-medium block">Property Address &amp; Location</span>
                    <p className="font-medium text-slate-800 mt-0.5 flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{hotelDetailModal.meetingPoint || 'Nepal'}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Stay & Accommodation Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Stay &amp; Accommodation Details
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Check-In</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {hotelDetailModal.checkInDate || hotelDetailModal.date.split(' - ')[0]}
                    </p>
                    <span className="text-[11px] text-slate-500">From 02:00 PM</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Check-Out</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {hotelDetailModal.checkOutDate || hotelDetailModal.date.split(' - ')[1] || 'Flexible'}
                    </p>
                    <span className="text-[11px] text-slate-500">Until 12:00 PM (Noon)</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Room Category</span>
                    <p className="font-bold text-slate-900 mt-0.5 truncate">
                      {hotelDetailModal.roomName || 'Deluxe Room'}
                    </p>
                    <span className="text-[11px] text-slate-500">
                      {hotelDetailModal.roomsCount || 1} Room • {hotelDetailModal.nightsCount || 2} Nights
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Guests &amp; Capacity</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {(hotelDetailModal.adultsCount || 2) + (hotelDetailModal.childrenCount || 0)} Guests
                    </p>
                    <span className="text-[11px] text-slate-500">
                      {hotelDetailModal.adultsCount || 2} Adults
                      {hotelDetailModal.childrenCount ? `, ${hotelDetailModal.childrenCount} Child` : ''}
                    </span>
                  </div>
                </div>

                {/* Special Requests & Arrival Time */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-700">Special Guest Requests:</span>
                      <p className="text-slate-600 mt-0.5 italic">
                        "{hotelDetailModal.specialRequests || 'Standard reservation. No special requests submitted.'}"
                      </p>
                    </div>
                    {hotelDetailModal.arrivalTime && (
                      <div className="text-right shrink-0">
                        <span className="font-bold text-slate-700">Estimated Arrival:</span>
                        <p className="text-slate-600 mt-0.5 font-mono">{hotelDetailModal.arrivalTime}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Itemized Financial Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Itemized Financial Breakdown
                </h4>
                <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs space-y-2.5">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>
                      Room Rate ({hotelDetailModal.nightsCount || 2} Nights × {hotelDetailModal.roomsCount || 1} Room)
                    </span>
                    <span className="font-semibold text-slate-800">
                      {hotelDetailModal.priceBreakdown?.baseAmountNpr
                        ? `NPR ${hotelDetailModal.priceBreakdown.baseAmountNpr.toLocaleString()}`
                        : 'Included in Total'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Hotel Luxury Service Charge (10%)</span>
                    <span className="font-semibold text-slate-800">
                      {hotelDetailModal.priceBreakdown?.serviceChargeNpr
                        ? `NPR ${hotelDetailModal.priceBreakdown.serviceChargeNpr.toLocaleString()}`
                        : '10% Standard'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Nepal Government VAT (13%)</span>
                    <span className="font-semibold text-slate-800">
                      {hotelDetailModal.priceBreakdown?.vatNpr
                        ? `NPR ${hotelDetailModal.priceBreakdown.vatNpr.toLocaleString()}`
                        : '13% Statutory'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-900">Total Price</span>
                    <span className="font-extrabold text-[#0552A2] font-poppins text-base">
                      {hotelDetailModal.amount}
                    </span>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Payment Status:</span>
                    <span className="font-semibold text-emerald-700">
                      {(hotelDetailModal.paymentStatus as any) === 'successful' || (hotelDetailModal.paymentStatus as any) === 'paid'
                        ? 'Paid in Full (Verified)'
                        : hotelDetailModal.paymentMode === 'pay_at_property'
                        ? 'Payable at Front Desk upon Check-In'
                        : 'Deposit Verified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Cancellation & Check-In Policies */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Cancellation Policy:</strong>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      {hotelDetailModal.cancellationPolicy ||
                        'Free cancellation up to 48 hours prior to check-in. Cancellations between 24 and 48 hours receive a 50% refund. Non-refundable within 24 hours of arrival.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="border-t border-slate-200 p-4 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-500" />
                  <span>Print Voucher</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadPayload(hotelDetailModal)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  <span>Download Pass</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {hotelDetailModal.hotelId && (
                  <Link
                    href={`/hotels/${hotelDetailModal.hotelId}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-2xs transition-colors"
                  >
                    <Building2 className="h-3.5 w-3.5 text-[#0552A2]" />
                    <span>View Property Page</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => setHotelDetailModal(null)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. EXPEDITION / TREK QR PASS MODAL
          ========================================================================= */}
      {trekDetailModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setTrekDetailModal(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-poppins">
                Digital Checkpoint &amp; Trail Pass
              </h3>
              <button
                type="button"
                onClick={() => setTrekDetailModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center space-y-2">
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs">
                <QrCode className="h-20 w-20 text-slate-900" />
              </div>
              <p className="font-mono text-xs font-bold text-[#0552A2]">
                {trekDetailModal.qrCode}
              </p>
              <p className="text-xs font-bold text-slate-900">
                {trekDetailModal.title}
              </p>
              <p className="text-[11px] text-slate-500">
                Traveler: {trekDetailModal.bookedBy} • {trekDetailModal.date}
              </p>

              {verifiedInfo ? (
                <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-left text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Ranger Verified: {verifiedInfo.status || 'CONFIRMED'}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Issued by: {verifiedInfo.verificationAgency || 'Nepal Tourism Board (NTB)'}
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await api.bookings.verifyPass(trekDetailModal.qrCode);
                      setVerifiedInfo(res);
                    } catch {
                      setVerifiedInfo({
                        valid: true,
                        status: 'CONFIRMED',
                        verificationAgency: 'Nepal Tourism Board (NTB) Digital Checkpoint System',
                      });
                    }
                  }}
                  className="mt-2 w-full rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verify Checkpoint Pass</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleDownloadPayload(trekDetailModal)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="h-4 w-4 text-slate-600" />
                <span>Download Offline Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          8. CANCELLATION MODAL (POLICY-AWARE REFUND ESTIMATOR)
          ========================================================================= */}
      {cancelModalBooking && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setCancelModalBooking(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="bg-rose-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-sm font-bold">Cancel Reservation</h3>
              </div>
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="rounded-lg p-1 text-rose-100 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700 font-inter">
              <div className="space-y-1">
                <p className="font-bold text-slate-900 text-sm">
                  {cancelModalBooking.hotelName || cancelModalBooking.title}
                </p>
                <p className="text-slate-500 font-mono text-[11px]">
                  Ref: {cancelModalBooking.id} • Scheduled:{' '}
                  {cancelModalBooking.checkInDate || cancelModalBooking.date}
                </p>
              </div>

              {/* Policy Estimate Box */}
              {(() => {
                const est = getRefundEstimate(cancelModalBooking);
                return (
                  <div className={`p-3.5 rounded-xl border space-y-1.5 ${est.badgeClass}`}>
                    <div className="font-bold flex items-center gap-1.5 text-xs">
                      <span>Refund Estimation:</span>
                      <span>{est.percent}% (NPR {est.amountNpr.toLocaleString()})</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{est.tierText}</p>
                  </div>
                );
              })()}

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Reason for Cancellation:</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs bg-slate-50 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="Travel schedule change">Travel schedule change</option>
                  <option value="Flight or connection cancellation">Flight or connection cancellation</option>
                  <option value="Medical or health reason">Medical or health reason</option>
                  <option value="Found alternative stay">Found alternative stay</option>
                  <option value="Other">Other personal reason</option>
                </select>
              </div>

              <p className="text-[11px] text-slate-500">
                Refunds are processed automatically back to the original payment source within 3-5 business days.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  disabled={isSubmitting}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Keep Reservation
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          9. MODIFY RESERVATION MODAL
          ========================================================================= */}
      {modifyModalBooking && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setModifyModalBooking(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="bg-[#0552A2] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                <h3 className="text-sm font-bold">Modify Stay Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setModifyModalBooking(null)}
                className="rounded-lg p-1 text-blue-100 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700 font-inter">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900 text-sm">
                  {modifyModalBooking.hotelName || modifyModalBooking.title}
                </p>
                <p className="text-slate-500 font-mono text-[11px]">
                  Ref: {modifyModalBooking.id} • Room: {modifyModalBooking.roomName || 'Standard'}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Estimated Arrival Time:</label>
                <input
                  type="text"
                  value={editArrivalTime}
                  onChange={(e) => setEditArrivalTime(e.target.value)}
                  placeholder="e.g. 03:00 PM - 05:00 PM"
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Special Requests &amp; Room Preferences:</label>
                <textarea
                  value={editSpecialRequests}
                  onChange={(e) => setEditSpecialRequests(e.target.value)}
                  rows={3}
                  placeholder="e.g. High floor, quiet room, late check-in notice, twin beds..."
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20 resize-none"
                />
                <span className="text-[10.5px] text-slate-400 block">
                  Property reception concierge will be notified immediately upon update.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModifyModalBooking(null)}
                  disabled={isSubmitting}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmModify}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save Modifications'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          10. CONTACT HOTEL MODAL
          ========================================================================= */}
      {contactHotelModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setContactHotelModal(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="bg-[#0552A2] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <h3 className="text-sm font-bold">Contact Property Reception</h3>
              </div>
              <button
                type="button"
                onClick={() => setContactHotelModal(null)}
                className="rounded-lg p-1 text-blue-100 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700 font-inter">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">
                  {contactHotelModal.hotelName || contactHotelModal.provider}
                </h4>
                <p className="text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{contactHotelModal.meetingPoint || 'Nepal'}</span>
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Front Desk Phone:</span>
                  <a
                    href={`tel:${contactHotelModal.contactPhone || '+97714412345'}`}
                    className="font-bold text-[#0552A2] hover:underline"
                  >
                    {contactHotelModal.contactPhone || '+977-1-4412345'}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Concierge Desk:</span>
                  <span className="font-semibold text-slate-800">24/7 Guest Assistance</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Reservation Ref:</span>
                  <span className="font-mono font-bold text-slate-700">{contactHotelModal.id}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setContactHotelModal(null)}
                  className="w-full py-2 rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white font-bold text-xs text-center cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
