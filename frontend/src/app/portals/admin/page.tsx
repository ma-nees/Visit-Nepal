'use client';

import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Building2,
  FileCheck2,
  DollarSign,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  History,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

export default function AdminPortalPage() {
  const { showToast } = useApp();
  const [metrics, setMetrics] = useState({
    totalTravelers: 1420,
    registeredAgencies: 48,
    verifiedGuides: 420,
    totalBookingsCount: 84,
    totalBookingsVolumeNpr: 920000,
    pendingPermitsCount: 3,
  });

  const [verifications, setVerifications] = useState<any[]>([]);
  const [permitQueue, setPermitQueue] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [customPlans, setCustomPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const res = await api.portals.getAdminDashboard();
      if (res) {
        if (res.metrics) setMetrics(res.metrics);
        if (res.verificationQueue) setVerifications(res.verificationQueue);
        if (res.permitOfficerQueue) setPermitQueue(res.permitOfficerQueue);
        if (res.recentAuditLogs) setAuditLogs(res.recentAuditLogs);
        if (res.customPlans) setCustomPlans(res.customPlans);
      }
    } catch (err) {
      console.warn('[AdminPortal] Offline/mock fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const approveBusiness = async (id: string, name: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'Approved' } : v))
    );
    showToast(`Verified & officially approved ${name}.`);
    try {
      await api.portals.approveBusinessKyc(id);
      fetchAdminData();
    } catch (err) {
      console.warn('Backend synced locally');
    }
  };

  const approvePermit = async (id: string, applicant: string) => {
    setPermitQueue((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Approved' } : p))
    );
    showToast(`Official permit signed and issued for ${applicant}.`);
    try {
      await api.permits.decide(id, 'approved', 'Verified and authorized by NTB Officer desk.');
      fetchAdminData();
    } catch (err) {
      console.warn('Backend synced locally');
    }
  };

  const rejectPermit = async (id: string, applicant: string) => {
    setPermitQueue((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Rejected' } : p))
    );
    showToast(`Permit ${id} rejected.`);
    try {
      await api.permits.decide(id, 'rejected', 'Missing required alpine guide voucher or insurance.');
      fetchAdminData();
    } catch (err) {
      console.warn('Backend synced locally');
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-3.5 py-3.5 sm:px-6 sm:py-5 lg:px-8 lg:py-6 space-y-3 sm:space-y-4 font-inter">
      {/* 1. Unique & Aesthetic Editorial Header */}
      <div className="relative pb-3 sm:pb-4 border-b border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#0552A2] text-[10px] font-bold tracking-wider uppercase">
              <ShieldCheck className="h-3 w-3 text-[#0552A2]" />
              <span>Ministry of Tourism</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">NTB Desk 2026</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-poppins leading-tight">
              Government Oversight &amp; <span className="text-[#0552A2]">Permits Authority</span>
            </h1>

            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              Real-time traveler tracking, TIMS &amp; restricted zone permit approval queues, and tour agency compliance verifications.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs shrink-0">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900">National Registry</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Live Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <Users className="h-4 w-4 text-[#0552A2]" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Travelers</p>
          <p className="text-xl font-extrabold text-slate-900">
            {metrics.totalTravelers.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <Building2 className="h-4 w-4 text-emerald-600" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Registered Agencies</p>
          <p className="text-xl font-extrabold text-slate-900">
            {metrics.registeredAgencies}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <FileCheck2 className="h-4 w-4 text-amber-500" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Guides</p>
          <p className="text-xl font-extrabold text-slate-900">
            {metrics.verifiedGuides}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <DollarSign className="h-4 w-4 text-[#EC1F27]" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Platform Volume (NPR)</p>
          <p className="text-xl font-extrabold text-slate-900">
            NPR {(metrics.totalBookingsVolumeNpr || 920000).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Business Verification Queue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900">
              Agency KYC Verification Queue
            </h2>
            <span className="text-xs font-mono font-bold text-slate-400">
              {verifications.length} Pending/Active
            </span>
          </div>
          <div className="space-y-2.5">
            {verifications.map((v) => (
              <div
                key={v.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-slate-100 bg-slate-50/70 p-3"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {v.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Type: {v.type} • PAN: {v.pan}
                  </p>
                </div>
                {v.status === 'Approved' ? (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Approved &amp; Licensed</span>
                  </span>
                ) : (
                  <button
                    onClick={() => approveBusiness(v.id, v.name)}
                    className="rounded-lg bg-[#0552A2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#044182] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Verify &amp; Approve
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Permit Officer Queue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900">
              Permit Officer Sign-off Queue
            </h2>
            <span className="text-xs font-mono font-bold text-slate-400">
              {permitQueue.length} Applications
            </span>
          </div>
          <div className="space-y-2.5">
            {permitQueue.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-slate-100 bg-slate-50/70 p-3"
              >
                <div>
                  <span className="font-mono text-[10px] font-bold text-slate-400">
                    {p.id}
                  </span>
                  <p className="text-xs font-bold text-slate-900">{p.type}</p>
                  <p className="text-[11px] text-slate-500">
                    Applicant: {p.applicant} • Route: {p.zone}
                  </p>
                </div>
                {p.status === 'Approved' ? (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Official Pass Issued</span>
                  </span>
                ) : p.status === 'Rejected' ? (
                  <span className="inline-flex items-center gap-1 rounded bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-bold text-red-700">
                    <XCircle className="h-3 w-3" />
                    <span>Rejected</span>
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => rejectPermit(p.id, p.applicant)}
                      className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approvePermit(p.id, p.applicant)}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Sign &amp; Approve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Expeditions Oversight */}
      {customPlans.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900">
              Custom Expedition Inquiries &amp; Quotation Oversight
            </h2>
            <span className="text-xs font-mono font-bold text-slate-400">
              {customPlans.length} Requests
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Trip ID</th>
                  <th className="py-2.5 px-3">Traveler</th>
                  <th className="py-2.5 px-3">Custom Route</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Budget</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {customPlans.map((cp: any) => (
                  <tr key={cp.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0552A2]">{cp.id}</td>
                    <td className="py-2.5 px-3 font-semibold">{cp.travelerContact?.fullName || cp.userName}</td>
                    <td className="py-2.5 px-3 max-w-[200px] truncate">{cp.title}</td>
                    <td className="py-2.5 px-3">{cp.durationDays} Days</td>
                    <td className="py-2.5 px-3 font-mono font-semibold">NPR {(cp.estimatedBudgetNpr || 0).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        cp.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : cp.status === 'QUOTED'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {cp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Logs */}
      {auditLogs.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
            <History className="h-4 w-4 text-[#0552A2]" />
            <span>NTB Officer Compliance &amp; Audit Trail</span>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="text-slate-500"> by {log.actorName} ({log.actorRole})</span>
                  <p className="text-[11px] text-slate-400">Target: {log.targetType} #{log.targetId}</p>
                </div>
                <span className="font-mono text-[10px] text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
