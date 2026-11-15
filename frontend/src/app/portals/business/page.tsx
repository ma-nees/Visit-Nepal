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
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

export default function BusinessPortalPage() {
  const { showToast } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    activePackagesCount: 4,
  };

  const bookings = data?.bookings || [];
  const guides = data?.availableGuides || [];

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#031526] via-[#053568] to-[#031526] p-6 sm:p-8 text-white border border-white/10">
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-[#92C4EA]">
            <Building2 className="h-3.5 w-3.5" />
            <span>Authorized Tour Operator Enterprise Suite 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-serif">
            Tour Operator &amp; Agency Management Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
            Monitor client bookings, guide allocations, permit filings, and financial settlement logs.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1 rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800 mb-1">
            <BadgeCheck className="h-3 w-3" />
            <span>Official NTB Verified Operator</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {business.name}
          </h2>
          <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
            <span>PAN / Reg: {business.panNumber}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-bold text-slate-700">
              <Star className="h-3 w-3 fill-[#FDB716] text-[#FDB716]" />
              <span>4.96 / 5.0</span>
            </span>
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <DollarSign className="h-4 w-4 text-emerald-600" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Settled Revenue (NPR)
          </p>
          <p className="text-xl font-extrabold text-slate-900">
            NPR {(metrics.totalRevenueNpr || 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <CalendarCheck className="h-4 w-4 text-[#0552A2]" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Reservations
          </p>
          <p className="text-xl font-extrabold text-slate-900">
            {metrics.totalBookingsCount}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <Users className="h-4 w-4 text-purple-600" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Pending Approval
          </p>
          <p className="text-xl font-extrabold text-slate-900">
            {metrics.pendingRequestsCount}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <Star className="h-4 w-4 text-[#FDB716]" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Active Packages
          </p>
          <p className="text-xl font-extrabold text-slate-900">
            {metrics.activePackagesCount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Reservations & Workflow Management */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#0552A2]" />
              <h2 className="text-sm font-extrabold text-slate-900">
                Incoming Expeditions &amp; Reservations
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {bookings.length} Orders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="py-2 pr-3">ID</th>
                  <th className="py-2 pr-3">Traveler</th>
                  <th className="py-2 pr-3">Expedition</th>
                  <th className="py-2 pr-3">Guide</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b: any) => (
                  <tr key={b.id}>
                    <td className="py-3 pr-3 font-mono text-[11px] font-bold text-slate-500">
                      {b.id}
                    </td>
                    <td className="py-3 pr-3 font-bold text-slate-900">
                      {b.userName}
                    </td>
                    <td className="py-3 pr-3 text-slate-600 max-w-[180px] truncate">
                      {b.title}
                    </td>
                    <td className="py-3 pr-3 text-slate-500 text-[11px]">
                      {b.assignedGuideName ? (
                        <span className="text-emerald-700 font-semibold">{b.assignedGuideName}</span>
                      ) : guides.length > 0 ? (
                        <button
                          onClick={() => handleAssignGuide(b.id, guides[0].id)}
                          className="text-[#0552A2] hover:underline flex items-center gap-1 font-semibold"
                        >
                          <UserCheck className="h-3 w-3" />
                          <span>Assign Guide</span>
                        </button>
                      ) : (
                        <span>Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : b.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {b.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'rejected')}
                            className="p-1 rounded text-red-500 hover:bg-red-50"
                            title="Reject Request"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                            className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-[11px]"
                            title="Accept & Confirm"
                          >
                            Accept
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">
                          NPR {(b.totalAmountNpr || 0).toLocaleString()}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Certified Guide Roster */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
          <h2 className="text-sm font-extrabold text-slate-900">
            Available IFMGA Guides
          </h2>
          <div className="space-y-2.5">
            {guides.map((g: any) => (
              <div
                key={g.id}
                className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">{g.name}</p>
                  <p className="text-[11px] text-slate-500">License: {g.licenseNumber} • {g.experienceYears} yrs</p>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#0552A2]">NPR {g.dailyRateNpr.toLocaleString()} / day</span>
                  <span className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-emerald-800 font-bold text-[10px]">
                    Ready for Deployment
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
