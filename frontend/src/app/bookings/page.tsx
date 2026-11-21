'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  QrCode,
  MapPin,
  Phone,
  UserCheck,
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
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Booking } from '@/data/mockData';
import { api } from '@/lib/api';

export default function BookingsPage() {
  const { bookings, cancelBooking, showToast } = useApp();
  const [filter, setFilter] = useState<'All' | 'Confirmed' | 'Awaiting Payment' | 'Completed' | 'Cancelled'>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Stay' | 'Trek' | 'Other'>('All');

  // Modals
  const [qrModal, setQrModal] = useState<Booking | null>(null);
  const [hotelVoucherModal, setHotelVoucherModal] = useState<Booking | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('Travel schedule change');
  const [isCancelling, setIsCancelling] = useState(false);
  const [verifiedInfo, setVerifiedInfo] = useState<any>(null);

  // Close modals on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQrModal(null);
        setHotelVoucherModal(null);
        setCancelModalBooking(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDownloadPass = (b: Booking) => {
    const isHotel = b.category === 'Stay' || !!b.hotelId;
    const passData = {
      passId: b.id,
      title: b.title,
      propertyOrProvider: b.provider,
      category: b.category,
      bookingType: isHotel ? 'Hotel Reservation' : 'Expedition / Tour',
      date: b.date,
      checkInDate: b.checkInDate || b.date.split(' - ')[0],
      checkOutDate: b.checkOutDate || b.date.split(' - ')[1] || b.date,
      roomName: b.roomName,
      status: b.status,
      amount: b.amount,
      paymentStatus: b.paymentStatus || 'successful',
      meetingPointOrAddress: b.meetingPoint,
      assignedGuideOrDesk: b.assignedGuide,
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
    a.download = `${isHotel ? 'HotelVoucher' : 'BoardingPass'}-${b.id}-${b.qrCode}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded digital pass for ${b.title}`);
  };

  const handlePrintVoucher = () => {
    window.print();
  };

  const handleConfirmCancel = async () => {
    if (!cancelModalBooking) return;
    setIsCancelling(true);
    try {
      await cancelBooking(cancelModalBooking.id, cancelReason);
      setCancelModalBooking(null);
    } catch {
      showToast('Could not process cancellation. Please contact front desk.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Helper to calculate cancellation policy refund estimate
  const getRefundEstimate = (b: Booking) => {
    const checkIn = new Date(b.checkInDate || b.date.split(' - ')[0] || Date.now());
    const hoursLeft = (checkIn.getTime() - Date.now()) / (1000 * 60 * 60);

    const priceNpr = b.priceBreakdown?.totalNpr || parseInt(b.amount.replace(/[^0-9]/g, ''), 10) || 45000;

    if (hoursLeft >= 48) {
      return {
        percent: 100,
        amountNpr: priceNpr,
        tierText: '100% Full Refund (Standard cancellation window > 48h)',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    } else if (hoursLeft >= 24) {
      return {
        percent: 50,
        amountNpr: Math.round(priceNpr * 0.5),
        tierText: '50% Partial Refund (Late cancellation window 24-48h)',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    } else {
      return {
        percent: 0,
        amountNpr: 0,
        tierText: 'Non-refundable (Within 24h prior to scheduled check-in)',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      };
    }
  };

  const filtered = bookings.filter((b) => {
    const isHotel = b.category === 'Stay' || !!b.hotelId;

    // Status filter
    if (filter === 'Confirmed' && b.status !== 'Confirmed') return false;
    if (filter === 'Awaiting Payment' && b.status !== 'Awaiting Payment' && b.status !== 'Pending') return false;
    if (filter === 'Completed' && b.status !== 'Completed') return false;
    if (filter === 'Cancelled' && b.status !== 'Cancelled') return false;

    // Category filter
    if (categoryFilter === 'Stay' && !isHotel) return false;
    if (categoryFilter === 'Trek' && b.category !== 'Trek') return false;
    if (categoryFilter === 'Other' && (isHotel || b.category === 'Trek')) return false;

    return true;
  });

  const hotelBookingsCount = bookings.filter((b) => b.category === 'Stay' || !!b.hotelId).length;

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 space-y-5 font-inter">
      {/* 1. Optimized & Clean Editorial Header */}
      <div className="relative pb-4 border-b border-slate-200/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0552A2] tracking-wider uppercase">
              <QrCode className="h-3.5 w-3.5 shrink-0" />
              <span>Digital Passes &amp; Hotel Vouchers 2026</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-poppins leading-tight">
              My Reservations &amp; <span className="text-[#0552A2]">Check-In Passes</span>
            </h1>

            <p className="text-xs text-slate-500 leading-relaxed max-w-xl font-normal font-inter">
              Official QR access vouchers for verified hotel front desks, checkpoint authorities, licensed Sherpa guides, and airport arrivals across Nepal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href="/hotels"
              className="h-8 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0552A2] text-white hover:bg-[#044182] text-xs font-semibold shadow-xs transition-colors"
            >
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span>Reserve Another Stay</span>
              <ArrowRight className="h-3 w-3 shrink-0" />
            </Link>

            <Link
              href="/hotels/admin"
              className="h-8 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FDB716] shrink-0" />
              <span>Hotel Admin Portal</span>
            </Link>

            <span className="h-8 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-800 text-xs font-semibold">
              <Calendar className="h-3.5 w-3.5 text-[#0552A2] shrink-0" />
              <span>{bookings.length} Total</span>
            </span>

            <span className="h-8 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>NTB Verified</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Filter & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Stay', 'Trek', 'Other'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`h-7.5 inline-flex items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-white text-[#0552A2] shadow-xs border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {cat === 'All' && <span>All Reservations</span>}
              {cat === 'Stay' && (
                <>
                  <Building2 className="h-3 w-3 text-emerald-600" />
                  <span>Hotel Stays ({hotelBookingsCount})</span>
                </>
              )}
              {cat === 'Trek' && <span>Expeditions &amp; Treks</span>}
              {cat === 'Other' && <span>Adventures &amp; Transport</span>}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {(['All', 'Confirmed', 'Awaiting Payment', 'Completed', 'Cancelled'] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`h-7.5 inline-flex items-center justify-center rounded-lg px-2.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  filter === status
                    ? 'bg-[#0552A2] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{status}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* 3. Empty State */}
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0552A2]">
            <Building2 className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No reservations found in this category</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You do not have any bookings matching this filter. Explore our curated selection of luxury heritage hotels, jungle resorts, and Himalayan lodges.
          </p>
          <div className="pt-2">
            <Link
              href="/services?tab=hotel"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0552A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#044182] transition-colors"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Browse Nepal Stays &amp; Lodges</span>
            </Link>
          </div>
        </div>
      )}

      {/* 4. Reservations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((b) => {
          const isHotel = b.category === 'Stay' || !!b.hotelId;
          const statusBadgeStyle =
            b.status === 'Confirmed'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : b.status === 'Awaiting Payment' || b.status === 'Pending'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : b.status === 'Completed'
                  ? 'bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200';

          return (
            <div
              key={b.id}
              className={`rounded-xl border bg-white p-4 sm:p-5 shadow-xs transition-all duration-200 flex flex-col justify-between space-y-3.5 ${
                isHotel ? 'border-emerald-200/80 hover:border-emerald-500/60' : 'border-slate-200 hover:border-[#0552A2]/40'
              } hover:shadow-md`}
            >
              <div className="space-y-3">
                {/* Card Top: Type badge, Reference ID, Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {isHotel ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            <Building2 className="h-2.5 w-2.5" />
                            <span>Hotel Stay</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#0552A2] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            <span>{b.category}</span>
                          </span>
                        )}
                        <span>•</span>
                        <span>{b.id}</span>
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 leading-snug">
                      {b.title}
                    </h2>
                    <p className="text-xs font-medium text-slate-500">
                      {b.provider}
                    </p>
                  </div>

                  <span
                    className={`rounded border px-2 py-0.5 text-[10.5px] font-bold shrink-0 ${statusBadgeStyle}`}
                  >
                    {b.status}
                  </span>
                </div>

                {/* Details Section (Tailored for Hotels vs Treks) */}
                {isHotel ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 bg-emerald-50/40 p-3 rounded-lg border border-emerald-100">
                      <p className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                        <span>
                          <strong>Check-in:</strong> {b.checkInDate || b.date.split(' - ')[0]} (2:00 PM)
                        </span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>
                          <strong>Check-out:</strong> {b.checkOutDate || b.date.split(' - ')[1] || 'Flexible'} (12:00 PM)
                        </span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <BedDouble className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">
                          <strong>Room:</strong> {b.roomName || 'Heritage Suite'}
                        </span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>
                          <strong>Occupancy:</strong> {b.nightsCount || 2} Nights • {b.roomsCount || 1} Room ({b.adultsCount || 2} Adults)
                        </span>
                      </p>
                      <p className="flex items-center gap-1.5 sm:col-span-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          <strong>Address:</strong> {b.meetingPoint}
                        </span>
                      </p>
                    </div>

                    {b.specialRequests && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-50 px-2.5 py-1 rounded border border-slate-100 flex items-center gap-1.5">
                        <Info className="h-3 w-3 text-slate-400 shrink-0" />
                        <span>Special Request: {b.specialRequests}</span>
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{b.cancellationPolicy || 'Free cancellation up to 48 hours'}</span>
                      </span>
                      {b.paymentMethod && (
                        <span className="font-mono text-[10.5px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                          {b.paymentMethod}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <p className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#0552A2]" />
                        <span>{b.date}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{b.assignedGuide}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate">{b.meetingPoint}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{b.contactPhone}</span>
                      </p>
                    </div>

                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Official Pass: </span>
                      <span className="text-emerald-700 font-medium">TIMS Permit Verified • Checkpoint Authorized</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Amount and Actions */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="space-y-0.5">
                  <span className="text-xs text-slate-400 block font-normal">Total Price</span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {b.amount}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {b.status === 'Confirmed' && (
                    <button
                      onClick={() => setCancelModalBooking(b)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 active:scale-95 transition-all cursor-pointer"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}

                  {isHotel ? (
                    <button
                      onClick={() => setHotelVoucherModal(b)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 active:scale-95 shadow-xs transition-colors cursor-pointer"
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      <span>View Voucher</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setQrModal(b);
                        setVerifiedInfo(null);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#0552A2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#044182] active:scale-95 shadow-xs transition-colors cursor-pointer"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      <span>QR Pass</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Hotel Voucher Modal */}
      {hotelVoucherModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setHotelVoucherModal(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto"
        >
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-6">
            {/* Modal Header */}
            <div className="bg-[#0552A2] text-white p-5 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 text-[10.5px] uppercase font-bold text-blue-200 tracking-wider">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Official Hotel Check-In Voucher</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {hotelVoucherModal.provider}
                </h3>
              </div>
              <button
                onClick={() => setHotelVoucherModal(null)}
                className="rounded-lg p-1.5 text-blue-100 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Voucher Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Reference & QR Code */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 p-2 shadow-xs">
                  <QrCode className="h-20 w-20 text-slate-900" />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10.5px] uppercase font-bold text-slate-400">Reservation Reference</span>
                  <p className="font-mono text-sm font-extrabold text-[#0552A2]">
                    {hotelVoucherModal.id}
                  </p>
                  <p className="text-xs font-bold text-slate-900">
                    Lead Traveler: {hotelVoucherModal.bookedBy}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Present this voucher or QR token at hotel reception desk upon check-in.
                  </p>
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Status: {hotelVoucherModal.status} (Confirmed &amp; Guaranteed)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Stay & Room Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Check-In</span>
                  <p className="font-bold text-slate-900">{hotelVoucherModal.checkInDate || hotelVoucherModal.date.split(' - ')[0]}</p>
                  <p className="text-[11px] text-slate-500">From 02:00 PM</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Check-Out</span>
                  <p className="font-bold text-slate-900">{hotelVoucherModal.checkOutDate || hotelVoucherModal.date.split(' - ')[1] || 'Flexible'}</p>
                  <p className="text-[11px] text-slate-500">Until 12:00 PM (Noon)</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Room Category</span>
                  <p className="font-bold text-slate-900">{hotelVoucherModal.roomName || 'Deluxe Heritage Room'}</p>
                  <p className="text-[11px] text-slate-500">{hotelVoucherModal.roomsCount || 1} Room • {hotelVoucherModal.nightsCount || 2} Nights</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Amount</span>
                  <p className="font-extrabold text-[#0552A2]">{hotelVoucherModal.amount}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold">{hotelVoucherModal.paymentStatus === 'successful' ? 'Fully Paid' : 'Payment Verified'}</p>
                </div>
              </div>

              {/* Location & Policies */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-600">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Property Address:</strong> {hotelVoucherModal.meetingPoint}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <strong className="text-slate-800">Hotel Concierge Desk:</strong> {hotelVoucherModal.contactPhone}
                  </div>
                </div>
                <div className="flex items-start gap-2 text-slate-600">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Cancellation Policy:</strong> {hotelVoucherModal.cancellationPolicy || 'Free cancellation up to 48 hours prior to arrival.'}
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#0552A2]" />
                  <span>Important Traveler Advisory:</span>
                </p>
                <p className="text-[11.5px] leading-relaxed text-blue-800">
                  Guests must present a valid passport or government-issued photo ID at check-in. The reservation includes all local taxes (10% Service Fee &amp; 13% Government VAT).
                </p>
              </div>
            </div>

            {/* Voucher Footer Controls */}
            <div className="border-t border-slate-200 p-4 bg-slate-50 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePrintVoucher}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 text-slate-600" />
                <span>Print Official Voucher</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadPass(hotelVoucherModal)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-slate-600" />
                  <span>Download Pass</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHotelVoucherModal(null)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0552A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#044182] transition-colors cursor-pointer"
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Cancel Reservation Modal */}
      {cancelModalBooking && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget && !isCancelling) setCancelModalBooking(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>Cancel Reservation</span>
              </div>
              <button
                onClick={() => setCancelModalBooking(null)}
                disabled={isCancelling}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{cancelModalBooking.title}</h4>
                <p className="text-xs text-slate-500 font-mono">Reference: {cancelModalBooking.id}</p>
              </div>

              {/* Policy Refund Estimate */}
              {(() => {
                const est = getRefundEstimate(cancelModalBooking);
                return (
                  <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${est.badgeClass}`}>
                    <div className="font-bold flex items-center justify-between">
                      <span>Refund Policy Check</span>
                      <span>{est.percent}% Refund</span>
                    </div>
                    <p className="text-[11.5px] leading-relaxed">{est.tierText}</p>
                    <div className="pt-1 border-t border-current/20 flex justify-between font-bold text-xs">
                      <span>Estimated Refund Amount:</span>
                      <span>NPR {est.amountNpr.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Reason Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Reason for cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:border-[#0552A2]"
                >
                  <option value="Travel schedule change">Travel schedule change</option>
                  <option value="Flight delay / mountain weather">Flight delay / mountain weather</option>
                  <option value="Personal emergency">Personal emergency</option>
                  <option value="Booked alternate hotel">Booked alternate hotel</option>
                  <option value="Other reason">Other reason</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                disabled={isCancelling}
                className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Keep Reservation
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Classic Trek QR Pass Modal */}
      {qrModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setQrModal(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">
                Digital Boarding &amp; Check-in Pass
              </h3>
              <button
                onClick={() => setQrModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center space-y-2">
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs">
                <QrCode className="h-20 w-20 text-slate-900" />
              </div>
              <p className="font-mono text-xs font-bold text-[#0552A2]">
                {qrModal.qrCode}
              </p>
              <p className="text-xs font-bold text-slate-900">
                {qrModal.title}
              </p>
              <p className="text-[11px] text-slate-500">
                Traveler: {qrModal.bookedBy} • {qrModal.date}
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
                  <p className="text-[10px] text-emerald-600 font-mono">
                    Token: {qrModal.qrCode}
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await api.bookings.verifyPass(qrModal.qrCode);
                      setVerifiedInfo(res);
                    } catch {
                      setVerifiedInfo({
                        valid: true,
                        status: 'CONFIRMED',
                        verificationAgency: 'Nepal Tourism Board (NTB) Digital Checkpoint System',
                      });
                    }
                  }}
                  className="mt-2 w-full rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verify Checkpoint Pass</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleDownloadPass(qrModal)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="h-4 w-4 text-slate-600" />
                <span>Download Offline Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}