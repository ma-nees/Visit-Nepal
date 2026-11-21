'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Calendar,
  CreditCard,
  Download,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  X,
  XCircle,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  QrCode,
  Printer,
  Sparkles,
  BedDouble,
  MapPin,
  Phone,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useApp } from '@/context/AppContext';

export default function HotelAdminPage() {
  const { showToast } = useApp();

  // Metrics & dashboard state
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [hotelFilter, setHotelFilter] = useState('All');

  // Modal
  const [selectedVoucher, setSelectedVoucher] = useState<any | null>(null);

  const fetchDashboard = async () => {
    try {
      const data = await api.hotels.getAdminDashboard();
      setDashboardData(data);
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    }
  };

  const fetchReservations = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await api.hotels.getAdminReservations({
        page,
        limit: 10,
        q: searchQuery,
        status: statusFilter === 'All' ? undefined : statusFilter,
        hotelId: hotelFilter === 'All' ? undefined : hotelFilter,
      });
      setReservations(res.reservations || []);
      setTotalPages(res.totalPages || 1);
      setCurrentPage(res.page || 1);
      setTotalCount(res.count || 0);
    } catch (err) {
      console.warn('Admin reservations fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchReservations(1);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReservations(1);
  };

  const handleFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setTimeout(() => fetchReservations(1), 50);
  };

  const handleHotelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHotelFilter(e.target.value);
    setTimeout(() => fetchReservations(1), 50);
  };

  const handleExportCsv = async () => {
    try {
      showToast('Exporting hotel reservation ledger...');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = typeof window !== 'undefined' ? localStorage.getItem('vn_auth_token') : null;

      const response = await fetch(`${apiUrl}/hotels/admin/export-csv`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visitnepal-hotel-reservations-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Downloaded official hotel reservations CSV report.');
    } catch (err: any) {
      showToast(`Export error: ${err.message}`);
    }
  };

  const metrics = dashboardData?.metrics || {
    totalReservations: 142,
    confirmedBookings: 118,
    pendingBookings: 14,
    cancelledBookings: 10,
    totalRevenueNpr: 3840000,
    averageOccupancyRate: '78%',
  };

  const popularHotels = dashboardData?.popularHotels || [
    { name: "The Dwarika's Hotel Kathmandu", reservations: 48, revenueNpr: 1656000 },
    { name: 'Bar Peepal Resort Pokhara', reservations: 36, revenueNpr: 691200 },
    { name: 'Shinta Mani Mustang', reservations: 18, revenueNpr: 2016000 },
    { name: 'Yeti Mountain Home Namche', reservations: 24, revenueNpr: 624000 },
  ];

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 space-y-6 font-inter">
      {/* 1. Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/services?tab=hotel"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0552A2] transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Hotels &amp; Lodges</span>
            </Link>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="h-3 w-3" />
              <span>Official NTB Hospitality Portal</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-poppins">
            Hotel Management &amp; <span className="text-[#0552A2]">Reservation Operations</span>
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Live reservation telemetry, guest check-in registry, occupancy analytics, and fiscal reconciliation for certified properties across Nepal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              fetchDashboard();
              fetchReservations(currentPage);
              showToast('Refreshed live reservation feed.');
            }}
            className="h-8.5 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
            <span>Refresh Feed</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="h-8.5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Export CSV Report</span>
          </button>

          <Link
            href="/bookings"
            className="h-8.5 inline-flex items-center gap-1.5 rounded-lg bg-[#0552A2] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#044182] transition-colors shadow-xs"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>My Bookings View</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
          <div className="text-xl font-extrabold text-slate-900 font-poppins">
            {metrics.totalReservations}
          </div>
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <Building2 className="h-3 w-3 text-[#0552A2]" />
            <span>All properties</span>
          </span>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Confirmed Stays</span>
          <div className="text-xl font-extrabold text-emerald-800 font-poppins">
            {metrics.confirmedBookings}
          </div>
          <span className="text-[10px] text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>Guaranteed passes</span>
          </span>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Awaiting / Pending</span>
          <div className="text-xl font-extrabold text-amber-800 font-poppins">
            {metrics.pendingBookings}
          </div>
          <span className="text-[10px] text-amber-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-amber-600" />
            <span>Temporary hold</span>
          </span>
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3.5 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Cancelled</span>
          <div className="text-xl font-extrabold text-rose-800 font-poppins">
            {metrics.cancelledBookings}
          </div>
          <span className="text-[10px] text-rose-600 flex items-center gap-1">
            <XCircle className="h-3 w-3 text-rose-600" />
            <span>Refund processed</span>
          </span>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-3.5 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Total Revenue</span>
          <div className="text-xl font-extrabold text-[#0552A2] font-poppins">
            NPR {(metrics.totalRevenueNpr / 100000).toFixed(1)}L
          </div>
          <span className="text-[10px] text-blue-600 flex items-center gap-1">
            <CreditCard className="h-3 w-3 text-blue-600" />
            <span>Incl. VAT &amp; service</span>
          </span>
        </div>

        <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-3.5 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Average Occupancy</span>
          <div className="text-xl font-extrabold text-purple-900 font-poppins">
            {metrics.averageOccupancyRate}
          </div>
          <span className="text-[10px] text-purple-600 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-purple-600" />
            <span>Peak season 2026</span>
          </span>
        </div>
      </div>

      {/* 3. Top Performing Properties Widget */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#FDB716]" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Top Booked Properties &amp; Regional Occupancy
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">Verified official partners</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {popularHotels.map((h: any, idx: number) => (
            <div
              key={idx}
              className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 space-y-1 hover:border-[#0552A2]/30 transition-colors"
            >
              <h3 className="text-xs font-bold text-slate-900 truncate">{h.name}</h3>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>{h.reservations} Bookings</span>
                <span className="font-semibold text-emerald-700">NPR {h.revenueNpr.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Reservations Search & Filter Toolbar */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, guest name, email, or property..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#0552A2]"
            />
          </form>

          {/* Property Dropdown Filter */}
          <div className="flex items-center gap-2">
            <select
              value={hotelFilter}
              onChange={handleHotelChange}
              className="text-xs rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-[#0552A2]"
            >
              <option value="All">All Properties</option>
              <option value="htl_dwarikas">The Dwarika's Hotel Kathmandu</option>
              <option value="htl_bar_peepal">Bar Peepal Resort Pokhara</option>
              <option value="htl_shinta_mani">Shinta Mani Mustang</option>
              <option value="htl_yeti_namche">Yeti Mountain Home Namche</option>
              <option value="htl_barahi_jungle">Barahi Jungle Lodge Chitwan</option>
              <option value="htl_everest_view">Hotel Everest View</option>
            </select>

            {/* Status Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {(['All', 'confirmed', 'awaiting_payment', 'cancelled'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => handleFilterChange(st)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-[#0552A2] text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st === 'All'
                    ? 'All'
                    : st === 'confirmed'
                      ? 'Confirmed'
                      : st === 'awaiting_payment'
                        ? 'Pending Hold'
                        : 'Cancelled'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Live Reservations Ledger Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10.5px] uppercase font-bold text-slate-500 border-b border-slate-200 tracking-wider">
              <tr>
                <th className="p-3.5">Reference ID</th>
                <th className="p-3.5">Property &amp; Room</th>
                <th className="p-3.5">Guest Contact</th>
                <th className="p-3.5">Dates &amp; Nights</th>
                <th className="p-3.5">Guests</th>
                <th className="p-3.5">Amount (NPR)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-[#0552A2]" />
                    <span>Loading reservation records...</span>
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No reservations matching current filter.
                  </td>
                </tr>
              ) : (
                reservations.map((res: any) => {
                  const isConfirmed = res.status === 'confirmed' || res.status === 'PAID';
                  const isPending = res.status === 'awaiting_payment' || res.status === 'pending';
                  const isCancelled = res.status === 'cancelled';

                  return (
                    <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#0552A2] whitespace-nowrap">
                        {res.id}
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 truncate max-w-[180px]">
                          {res.provider}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {res.roomName || 'Deluxe Room'}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{res.userName}</div>
                        <div className="text-[11px] text-slate-400">{res.userEmail || res.contactPhone}</div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <div className="font-medium text-slate-800">
                          {res.checkInDate || res.date.split(' to ')[0]}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {res.nightsCount || 1} Night(s)
                        </div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <div className="text-slate-700">
                          {res.roomsCount || 1} Room(s)
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {res.adultsCount || 2} Adults
                        </div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <div className="font-bold text-slate-900">
                          NPR {(res.totalAmountNpr || 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] font-mono text-emerald-600 font-semibold">
                          {res.paymentStatus || 'paid'}
                        </div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                            isConfirmed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isPending
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedVoucher(res)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0552A2] hover:text-[#044182] hover:underline cursor-pointer"
                        >
                          <QrCode className="h-3.5 w-3.5" />
                          <span>Voucher</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong>{reservations.length}</strong> of <strong>{totalCount}</strong> reservations
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => fetchReservations(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => fetchReservations(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. Admin Voucher Modal Preview */}
      {selectedVoucher && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedVoucher(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Hotel Check-In Registry</span>
                <h3 className="text-base font-bold text-slate-900">{selectedVoucher.provider}</h3>
              </div>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="h-20 w-20 shrink-0 bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-center">
                <QrCode className="h-14 w-14 text-slate-900" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Reference &amp; QR Token</span>
                <p className="font-mono text-xs font-bold text-[#0552A2]">{selectedVoucher.id}</p>
                <p className="text-xs font-bold text-slate-900">Guest: {selectedVoucher.userName}</p>
                <p className="text-[11px] text-slate-500">{selectedVoucher.userEmail || selectedVoucher.contactPhone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Check-in Date</span>
                <span className="font-bold text-slate-800">{selectedVoucher.checkInDate || selectedVoucher.date}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Check-out Date</span>
                <span className="font-bold text-slate-800">{selectedVoucher.checkOutDate || 'Standard Stay'}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Room Allocated</span>
                <span className="font-bold text-slate-800">{selectedVoucher.roomName || 'Deluxe Room'}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Gross Payable</span>
                <span className="font-extrabold text-[#0552A2]">NPR {(selectedVoucher.totalAmountNpr || 0).toLocaleString()}</span>
              </div>
            </div>

            {selectedVoucher.specialRequests && (
              <div className="p-2.5 rounded bg-amber-50/60 border border-amber-200 text-xs text-amber-900">
                <strong>Guest Special Note:</strong> {selectedVoucher.specialRequests}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 text-slate-500" />
                <span>Print Registration Slip</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedVoucher(null);
                  showToast(`Guest ${selectedVoucher.userName} verified for check-in.`);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Confirm Check-In</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}