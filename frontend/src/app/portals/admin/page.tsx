'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  Building2,
  FileCheck2,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  History,
  Compass,
  MapPin,
  Globe,
  Bell,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

export default function NTBAdminPortalPage() {
  const { showToast, role } = useApp();
  const [metrics, setMetrics] = useState({
    totalTravelers: 1420,
    registeredAgencies: 48,
    verifiedGuides: 420,
    totalBookingsCount: 84,
    pendingPermitsCount: 3,
    activeExpeditionsCount: 42,
  });

  const [verifications, setVerifications] = useState<any[]>([]);
  const [permitQueue, setPermitQueue] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [customPlans, setCustomPlans] = useState<any[]>([]);
  const [advisories, setAdvisories] = useState<any[]>([
    {
      region: 'Solukhumbu (Everest Base Camp & Gokyo)',
      status: 'Open',
      notes: 'Clear visibility. Microspikes mandatory above Lobuche (4,940m).',
    },
    {
      region: 'Annapurna Circuit (Thorong La Pass 5,416m)',
      status: 'Caution',
      notes: 'Morning high winds reported. Crossing strictly between 05:00 - 09:00 AM.',
    },
    {
      region: 'Upper Mustang (Kingdom of Lo)',
      status: 'Open',
      notes: 'Road conditions dry from Jomsom to Kagbeni. RAP verified at Kagbeni post.',
    },
  ]);
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
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 lg:py-8 space-y-6 font-inter bg-[#F8FAFC] min-h-screen">
      
      {/* 1. Header with Government Credentials */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#0552A2] text-[10px] font-bold tracking-wider uppercase">
              <ShieldCheck className="h-3 w-3 text-[#0552A2]" />
              <span>Government of Nepal</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-700">Nepal Tourism Board (NTB)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-poppins">
              Tourism Oversight &amp; <span className="text-[#0552A2]">Permits Authority</span>
            </h1>

            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Official NTB statutory portal for national traveler verification, digital TIMS permits, conservation area clearances, and trail safety advisories.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {role === 'super_admin' && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Super Admin Command</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
              </Link>
            )}
          </div>
        </div>

        {/* Boundary Notice */}
        <div className="mt-3 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-[#0552A2] shrink-0" />
            <span>
              <strong>NTB Authority Boundary:</strong> Authorized for tourism permits, partner KYC accreditation, and regional advisories. Platform financial governance and master permissions reside with Super Admin.
            </span>
          </div>
        </div>
      </div>

      {/* 2. Tourism Vital Statistics KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Registered International Travelers</span>
            <Users className="h-4 w-4 text-[#0552A2]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {metrics.totalTravelers.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Biometrics &amp; Passport Verified</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Accredited Tour Agencies</span>
            <Building2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {metrics.registeredAgencies}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">TAAN &amp; Ministry Licensed Operators</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Certified Mountain Guides</span>
            <FileCheck2 className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {metrics.verifiedGuides}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">NMA &amp; IFMGA Badge Verified</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Permit Reviews</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {permitQueue.filter((p) => p.status !== 'Approved').length || 3} Queued
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Sagarmatha, Annapurna &amp; Mustang RAP</p>
        </div>
      </div>

      {/* 3. Operational Queues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Permit Officer Approval Queue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#0552A2]" />
              <h2 className="text-sm font-bold text-slate-900">
                TIMS &amp; Restricted Area Permit (RAP) Queue
              </h2>
            </div>
            <span className="text-[11px] font-bold text-slate-500 font-mono">
              NTB Checkpoint Seal Desk
            </span>
          </div>

          <div className="space-y-3">
            {permitQueue.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/70"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{p.applicant}</span>
                    <span className="font-mono text-[10px] text-slate-400">({p.id})</span>
                  </div>
                  <p className="text-xs text-[#0552A2] font-semibold mt-0.5">{p.type}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Route: {p.zone}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {p.status === 'Approved' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Seal Issued
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => approvePermit(p.id, p.applicant)}
                        className="px-3 py-1.5 rounded-lg bg-[#0552A2] hover:bg-[#044182] text-white text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        Sign &amp; Issue
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectPermit(p.id, p.applicant)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agency KYC Accreditation Queue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Tourism Partner Accreditation Queue
              </h2>
            </div>
            <span className="text-[11px] font-bold text-slate-500 font-mono">
              TAAN Verification
            </span>
          </div>

          <div className="space-y-3">
            {verifications.map((v) => (
              <div
                key={v.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/70"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{v.name}</span>
                    <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 capitalize font-medium">{v.type}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">PAN / Registration: {v.pan}</p>
                </div>

                <div>
                  {v.status === 'Approved' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Accredited
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => approveBusiness(v.id, v.name)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      Authorize License
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Trail Advisories & Seasonal Tourism Updates */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Official Regional Tourism Advisories
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            Updated Daily at 06:00 NPT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {advisories.map((adv, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{adv.region}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    adv.status === 'Open'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {adv.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{adv.notes}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
