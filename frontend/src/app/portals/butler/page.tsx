'use client';

import { useState, useEffect } from 'react';
import { ConciergeBell, CheckCircle2, DollarSign, Users, Star, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

export default function ButlerPortalPage() {
  const { showToast } = useApp();
  const [data, setData] = useState<any>(null);
  const [tasks, setTasks] = useState([
    {
      id: 'task_1',
      guest: 'Aayush Pradhan',
      req: 'Reserve corner mountain-view teahouse rooms at Namche & Tengboche',
      time: 'Today, 09:30 AM',
      completed: false,
    },
    {
      id: 'task_2',
      guest: 'Marcus Berg',
      req: 'Prepare portable oxygen canister & warm yak butter tea at Dingboche',
      time: 'Today, 11:15 AM',
      completed: false,
    },
  ]);

  const fetchButlerData = async () => {
    try {
      const res = await api.portals.getButlerDashboard();
      if (res) setData(res);
    } catch (err) {
      console.warn('[ButlerPortal] Fallback to local:', err);
    }
  };

  useEffect(() => {
    fetchButlerData();
  }, []);

  const completeTask = (taskId: string, guest: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
    );
    showToast(`VIP concierge service for ${guest} marked completed.`);
  };

  const butler = data?.butler || {
    name: 'Pemba Tenzing Sherpa',
    experienceYears: 11,
    dailyRateNpr: 8500,
    services: ['Alpine Concierge', 'Luggage & Pack Transit', 'Tea House Reservation Priority'],
    rating: 4.96,
  };

  const metrics = data?.metrics || {
    completedTasksCount: 142,
    rating: 4.96,
    dailyRateNpr: 8500,
  };

  const assignedBookings = data?.assignedBookings || [];

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 font-inter">
      {/* 1. Unique & Aesthetic Editorial Header */}
      <div className="relative pb-3 sm:pb-4 border-b border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#0552A2] text-[10px] font-bold tracking-wider uppercase">
              <ConciergeBell className="h-3 w-3 text-[#0552A2]" />
              <span>Dedicated Sherpa Butler</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">VIP Concierge 2026</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-poppins leading-tight">
              Sherpa Butler <span className="text-[#0552A2]">Concierge Hub</span>
            </h1>

            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              Guest gear portage itineraries, VIP teahouse reservations, hot meal pre-orders, and baggage tracking.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs shrink-0">
            <ConciergeBell className="h-3.5 w-3.5 text-purple-600" />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900">{butler.name}</div>
              <div className="text-[10px] text-purple-600 font-semibold">VIP Mountain Hospitality</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <img
          src="https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=200&q=80"
          alt={butler.name}
          className="h-16 w-16 rounded-xl object-cover border border-slate-200"
        />
        <div className="flex-1">
          <span className="inline-flex items-center gap-1 rounded bg-purple-50 border border-purple-200 px-2 py-0.5 text-[10px] font-bold text-purple-800">
            <ConciergeBell className="h-3 w-3" />
            <span>HERO-BUTLER-9921 (Verified Concierge)</span>
          </span>
          <h2 className="mt-1 text-lg font-bold text-slate-900">
            {butler.name}
          </h2>
          <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
            <span>{butler.experienceYears} Years Experience</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-bold text-slate-700">
              <Star className="h-3 w-3 fill-[#FDB716] text-[#FDB716]" />
              <span>{butler.rating} / 5.0</span>
            </span>
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Daily Rate</p>
          <p className="text-xl font-extrabold text-[#0552A2]">
            NPR {butler.dailyRateNpr?.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <ConciergeBell className="h-4 w-4 text-[#0552A2]" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Pending Concierge Tasks</p>
          <p className="text-xl font-bold text-slate-900">
            {tasks.filter((t) => !t.completed).length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <Users className="h-4 w-4 text-emerald-600" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Assigned Travelers</p>
          <p className="text-xl font-bold text-slate-900">{assignedBookings.length || 2} Pax</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <DollarSign className="h-4 w-4 text-amber-500" />
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Lifetime Completed</p>
          <p className="text-xl font-bold text-slate-900">{metrics.completedTasksCount} Services</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900">
            Guest Concierge &amp; Camp Requests
          </h2>
          <span className="text-xs font-mono text-slate-400">{tasks.length} Requests</span>
        </div>

        <div className="space-y-2.5">
          {tasks.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-slate-100 bg-slate-50/70 p-3"
            >
              <div>
                <p className="text-xs font-bold text-slate-900">{item.guest}</p>
                <p className="text-xs text-slate-600 mt-0.5">{item.req}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{item.time}</span>
                </p>
              </div>

              {item.completed ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Service Completed</span>
                </span>
              ) : (
                <button
                  onClick={() => completeTask(item.id, item.guest)}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#0552A2] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#044182] active:scale-[0.98] transition-all shrink-0 self-start sm:self-center cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Mark Complete</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
