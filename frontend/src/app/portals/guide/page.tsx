'use client';

import { useState, useEffect } from 'react';
import { Compass, Users, DollarSign, ShieldCheck, CheckCircle2, FileText, ToggleLeft, ToggleRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

export default function GuidePortalPage() {
  const { showToast } = useApp();
  const [data, setData] = useState<any>(null);
  const [reportModal, setReportModal] = useState<any>(null);
  const [reportText, setReportText] = useState('');
  const [trailCondition, setTrailCondition] = useState('Clear & Safe');

  const fetchGuideData = async () => {
    try {
      const res = await api.portals.getGuideDashboard();
      if (res) setData(res);
    } catch (err) {
      console.warn('[GuidePortal] Fallback to local:', err);
    }
  };

  useEffect(() => {
    fetchGuideData();
  }, []);

  const handleToggleAvailability = async () => {
    try {
      const current = data?.metrics?.isAvailable ?? true;
      const res = await api.portals.toggleGuideAvailability(!current);
      showToast(`Availability status updated: ${res.isAvailable ? 'Available for booking' : 'Off-duty / On-trail'}`);
      fetchGuideData();
    } catch (err: any) {
      showToast(`Failed: ${err.message}`);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    try {
      await api.portals.submitGuideReport({
        bookingId: reportModal?.id,
        summary: reportText,
        trailConditions: trailCondition,
        safeCompletion: true,
      });
      showToast(`Official expedition report lodged with NTB for #${reportModal?.id}.`);
      setReportModal(null);
      setReportText('');
      fetchGuideData();
    } catch (err: any) {
      showToast(`Failed: ${err.message}`);
    }
  };

  const guide = data?.guide || {
    name: 'Pasang Nuru Sherpa',
    licenseNumber: 'NMA-IFMGA-042',
    experienceYears: 18,
    dailyRateNpr: 12000,
    languages: ['English', 'Nepali', 'Tibetan'],
    specializations: ['Everest Region', 'Glacier Navigation'],
  };

  const metrics = data?.metrics || {
    expeditionsCount: 46,
    totalEarningsNpr: 580000,
    isAvailable: true,
  };

  const assignments = data?.assignments || [];

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Unique & Aesthetic Editorial Header (No dark container card) */}
      <div className="relative pb-6 border-b border-slate-200/80">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#0552A2] text-[11px] font-bold tracking-wider uppercase">
              <Compass className="h-3.5 w-3.5 text-[#0552A2]" />
              <span>NMA &amp; IFMGA Certified</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">Lead Mountaineer Desk 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-poppins">
              Mountain Guide <span className="text-[#0552A2]">Operations Desk</span>
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              Assigned expedition rosters, client altitude monitoring, daily rate payouts, and live dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900">{guide.licenseNumber}</div>
              <div className="text-[10px] text-emerald-600 font-semibold">IFMGA Verified Master Guide</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
            alt={guide.name}
            className="h-16 w-16 rounded-xl object-cover border border-slate-200"
          />
          <div>
            <span className="inline-flex items-center gap-1 rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              <ShieldCheck className="h-3 w-3" />
              <span>{guide.licenseNumber} (IFMGA Verified)</span>
            </span>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              {guide.name}
            </h2>
            <p className="text-xs text-slate-500">
              {guide.experienceYears} Years Experience • Languages: {guide.languages?.join(', ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={handleToggleAvailability}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <span>Status:</span>
            {metrics.isAvailable ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <ToggleRight className="h-4 w-4" /> Available
              </span>
            ) : (
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <ToggleLeft className="h-4 w-4" /> On Trail / Busy
              </span>
            )}
          </button>

          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Daily Rate</p>
            <p className="text-xl font-extrabold text-[#0552A2]">NPR {guide.dailyRateNpr?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <Compass className="h-4 w-4 text-[#0552A2]" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Assigned Expeditions</p>
          <p className="text-xl font-bold text-slate-900">
            {assignments.length} Expeditions
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <Users className="h-4 w-4 text-emerald-600" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Summits Led</p>
          <p className="text-xl font-bold text-slate-900">
            {metrics.expeditionsCount} Summits
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <DollarSign className="h-4 w-4 text-amber-500" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Estimated Season Earnings</p>
          <p className="text-xl font-bold text-slate-900">NPR {metrics.totalEarningsNpr?.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900">
            Assigned Expedition Roster &amp; Client Tracking
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {assignments.length} Trips
          </span>
        </div>

        <div className="space-y-2.5">
          {assignments.map((item: any) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3.5"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400">{item.id}</span>
                <p className="text-xs font-bold text-slate-900">{item.title}</p>
                <p className="text-[11px] text-slate-500">
                  Lead Traveler: <span className="font-semibold text-slate-700">{item.userName}</span> ({item.participantsCount} Pax) • {item.date}
                </p>
                <p className="text-[11px] text-slate-500">
                  Meeting Point: {item.meetingPoint}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-50 border border-blue-100 px-2.5 py-1 text-[10px] font-bold text-[#0552A2]">
                  {item.status.toUpperCase()}
                </span>
                <button
                  onClick={() => setReportModal(item)}
                  className="rounded-lg bg-[#0552A2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#044182] active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Report</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expedition Report Modal */}
      {reportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleReportSubmit}
            className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Lodge Expedition Report: {reportModal.id}
              </h3>
              <button
                type="button"
                onClick={() => setReportModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Trail Condition &amp; Weather</label>
                <select
                  value={trailCondition}
                  onChange={(e) => setTrailCondition(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs"
                >
                  <option value="Clear & Safe">Clear &amp; Safe</option>
                  <option value="Hard-Ice On High Passes (Crampons Needed)">Hard-Ice On High Passes (Crampons Needed)</option>
                  <option value="Snowpack / Blizzard Caution">Snowpack / Blizzard Caution</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Expedition Field Summary</label>
                <textarea
                  rows={4}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Record altitude reached, guest acclimatization status, and confirmation of safe return."
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:ring-1 focus:ring-[#0552A2]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReportModal(null)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#0552A2] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#044182]"
              >
                Submit to NTB Records
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
