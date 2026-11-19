'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  DollarSign,
  CalendarCheck,
  Users,
  BadgeCheck,
  Star,
  CheckCircle2,
  XCircle,
  UserCheck,
  Compass,
  Search,
  Filter,
  FileText,
  AlertCircle,
  X,
  Send,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

export default function BusinessPortalPage() {
  const { showToast } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Active view tab: 'bookings' | 'custom-trips'
  const [activeTab, setActiveTab] = useState<'bookings' | 'custom-trips'>('bookings');

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Quotation Modal State
  const [activeQuoteTrip, setActiveQuoteTrip] = useState<any | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<number>(310000);
  const [quoteRemarks, setQuoteRemarks] = useState(
    'Includes 1 IFMGA Certified Lead Mountain Guide, 1 Porter (25kg capacity), all TIMS & park permits, and en-suite lodge rooms.'
  );
  const [routeSuggestions, setRouteSuggestions] = useState(
    'We recommend inserting a mandatory acclimatization rest day in Dingboche before continuing to Gorak Shep.'
  );
  const [submittingQuote, setSubmittingQuote] = useState(false);

  // Rejection Modal State
  const [activeRejectTrip, setActiveRejectTrip] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Route unavailable due to seasonal high-pass closure.');

  const fetchDashboard = async () => {
    try {
      const res = await api.portals.getBusinessDashboard();
      if (res) setData(res);
    } catch (err) {
      console.warn('[BusinessPortal] Fallback to local:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      await api.bookings.updateStatus(bookingId, status);
      showToast(`Booking #${bookingId} marked as ${status.toUpperCase()}.`);
      fetchDashboard();
    } catch (err: any) {
      showToast(`Failed: ${err.message}`);
    }
  };

  const handleAssignGuide = async (bookingId: string, guideId: string) => {
    try {
      await api.bookings.assignStaff(bookingId, { guideId });
      showToast(`IFMGA guide assigned to Booking #${bookingId}.`);
      fetchDashboard();
    } catch (err: any) {
      showToast(`Failed: ${err.message}`);
    }
  };

  const handleSendQuotation = async () => {
    if (!activeQuoteTrip) return;
    setSubmittingQuote(true);
    try {
      await api.customPlans.quote(activeQuoteTrip.id, {
        quotedAmountNpr: Number(quoteAmount),
        remarks: quoteRemarks,
        alternativeRouteNotes: routeSuggestions,
      });
      showToast(`Quotation transmitted for Custom Trip #${activeQuoteTrip.id}! Status is now QUOTED.`);
      setActiveQuoteTrip(null);
      fetchDashboard();
    } catch (err: any) {
      showToast(`Failed to send quotation: ${err.message}`);
    } finally {
      setSubmittingQuote(false);
    }
  };

  const handleRejectCustomTrip = async () => {
    if (!activeRejectTrip) return;
    try {
      await api.customPlans.reject(activeRejectTrip.id, rejectionReason);
      showToast(`Custom Trip #${activeRejectTrip.id} marked as REJECTED.`);
      setActiveRejectTrip(null);
      fetchDashboard();
    } catch (err: any) {
      showToast(`Failed: ${err.message}`);
    }
  };

  const business = data?.business || {
    name: 'Himalayan Sherpa Expeditions',
    panNumber: '601248912',
    status: 'verified',
    businessType: 'Trekking & Expeditions',
  };

  const metrics = data?.metrics || {
    totalRevenueNpr: 4850000,
    totalBookingsCount: 14,
    pendingRequestsCount: 2,
    pendingCustomPlansCount: 2,
    activePackagesCount: 4,
  };

  const allBookings = data?.bookings || [];
  const customPlans = data?.customPlans || [];
  const guides = data?.availableGuides || [];

  // Filter bookings
  const filteredBookings = allBookings.filter((b: any) => {
    const matchesSearch =
      !searchQuery ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      b.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesType =
      typeFilter === 'All' ||
      (b.bookingType || 'standard').toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto w-full px-3.5 py-3.5 sm:px-6 sm:py-5 lg:px-8 lg:py-6 space-y-3 sm:space-y-4 font-inter">
      {/* 1. Unique & Aesthetic Editorial Header */}
      <div className="relative pb-3 sm:pb-4 border-b border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#0552A2] text-[10px] font-bold tracking-wider uppercase">
              <Building2 className="h-3 w-3 text-[#0552A2]" />
              <span>Tour Operator Enterprise</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">NTB 2026</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-poppins leading-tight">
              Tour Operator &amp; <span className="text-[#0552A2]">Agency Operations</span>
            </h1>

            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              Review custom itinerary requests, issue binding quotations, manage standard reservations, and assign IFMGA field staff.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs shrink-0">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900">{business.name}</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Official Verified License</div>
            </div>
          </div>
        </div>
      </div>

      {/* Operator Metadata Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1 rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800 mb-1">
            <BadgeCheck className="h-3 w-3" />
            <span>Official NTB Verified Operator</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-poppins">
            {business.name}
          </h2>
          <p className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>PAN / Reg: {business.panNumber}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-bold text-slate-700">
              <Star className="h-3 w-3 fill-[#FDB716] text-[#FDB716]" />
              <span>4.96 / 5.0 Rating</span>
            </span>
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <DollarSign className="h-4 w-4 text-emerald-600" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Settled Revenue
          </p>
          <p className="text-xl font-extrabold text-slate-900">
            NPR {(metrics.totalRevenueNpr || 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <CalendarCheck className="h-4 w-4 text-[#0552A2]" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Bookings
          </p>
          <p className="text-xl font-extrabold text-slate-900">
            {metrics.totalBookingsCount}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <Compass className="h-4 w-4 text-purple-600" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Custom Trip Requests
          </p>
          <p className="text-xl font-extrabold text-slate-900">
            {customPlans.length} ({metrics.pendingCustomPlansCount || customPlans.filter((p: any) => p.status === 'PENDING_REVIEW').length} Pending)
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <Users className="h-4 w-4 text-[#FDB716]" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Available Guides
          </p>
          <p className="text-xl font-extrabold text-slate-900">
            {guides.length} IFMGA Guides
          </p>
        </div>
      </div>

      {/* Toggle View Tabs: Reservations vs Custom Approval Workflow */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1.5 shadow-xs gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'bookings'
            ? 'bg-[#0552A2] text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
          <CalendarCheck className="h-4 w-4" />
          <span>All Reservations ({allBookings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('custom-trips')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'custom-trips'
            ? 'bg-[#0552A2] text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
          <Compass className="h-4 w-4" />
          <span>Custom Itinerary Requests ({customPlans.length})</span>
          {customPlans.filter((p: any) => p.status === 'PENDING_REVIEW').length > 0 && (
            <span className="bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-full text-[10px]">
              {customPlans.filter((p: any) => p.status === 'PENDING_REVIEW').length}
            </span>
          )}
        </button>
      </div>

      {/* VIEW 1: RESERVATIONS LIST WITH SEARCH & FILTERS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Booking ID, Traveler Name, or Expedition Title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0552A2]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="All">All Types</option>
                <option value="standard">Standard</option>
                <option value="custom">Custom</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="paid">Paid</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Traveler</th>
                    <th className="py-3 px-3">Expedition / Package</th>
                    <th className="py-3 px-3">Assigned Guide</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No reservations match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b: any) => (
                      <tr key={b.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-mono font-bold text-[#0552A2]">
                          {b.id}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${b.bookingType === 'custom' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                            }`}>
                            {b.bookingType || 'standard'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {b.userName}
                          <span className="block text-[10px] font-normal text-slate-400">{b.userEmail}</span>
                        </td>
                        <td className="py-3 px-3 max-w-[200px] truncate text-slate-800">
                          {b.title}
                        </td>
                        <td className="py-3 px-3 text-[11px]">
                          {b.assignedGuideName ? (
                            <span className="text-emerald-700 font-semibold">{b.assignedGuideName}</span>
                          ) : guides.length > 0 ? (
                            <button
                              type="button"
                              onClick={() => handleAssignGuide(b.id, guides[0].id)}
                              className="text-[#0552A2] hover:underline flex items-center gap-1 font-semibold"
                            >
                              <UserCheck className="h-3 w-3" />
                              <span>Assign Guide</span>
                            </button>
                          ) : (
                            <span className="text-slate-400">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          NPR {(b.totalAmountNpr || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${b.status === 'confirmed' || b.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                            }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {b.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(b.id, 'rejected')}
                                className="p-1 rounded text-red-500 hover:bg-red-50"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                                className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-[11px]"
                              >
                                Confirm
                              </button>
                            </div>
                          ) : (
                            <span className="font-mono text-slate-400 text-[11px]">
                              {b.invoiceNumber || 'INV-2026'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CUSTOM ITINERARY APPROVAL WORKFLOW & QUOTATIONS */}
      {activeTab === 'custom-trips' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-poppins text-slate-900">
                Custom Itinerary Inquiries &amp; Quotation Workbench
              </h2>
              <p className="text-xs text-slate-500">
                Review client-submitted custom routes, verify field guide availability, and furnish binding quotations.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {customPlans.length} Total Custom Inquiries
            </span>
          </div>

          <div className="space-y-4">
            {customPlans.map((trip: any) => {
              const isPending = trip.status === 'PENDING_REVIEW';
              const isQuoted = trip.status === 'QUOTED';
              const isConfirmed = trip.status === 'CONFIRMED';
              const latestQuote = trip.quotations && trip.quotations.length > 0 ? trip.quotations[0] : null;

              return (
                <div
                  key={trip.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0552A2] bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                          {trip.id}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${isConfirmed
                          ? 'bg-emerald-100 text-emerald-800'
                          : isQuoted
                            ? 'bg-purple-100 text-purple-800 ring-1 ring-purple-300'
                            : 'bg-amber-100 text-amber-800'
                          }`}>
                          {trip.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 font-poppins mt-1">
                        {trip.title}
                      </h3>
                      <p className="text-xs text-slate-600">
                        Lead Traveler: <span className="font-semibold text-slate-800">{trip.travelerContact?.fullName || trip.userName}</span> • Email: {trip.travelerContact?.email} • Phone: {trip.travelerContact?.phone}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Client Estimated Budget
                      </span>
                      <span className="text-base font-extrabold text-[#0552A2]">
                        NPR {(trip.estimatedBudgetNpr || 250000).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Requirements Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">Duration</span>
                      <p className="font-semibold text-slate-800">{trip.durationDays} Days</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">Group Size</span>
                      <p className="font-semibold text-slate-800">{trip.travelersCount || 2} Persons</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">Lodging Preference</span>
                      <p className="font-semibold text-slate-800">{trip.accommodationPreference || 'Teahouse'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">Guide &amp; Porter</span>
                      <p className="font-semibold text-slate-800">
                        {trip.guideRequested ? 'Lead Guide' : 'No Guide'} • {trip.porterRequested ? 'Porter' : 'No Porter'}
                      </p>
                    </div>
                  </div>

                  {/* Day-by-Day Stages Preview */}
                  {trip.itinerary && trip.itinerary.length > 0 && (
                    <div className="text-xs space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Client Itinerary Stages ({trip.itinerary.length} Days)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-700">
                        {trip.itinerary.slice(0, 4).map((st: any, idx: number) => (
                          <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200">
                            <span className="font-bold text-[#0552A2]">D{st.day}:</span> {st.title || st.activity}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Latest Quotation Snapshot */}
                  {latestQuote && (
                    <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3 text-xs space-y-1 text-purple-900">
                      <div className="flex justify-between items-center font-bold">
                        <span>Active Quotation ({latestQuote.id}):</span>
                        <span className="text-sm">NPR {(latestQuote.quotedAmountNpr || 0).toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-purple-800">{latestQuote.remarks}</p>
                    </div>
                  )}

                  {/* Actions Toolbar */}
                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveQuoteTrip(trip);
                        setQuoteAmount(trip.estimatedBudgetNpr || 300000);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#044182] cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{isQuoted ? 'Revise Quotation' : 'Send Official Quotation'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveRejectTrip(trip)}
                      className="rounded-xl border border-red-300 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      Decline Request
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* QUOTATION EDITOR MODAL */}
      {activeQuoteTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 my-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold font-poppins text-slate-900">
                  Issue Tour Operator Quotation
                </h3>
                <p className="text-xs text-slate-500">
                  Trip #{activeQuoteTrip.id} • {activeQuoteTrip.title}
                </p>
              </div>
              <button
                onClick={() => setActiveQuoteTrip(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Quoted Price in NPR (Binding Offer) *
                </label>
                <input
                  type="number"
                  required
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Included Services &amp; Operator Remarks *
                </label>
                <textarea
                  rows={3}
                  required
                  value={quoteRemarks}
                  onChange={(e) => setQuoteRemarks(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Suggested Route Adjustments / Acclimatization Advice
                </label>
                <textarea
                  rows={2}
                  value={routeSuggestions}
                  onChange={(e) => setRouteSuggestions(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveQuoteTrip(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submittingQuote || !quoteAmount}
                onClick={handleSendQuotation}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] px-5 py-2 text-xs font-bold text-white hover:bg-[#044182] disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{submittingQuote ? 'Transmitting...' : 'Send Binding Quotation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT REQUEST MODAL */}
      {activeRejectTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Decline Custom Trip Request</h3>
              <button
                onClick={() => setActiveRejectTrip(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Explain why this custom itinerary cannot be accepted (e.g. guide fully booked, severe weather forecast, or high pass impassable).
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveRejectTrip(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectCustomTrip}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
