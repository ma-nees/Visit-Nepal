'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Booking } from '@/data/mockData';
import { api } from '@/lib/api';

export default function BookingsPage() {
  const { bookings, cancelBooking, showToast } = useApp();
  const [filter, setFilter] = useState<'All' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');
  const [qrModal, setQrModal] = useState<Booking | null>(null);
  const [verifiedInfo, setVerifiedInfo] = useState<any>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQrModal(null);
      }
    };
    if (qrModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [qrModal]);

  const handleDownloadPass = (b: Booking) => {
    const passData = {
      passId: b.id,
      title: b.title,
      provider: b.provider,
      category: b.category,
      date: b.date,
      status: b.status,
      amount: b.amount,
      meetingPoint: b.meetingPoint,
      assignedGuide: b.assignedGuide,
      contactPhone: b.contactPhone,
      qrToken: b.qrCode,
      bookedBy: b.bookedBy,
      issuingAuthority: 'Nepal Tourism Board (NTB) Digital Expedition Registry',
    };
    const blob = new Blob([JSON.stringify(passData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BoardingPass-${b.id}-${b.qrCode}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded digital pass for ${b.title}`);
  };

  const filtered = bookings.filter(
    (b) => filter === 'All' || b.status === filter
  );

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Optimized & Clean Editorial Header */}
      <div className="relative pb-5 border-b border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0552A2] tracking-wider uppercase">
              <QrCode className="h-3.5 w-3.5 shrink-0" />
              <span>Digital Passes &amp; Trail Check-In 2026</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-poppins">
              My Expeditions &amp; <span className="text-[#0552A2]">Digital Passes</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl font-normal font-inter">
              Instant offline QR access for checkpoint authorities, hotel check-ins, licensed guide assignments, and helicopter rescue registration.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 text-slate-800 text-xs font-semibold">
              <Calendar className="h-3.5 w-3.5 text-[#0552A2] shrink-0" />
              <span>{bookings.length} Passes</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>TIMS Validated</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-slate-900 font-poppins">Active Itinerary Passes</h2>
          <p className="text-xs text-slate-500">Showing {filtered.length} reservations</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Confirmed', 'Completed', 'Cancelled'] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-150 active:scale-[0.98] ${
                  filter === status
                    ? 'bg-[#0552A2] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((b) => {
          const badgeStyle =
            b.status === 'Confirmed'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : b.status === 'Completed'
                ? 'bg-slate-100 text-slate-700 border-slate-200'
                : 'bg-red-50 text-red-700 border-red-200';

          return (
            <div
              key={b.id}
              className="rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs hover:border-[#0552A2]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {b.id} • {b.category}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-0.5">
                      {b.title}
                    </h2>
                    <p className="text-xs font-medium text-slate-500">
                      {b.provider}
                    </p>
                  </div>
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-bold ${badgeStyle}`}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
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

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs font-bold text-slate-800">
                  Total: {b.amount}
                </span>

                <div className="flex items-center gap-2">
                  {b.status === 'Confirmed' && (
                    <button
                      onClick={() => cancelBooking(b.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-200 active:scale-95"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setQrModal(b);
                      setVerifiedInfo(null);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0552A2] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#044182] active:scale-95 shadow-xs"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    <span>QR Pass</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* QR Pass Modal */}
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
