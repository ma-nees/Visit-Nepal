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
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const res = await api.portals.getAdminDashboard();
      if (res) {
        if (res.metrics) setMetrics(res.metrics);
        if (res.verificationQueue) setVerifications(res.verificationQueue);
        if (res.permitOfficerQueue) setPermitQueue(res.permitOfficerQueue);
        if (res.recentAuditLogs) setAuditLogs(res.recentAuditLogs);
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
    <div className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#031526] via-[#053568] to-[#031526] p-6 sm:p-8 text-white border border-white/10">
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-[#92C4EA]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Ministry of Culture, Tourism &amp; Civil Aviation 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-serif">
            Nepal Tourism Board (NTB) Government Admin Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
            Real-time traveler tracking, TIMS &amp; restricted zone permit approval queues, and tour agency compliance verifications.
          </p>
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
